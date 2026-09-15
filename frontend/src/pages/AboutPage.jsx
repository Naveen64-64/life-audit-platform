import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 0' }}>
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }} className="gradient-text">
          How Life Audit Platform Works
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          The **Life Audit Platform** is designed specifically for college students seeking clarity on where their daily time and energy are spent. Instead of tedious minute-by-minute time logging, we use **minimum user input** paired with a transparent rule-based algorithm.
        </p>

        <h3 style={{ fontSize: '1.3rem', marginTop: '2rem', marginBottom: '0.8rem' }}>
          🎯 Our Core Design Principles
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.3rem' }}>1. Minimum Typing & Friction</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              No long text entries or manual calculations. Everything is answered through dropdowns, radio option cards, sliders, and checkboxes.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--accent-emerald)', marginBottom: '0.3rem' }}>2. Empathetic & Non-Judgmental Language</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              We never label anyone as "lazy" or "failing". We use constructive phrasing like *"appears to be a time leak"* or *"an opportunity to optimize your routine"*.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '0.3rem' }}>3. Transparent Estimation (~75% Practical Accuracy)</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              We do not claim medical or absolute scientific perfection. Our backend Audit Engine uses logical rules to identify obvious time sinks, energy slumps, and goal misalignments.
            </p>
          </div>
        </div>

        <h3 style={{ fontSize: '1.3rem', marginTop: '2.5rem', marginBottom: '0.8rem' }}>
          🔒 Privacy & Data Policy
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          We store minimal necessary parameters strictly for generating your audit report dashboard. No personal sensitive identifiable information is requested or sold.
        </p>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <Link to="/audit" className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
            Take Your Audit Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
