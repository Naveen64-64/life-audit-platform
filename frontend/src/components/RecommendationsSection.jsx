import React from 'react';

export default function RecommendationsSection({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.8rem' }}>💡</span>
        <div>
          <h3 style={{ fontSize: '1.3rem' }}>Personalized Recommendations</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Targeted adjustments tailored to your audit answers (Max 3–5 items).
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {recommendations.map((rec, idx) => (
          <div 
            key={idx} 
            style={{ 
              padding: '1.2rem', 
              background: 'var(--bg-input)', 
              borderRadius: 'var(--radius-md)', 
              borderLeft: '4px solid var(--primary)' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                {idx + 1}. {rec.title}
              </h4>
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', borderRadius: '4px' }}>
                {rec.category}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {rec.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
