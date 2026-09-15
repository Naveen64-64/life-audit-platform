import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TimeLeaksChart({ distribution = {} }) {
  const categories = ['Productive Study', 'Social Media', 'Entertainment', 'Gaming', 'Commute'];
  const values = categories.map(cat => distribution[cat] || 0);

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Est. Hours / Day',
        data: values,
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // Study - Green
          'rgba(244, 63, 94, 0.85)',  // Social Media - Red
          'rgba(245, 158, 11, 0.85)', // Entertainment - Amber
          'rgba(139, 92, 246, 0.85)', // Gaming - Purple
          'rgba(6, 182, 212, 0.85)'   // Commute - Cyan
        ],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.raw} hours/day`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
        grid: { display: false }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        title: { display: true, text: 'Hours / Day', color: '#64748b' }
      }
    }
  };

  return (
    <div className="glass-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
      <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        📊 Productive vs. Leak Hours Breakdown
      </h4>
      <div style={{ flex: 1, position: 'relative' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
