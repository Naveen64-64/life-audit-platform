import React from 'react';

export default function ActionPlanSection({ actionPlan }) {
  if (!actionPlan) return null;

  const actions = actionPlan.actions || [];

  return (
    <div className="glass-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(99, 102, 241, 0.15) 100%)', borderColor: 'var(--border-highlight)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.8rem' }}>🚀</span>
        <div>
          <h3 style={{ fontSize: '1.3rem' }}>Tomorrow's 3 Actions</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Simple, actionable daily habits to start immediately.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
        {actions.map((act, idx) => (
          <div 
            key={idx} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: '1rem', 
              padding: '1rem 1.25rem', 
              background: 'rgba(15, 23, 42, 0.7)', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid rgba(255, 255, 255, 0.1)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{act.icon}</span>
              <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>
                {idx + 1}. {act.text}
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: '600', whiteSpace: 'nowrap' }}>
              {act.estimated_hours_saved}
            </span>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.9rem', color: '#d1fae5' }}>
        <strong>Expected Improvement Estimate:</strong> {actionPlan.estimated_recovery}
      </div>
    </div>
  );
}
