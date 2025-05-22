// Crop data with realistic parameters
export const cropData = [
  {
    id: 1,
    name: "Rice",
    icon: "🌾",
    growthDuration: 120, // in days
    baseYield: 4500, // kg per hectare
    waterRequirements: [30, 45, 35], // water needs per growth stage (mm/week)
    fertilizerRequirements: [12, 22, 15], // fertilizer needs per growth stage (kg/week)
    optimalConditions: {
      temperature: 25, // °C
      humidity: 80, // %
      rainfall: 25, // mm/week
      sunlight: 6, // hours/day
    },
    // Compatibility with soil types (0-1 scale)
    soilCompatibility: [0.7, 0.9, 0.6], // [Sandy, Loamy, Clay]
    description: "A staple grain that thrives in wet conditions, particularly suited to loamy soil and warm temperatures."
  },
  {
    id: 2,
    name: "Maize",
    icon: "🌽",
    growthDuration: 100,
    baseYield: 6000,
    waterRequirements: [25, 40, 20],
    fertilizerRequirements: [18, 25, 10],
    optimalConditions: {
      temperature: 24,
      humidity: 65,
      rainfall: 20,
      sunlight: 8,
    },
    soilCompatibility: [0.8, 0.9, 0.7],
    description: "A versatile crop that adapts well to various soil types, requiring moderate water and good sunlight."
  },
  {
    id: 3,
    name: "Wheat",
    icon: "🌾",
    growthDuration: 120,
    baseYield: 3500,
    waterRequirements: [20, 35, 15],
    fertilizerRequirements: [15, 18, 8],
    optimalConditions: {
      temperature: 21,
      humidity: 60,
      rainfall: 15,
      sunlight: 7,
    },
    soilCompatibility: [0.7, 0.9, 0.8],
    description: "A hardy grain crop that can withstand cooler temperatures and prefers well-drained loamy soils."
  },
  {
    id: 4,
    name: "Tomato",
    icon: "🍅",
    growthDuration: 90,
    baseYield: 35000,
    waterRequirements: [15, 30, 25],
    fertilizerRequirements: [20, 25, 15],
    optimalConditions: {
      temperature: 24,
      humidity: 70,
      rainfall: 15,
      sunlight: 8,
    },
    soilCompatibility: [0.6, 0.9, 0.7],
    description: "A popular vegetable crop that thrives in warm weather and requires regular watering and nutrient-rich soil."
  },
  {
    id: 5,
    name: "Cotton",
    icon: "🌿",
    growthDuration: 160,
    baseYield: 2500,
    waterRequirements: [20, 35, 25],
    fertilizerRequirements: [15, 22, 12],
    optimalConditions: {
      temperature: 27,
      humidity: 60,
      rainfall: 15,
      sunlight: 9,
    },
    soilCompatibility: [0.8, 0.9, 0.7],
    description: "A fiber crop that performs well in warm climates with moderate water and well-drained soils."
  },
  {
    id: 6,
    name: "Potato",
    icon: "🥔",
    growthDuration: 100,
    baseYield: 25000,
    waterRequirements: [25, 35, 20],
    fertilizerRequirements: [15, 20, 10],
    optimalConditions: {
      temperature: 20,
      humidity: 75,
      rainfall: 18,
      sunlight: 6,
    },
    soilCompatibility: [0.7, 0.9, 0.6],
    description: "A root vegetable that prefers cool temperatures and does best in loose, well-drained soil rich in organic matter."
  }
];

// Soil type data
export const soilTypeData = [
  {
    id: 1,
    name: "Sandy",
    icon: "🏜️",
    description: "Sandy soil has large particles with good drainage but poor nutrient retention.",
    waterRetention: 0.4, // Relative scale (0-1)
    nutrientRetention: 0.3,
    yieldMultiplier: 0.7
  },
  {
    id: 2,
    name: "Loamy",
    icon: "🌱",
    description: "Loamy soil is ideal with balanced properties, good drainage and nutrient retention.",
    waterRetention: 0.8,
    nutrientRetention: 0.8,
    yieldMultiplier: 1.0
  },
  {
    id: 3,
    name: "Clay",
    icon: "🧱",
    description: "Clay soil has small particles with excellent nutrient retention but poor drainage.",
    waterRetention: 0.9,
    nutrientRetention: 0.9,
    yieldMultiplier: 0.8
  }
];

// Growth stages
export const growthStages = [
  {
    id: 1,
    name: "Vegetative",
    description: "Initial growth stage focused on leaf and stem development"
  },
  {
    id: 2,
    name: "Reproductive",
    description: "Middle stage with flowering and early fruit/grain formation"
  },
  {
    id: 3,
    name: "Ripening",
    description: "Final stage with fruit/grain maturation before harvest"
  }
];

// Mock algorithms data
export const algorithmData = [
  {
    id: "astar",
    name: "A* Algorithm",
    description: "A* search algorithm for path-finding the optimal resource allocation",
    strengths: "Efficient for sequential decision making, predictive optimization",
    bestFor: "Predictable environments with clear optimization goals"
  },
  {
    id: "genetic",
    name: "Genetic Algorithm",
    description: "Evolutionary approach that mimics natural selection to find optimal solutions",
    strengths: "Good for complex problems with multiple variables, adaptive over time",
    bestFor: "Highly variable conditions and multiple competing objectives"
  },
  {
    id: "csp",
    name: "Constraint Satisfaction",
    description: "Finds solutions that satisfy a set of constraints between variables",
    strengths: "Excellent for resource planning with specific restrictions",
    bestFor: "Limited resource scenarios with many constraints to balance"
  },
  {
  id: 'greedy',
  name: 'Greedy Search',
  description: 'A fast, heuristic-based search for quick solutions.',
  bestFor: 'Simple, fast optimization'
}
];