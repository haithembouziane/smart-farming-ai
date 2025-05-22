import { Droplets, Wind, Thermometer, Sun, Sparkles } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

const FarmOverview = () => {
  const { selectedCrop, soilType, environmentalFactors } = useFarm();
  
  const statItems = [
    { 
      name: 'Temperature', 
      value: `${environmentalFactors.temperature}°C`, 
      icon: Thermometer, 
      color: 'text-red-500 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/30'
    },
    { 
      name: 'Humidity', 
      value: `${environmentalFactors.humidity}%`, 
      icon: Droplets, 
      color: 'text-blue-500 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30' 
    },
    { 
      name: 'Sunlight', 
      value: `${environmentalFactors.sunlight} hrs`, 
      icon: Sun, 
      color: 'text-yellow-500 dark:text-yellow-300',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30'  
    },
    { 
      name: 'Wind Speed', 
      value: `${environmentalFactors.windSpeed} km/h`, 
      icon: Wind, 
      color: 'text-cyan-500 dark:text-cyan-400',
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/30'  
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover-effect">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Farm Overview</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Current conditions and selected crop</p>
        </div>
        <div className="flex items-center">
          <span className="text-2xl mr-2">{selectedCrop.icon}</span>
          <span className="text-xl mr-2">{soilType.icon}</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Selected Crop</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCrop.name}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="bg-secondary-100 dark:bg-secondary-900/30 p-2 rounded-full">
              <Droplets className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Soil Type</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{soilType.name} - {soilType.description}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        {statItems.map((item) => (
          <div key={item.name} className="flex items-center">
            <div className={`flex-shrink-0 ${item.iconBg} p-2 rounded-full`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.name}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmOverview;