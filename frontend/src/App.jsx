import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AuditPage from './pages/AuditPage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import AuditBot from './components/AuditBot';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/results/:id" element={<ResultsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      {/* AuditBot: fixed bottom-right, no text input, session-only history */}
      <AuditBot />
    </Router>
  );
}

