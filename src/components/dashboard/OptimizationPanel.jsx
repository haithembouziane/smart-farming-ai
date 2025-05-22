import { useFarm } from '../../context/FarmContext';
import { Search, Cpu, Leaf } from 'lucide-react';
import { algorithmData } from '../../data/farmData';

const OptimizationPanel = () => {
  const { optimizationAlgorithm, setOptimizationAlgorithm, resources, setResources, environmentalFactors, additionalFactors, selectedCrop, soilType, growthStage, setRecommendedSchedule, setYieldForecast, setIsLoading } = useFarm();

  const handleResourceChange = (resource, value) => {
    setResources(prev => ({
      ...prev,
      [resource]: parseInt(value)
    }));
  };

  const runOptimization = async () => {
    const payload = {
      algorithm: optimizationAlgorithm,
      crop_type: selectedCrop.name.toLowerCase(),
      soil_type: soilType.id,
      temperature: environmentalFactors.temperature,
      humidity: environmentalFactors.humidity,
      rainfall: environmentalFactors.rainfall,
      sunlight: environmentalFactors.sunlight,
      wind_speed: environmentalFactors.windSpeed,
      ph: additionalFactors.ph,
      crop_area: additionalFactors.crop_area,
      crop_density: additionalFactors.crop_density,
      water: resources.water,
      fertilizer: {
        N: additionalFactors.soil_nutrients.N,
        P: additionalFactors.soil_nutrients.P,
        K: additionalFactors.soil_nutrients.K
      },
      pesticides: additionalFactors.pesticides,
      goal_yield: selectedCrop.baseYield,
      max_steps: 30,
      growth_stage: growthStage,
      soil_moisture: additionalFactors.soil_moisture,
      soil_nutrients: additionalFactors.soil_nutrients,
      crop_health: additionalFactors.crop_health
    };
    
    try {
      setIsLoading(true);
      console.log("Calling optimization API with payload:", payload);
      
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received optimization results:", data);
      
      // Update state with results
      setRecommendedSchedule(data.schedule);
      setYieldForecast(data.yield);
      
    } catch (error) {
      console.error("Optimization error:", error);
      // You could show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover-effect">
      <div className="flex items-center mb-4">
        <Cpu className="h-5 w-5 text-primary-600 mr-2" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Optimization Settings</h2>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          AI Algorithm
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {algorithmData.map((algorithm) => (
            <button
              key={algorithm.id}
              onClick={() => setOptimizationAlgorithm(algorithm.id)}
              className={`py-2 px-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors ${
                optimizationAlgorithm === algorithm.id
                  ? 'bg-primary-100 text-primary-700 border-2 border-primary-500 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-700'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <span className="font-medium">{algorithm.name}</span>
              <span className="text-xs mt-1">
                {algorithm.id === 'astar' ? 'A*' : algorithm.id === 'genetic' ? 'GA' : algorithm.id === 'greedy' ? 'Greedy' : 'CSP'}
              </span>
            </button>
          ))}
        </div>
        
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          <p>{algorithmData.find(a => a.id === optimizationAlgorithm)?.description}</p>
          <p className="mt-2 text-xs font-medium text-primary-600 dark:text-primary-400">
            Best for: {algorithmData.find(a => a.id === optimizationAlgorithm)?.bestFor}
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Available Water
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">{resources.water} liters</span>
          </div>
          <input
            type="range"
            min="1000"
            max="10000"
            step="100"
            value={resources.water}
            onChange={(e) => handleResourceChange('water', e.target.value)}
            className="w-full accent-primary-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Available Fertilizer
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">{resources.fertilizer} kg</span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="10"
            value={resources.fertilizer}
            onChange={(e) => handleResourceChange('fertilizer', e.target.value)}
            className="w-full accent-primary-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={runOptimization}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
        >
          Run Optimization
        </button>
      </div>
    </div>
  );
};

export default OptimizationPanel;