from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class Step1BasicInfo(BaseModel):
    student_status: str = Field(..., description="College Student, Working Student, or Other")
    wake_time: str = Field(..., description="Typical wake up time")
    sleep_time: str = Field(..., description="Typical sleep time")

class Step2DailyTime(BaseModel):
    college_time: str = Field(..., description="College / work hours")
    study_time: str = Field(..., description="Study / productive work hours")
    social_media: str = Field(..., description="Social media hours")
    entertainment: str = Field(..., description="Entertainment / YouTube / OTT hours")
    gaming: str = Field(..., description="Gaming hours")
    commute: str = Field(..., description="Travel / commute hours")

class Step3Habits(BaseModel):
    sleep_quality: str = Field(..., description="Sleep quality rating")
    exercise: str = Field(..., description="Exercise frequency")
    phone_check_frequency: str = Field(..., description="Phone checking frequency while studying")
    notifications_enabled: str = Field(..., description="Notifications enabled state: Yes or No")

class Step4Energy(BaseModel):
    morning_energy: int = Field(..., ge=1, le=10, description="Morning energy slider 1-10")
    afternoon_energy: int = Field(..., ge=1, le=10, description="Afternoon energy slider 1-10")
    night_energy: int = Field(..., ge=1, le=10, description="Night energy slider 1-10")
    tired_frequency: str = Field(..., description="Frequency of feeling tired without physical exertion")

class Step5Focus(BaseModel):
    focus_duration: str = Field(..., description="Focus duration without phone")
    task_switching: str = Field(..., description="Frequency of switching between tasks")
    interruptions: List[str] = Field(default_factory=list, description="Common study interruptions")

class Step6Goal(BaseModel):
    main_goal: str = Field(..., description="Primary user goal")
    goal_importance: int = Field(..., ge=1, le=10, description="Importance of main goal 1-10")
    goal_satisfaction: int = Field(..., ge=1, le=10, description="Satisfaction with current progress 1-10")

class AuditSubmission(BaseModel):
    step1: Step1BasicInfo
    step2: Step2DailyTime
    step3: Step3Habits
    step4: Step4Energy
    step5: Step5Focus
    step6: Step6Goal

class LeakItem(BaseModel):
    title: str
    category: str  # "Time", "Energy", or "Focus"
    estimate: str
    impact: str    # "High", "Medium", "Low"
    description: str
    icon: str

class RecommendationItem(BaseModel):
    title: str
    description: str
    category: str
    priority: int

class ActionPlanItem(BaseModel):
    text: str
    icon: str
    estimated_hours_saved: str

class AuditResponse(BaseModel):
    id: str
    created_at: str
    overall_score: int
    time_score: int
    energy_score: int
    focus_score: int
    goal_alignment_score: int
    time_distribution: Dict[str, float]
    detected_leaks: List[LeakItem]
    positive_habits: List[str]
    recommendations: List[RecommendationItem]
    daily_action_plan: Dict[str, Any]
    answers: AuditSubmission
