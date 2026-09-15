from typing import List, Dict, Any
from app.schemas.audit import AuditSubmission, RecommendationItem, ActionPlanItem

def generate_recommendations(submission: AuditSubmission, audit_results: Dict[str, Any]) -> List[RecommendationItem]:
    """Generate 3-5 prioritized, practical recommendations based on audit answers."""
    recs: List[RecommendationItem] = []

    s2 = submission.step2
    s3 = submission.step3
    s4 = submission.step4
    s5 = submission.step5
    s6 = submission.step6

    # 1. Social Media recommendation
    if s2.social_media in ["1–2 hours", "2–3 hours", "3–4 hours", "More than 4 hours"]:
        recs.append(RecommendationItem(
            title="Set a 60-Minute Social Media App Limit",
            description="Use built-in phone screen time limits or app blockers during study blocks to prevent unintended scrolling.",
            category="Time Management",
            priority=1
        ))

    # 2. Phone Interruptions recommendation
    if s3.phone_check_frequency in ["Every 15–30 minutes", "Almost continuously"] or s3.notifications_enabled == "Yes":
        recs.append(RecommendationItem(
            title="Keep Phone in Another Room During Study",
            description="Place your phone on Silent and out of reach for just one 45-minute study session to protect your focus flow.",
            category="Focus",
            priority=2
        ))

    # 3. Focus duration / Pomodoro recommendation
    if s5.focus_duration in ["Less than 10 minutes", "10–20 minutes", "20–30 minutes"]:
        recs.append(RecommendationItem(
            title="Adopt 25-Minute Structured Focus Blocks",
            description="Start with a 25-minute timer dedicated to a single task, followed by a 5-minute break before gradually increasing duration.",
            category="Focus",
            priority=3
        ))

    # 4. Energy & Sleep recommendation
    if s3.sleep_quality in ["Poor", "Very Poor"] or s4.tired_frequency in ["Often", "Almost every day"]:
        recs.append(RecommendationItem(
            title="Establish a Consistent Bedtime Routine",
            description="Aim for a fixed sleep schedule and avoid screens 30 minutes before sleep to elevate morning baseline energy.",
            category="Energy",
            priority=4
        ))

    # 5. Peak Energy Goal Alignment recommendation
    if audit_results.get("goal_alignment_score", 100) < 75 or s6.goal_importance >= 8:
        # Determine highest energy window
        m, a, n = s4.morning_energy, s4.afternoon_energy, s4.night_energy
        peak_window = "Morning" if m >= max(a, n) else ("Afternoon" if a >= n else "Night")
        recs.append(RecommendationItem(
            title=f"Schedule '{s6.main_goal}' During Your Peak {peak_window} Window",
            description=f"Your self-reported energy peaks in the {peak_window.lower()}. Reserve this high-energy window specifically for your top goal.",
            category="Goal Alignment",
            priority=5
        ))

    # 6. Task switching recommendation
    if s5.task_switching in ["Often", "Very Often"] and len(recs) < 5:
        recs.append(RecommendationItem(
            title="Single-Tasking Rule",
            description="Choose one key task and complete a full focus block before switching to messaging, email, or other projects.",
            category="Focus",
            priority=6
        ))

    # Fallback recommendations if fewer than 3 generated
    if len(recs) < 3:
        recs.append(RecommendationItem(
            title="Daily Time Blocking",
            description="Block 2 fixed hours each day specifically dedicated to high-priority goals before opening social apps.",
            category="Time Management",
            priority=7
        ))
        recs.append(RecommendationItem(
            title="Hydration & Light Movement Breaks",
            description="Take a quick 2-minute stretch or walk every hour to prevent physical fatigue during long study sessions.",
            category="Energy",
            priority=8
        ))

    # Sort by priority and cap to top 4 recommendations
    recs.sort(key=lambda r: r.priority)
    return recs[:4]


def generate_daily_action_plan(submission: AuditSubmission, recs: List[RecommendationItem]) -> Dict[str, Any]:
    """Generate Tomorrow's 3 Actions plan with estimated hours recovered."""
    actions: List[ActionPlanItem] = []

    s2 = submission.step2
    s3 = submission.step3
    s4 = submission.step4

    # Action 1: Time leak limit
    if s2.social_media in ["1–2 hours", "2–3 hours", "3–4 hours", "More than 4 hours"]:
        actions.append(ActionPlanItem(
            text="Limit social media usage to 60 minutes on study days.",
            icon="📱",
            estimated_hours_saved="~1 hour recovered"
        ))
    elif s2.entertainment in ["1–2 hours", "2–3 hours", "More than 3 hours"]:
        actions.append(ActionPlanItem(
            text="Cap streaming & entertainment to 1 hour after completing primary studies.",
            icon="📺",
            estimated_hours_saved="~45 mins recovered"
        ))
    else:
        actions.append(ActionPlanItem(
            text="Set a 15-minute timer before opening recreational apps.",
            icon="⏱️",
            estimated_hours_saved="~30 mins recovered"
        ))

    # Action 2: Focus action
    if s3.notifications_enabled == "Yes" or s3.phone_check_frequency in ["Every 15–30 minutes", "Almost continuously"]:
        actions.append(ActionPlanItem(
            text="Complete two 45-minute focused study sessions with your phone in Do Not Disturb mode.",
            icon="📚",
            estimated_hours_saved="~45 mins of focus gain"
        ))
    else:
        actions.append(ActionPlanItem(
            text="Complete three 30-minute uninterrupted study sessions using single-tasking.",
            icon="🎯",
            estimated_hours_saved="~30 mins of focus gain"
        ))

    # Action 3: Energy action
    if s3.sleep_quality in ["Poor", "Very Poor"] or s4.tired_frequency in ["Often", "Almost every day"]:
        actions.append(ActionPlanItem(
            text="Go to bed 30 minutes earlier tonight and disconnect screens 20 mins prior.",
            icon="😴",
            estimated_hours_saved="~1 hour quality energy gain"
        ))
    else:
        actions.append(ActionPlanItem(
            text="Take a 10-minute energizing outdoor walk during your afternoon break.",
            icon="🏃",
            estimated_hours_saved="Vitality boost"
        ))

    return {
        "title": "Tomorrow's 3 Actions",
        "actions": [a.dict() for a in actions[:3]],
        "estimated_recovery": "Small daily tweaks like these can help recover an estimated 1 to 2 hours of useful focus time.",
        "disclaimer": "All estimates are non-medical approximations based on your input."
    }
