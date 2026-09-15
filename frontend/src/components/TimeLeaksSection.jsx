import React from 'react';

export default function TimeLeaksSection({ leaks = [] }) {
  if (!leaks || leaks.length === 0) return null;

  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.8rem' }}>🔴</span>
        <div>
          <h3 style={{ fontSize: '1.3rem' }}>Your Top Leaks</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Key areas where your time, energy, or focus might be leaking.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {leaks.map((leak, idx) => {
          const impactClass = leak.impact === 'High' 
            ? 'impact-high' 
            : (leak.impact === 'Medium' ? 'impact-medium' : 'impact-low');

          return (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '1rem', 
                padding: '1rem 1.25rem', 
                background: 'rgba(15, 23, 42, 0.6)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-color)' 
              }}
            >
              <div style={{ fontSize: '2rem', marginTop: '0.2rem' }}>{leak.icon || '⚠️'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {idx + 1}. {leak.title}
                  </h4>
                  <span className={`impact-badge ${impactClass}`}>
                    Impact: {leak.impact}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: '600', margin: '0.2rem 0' }}>
                  Estimated: {leak.estimate}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {leak.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
