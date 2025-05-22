import { useFarm } from '../../context/FarmContext';
import { BarChart3 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResourceUsage = () => {
  const { recommendedSchedule, growthStage } = useFarm();
  
  if (!recommendedSchedule) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }
  
  // Filter weeks based on growth stage
  const filteredSchedule = recommendedSchedule.filter(week => week.stage >= growthStage);
  
  // Prepare data for chart
  const labels = filteredSchedule.map(week => `Week ${week.week}`);
  const waterData = filteredSchedule.map(week => parseFloat(week.waterTotal));
  const fertilizerData = filteredSchedule.map(week => parseFloat(week.fertilizerTotal));
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Water (mm)',
        data: waterData,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Fertilizer (kg)',
        data: fertilizerData,
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563',
        },
      },
    },
  };
  
  // Calculate totals for the text summary
  const totalWater = waterData.reduce((acc, curr) => acc + curr, 0).toFixed(1);
  const totalFertilizer = fertilizerData.reduce((acc, curr) => acc + curr, 0).toFixed(1);
  
  // Calculate daily averages
  const totalDays = labels.length * 7; // 7 days per week
  const dailyWaterAvg = (totalWater / totalDays).toFixed(1);
  const dailyFertilizerAvg = (totalFertilizer / totalDays).toFixed(2);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover-effect">
      <div className="flex items-center mb-4">
        <BarChart3 className="h-5 w-5 text-primary-600 mr-2" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Resource Usage</h2>
      </div>
      
      <div className="h-72">
        <Bar options={options} data={data} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Water</p>
          <p className="text-xl font-semibold text-blue-700 dark:text-blue-300">{totalWater} mm</p>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
            ~{dailyWaterAvg} mm/day average
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Fertilizer</p>
          <p className="text-xl font-semibold text-purple-700 dark:text-purple-300">{totalFertilizer} kg</p>
          <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
            ~{dailyFertilizerAvg} kg/day average
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourceUsage;