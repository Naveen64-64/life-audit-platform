from typing import Dict, Any, List
from app.schemas.audit import AuditSubmission, LeakItem

# Helper maps for converting string choices to numeric estimates
SOCIAL_MEDIA_HOURS_MAP = {
    "Less than 30 minutes": 0.3,
    "30–60 minutes": 0.75,
    "1–2 hours": 1.5,
    "2–3 hours": 2.5,
    "3–4 hours": 3.5,
    "More than 4 hours": 4.5
}

ENTERTAINMENT_HOURS_MAP = {
    "Less than 30 minutes": 0.3,
    "30–60 minutes": 0.75,
    "1–2 hours": 1.5,
    "2–3 hours": 2.5,
    "More than 3 hours": 3.5
}

GAMING_HOURS_MAP = {
    "I don't play": 0.0,
    "Less than 30 minutes": 0.3,
    "30–60 minutes": 0.75,
    "1–2 hours": 1.5,
    "2–3 hours": 2.5,
    "More than 3 hours": 3.5
}

STUDY_HOURS_MAP = {
    "Less than 1 hour": 0.5,
    "1–2 hours": 1.5,
    "2–3 hours": 2.5,
    "3–4 hours": 3.5,
    "More than 4 hours": 4.5
}

COLLEGE_HOURS_MAP = {
    "Less than 3 hours": 2.0,
    "3–5 hours": 4.0,
    "5–7 hours": 6.0,
    "7–9 hours": 8.0,
    "More than 9 hours": 10.0
}

COMMUTE_HOURS_MAP = {
    "Less than 30 minutes": 0.3,
    "30–60 minutes": 0.75,
    "1–2 hours": 1.5,
    "2–3 hours": 2.5,
    "More than 3 hours": 3.5
}


def calculate_time_score(step2: Any, step5: Any) -> int:
    """Calculate Time Management Score (0-100)"""
    score = 100

    # Social Media deductions
    sm = step2.social_media
    if sm == "More than 4 hours":
        score -= 35
    elif sm == "3–4 hours":
        score -= 28
    elif sm == "2–3 hours":
        score -= 20
    elif sm == "1–2 hours":
        score -= 12
    elif sm == "30–60 minutes":
        score -= 5

    # Entertainment deductions
    ent = step2.entertainment
    if ent == "More than 3 hours":
        score -= 25
    elif ent == "2–3 hours":
        score -= 18
    elif ent == "1–2 hours":
        score -= 10
    elif ent == "30–60 minutes":
        score -= 5

    # Gaming deductions
    gam = step2.gaming
    if gam == "More than 3 hours":
        score -= 25
    elif gam == "2–3 hours":
        score -= 18
    elif gam == "1–2 hours":
        score -= 10
    elif gam == "30–60 minutes":
        score -= 5

    # Study time baseline encouragement
    std = step2.study_time
    if std == "Less than 1 hour":
        score -= 15
    elif std == "1–2 hours":
        score -= 8

    # Task switching penalty
    if step5.task_switching == "Very Often":
        score -= 10
    elif step5.task_switching == "Often":
        score -= 5

    return max(15, min(100, score))


def calculate_energy_score(step3: Any, step4: Any) -> int:
    """Calculate Energy Score (0-100)"""
    # Self-reported energy component (max 40 pts)
    avg_energy = (step4.morning_energy + step4.afternoon_energy + step4.night_energy) / 3.0
    energy_pts = (avg_energy / 10.0) * 40.0

    # Sleep quality (max 20 pts)
    sq_map = {"Very Good": 20, "Good": 16, "Average": 11, "Poor": 6, "Very Poor": 2}
    sq_pts = sq_map.get(step3.sleep_quality, 10)

    # Exercise (max 20 pts)
    ex_map = {"5+ days/week": 20, "3–4 days/week": 16, "1–2 days/week": 10, "Never": 2}
    ex_pts = ex_map.get(step3.exercise, 10)

    # Tiredness frequency (max 20 pts)
    tf_map = {"Never": 20, "Rarely": 16, "Sometimes": 11, "Often": 5, "Almost every day": 2}
    tf_pts = tf_map.get(step4.tired_frequency, 10)

    total = int(energy_pts + sq_pts + ex_pts + tf_pts)
    return max(15, min(100, total))


def calculate_focus_score(step3: Any, step5: Any) -> int:
    """Calculate Focus Score (0-100)"""
    # Focus duration (max 35 pts)
    fd_map = {
        "More than 60 minutes": 35,
        "45–60 minutes": 30,
        "30–45 minutes": 24,
        "20–30 minutes": 17,
        "10–20 minutes": 10,
        "Less than 10 minutes": 4
    }
    fd_pts = fd_map.get(step5.focus_duration, 15)

    # Phone checking frequency (max 25 pts)
    pc_map = {
        "Almost never": 25,
        "A few times": 20,
        "Every 30–60 minutes": 14,
        "Every 15–30 minutes": 8,
        "Almost continuously": 2
    }
    pc_pts = pc_map.get(step3.phone_check_frequency, 12)

    # Notifications enabled (max 15 pts)
    notif_pts = 15 if step3.notifications_enabled == "No" else 5

    # Task switching (max 15 pts)
    ts_map = {"Rarely": 15, "Sometimes": 11, "Often": 6, "Very Often": 2}
    ts_pts = ts_map.get(step5.task_switching, 8)

    # Interruptions count penalty (max 10 pts)
    interr_count = len(step5.interruptions)
    interr_pts = max(0, 10 - (interr_count * 2))

    total = fd_pts + pc_pts + notif_pts + ts_pts + interr_pts
    return max(15, min(100, total))


def calculate_goal_alignment_score(step2: Any, step6: Any) -> int:
    """Calculate Goal Alignment Score (0-100)"""
    study_hrs = STUDY_HOURS_MAP.get(step2.study_time, 2.0)
    importance = step6.goal_importance
    satisfaction = step6.goal_satisfaction

    # Base alignment from ratio of productive time to goal importance
    # If goal importance is 9-10, user needs at least 2-3+ hours of study time
    needed_study = (importance / 10.0) * 3.5
    time_ratio = min(1.2, study_hrs / max(0.5, needed_study))

    time_alignment_pts = time_ratio * 40.0
    importance_pts = (importance / 10.0) * 30.0
    satisfaction_pts = (satisfaction / 10.0) * 30.0

    total = int(time_alignment_pts + importance_pts + satisfaction_pts)
    return max(15, min(100, total))


def estimate_time_distribution(step2: Any) -> Dict[str, float]:
    """Provide numerical breakdown for Chart.js doughnut visualization."""
    college = COLLEGE_HOURS_MAP.get(step2.college_time, 4.0)
    study = STUDY_HOURS_MAP.get(step2.study_time, 2.0)
    social = SOCIAL_MEDIA_HOURS_MAP.get(step2.social_media, 1.5)
    entertainment = ENTERTAINMENT_HOURS_MAP.get(step2.entertainment, 1.5)
    gaming = GAMING_HOURS_MAP.get(step2.gaming, 0.0)
    commute = COMMUTE_HOURS_MAP.get(step2.commute, 1.0)

    # Estimate remaining hours out of 24h
    accounted = college + study + social + entertainment + gaming + commute
    sleep_rest = 7.5
    free_time = max(0.5, round(24.0 - accounted - sleep_rest, 1))

    return {
        "College / Classes": college,
        "Productive Study": study,
        "Social Media": social,
        "Entertainment": entertainment,
        "Gaming": gaming,
        "Commute": commute,
        "Sleep & Rest": sleep_rest,
        "Other / Unplanned": free_time
    }


def detect_leaks(submission: AuditSubmission) -> List[LeakItem]:
    """Identify top time, energy, and focus leaks using constructive language."""
    leaks: List[LeakItem] = []

    s2 = submission.step2
    s3 = submission.step3
    s4 = submission.step4
    s5 = submission.step5

    # 1. Social Media Leak
    if s2.social_media in ["2–3 hours", "3–4 hours", "More than 4 hours"]:
        leaks.append(LeakItem(
            title="Social Media Usage",
            category="Time",
            estimate=f"Est. {s2.social_media} / day",
            impact="High" if s2.social_media in ["3–4 hours", "More than 4 hours"] else "Medium",
            description="Social media appears to be one of your biggest daily time sinks, potentially taking away from your primary goals.",
            icon="📱"
        ))

    # 2. Phone Interruptions / Notifications
    if s3.phone_check_frequency in ["Every 15–30 minutes", "Almost continuously"] or s3.notifications_enabled == "Yes":
        leaks.append(LeakItem(
            title="Study Phone Interruptions",
            category="Focus",
            estimate="Frequent checking & notifications",
            impact="High" if s3.phone_check_frequency == "Almost continuously" else "Medium",
            description="Checking your phone while studying breaks your focus flow state, making study sessions take significantly longer.",
            icon="🔔"
        ))

    # 3. Short Focus Duration
    if s5.focus_duration in ["Less than 10 minutes", "10–20 minutes", "20–30 minutes"]:
        leaks.append(LeakItem(
            title="Fragmented Focus Sessions",
            category="Focus",
            estimate=f"Max focus est. {s5.focus_duration}",
            impact="Medium" if s5.focus_duration == "20–30 minutes" else "High",
            description="Your study sessions appear to be broken into short intervals. Building longer uninterrupted sessions can boost productivity.",
            icon="🎯"
        ))

    # 4. Low Afternoon / Energy Slump
    if s4.afternoon_energy <= 4 or s4.tired_frequency in ["Often", "Almost every day"]:
        leaks.append(LeakItem(
            title="Daytime Energy Slump",
            category="Energy",
            estimate="Frequent fatigue reported",
            impact="High" if s4.tired_frequency == "Almost every day" else "Medium",
            description="Frequent tiredness or afternoon slumps may be limiting your stamina and motivation during productive peak hours.",
            icon="🔋"
        ))

    # 5. Gaming or Entertainment Leak
    if s2.entertainment in ["2–3 hours", "More than 3 hours"] or s2.gaming in ["2–3 hours", "More than 3 hours"]:
        activity = "Gaming" if s2.gaming in ["2–3 hours", "More than 3 hours"] else "Entertainment & YouTube"
        hours_str = s2.gaming if activity == "Gaming" else s2.entertainment
        leaks.append(LeakItem(
            title=f"Excessive {activity}",
            category="Time",
            estimate=f"Est. {hours_str} / day",
            impact="Medium",
            description=f"High passive video or gaming consumption could be taking time from your core study or rest balance.",
            icon="🎮" if activity == "Gaming" else "📺"
        ))

    # 6. Low Physical Activity
    if s3.exercise == "Never":
        leaks.append(LeakItem(
            title="Low Physical Activity",
            category="Energy",
            estimate="No regular exercise routine",
            impact="Medium",
            description="Your current schedule has minimal physical activity, which can reduce baseline vitality and worsen focus.",
            icon="🏃"
        ))

    # Fallback default leak if fewer than 2 detected
    if len(leaks) < 2:
        leaks.append(LeakItem(
            title="Unplanned Time Buffers",
            category="Time",
            estimate="Variable daily structure",
            impact="Low",
            description="Transition periods between tasks appear to lack fixed time blocking, leaving room for minor distractions.",
            icon="⏳"
        ))

    # Sort leaks by impact (High first, then Medium, then Low)
    impact_order = {"High": 1, "Medium": 2, "Low": 3}
    leaks.sort(key=lambda x: impact_order.get(x.impact, 4))

    return leaks[:3]


def detect_positive_habits(submission: AuditSubmission) -> List[str]:
    """Identify positive habits and user strengths to keep the audit encouraging."""
    strengths: List[str] = []

    s2 = submission.step2
    s3 = submission.step3
    s4 = submission.step4
    s5 = submission.step5
    s6 = submission.step6

    if s2.study_time in ["2–3 hours", "3–4 hours", "More than 4 hours"]:
        strengths.append(f"You maintain a strong daily study habit of {s2.study_time}.")
    elif s2.study_time == "1–2 hours":
        strengths.append("You consistently dedicate time each day to focused study.")

    if s3.exercise in ["3–4 days/week", "5+ days/week"]:
        strengths.append(f"Great physical routine ({s3.exercise}), supporting healthy energy levels.")
    elif s3.exercise == "1–2 days/week":
        strengths.append("You incorporate regular exercise into your weekly schedule.")

    if s3.notifications_enabled == "No":
        strengths.append("Proactive focus control: You keep notifications turned off during study sessions.")

    if s5.focus_duration in ["30–45 minutes", "45–60 minutes", "More than 60 minutes"]:
        strengths.append(f"Solid focus stamina ({s5.focus_duration} before checking phone).")

    if s6.goal_importance >= 8:
        strengths.append(f"High clarity & motivation for your primary goal: '{s6.main_goal}'.")

    if s4.morning_energy >= 7:
        strengths.append("Strong morning energy levels—an ideal window for high-leverage tasks.")

    if s3.sleep_quality in ["Good", "Very Good"]:
        strengths.append("Healthy sleep quality foundation to power your mental focus.")

    if len(strengths) < 2:
        strengths.append(f"Clear commitment to self-improvement by auditing your routine for {s6.main_goal}.")
        strengths.append("Willingness to evaluate daily habits and build better productivity systems.")

    return strengths[:4]


def process_life_audit(submission: AuditSubmission) -> Dict[str, Any]:
    """Run full audit scoring engine and return comprehensive response."""
    time_score = calculate_time_score(submission.step2, submission.step5)
    energy_score = calculate_energy_score(submission.step3, submission.step4)
    focus_score = calculate_focus_score(submission.step3, submission.step5)
    goal_alignment_score = calculate_goal_alignment_score(submission.step2, submission.step6)

    # Weighted overall score
    overall_score = int(
        (0.30 * time_score) +
        (0.25 * energy_score) +
        (0.25 * focus_score) +
        (0.20 * goal_alignment_score)
    )

    time_dist = estimate_time_distribution(submission.step2)
    leaks = detect_leaks(submission)
    positives = detect_positive_habits(submission)

    return {
        "overall_score": overall_score,
        "time_score": time_score,
        "energy_score": energy_score,
        "focus_score": focus_score,
        "goal_alignment_score": goal_alignment_score,
        "time_distribution": time_dist,
        "detected_leaks": leaks,
        "positive_habits": positives
    }
