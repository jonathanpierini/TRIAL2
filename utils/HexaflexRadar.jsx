
import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function HexaflexRadar({ profilo }) {
  const labels = Object.keys(profilo);
  const data = Object.values(profilo);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Profilo Hexaflex',
        data: data,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      }
    ]
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Radar data={chartData} />
    </div>
  );
}
