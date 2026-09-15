import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function FocusChart({ focusScore = 60, timeScore = 60, energyScore = 60, goalScore = 60 }) {
  const data = {
    labels: ['Focus Stamina', 'Time Control', 'Energy Balance', 'Goal Alignment', 'Friction Resistance'],
    datasets: [
      {
        label: 'Productivity Profile',
        data: [
          focusScore,
          timeScore,
          energyScore,
          goalScore,
          Math.round((focusScore + timeScore) / 2)
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        borderColor: '#6366f1',
        borderWidth: 2,
        pointBackgroundColor: '#a5b4fc',
        pointRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#94a3b8', font: { family: 'Inter', size: 10 } },
        ticks: { display: false, stepSize: 20 },
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="glass-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
      <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        🎯 Focus & Productivity Profile Radar
      </h4>
      <div style={{ flex: 1, position: 'relative' }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}
