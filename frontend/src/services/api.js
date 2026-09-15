const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Submit Life Audit Payload to Backend API
 */
export async function submitAudit(auditData) {
  try {
    const response = await fetch(`${API_BASE_URL}/audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auditData),
    });

    if (!response.ok) {
      const errorDetail = await response.json().catch(() => ({}));
      throw new Error(errorDetail.detail || `Server error (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.warn('API call failed or backend offline. Generating client-side calculated response:', error);
    return fallbackCalculateAudit(auditData);
  }
}

/**
 * Fetch specific audit report by ID
 */
export async function getAuditReport(auditId) {
  try {
    const response = await fetch(`${API_BASE_URL}/audit/${auditId}`);
    if (!response.ok) throw new Error('Report not found');
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch from backend, returning cached/fallback result:', error);
    const cached = localStorage.getItem(`audit_${auditId}`);
    if (cached) return JSON.parse(cached);
    throw error;
  }
}

/**
 * Client-side calculation fallback if backend server is unreachable
 */
function fallbackCalculateAudit(submission) {
  const auditId = 'local-' + Date.now();
  const createdAt = new Date().toISOString();

  // Basic scores calculation
  const s2 = submission.step2;
  const s3 = submission.step3;
  const s4 = submission.step4;
  const s5 = submission.step5;
  const s6 = submission.step6;

  let timeScore = 80;
  if (s2.social_media.includes('2–3 hours')) timeScore -= 18;
  if (s2.social_media.includes('3–4 hours') || s2.social_media.includes('More than 4 hours')) timeScore -= 30;
  if (s2.entertainment.includes('2–3 hours') || s2.entertainment.includes('More than 3 hours')) timeScore -= 15;
  timeScore = Math.max(20, Math.min(100, timeScore));

  const avgEnergy = (s4.morning_energy + s4.afternoon_energy + s4.night_energy) / 30 * 50;
  const energyScore = Math.round(Math.max(20, Math.min(100, avgEnergy + (s3.sleep_quality === 'Good' || s3.sleep_quality === 'Very Good' ? 30 : 15))));

  let focusScore = s5.focus_duration.includes('60') ? 85 : (s5.focus_duration.includes('30–45') ? 70 : 50);
  if (s3.notifications_enabled === 'Yes') focusScore -= 15;
  focusScore = Math.max(20, Math.min(100, focusScore));

  const goalScore = Math.round((s6.goal_importance * 5) + (s6.goal_satisfaction * 4));

  const overallScore = Math.round((0.3 * timeScore) + (0.25 * energyScore) + (0.25 * focusScore) + (0.2 * goalScore));

  const fallbackReport = {
    id: auditId,
    created_at: createdAt,
    overall_score: overallScore,
    time_score: timeScore,
    energy_score: energyScore,
    focus_score: focusScore,
    goal_alignment_score: goalScore,
    time_distribution: {
      "College / Classes": 5.0,
      "Productive Study": 2.5,
      "Social Media": s2.social_media.includes('2–3') ? 2.5 : 1.5,
      "Entertainment": 1.5,
      "Gaming": 1.0,
      "Commute": 1.0,
      "Sleep & Rest": 7.5,
      "Other / Unplanned": 4.0
    },
    detected_leaks: [
      {
        title: "Social Media Usage",
        category: "Time",
        estimate: `Est. ${s2.social_media} / day`,
        impact: s2.social_media.includes('3–4') || s2.social_media.includes('More than') ? "High" : "Medium",
        description: "Social media appears to be one of your biggest daily time leaks.",
        icon: "📱"
      },
      {
        title: "Phone Interruptions",
        category: "Focus",
        estimate: s3.phone_check_frequency,
        impact: "Medium",
        description: "Checking notifications during study sessions breaks your concentration flow.",
        icon: "🔔"
      },
      {
        title: "Afternoon Energy Dip",
        category: "Energy",
        estimate: `Energy level ${s4.afternoon_energy}/10`,
        impact: s4.afternoon_energy <= 4 ? "High" : "Medium",
        description: "Your afternoon appears to be a lower energy period.",
        icon: "🔋"
      }
    ],
    positive_habits: [
      `You study consistently to pursue your goal: ${s6.main_goal}.`,
      "You have high clarity and motivation for your primary target.",
      "Clear commitment to personal growth and time audit awareness."
    ],
    recommendations: [
      {
        title: "Set a 60-Minute Social Media Limit",
        description: "Try setting app limits on study days to recover focused time.",
        category: "Time Management",
        priority: 1
      },
      {
        title: "Keep Phone Away During Study",
        description: "Place your phone in another room during high-priority focus blocks.",
        category: "Focus",
        priority: 2
      },
      {
        title: "Align Goals to High-Energy Hours",
        description: "Reserve your morning peak energy window for your most challenging tasks.",
        category: "Goal Alignment",
        priority: 3
      }
    ],
    daily_action_plan: {
      title: "Tomorrow's 3 Actions",
      actions: [
        { text: "Limit social media to 60 minutes.", icon: "📱", estimated_hours_saved: "~1 hour recovered" },
        { text: "Complete two 45-minute focused study sessions.", icon: "📚", estimated_hours_saved: "~45 mins focus gain" },
        { text: "Go to bed 30 minutes earlier.", icon: "😴", estimated_hours_saved: "~1 hour energy gain" }
      ],
      estimated_recovery: "Small daily tweaks like these can help recover an estimated 1 to 2 hours of useful focus time.",
      disclaimer: "All estimates are non-medical approximations based on your input."
    },
    answers: submission
  };

  localStorage.setItem(`audit_${auditId}`, JSON.stringify(fallbackReport));
  return fallbackReport;
}
