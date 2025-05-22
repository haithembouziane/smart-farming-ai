import { useState, useEffect } from 'react';
import { Timer, Cpu, Memory, Scale } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AlgorithmPerformance = ({ algorithm, isRunning, startTime, endTime }) => {
  const [cpuUsage, setCpuUsage] = useState([]);
  const [memoryUsage, setMemoryUsage] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        // Simulate CPU and memory usage
        setCpuUsage(prev => [...prev, Math.random() * 30 + 20]);
        setMemoryUsage(prev => [...prev, Math.random() * 200 + 300]);
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else if (endTime) {
      setElapsedTime(endTime - startTime);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, endTime]);

  const performanceData = {
    labels: cpuUsage.map((_, i) => `${i}s`),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: cpuUsage,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Memory Usage (MB)',
        data: memoryUsage,
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Scale className="h-5 w-5 text-primary-600 mr-2" />
            Algorithm Performance Metrics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real-time performance monitoring for {algorithm}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Timer className="h-4 w-4 text-primary-600" />
          <span className="font-mono">{(elapsedTime / 1000).toFixed(2)}s</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Cpu className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm text-blue-600 dark:text-blue-400">CPU Usage</span>
          </div>
          <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
            {cpuUsage[cpuUsage.length - 1]?.toFixed(1) || 0}%
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Memory className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm text-purple-600 dark:text-purple-400">Memory Usage</span>
          </div>
          <p className="text-2xl font-semibold text-purple-700 dark:text-purple-300">
            {memoryUsage[memoryUsage.length - 1]?.toFixed(0) || 0} MB
          </p>
        </div>
      </div>

      <div className="h-64">
        <Line options={options} data={performanceData} />
      </div>

      {isRunning && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
            <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
            <span>Algorithm running...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmPerformance;