import { useState } from 'react';
import { useFarm } from '../../context/FarmContext';

const CropSelector = () => {
  const { cropData, selectedCrop, setSelectedCrop } = useFarm();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover-effect">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Crop</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Choose the crop you're farming</p>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 flex justify-between items-center text-left"
        >
          <div className="flex items-center">
            <span className="text-2xl mr-3">{selectedCrop.icon}</span>
            <span className="text-gray-900 dark:text-white font-medium">{selectedCrop.name}</span>
          </div>
          <svg className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            <div className="p-2">
              {cropData.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => {
                    setSelectedCrop(crop);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    selectedCrop.id === crop.id ? 'bg-primary-50 dark:bg-gray-600' : ''
                  }`}
                >
                  <span className="text-2xl mr-3">{crop.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{crop.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{crop.growthDuration} days cycle</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">Crop Details:</p>
        <p>{selectedCrop.description}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Growth Duration</p>
            <p className="font-medium">{selectedCrop.growthDuration} days</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Base Yield</p>
            <p className="font-medium">{selectedCrop.baseYield} kg/ha</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropSelector;