import { useFarm } from '../context/FarmContext';

const SoilTypeSelector = () => {
  const { soilType, setSoilType, soilTypeData } = useFarm();

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-1" htmlFor="soil-type-select">
        Soil Type
      </label>
      <select
        id="soil-type-select"
        className="w-full rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700 p-2"
        value={soilType.id}
        onChange={e => {
          const selected = soilTypeData.find(s => s.id === Number(e.target.value));
          setSoilType(selected);
        }}
      >
        {soilTypeData.map(type => (
          <option key={type.id} value={type.id}>{type.name}</option>
        ))}
      </select>
    </div>
  );
};

export default SoilTypeSelector;
