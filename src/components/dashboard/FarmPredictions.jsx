import { useFarm } from '../../context/FarmContext';
import { TrendingUp, Leaf, CalendarClock } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const FarmPredictions = () => {
  const { selectedCrop, farmHealth, yieldForecast } = useFarm();
  
  const harvestDate = new Date();
  harvestDate.setDate(harvestDate.getDate() + selectedCrop.growthDuration);
  
  // Simulate growth curve data
  const labels = Array.from({ length: 8 }, (_, i) => `Week ${i + 1}`);
  
  // Create a growth curve based on sigmoid function
  const generateGrowthCurve = () => {
    return labels.map((_, i) => {
      const x = (i / (labels.length - 1)) * 2 - 1; // Map to -1 to 1
      const sigmoid = 1 / (1 + Math.exp(-6 * x)); // Steeper sigmoid curve
      return sigmoid * 100 * (farmHealth / 100);
    });
  };
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Growth Progress',
        data: generateGrowthCurve(),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 4,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Growth: ${context.parsed.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563',
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563',
        }
      }
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover-effect">
      <div className="flex items-center mb-4">
        <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Growth & Yield Predictions</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Leaf className="h-4 w-4 text-primary-600 mr-1" />
            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">Predicted Yield</p>
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {yieldForecast ? Math.round(yieldForecast).toLocaleString() : '---'} kg/ha
          </p>
          <div className="mt-1 flex items-center text-xs">
            <span className={farmHealth > 75 ? 'text-success-500' : farmHealth > 50 ? 'text-secondary-500' : 'text-error-500'}>
              {farmHealth > 75 ? '↑ Optimal' : farmHealth > 50 ? '→ Average' : '↓ Below Average'}
            </span>
          </div>
        </div>
        
        <div className="bg-secondary-50 dark:bg-secondary-900/20 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <CalendarClock className="h-4 w-4 text-secondary-600 mr-1" />
            <p className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">Est. Harvest</p>
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {harvestDate.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <p className="mt-1 text-xs text-secondary-600/70 dark:text-secondary-400/70">
            {selectedCrop.growthDuration} days from planting
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Predicted Growth Curve</h3>
        <div className="h-52">
          <Line options={options} data={data} />
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>* Predictions based on current environmental factors and selected crop characteristics</p>
      </div>
    </div>
  );
};

export default FarmPredictions;