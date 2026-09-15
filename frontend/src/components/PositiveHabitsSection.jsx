import React from 'react';

export default function PositiveHabitsSection({ habits = [] }) {
  if (!habits || habits.length === 0) return null;

  return (
    <div className="glass-card" style={{ marginBottom: '2rem', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.8rem' }}>🟢</span>
        <div>
          <h3 className="gradient-emerald" style={{ fontSize: '1.3rem' }}>What You're Doing Well</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Empowering strengths and positive habits detected in your routine.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
        {habits.map((habit, idx) => (
          <div 
            key={idx} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.85rem 1rem', 
              background: 'rgba(16, 185, 129, 0.08)', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontSize: '0.9rem',
              color: '#d1fae5'
            }}
          >
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>✅</span>
            <span>{habit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
