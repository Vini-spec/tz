import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const Chart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.timestamp),
    datasets: [
      {
        label: 'Value',
        data: data.map(item => ({ x: item.timestamp, y: item.value })),
        fill: false,
        backgroundColor: 'rgba(136, 132, 216, 0.2)',
        borderColor: '#8884d8',
      }
    ]
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'PP',
          displayFormats: {
            day: 'MMM d'
          }
        },
        title: {
          display: true,
          text: 'Timestamp'
        },
        adapters: {
          date: {
            formats: {
              date: (value) => format(new Date(value), 'yyyy-MM-dd')
            }
          }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value'
        }
      }
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false
      },
      legend: {
        display: true,
        position: 'top'
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Chart;