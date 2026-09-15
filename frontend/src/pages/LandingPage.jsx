import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing-page" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      {/* Hero Header */}
      <div style={{ maxWidth: '800px', margin: '0 auto 4rem auto' }}>
        <div 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.4rem 1rem', 
            background: 'rgba(99, 102, 241, 0.15)', 
            border: '1px solid rgba(99, 102, 241, 0.3)', 
            borderRadius: '30px', 
            fontSize: '0.85rem', 
            color: '#a5b4fc', 
            fontWeight: '600',
            marginBottom: '1.5rem' 
          }}
        >
          ⚡ Takes only 2–4 minutes • Minimum Typing Required
        </div>

        <h1 
          style={{ 
            fontSize: 'clamp(2.3rem, 5vw, 3.8rem)', 
            fontWeight: '800', 
            letterSpacing: '-1px', 
            lineHeight: 1.15,
            marginBottom: '1.25rem' 
          }}
        >
          Where Is Your Day <span className="gradient-text">Really Going?</span>
        </h1>

        <p 
          style={{ 
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', 
            color: 'var(--text-secondary)', 
            maxWidth: '650px', 
            margin: '0 auto 2.5rem auto' 
          }}
        >
          Find your time leaks, energy leaks, and productivity patterns in just a few minutes with friendly, non-judgmental guidance.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/audit" className="btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
            Start My Life Audit →
          </Link>
          <a href="#how-it-works" className="btn-secondary" style={{ padding: '0.9rem 1.8rem', fontSize: '1.05rem' }}>
            How It Works
          </a>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div id="how-it-works" style={{ paddingTop: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Three Steps to Clarity</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          Designed specifically for college students balancing classes, study, and life.
        </p>

        <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {/* Card 1 */}
          <div className="glass-card" style={{ textAlign: 'left', position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏰</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Track Your Time</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Select simple choices for social media, entertainment, study, and commute without typing or recording every minute.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card" style={{ textAlign: 'left', position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔋</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Understand Your Energy</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Map out morning, afternoon, and night energy slumps to discover when your brain is naturally sharpest.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card" style={{ textAlign: 'left', position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💡</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Get Better Recommendations</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Receive 3–5 targeted daily habits and a simple action plan to recover 1–2 hours of high-yield focus time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
