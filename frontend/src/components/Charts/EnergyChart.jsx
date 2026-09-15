import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function EnergyChart({ energyAnswers = {} }) {
  const morning = energyAnswers.morning_energy || 5;
  const afternoon = energyAnswers.afternoon_energy || 5;
  const night = energyAnswers.night_energy || 5;

  const data = {
    labels: ['Morning', 'Afternoon', 'Night'],
    datasets: [
      {
        label: 'Energy Level (1–10)',
        data: [morning, afternoon, night],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#06b6d4',
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` Energy: ${ctx.raw} / 10`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 12 } },
        grid: { display: false }
      },
      y: {
        min: 0,
        max: 10,
        ticks: { color: '#94a3b8', stepSize: 2 },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        title: { display: true, text: 'Energy Scale (1-10)', color: '#64748b' }
      }
    }
  };

  return (
    <div className="glass-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
      <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        🔋 Daily Energy Curve
      </h4>
      <div style={{ flex: 1, position: 'relative' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
