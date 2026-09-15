import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TimeDistributionChart({ distribution = {} }) {
  const labels = Object.keys(distribution);
  const values = Object.values(distribution);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Est. Hours / Day',
        data: values,
        backgroundColor: [
          '#6366f1', // College
          '#10b981', // Productive Study
          '#f43f5e', // Social Media
          '#f59e0b', // Entertainment
          '#8b5cf6', // Gaming
          '#06b6d4', // Commute
          '#3b82f6', // Sleep
          '#64748b'  // Unplanned
        ],
        borderWidth: 2,
        borderColor: '#1e293b',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 11
          },
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${context.raw} hrs`
        }
      }
    }
  };

  return (
    <div className="glass-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
      <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        ⏰ 24-Hour Time Distribution
      </h4>
      <div style={{ flex: 1, position: 'relative' }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
