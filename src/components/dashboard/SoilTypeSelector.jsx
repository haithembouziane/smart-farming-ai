import { useFarm } from '../../context/FarmContext';

const SoilTypeSelector = () => {
  const { soilType, setSoilType, soilTypeData } = useFarm();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover-effect mt-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Select Soil Type</h2>
      <div className="flex gap-4">
        {soilTypeData.map((type) => (
          <button
            key={type.id}
            onClick={() => setSoilType(type)}
            className={`flex flex-col items-center px-4 py-2 rounded-lg border transition-all focus:outline-none ${soilType.id === type.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700'}`}
          >
            <span className="text-2xl mb-1">{type.icon}</span>
            <span className="font-medium text-gray-900 dark:text-white">{type.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center">{type.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SoilTypeSelector;
