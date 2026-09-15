from fastapi import APIRouter, HTTPException, status
from datetime import datetime
import uuid

from app.schemas.audit import AuditSubmission, AuditResponse
from app.services.audit_engine import process_life_audit
from app.services.recommendation_engine import generate_recommendations, generate_daily_action_plan

router = APIRouter(prefix="/api/audit", tags=["Audit"])

@router.post("", response_model=AuditResponse, status_code=status.HTTP_201_CREATED)
async def create_audit(submission: AuditSubmission):
    """
    Process user life audit questionnaire, calculate scores, store results,
    and return detailed productivity insights.
    """
    try:
        audit_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat()

        # Run core audit calculations
        audit_results = process_life_audit(submission)

        # Generate recommendations and daily action plan
        recommendations = generate_recommendations(submission, audit_results)
        daily_action_plan = generate_daily_action_plan(submission, recommendations)

        audit_document = {
            "id": audit_id,
            "created_at": created_at,
            "overall_score": audit_results["overall_score"],
            "time_score": audit_results["time_score"],
            "energy_score": audit_results["energy_score"],
            "focus_score": audit_results["focus_score"],
            "goal_alignment_score": audit_results["goal_alignment_score"],
            "time_distribution": audit_results["time_distribution"],
            "detected_leaks": [leak.dict() for leak in audit_results["detected_leaks"]],
            "positive_habits": audit_results["positive_habits"],
            "recommendations": [rec.dict() for rec in recommendations],
            "daily_action_plan": daily_action_plan,
            "answers": submission.dict()
        }
        return audit_document
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing your audit: {str(e)}"
        )

