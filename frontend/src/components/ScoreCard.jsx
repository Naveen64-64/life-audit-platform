import React from 'react';

export default function ScoreCard({ icon, title, score, category }) {
  // Score status color calculation
  const getScoreColor = (val) => {
    if (val >= 85) return 'var(--accent-emerald)';
    if (val >= 65) return '#a5b4fc';
    if (val >= 50) return 'var(--accent-amber)';
    return 'var(--accent-rose)';
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{icon}</div>
      <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </h4>
      <div style={{ fontSize: '2.2rem', fontWeight: '800', color: scoreColor, margin: '0.4rem 0' }}>
        {score}<span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/100</span>
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        {score >= 75 ? 'Optimal' : (score >= 60 ? 'Moderate' : 'Opportunity to Improve')}
      </div>
    </div>
  );
}
