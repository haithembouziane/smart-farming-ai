import { createContext, useContext, useState, useEffect } from 'react';
import { cropData, soilTypeData } from '../data/farmData';

const FarmContext = createContext();

export const useFarm = () => useContext(FarmContext);

export const FarmProvider = ({ children }) => {
  const [selectedCrop, setSelectedCrop] = useState(cropData[0]);
  const [soilType, setSoilType] = useState(soilTypeData[1]); // Default to Loamy
  const [growthStage, setGrowthStage] = useState(2); // Start at stage 2
  const [environmentalFactors, setEnvironmentalFactors] = useState({
    temperature: 25, // °C
    humidity: 65, // %
    rainfall: 20, // mm/week
    sunlight: 6, // hours/day
    windSpeed: 10 // km/h
  });
  const [resources, setResources] = useState({
    water: 5000, // Liters
    fertilizer: 500, // kg
  });
  
  const [additionalFactors, setAdditionalFactors] = useState({
    ph: 6.5, // Soil pH
    crop_area: 5.0, // hectares
    crop_density: 12, // plants/m²
    pesticides: 20, // liters
    soil_moisture: 45.0, // %
    soil_nutrients: { N: 25, P: 15, K: 30 }, // ppm
    crop_health: 0.6 // 0-1 scale
  });

  const [optimizationAlgorithm, setOptimizationAlgorithm] = useState('csp'); // Default to CSP
  const [farmHealth, setFarmHealth] = useState(75); // 0-100 scale
  const [recommendedSchedule, setRecommendedSchedule] = useState(null);
  const [yieldForecast, setYieldForecast] = useState(null);
  
  // Calculate farm health based on environmental factors and selected crop
  useEffect(() => {
    const calculateFarmHealth = () => {
      const optimalTemp = selectedCrop.optimalConditions.temperature;
      const optimalHumidity = selectedCrop.optimalConditions.humidity;
      const optimalRainfall = selectedCrop.optimalConditions.rainfall;
      const optimalSunlight = selectedCrop.optimalConditions.sunlight;
      
      // Calculate deviations from optimal conditions (as percentages)
      const tempDeviation = 100 - Math.min(100, Math.abs(environmentalFactors.temperature - optimalTemp) * 5);
      const humidityDeviation = 100 - Math.min(100, Math.abs(environmentalFactors.humidity - optimalHumidity) * 1.5);
      const rainfallDeviation = 100 - Math.min(100, Math.abs(environmentalFactors.rainfall - optimalRainfall) * 3);
      const sunlightDeviation = 100 - Math.min(100, Math.abs(environmentalFactors.sunlight - optimalSunlight) * 10);
      
      // Weighted average of deviations
      const healthScore = (
        tempDeviation * 0.3 +
        humidityDeviation * 0.2 +
        rainfallDeviation * 0.3 +
        sunlightDeviation * 0.2
      );
      
      // Adjustment for soil compatibility
      const soilCompatibility = selectedCrop.soilCompatibility[soilType.id - 1]; // 0-1 scale
      const finalHealthScore = healthScore * soilCompatibility;
      
      setFarmHealth(Math.round(finalHealthScore));
    };
    
    calculateFarmHealth();
  }, [selectedCrop, soilType, environmentalFactors]);
  
  // Generate recommended schedule when parameters change
  useEffect(() => {
    const generateSchedule = () => {
      // This simulates the AI algorithm outputs
      // In a real implementation, this would call the actual algorithms
      
      const weekCount = selectedCrop.growthDuration / 7;
      const schedule = [];
      
      // Generate per-week schedules
      for (let week = 0; week < weekCount; week++) {
        const currentStage = week < weekCount/3 ? 1 : (week < 2*weekCount/3 ? 2 : 3);
        if (currentStage < growthStage) continue; // Skip stages before selected stage
        
        const weeklyWaterNeeded = selectedCrop.waterRequirements[currentStage - 1];
        const weeklyFertilizerNeeded = selectedCrop.fertilizerRequirements[currentStage - 1];
        
        // Calculate actual amounts based on environmental factors
        const rainAdjustment = 1 - (environmentalFactors.rainfall / 100);
        const humidityAdjustment = 1 - (environmentalFactors.humidity / 200);
        
        const adjustedWeeklyWater = weeklyWaterNeeded * rainAdjustment * humidityAdjustment;
        const adjustedWeeklyFertilizer = weeklyFertilizerNeeded;
        
        const weekSchedule = {
          week: week + 1,
          stage: currentStage,
          waterTotal: adjustedWeeklyWater.toFixed(1),
          fertilizerTotal: adjustedWeeklyFertilizer.toFixed(1),
          days: []
        };
        
        // Generate daily applications
        for (let day = 0; day < 7; day++) {
          // Different distribution strategies based on the selected algorithm
          let waterAmount = 0;
          let fertilizerAmount = 0;
          
          if (optimizationAlgorithm === 'csp') {
            // CSP (more even distribution)
            if (day % 2 === 0 && adjustedWeeklyWater > 0) {
              waterAmount = (adjustedWeeklyWater / 3.5).toFixed(2);
            }
            if ((day === 1 || day === 3 || day === 5) && adjustedWeeklyFertilizer > 0) {
              fertilizerAmount = (adjustedWeeklyFertilizer / 3).toFixed(2);
            }
          } else if (optimizationAlgorithm === 'genetic') {
            // Genetic Algorithm (more varied distribution)
            if (Math.random() > 0.5 && adjustedWeeklyWater > 0) {
              waterAmount = (adjustedWeeklyWater * (0.1 + Math.random() * 0.3)).toFixed(2);
            }
            if (Math.random() > 0.7 && adjustedWeeklyFertilizer > 0) {
              fertilizerAmount = (adjustedWeeklyFertilizer * (0.2 + Math.random() * 0.4)).toFixed(2);
            }
          } else { // A* algorithm
            // A* (more predictive, concentrated on certain days)
            if ((day === 2 || day === 5) && adjustedWeeklyWater > 0) {
              waterAmount = (adjustedWeeklyWater / 2).toFixed(2);
            }
            if (day === 3 && adjustedWeeklyFertilizer > 0) {
              fertilizerAmount = adjustedWeeklyFertilizer.toFixed(2);
            }
          }
          
          weekSchedule.days.push({
            day: day + 1,
            water: parseFloat(waterAmount),
            fertilizer: parseFloat(fertilizerAmount)
          });
        }
        
        schedule.push(weekSchedule);
      }
      
      setRecommendedSchedule(schedule);
      
      // Calculate yield forecast
      const baseYield = selectedCrop.baseYield;
      const healthFactor = farmHealth / 100;
      const soilFactor = soilType.yieldMultiplier;
      
      const forecastedYield = baseYield * healthFactor * soilFactor;
      setYieldForecast(forecastedYield);
    };
    
    // Short delay to simulate processing
    const timer = setTimeout(() => {
      generateSchedule();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedCrop, soilType, growthStage, environmentalFactors, optimizationAlgorithm, farmHealth]);
  
  // Helper to get all farm parameters for algorithms
  const getFarmParameters = () => ({
    selectedCrop,
    soilType,
    growthStage,
    environmentalFactors,
    resources,
    additionalFactors,
    optimizationAlgorithm,
    farmHealth
  });

  const value = {
    selectedCrop,
    setSelectedCrop,
    soilType,
    setSoilType,
    growthStage,
    setGrowthStage,
    environmentalFactors,
    setEnvironmentalFactors,
    resources,
    setResources,
    additionalFactors,
    setAdditionalFactors,
    optimizationAlgorithm,
    setOptimizationAlgorithm,
    farmHealth,
    recommendedSchedule,
    yieldForecast,
    cropData,
    soilTypeData,
    getFarmParameters
  };
  
  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
};