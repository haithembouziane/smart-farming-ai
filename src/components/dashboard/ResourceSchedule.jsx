import { useState, useEffect } from 'react';
import { useFarm } from '../../context/FarmContext';
import { Calendar, Droplets, Database, Download } from 'lucide-react';

const ResourceSchedule = () => {
  const { recommendedSchedule, selectedCrop, optimizationAlgorithm, growthStage } = useFarm();
  const [activeTab, setActiveTab] = useState('weekly');
  const [visibleWeeks, setVisibleWeeks] = useState([]);
  
  useEffect(() => {
    if (recommendedSchedule) {
      // Only show first 4 weeks by default
      setVisibleWeeks(recommendedSchedule.slice(0, 4).map(week => week.week));
    }
  }, [recommendedSchedule]);
  
  const toggleWeekVisibility = (weekNum) => {
    if (visibleWeeks.includes(weekNum)) {
      setVisibleWeeks(visibleWeeks.filter(w => w !== weekNum));
    } else {
      setVisibleWeeks([...visibleWeeks, weekNum]);
    }
  };
  
  if (!recommendedSchedule) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover-effect">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="h-5 w-5 text-primary-600 mr-2" />
            <span>{selectedCrop.name} Resource Schedule</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            AI-optimized resource allocation plan based on {optimizationAlgorithm === 'astar' ? 'A* Algorithm' : 
                                                        optimizationAlgorithm === 'genetic' ? 'Genetic Algorithm' : 
                                                        'Constraint Satisfaction'}
          </p>
        </div>
        <button className="flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition">
          <Download className="h-4 w-4 mr-1" />
          Export Schedule
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex border-b dark:border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'weekly'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'daily'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Daily View
          </button>
        </div>
      </div>
      
      {activeTab === 'weekly' ? (
        <div className="space-y-6">
          {recommendedSchedule.map((week) => {
            if (week.stage < growthStage) return null;
            
            const isVisible = visibleWeeks.includes(week.week);
            
            return (
              <div key={week.week} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                <div 
                  className={`p-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center cursor-pointer
                  ${week.stage === 1 ? 'border-l-4 border-green-500' :
                    week.stage === 2 ? 'border-l-4 border-secondary-500' :
                    'border-l-4 border-red-500'}`}
                  onClick={() => toggleWeekVisibility(week.week)}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3
                      ${week.stage === 1 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        week.stage === 2 ? 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}
                    >
                      {week.stage}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Week {week.week}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {week.stage === 1 ? 'Vegetative Stage' :
                         week.stage === 2 ? 'Reproductive Stage' :
                         'Ripening Stage'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="mr-4">
                      <p className="text-gray-500 dark:text-gray-400">Water</p>
                      <p className="font-medium text-gray-900 dark:text-white">{week.waterTotal} mm</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Fertilizer</p>
                      <p className="font-medium text-gray-900 dark:text-white">{week.fertilizerTotal} kg</p>
                    </div>
                    <svg className={`w-5 h-5 ml-4 text-gray-400 transform transition-transform ${isVisible ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {isVisible && (
                  <div className="p-4 bg-white dark:bg-gray-800">
                    <div className="grid grid-cols-7 gap-2">
                      {week.days.map((day, i) => (
                        <div 
                          key={i} 
                          className="border dark:border-gray-700 rounded-lg p-2 text-center bg-gray-50 dark:bg-gray-700"
                        >
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Day {day.day}</p>
                          {day.water > 0 && (
                            <div className="mb-2 text-sm flex items-center justify-center">
                              <Droplets className="h-3 w-3 text-blue-500 mr-1" />
                              <span className="font-medium text-blue-600 dark:text-blue-400">{day.water}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">mm</span>
                            </div>
                          )}
                          {day.fertilizer > 0 && (
                            <div className="text-sm flex items-center justify-center">
                              <Database className="h-3 w-3 text-purple-500 mr-1" />
                              <span className="font-medium text-purple-600 dark:text-purple-400">{day.fertilizer}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">kg</span>
                            </div>
                          )}
                          {day.water === 0 && day.fertilizer === 0 && (
                            <div className="h-12 flex items-center justify-center">
                              <p className="text-xs text-gray-400 dark:text-gray-500">No application</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="text-center">
                <div className="bg-primary-100 dark:bg-primary-900/30 rounded-lg p-2 mb-2">
                  <p className="text-xs font-medium text-primary-800 dark:text-primary-300">{day}</p>
                </div>
              </div>
            ))}
          </div>
          
          {recommendedSchedule
            .filter(week => week.stage >= growthStage)
            .slice(0, 4)
            .map((week) => (
              <div key={week.week} className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Week {week.week} - {week.stage === 1 ? 'Vegetative' : week.stage === 2 ? 'Reproductive' : 'Ripening'} Stage
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {week.days.map((day, i) => (
                    <div 
                      key={i} 
                      className={`border dark:border-gray-700 rounded-lg p-3 
                        ${day.water > 0 || day.fertilizer > 0 
                          ? 'bg-white dark:bg-gray-800'
                          : 'bg-gray-50 dark:bg-gray-700'}`}
                    >
                      <div className="flex flex-col h-full">
                        {day.water > 0 && (
                          <div className="flex items-center mb-2">
                            <Droplets className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-sm font-medium">{day.water} mm</span>
                          </div>
                        )}
                        {day.fertilizer > 0 && (
                          <div className="flex items-center">
                            <Database className="h-4 w-4 text-purple-500 mr-1" />
                            <span className="text-sm font-medium">{day.fertilizer} kg</span>
                          </div>
                        )}
                        {day.water === 0 && day.fertilizer === 0 && (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-xs text-gray-400 dark:text-gray-500">None</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ResourceSchedule;