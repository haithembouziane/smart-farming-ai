import { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import FarmOverview from './dashboard/FarmOverview';
import CropSelector from './dashboard/CropSelector';
import EnvironmentalFactors from './dashboard/EnvironmentalFactors';
import OptimizationPanel from './dashboard/OptimizationPanel';
import ResourceSchedule from './dashboard/ResourceSchedule';
import FarmPredictions from './dashboard/FarmPredictions';
import ResourceUsage from './dashboard/ResourceUsage';
import GrowthStageSelector from './dashboard/GrowthStageSelector';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { farmHealth } = useFarm();
  
  const healthColor = farmHealth > 80 ? 'text-success-600 dark:text-success-400' : 
                      farmHealth > 60 ? 'text-secondary-500 dark:text-secondary-400' :
                      'text-error-600 dark:text-error-400';
  
  return (
    <div className="pb-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Farm Dashboard</h1>
        <div className="flex items-center mt-2">
          <p className="text-gray-600 dark:text-gray-300">
            Farm Health: <span className={`font-semibold ${healthColor}`}>{farmHealth}%</span>
          </p>
          <div className="ml-4 bg-gray-200 dark:bg-gray-600 rounded-full h-2 w-36">
            <div 
              className={`h-full rounded-full ${
                farmHealth > 80 ? 'bg-success-500' : 
                farmHealth > 60 ? 'bg-secondary-500' : 
                'bg-error-500'
              }`}
              style={{ width: `${farmHealth}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <FarmOverview />
        
        <CropSelector />
        
        <GrowthStageSelector />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <EnvironmentalFactors />
        
        <OptimizationPanel />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ResourceSchedule />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ResourceUsage />
          <FarmPredictions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;