import React, { useContext } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import contentContext from '@/context/content/contentContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const StatsChart = ({ userStats }) => {
  const { t } = useContext(contentContext);

  if (!userStats) {
    return (
      <div
        style={{
          fontSize: '13px',
          color: 'white',
        }}
      >
        {t('NO_STATISTICS')}
      </div>
    );
  }

  const { labels, averageMoney, averageWinCount, averageLoseCount } = userStats;

  const barData = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: t('AVERAGE_MONEY'),
        data: averageMoney,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for the line chart (winCount and loseCount)
  const lineData = {
    labels,
    datasets: [
      {
        type: 'line',
        label: t('AVERAGE_WIN_COUNT'),
        data: averageWinCount,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        type: 'line',
        label: t('AVERAGE_LOSE_COUNT'),
        data: averageLoseCount,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: t('DAYS'),
          color: 'white',
          font: {
            size: 14,
          },
        },
        ticks: {
          color: 'white',
        },
      },
      y: {
        title: {
          display: true,
          text: t('VALUES'),
          color: 'white',
          font: {
            size: 14,
          },
        },
        ticks: {
          color: 'white',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Chart type="bar" data={barData} options={options} />
      <Chart type="line" data={lineData} options={options} />
    </div>
  );
};

export default StatsChart;
