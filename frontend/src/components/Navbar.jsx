import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <Link to="/" className="nav-brand">
        <span className="brand-icon">⏱️</span>
        <span className="gradient-text">Life Audit</span>
      </Link>
      <nav className="nav-links">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link 
          to="/about" 
          className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
        >
          How It Works
        </Link>
        <Link to="/audit" className="btn-primary">
          Start Audit
        </Link>
      </nav>
    </header>
  );
}
