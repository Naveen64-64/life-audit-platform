
from app.schemas.audit import (
    AuditSubmission, Step1BasicInfo, Step2DailyTime, 
    Step3Habits, Step4Energy, Step5Focus, Step6Goal
)
from app.services.audit_engine import process_life_audit
from app.services.recommendation_engine import generate_recommendations, generate_daily_action_plan

def test_audit_engine_calculation():
    submission = AuditSubmission(
        step1=Step1BasicInfo(
            student_status="College Student",
            wake_time="7–8 AM",
            sleep_time="11 PM–12 AM"
        ),
        step2=Step2DailyTime(
            college_time="5–7 hours",
            study_time="2–3 hours",
            social_media="2–3 hours",
            entertainment="1–2 hours",
            gaming="I don't play",
            commute="30–60 minutes"
        ),
        step3=Step3Habits(
            sleep_quality="Average",
            exercise="1–2 days/week",
            phone_check_frequency="Every 30–60 minutes",
            notifications_enabled="Yes"
        ),
        step4=Step4Energy(
            morning_energy=8,
            afternoon_energy=4,
            night_energy=6,
            tired_frequency="Sometimes"
        ),
        step5=Step5Focus(
            focus_duration="20–30 minutes",
            task_switching="Sometimes",
            interruptions=["Phone", "Notifications"]
        ),
        step6=Step6Goal(
            main_goal="Improve College Grades",
            goal_importance=9,
            goal_satisfaction=6
        )
    )

    results = process_life_audit(submission)

    assert 0 <= results["overall_score"] <= 100
    assert 0 <= results["time_score"] <= 100
    assert 0 <= results["energy_score"] <= 100
    assert 0 <= results["focus_score"] <= 100
    assert 0 <= results["goal_alignment_score"] <= 100

    assert len(results["detected_leaks"]) >= 1
    assert len(results["positive_habits"]) >= 1

    recs = generate_recommendations(submission, results)
    assert 3 <= len(recs) <= 5

    action_plan = generate_daily_action_plan(submission, recs)
    assert len(action_plan["actions"]) == 3
