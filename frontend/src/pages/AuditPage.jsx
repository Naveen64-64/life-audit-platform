import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { submitAudit } from '../services/api';

export default function AuditPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Initial Form State
  const [formData, setFormData] = useState({
    step1: {
      student_status: 'College Student',
      wake_time: '7–8 AM',
      sleep_time: '11 PM–12 AM'
    },
    step2: {
      college_time: '5–7 hours',
      study_time: '2–3 hours',
      social_media: '1–2 hours',
      entertainment: '1–2 hours',
      gaming: "I don't play",
      commute: '30–60 minutes'
    },
    step3: {
      sleep_quality: 'Average',
      exercise: '1–2 days/week',
      phone_check_frequency: 'Every 30–60 minutes',
      notifications_enabled: 'Yes'
    },
    step4: {
      morning_energy: 7,
      afternoon_energy: 4,
      night_energy: 6,
      tired_frequency: 'Sometimes'
    },
    step5: {
      focus_duration: '20–30 minutes',
      task_switching: 'Sometimes',
      interruptions: ['Phone', 'Social media', 'Notifications']
    },
    step6: {
      main_goal: 'Improve College Grades',
      goal_importance: 8,
      goal_satisfaction: 5
    }
  });

  // State update helpers
  const updateStepData = (stepKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [field]: value
      }
    }));
  };

  const toggleInterruption = (item) => {
    setFormData(prev => {
      const current = prev.step5.interruptions;
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return {
        ...prev,
        step5: { ...prev.step5, interruptions: updated }
      };
    });
  };

  // Next / Back handlers
  const handleNext = () => {
    setErrorMsg('');
    if (step < 6) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const result = await submitAudit(formData);
      navigate(`/results/${result.id}`, { state: { audit: result } });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit audit. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Progress Bar */}
      <ProgressBar currentStep={step} totalSteps={6} />

      {/* Main Glass Form Card */}
      <div className="glass-card">
        {errorMsg && (
          <div style={{ padding: '0.85rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: 'var(--radius-md)', color: '#fca5a5', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* STEP 1: BASIC INFORMATION */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Step 1 — Basic Information</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Tell us a little bit about your current daily schedule.
            </p>

            <div className="form-group">
              <label className="form-label">Student Status</label>
              <select 
                className="select-input"
                value={formData.step1.student_status}
                onChange={e => updateStepData('step1', 'student_status', e.target.value)}
              >
                <option value="College Student">College Student</option>
                <option value="Working Student">Working Student</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Typical Wake-up Time</label>
              <select 
                className="select-input"
                value={formData.step1.wake_time}
                onChange={e => updateStepData('step1', 'wake_time', e.target.value)}
              >
                <option value="Before 6 AM">Before 6 AM</option>
                <option value="6–7 AM">6–7 AM</option>
                <option value="7–8 AM">7–8 AM</option>
                <option value="8–9 AM">8–9 AM</option>
                <option value="After 9 AM">After 9 AM</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Typical Sleep Time</label>
              <select 
                className="select-input"
                value={formData.step1.sleep_time}
                onChange={e => updateStepData('step1', 'sleep_time', e.target.value)}
              >
                <option value="Before 10 PM">Before 10 PM</option>
                <option value="10–11 PM">10–11 PM</option>
                <option value="11 PM–12 AM">11 PM–12 AM</option>
                <option value="12–1 AM">12–1 AM</option>
                <option value="After 1 AM">After 1 AM</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: DAILY TIME */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Step 2 — Daily Time</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Rough estimates of where your time goes each day.
            </p>

            <div className="form-group">
              <label className="form-label">College / Work Time</label>
              <select 
                className="select-input"
                value={formData.step2.college_time}
                onChange={e => updateStepData('step2', 'college_time', e.target.value)}
              >
                <option value="Less than 3 hours">Less than 3 hours</option>
                <option value="3–5 hours">3–5 hours</option>
                <option value="5–7 hours">5–7 hours</option>
                <option value="7–9 hours">7–9 hours</option>
                <option value="More than 9 hours">More than 9 hours</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Study / Productive Work</label>
              <select 
                className="select-input"
                value={formData.step2.study_time}
                onChange={e => updateStepData('step2', 'study_time', e.target.value)}
              >
                <option value="Less than 1 hour">Less than 1 hour</option>
                <option value="1–2 hours">1–2 hours</option>
                <option value="2–3 hours">2–3 hours</option>
                <option value="3–4 hours">3–4 hours</option>
                <option value="More than 4 hours">More than 4 hours</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Social Media</label>
              <select 
                className="select-input"
                value={formData.step2.social_media}
                onChange={e => updateStepData('step2', 'social_media', e.target.value)}
              >
                <option value="Less than 30 minutes">Less than 30 minutes</option>
                <option value="30–60 minutes">30–60 minutes</option>
                <option value="1–2 hours">1–2 hours</option>
                <option value="2–3 hours">2–3 hours</option>
                <option value="3–4 hours">3–4 hours</option>
                <option value="More than 4 hours">More than 4 hours</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Entertainment / YouTube / OTT</label>
              <select 
                className="select-input"
                value={formData.step2.entertainment}
                onChange={e => updateStepData('step2', 'entertainment', e.target.value)}
              >
                <option value="Less than 30 minutes">Less than 30 minutes</option>
                <option value="30–60 minutes">30–60 minutes</option>
                <option value="1–2 hours">1–2 hours</option>
                <option value="2–3 hours">2–3 hours</option>
                <option value="More than 3 hours">More than 3 hours</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Gaming</label>
              <select 
                className="select-input"
                value={formData.step2.gaming}
                onChange={e => updateStepData('step2', 'gaming', e.target.value)}
              >
                <option value="I don't play">I don't play</option>
                <option value="Less than 30 minutes">Less than 30 minutes</option>
                <option value="30–60 minutes">30–60 minutes</option>
                <option value="1–2 hours">1–2 hours</option>
                <option value="2–3 hours">2–3 hours</option>
                <option value="More than 3 hours">More than 3 hours</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Travel / Commute</label>
              <select 
                className="select-input"
                value={formData.step2.commute}
                onChange={e => updateStepData('step2', 'commute', e.target.value)}
              >
                <option value="Less than 30 minutes">Less than 30 minutes</option>
                <option value="30–60 minutes">30–60 minutes</option>
                <option value="1–2 hours">1–2 hours</option>
                <option value="2–3 hours">2–3 hours</option>
                <option value="More than 3 hours">More than 3 hours</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: HABITS */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Step 3 — Habits</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Your sleep, physical routine, and phone environment.
            </p>

            {/* Sleep Quality Radio Cards */}
            <div className="form-group">
              <label className="form-label">Sleep Quality</label>
              <div className="radio-group-grid">
                {[
                  { value: 'Very Poor', emoji: '😴' },
                  { value: 'Poor', emoji: '😕' },
                  { value: 'Average', emoji: '😐' },
                  { value: 'Good', emoji: '🙂' },
                  { value: 'Very Good', emoji: '😄' }
                ].map((opt) => (
                  <label 
                    key={opt.value} 
                    className={`radio-card-option ${formData.step3.sleep_quality === opt.value ? 'active' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="sleep_quality"
                      value={opt.value}
                      checked={formData.step3.sleep_quality === opt.value}
                      onChange={() => updateStepData('step3', 'sleep_quality', opt.value)}
                    />
                    <span className="emoji">{opt.emoji}</span>
                    <span className="option-text">{opt.value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Exercise</label>
              <select 
                className="select-input"
                value={formData.step3.exercise}
                onChange={e => updateStepData('step3', 'exercise', e.target.value)}
              >
                <option value="Never">Never</option>
                <option value="1–2 days/week">1–2 days/week</option>
                <option value="3–4 days/week">3–4 days/week</option>
                <option value="5+ days/week">5+ days/week</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">How often do you check your phone while studying?</label>
              <select 
                className="select-input"
                value={formData.step3.phone_check_frequency}
                onChange={e => updateStepData('step3', 'phone_check_frequency', e.target.value)}
              >
                <option value="Almost never">Almost never</option>
                <option value="A few times">A few times</option>
                <option value="Every 30–60 minutes">Every 30–60 minutes</option>
                <option value="Every 15–30 minutes">Every 15–30 minutes</option>
                <option value="Almost continuously">Almost continuously</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Do you usually study with notifications enabled?</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {['Yes', 'No'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => updateStepData('step3', 'notifications_enabled', val)}
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      borderRadius: 'var(--radius-md)',
                      border: formData.step3.notifications_enabled === val ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: formData.step3.notifications_enabled === val ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {val === 'Yes' ? '🔔 Yes' : '🔕 No'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ENERGY */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Step 4 — Energy</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              How your energy levels naturally change throughout the day.
            </p>

            {/* Morning Energy Slider */}
            <div className="form-group">
              <div className="slider-header">
                <label className="form-label">Morning Energy</label>
                <span className="slider-value-badge">{formData.step4.morning_energy} / 10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                className="range-slider"
                value={formData.step4.morning_energy}
                onChange={e => updateStepData('step4', 'morning_energy', parseInt(e.target.value))}
              />
              <div className="slider-labels">
                <span>1 = Very Low</span>
                <span>10 = Very High</span>
              </div>
            </div>

            {/* Afternoon Energy Slider */}
            <div className="form-group">
              <div className="slider-header">
                <label className="form-label">Afternoon Energy</label>
                <span className="slider-value-badge">{formData.step4.afternoon_energy} / 10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                className="range-slider"
                value={formData.step4.afternoon_energy}
                onChange={e => updateStepData('step4', 'afternoon_energy', parseInt(e.target.value))}
              />
              <div className="slider-labels">
                <span>1 = Very Low</span>
                <span>10 = Very High</span>
              </div>
            </div>

            {/* Night Energy Slider */}
            <div className="form-group">
              <div className="slider-header">
                <label className="form-label">Night Energy</label>
                <span className="slider-value-badge">{formData.step4.night_energy} / 10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                className="range-slider"
                value={formData.step4.night_energy}
                onChange={e => updateStepData('step4', 'night_energy', parseInt(e.target.value))}
              />
              <div className="slider-labels">
                <span>1 = Very Low</span>
                <span>10 = Very High</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">How often do you feel tired even when you haven't done much?</label>
              <select 
                className="select-input"
                value={formData.step4.tired_frequency}
                onChange={e => updateStepData('step4', 'tired_frequency', e.target.value)}
              >
                <option value="Never">Never</option>
                <option value="Rarely">Rarely</option>
                <option value="Sometimes">Sometimes</option>
                <option value="Often">Often</option>
                <option value="Almost every day">Almost every day</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 5: FOCUS */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Step 5 — Focus</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Your concentration patterns and study environment interruptions.
            </p>

            <div className="form-group">
              <label className="form-label">How long can you usually focus without checking your phone?</label>
              <select 
                className="select-input"
                value={formData.step5.focus_duration}
                onChange={e => updateStepData('step5', 'focus_duration', e.target.value)}
              >
                <option value="Less than 10 minutes">Less than 10 minutes</option>
                <option value="10–20 minutes">10–20 minutes</option>
                <option value="20–30 minutes">20–30 minutes</option>
                <option value="30–45 minutes">30–45 minutes</option>
                <option value="45–60 minutes">45–60 minutes</option>
                <option value="More than 60 minutes">More than 60 minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">How often do you switch between tasks?</label>
              <select 
                className="select-input"
                value={formData.step5.task_switching}
                onChange={e => updateStepData('step5', 'task_switching', e.target.value)}
              >
                <option value="Rarely">Rarely</option>
                <option value="Sometimes">Sometimes</option>
                <option value="Often">Often</option>
                <option value="Very Often">Very Often</option>
              </select>
            </div>

            {/* Multi-select Interruption checkboxes */}
            <div className="form-group">
              <label className="form-label">
                When studying, what usually interrupts you?
                <span className="subtext">Select all that apply</span>
              </label>
              <div className="checkbox-grid">
                {[
                  'Phone', 'Social media', 'Friends', 'Messages', 
                  'YouTube', 'Gaming', 'Noise', 'Tiredness', 'Hunger', 'Other'
                ].map((item) => {
                  const isSelected = formData.step5.interruptions.includes(item);
                  return (
                    <label 
                      key={item} 
                      className={`checkbox-card ${isSelected ? 'selected' : ''}`}
                    >
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleInterruption(item)}
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: GOAL */}
        {step === 6 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Step 6 — Goal</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Final step: What are you striving towards right now?
            </p>

            <div className="form-group">
              <label className="form-label">What is your main goal right now?</label>
              <select 
                className="select-input"
                value={formData.step6.main_goal}
                onChange={e => updateStepData('step6', 'main_goal', e.target.value)}
              >
                <option value="Improve College Grades">Improve College Grades</option>
                <option value="Prepare for Placements">Prepare for Placements</option>
                <option value="Learn Programming">Learn Programming</option>
                <option value="Prepare for Competitive Exams">Prepare for Competitive Exams</option>
                <option value="Build Projects">Build Projects</option>
                <option value="Improve Fitness">Improve Fitness</option>
                <option value="Improve Sleep">Improve Sleep</option>
                <option value="Personal Development">Personal Development</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <div className="slider-header">
                <label className="form-label">How important is this goal?</label>
                <span className="slider-value-badge">{formData.step6.goal_importance} / 10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                className="range-slider"
                value={formData.step6.goal_importance}
                onChange={e => updateStepData('step6', 'goal_importance', parseInt(e.target.value))}
              />
              <div className="slider-labels">
                <span>1 = Low Importance</span>
                <span>10 = Top Priority</span>
              </div>
            </div>

            <div className="form-group">
              <div className="slider-header">
                <label className="form-label">How satisfied are you with your current progress?</label>
                <span className="slider-value-badge">{formData.step6.goal_satisfaction} / 10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                className="range-slider"
                value={formData.step6.goal_satisfaction}
                onChange={e => updateStepData('step6', 'goal_satisfaction', parseInt(e.target.value))}
              />
              <div className="slider-labels">
                <span>1 = Very Dissatisfied</span>
                <span>10 = Very Satisfied</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          {step > 1 ? (
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          <button 
            type="button" 
            className="btn-primary"
            onClick={handleNext}
            disabled={isSubmitting}
            style={{ minWidth: '140px', justifyContent: 'center' }}
          >
            {isSubmitting ? (
              <span>Processing...</span>
            ) : (
              step === 6 ? 'Generate Audit Report 🎉' : 'Next Step →'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
