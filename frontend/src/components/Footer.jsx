import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Life Audit Platform — Designed for College Students</p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Insights & scores are rule-based estimates provided for productivity self-reflection. Not medical advice.
        </p>
      </div>
    </footer>
  );
}
