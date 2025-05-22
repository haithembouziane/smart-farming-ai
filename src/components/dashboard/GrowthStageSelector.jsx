import { useFarm } from '../../context/FarmContext';
import { Sprout } from 'lucide-react';
import { growthStages } from '../../data/farmData';

const GrowthStageSelector = () => {
  const { growthStage, setGrowthStage } = useFarm();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover-effect">
      <div className="flex items-center mb-5">
        <Sprout className="h-5 w-5 text-primary-600 mr-2" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Growth Stage</h2>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
        Select the current growth stage to optimize from
      </p>
      
      <div className="flex flex-col gap-3">
        {growthStages.map((stage) => (
          <button
            key={stage.id}
            className={`flex items-center p-3 rounded-lg border-2 transition-all ${
              growthStage === stage.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
            onClick={() => setGrowthStage(stage.id)}
          >
            <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
              growthStage === stage.id 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}>
              {stage.id}
            </div>
            <div className="text-left">
              <p className={`font-medium ${growthStage === stage.id ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {stage.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stage.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GrowthStageSelector;