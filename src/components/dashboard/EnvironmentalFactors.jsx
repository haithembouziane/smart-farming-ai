import { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { Droplets, Wind, Thermometer, Sun, CloudRain } from 'lucide-react';

const EnvironmentalFactors = () => {
  const { environmentalFactors, setEnvironmentalFactors, soilType, setSoilType, soilTypeData } = useFarm();
  
  const handleChange = (factor, value) => {
    if (factor === 'soil_nutrients_N' || factor === 'soil_nutrients_P' || factor === 'soil_nutrients_K') {
      const nutrientKey = factor.split('_')[2]; // 'N', 'P', or 'K'
      setEnvironmentalFactors(prev => ({
        ...prev,
        soil_nutrients: {
          ...prev.soil_nutrients,
          [nutrientKey]: parseFloat(value)
        }
      }));
    } else {
      setEnvironmentalFactors(prev => ({
        ...prev,
        [factor]: parseFloat(value)
      }));
    }
  };
  
  const environmentalControls = [
    {
      name: 'Temperature',
      key: 'temperature',
      value: environmentalFactors.temperature,
      min: 5,
      max: 40,
      step: 1,
      unit: '°C',
      icon: Thermometer,
      color: 'text-red-500 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      name: 'Humidity',
      key: 'humidity',
      value: environmentalFactors.humidity,
      min: 20,
      max: 100,
      step: 1,
      unit: '%',
      icon: Droplets,
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      name: 'Rainfall',
      key: 'rainfall',
      value: environmentalFactors.rainfall,
      min: 0,
      max: 100,
      step: 1,
      unit: 'mm',
      icon: CloudRain,
      color: 'text-cyan-500 dark:text-cyan-400',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/20'
    },
    {
      name: 'Sunlight',
      key: 'sunlight',
      value: environmentalFactors.sunlight,
      min: 0,
      max: 14,
      step: 0.5,
      unit: 'hrs',
      icon: Sun,
      color: 'text-yellow-500 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      name: 'Wind Speed',
      key: 'windSpeed',
      value: environmentalFactors.windSpeed,
      min: 0,
      max: 50,
      step: 1,
      unit: 'km/h',
      icon: Wind,
      color: 'text-gray-500 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-700'
    },
    {
      name: 'Soil pH',
      key: 'ph',
      value: environmentalFactors.ph ?? 6.5,
      min: 4,
      max: 9,
      step: 0.1,
      unit: '',
      icon: Thermometer,
      color: 'text-green-700 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      name: 'Crop Area',
      key: 'crop_area',
      value: environmentalFactors.crop_area ?? 5.0,
      min: 0.1,
      max: 100,
      step: 0.1,
      unit: 'ha',
      icon: Sun,
      color: 'text-orange-500 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      name: 'Crop Density',
      key: 'crop_density',
      value: environmentalFactors.crop_density ?? 12,
      min: 1,
      max: 100,
      step: 1,
      unit: 'plants/m²',
      icon: Sun,
      color: 'text-yellow-700 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      name: 'Pesticides',
      key: 'pesticides',
      value: environmentalFactors.pesticides ?? 20,
      min: 0,
      max: 100,
      step: 1,
      unit: 'L',
      icon: Droplets,
      color: 'text-blue-700 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      name: 'Soil Moisture',
      key: 'soil_moisture',
      value: environmentalFactors.soil_moisture ?? 45.0,
      min: 0,
      max: 100,
      step: 1,
      unit: '%',
      icon: Droplets,
      color: 'text-cyan-700 dark:text-cyan-400',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/20'
    },
    {
      name: 'Soil Nitrogen (N)',
      key: 'soil_nutrients_N',
      value: environmentalFactors.soil_nutrients?.N ?? 25,
      min: 0,
      max: 100,
      step: 1,
      unit: 'ppm',
      icon: Sun,
      color: 'text-lime-700 dark:text-lime-400',
      bgColor: 'bg-lime-100 dark:bg-lime-900/20'
    },
    {
      name: 'Soil Phosphorus (P)',
      key: 'soil_nutrients_P',
      value: environmentalFactors.soil_nutrients?.P ?? 15,
      min: 0,
      max: 100,
      step: 1,
      unit: 'ppm',
      icon: Sun,
      color: 'text-pink-700 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20'
    },
    {
      name: 'Soil Potassium (K)',
      key: 'soil_nutrients_K',
      value: environmentalFactors.soil_nutrients?.K ?? 30,
      min: 0,
      max: 100,
      step: 1,
      unit: 'ppm',
      icon: Sun,
      color: 'text-yellow-700 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      name: 'Crop Health',
      key: 'crop_health',
      value: environmentalFactors.crop_health ?? 0.6,
      min: 0,
      max: 1,
      step: 0.01,
      unit: '',
      icon: Thermometer,
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    }
  ];

  const climateControls = [
    ...environmentalControls.filter(c => [
      'temperature', 'humidity', 'rainfall', 'sunlight', 'windSpeed'
    ].includes(c.key))
  ];

  const soilControls = [
    ...environmentalControls.filter(c => [
      'ph', 'soil_moisture', 'soil_nutrients_N', 'soil_nutrients_P', 'soil_nutrients_K'
    ].includes(c.key))
  ];

  const cropControls = [
    ...environmentalControls.filter(c => [
      'crop_area', 'crop_density', 'pesticides', 'crop_health'
    ].includes(c.key))
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover-effect">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Environmental Factors</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Adjust conditions to match your farm</p>
        </div>
        <button 
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition"
          onClick={() => {
            setEnvironmentalFactors({
              temperature: 25,
              humidity: 65,
              rainfall: 20,
              sunlight: 6,
              windSpeed: 10
            });
          }}
        >
          Reset to Default
        </button>
      </div>

      {/* Climate Section */}
      <div className="mb-8">
        <h3 className="text-md font-semibold text-primary-700 dark:text-primary-400 mb-2">Climate</h3>
        <div className="space-y-6">
          {climateControls.map((control) => (
            <div key={control.key} className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className={`${control.bgColor} p-2 rounded-full mr-3`}>
                    <control.icon className={`h-4 w-4 ${control.color}`} />
                  </div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {control.name}
                  </label>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {control.value}{control.unit}
                </div>
              </div>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={control.value}
                onChange={(e) => handleChange(control.key, e.target.value)}
                className="w-full accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                <span>{control.min}{control.unit}</span>
                <span>{control.max}{control.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Soil Section */}
      <div className="mb-8">
        <h3 className="text-md font-semibold text-green-700 dark:text-green-400 mb-2">Soil</h3>
        <div className="space-y-6">
          {soilControls.map((control) => (
            <div key={control.key} className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className={`${control.bgColor} p-2 rounded-full mr-3`}>
                    <control.icon className={`h-4 w-4 ${control.color}`} />
                  </div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {control.name}
                  </label>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {control.value}{control.unit}
                </div>
              </div>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={control.value}
                onChange={(e) => handleChange(control.key, e.target.value)}
                className="w-full accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                <span>{control.min}{control.unit}</span>
                <span>{control.max}{control.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crop & Resource Section */}
      <div className="mb-8">
        <h3 className="text-md font-semibold text-orange-700 dark:text-orange-400 mb-2">Crop & Resources</h3>
        <div className="space-y-6">
          {cropControls.map((control) => (
            <div key={control.key} className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className={`${control.bgColor} p-2 rounded-full mr-3`}>
                    <control.icon className={`h-4 w-4 ${control.color}`} />
                  </div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {control.name}
                  </label>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {control.value}{control.unit}
                </div>
              </div>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={control.value}
                onChange={(e) => handleChange(control.key, e.target.value)}
                className="w-full accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                <span>{control.min}{control.unit}</span>
                <span>{control.max}{control.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Soil Type Selector */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full mr-3">
              <span className="h-4 w-4 block bg-green-500 rounded-full" />
            </div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Soil Type
            </label>
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {soilType.name}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          {soilTypeData.map((type) => (
            <button
              key={type.id}
              onClick={() => setSoilType(type)}
              className={`px-3 py-1 rounded-full border text-xs font-semibold transition
                ${soilType.id === type.id ? 'bg-green-500 text-white border-green-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalFactors;