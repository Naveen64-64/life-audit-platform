import React from 'react';

export default function ProgressBar({ currentStep, totalSteps = 6 }) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="progress-bar-container">
      <div className="progress-header">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{percentage}% Completed</span>
      </div>
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}
