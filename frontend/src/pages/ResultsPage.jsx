import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ScoreCard from '../components/ScoreCard';
import TimeLeaksSection from '../components/TimeLeaksSection';
import PositiveHabitsSection from '../components/PositiveHabitsSection';
import RecommendationsSection from '../components/RecommendationsSection';
import ActionPlanSection from '../components/ActionPlanSection';

import TimeDistributionChart from '../components/Charts/TimeDistributionChart';
import TimeLeaksChart from '../components/Charts/TimeLeaksChart';
import EnergyChart from '../components/Charts/EnergyChart';
import FocusChart from '../components/Charts/FocusChart';

import { getAuditReport } from '../services/api';

export default function ResultsPage() {
  const { id } = useParams();
  const location = useLocation();
  const [report, setReport] = useState(location.state?.audit || null);
  const [loading, setLoading] = useState(!report);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!report && id) {
      setLoading(true);
      getAuditReport(id)
        .then(data => {
          setReport(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Could not load audit report: ' + err.message);
          setLoading(false);
        });
    }
  }, [id, report]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>⏳</div>
        <h2>Analyzing Your Answers...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Building your customized productivity analysis & action plan.</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Report Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{error || 'Unable to retrieve this audit result.'}</p>
        <Link to="/audit" className="btn-primary">Take a New Audit</Link>
      </div>
    );
  }

  const {
    overall_score = 67,
    time_score = 58,
    energy_score = 72,
    focus_score = 61,
    goal_alignment_score = 77,
    time_distribution = {},
    detected_leaks = [],
    positive_habits = [],
    recommendations = [],
    daily_action_plan = {},
    answers = {}
  } = report;

  return (
    <div className="results-page">
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span 
          style={{ 
            fontSize: '0.85rem', 
            padding: '0.35rem 0.9rem', 
            background: 'rgba(99, 102, 241, 0.15)', 
            color: '#a5b4fc', 
            borderRadius: '20px', 
            fontWeight: '600',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}
        >
          Rule-Based Estimation Report
        </span>
        <h1 style={{ fontSize: '2.4rem', marginTop: '0.8rem', marginBottom: '0.4rem' }}>
          Your Life Audit Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Here is a breakdown of your daily time, energy slumps, focus patterns, and target goal alignment.
        </p>
      </div>

      {/* Overall Score Banner */}
      <div 
        className="glass-card" 
        style={{ 
          marginBottom: '2.5rem', 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(99, 102, 241, 0.25) 100%)', 
          borderColor: 'var(--border-highlight)',
          textAlign: 'center',
          padding: '2.5rem 1.5rem'
        }}
      >
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Overall Productivity Health Score
        </h3>
        <div style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: 1, margin: '0.8rem 0' }} className="gradient-text">
          {overall_score}<span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>/100</span>
        </div>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto' }}>
          Your answers suggest an opportunity to optimize your daily routine and recover focus time.
        </p>
      </div>

      {/* 4 Score Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <ScoreCard icon="⏰" title="Time Management" score={time_score} />
        <ScoreCard icon="🔋" title="Energy Balance" score={energy_score} />
        <ScoreCard icon="🎯" title="Focus Stamina" score={focus_score} />
        <ScoreCard icon="🚀" title="Goal Alignment" score={goal_alignment_score} />
      </div>

      {/* 4 Chart Visualizations Grid */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        <TimeDistributionChart distribution={time_distribution} />
        <TimeLeaksChart distribution={time_distribution} />
        <EnergyChart energyAnswers={answers.step4 || {}} />
        <FocusChart 
          focusScore={focus_score} 
          timeScore={time_score} 
          energyScore={energy_score} 
          goalScore={goal_alignment_score} 
        />
      </div>

      {/* Biggest Leaks Section */}
      <TimeLeaksSection leaks={detected_leaks} />

      {/* Positive Habits Strengths Section */}
      <PositiveHabitsSection habits={positive_habits} />

      {/* Recommendations Section */}
      <RecommendationsSection recommendations={recommendations} />

      {/* Action Plan Section */}
      <ActionPlanSection actionPlan={daily_action_plan} />

      {/* Re-audit CTA */}
      <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
        <Link to="/audit" className="btn-secondary">
          🔄 Retake Audit Form
        </Link>
      </div>
    </div>
  );
}
