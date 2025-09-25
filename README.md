# 🌱 Smart Farming AI Optimization System

An intelligent farming resource optimization system that uses multiple AI algorithms to optimize water and fertilizer allocation throughout crop growth cycles.

![Smart Farming Dashboard](https://img.shields.io/badge/React-18.3.1-blue?logo=react) ![FastAPI](https://img.shields.io/badge/FastAPI-0.109.2-green?logo=fastapi) ![Python](https://img.shields.io/badge/Python-3.8+-yellow?logo=python)

## 🎯 Features

- **Multiple AI Algorithms**: A* Search, Greedy Search, Genetic Algorithm, and Constraint Satisfaction Problem (CSP)
- **Real-time Optimization**: Optimize water and fertilizer allocation based on environmental conditions
- **Interactive Dashboard**: Modern React-based UI with real-time parameter adjustment
- **Multi-stage Growth**: Account for different crop growth stages (Vegetative, Reproductive, Ripening)
- **Environmental Factors**: Consider temperature, humidity, rainfall, soil type, and more
- **Yield Prediction**: Forecast crop yields based on optimization strategies
- **Resource Scheduling**: Generate detailed weekly resource allocation plans
- **Visualization**: Charts and graphs for resource usage and crop health monitoring

## 🚀 Algorithms Implemented

| Algorithm | Description | Best For |
|-----------|-------------|----------|
| **A* Search** | Path-finding algorithm for optimal resource allocation | Predictable environments with clear optimization goals |
| **Greedy Search** | Fast heuristic-based search for quick solutions | Simple, fast optimization scenarios |
| **Genetic Algorithm** | Evolutionary approach mimicking natural selection | Highly variable conditions with multiple objectives |
| **CSP (Constraint Satisfaction)** | Finds solutions satisfying resource constraints | Limited resource scenarios with many restrictions |

## 🏗️ Project Structure

```
smart-farming-ai/
├── algorithms/           # AI algorithm implementations
│   ├── astar.py         # A* and Greedy search algorithms
│   ├── genetic.py       # Genetic algorithm implementation
│   ├── csp.py          # Constraint satisfaction problem
│   └── data/           # Dataset files
├── backend/             # FastAPI backend server
│   └── main.py         # API endpoints and server logic
├── src/                # React frontend source code
│   ├── components/     # React components
│   ├── context/        # React context providers
│   └── data/          # Frontend data models
├── scripts/            # Utility scripts
│   ├── deploy.sh      # Deployment script
│   └── test_algorithms.py # Algorithm testing
└── public/            # Static assets
```

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **npm** or **yarn**

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-farming-ai.git
cd smart-farming-ai
```

### 2. Frontend Setup

```bash
# Install frontend dependencies
npm install
```

### 3. Backend Setup

```bash
# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server:**
```bash
cd backend
python main.py
```
The API will be available at `http://localhost:8000`

2. **Start the Frontend Development Server:**
```bash
# In a new terminal
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Deployment

Use the automated deployment script:

```bash
bash scripts/deploy.sh
```

This script will:
- Build the React frontend
- Create/activate Python virtual environment
- Install dependencies
- Start the FastAPI backend server

## 🎮 Usage

1. **Select Crop Type**: Choose from Rice, Maize, Wheat, Tomato, Cotton, or Potato
2. **Configure Environment**: Set temperature, humidity, rainfall, sunlight, and wind speed
3. **Adjust Soil Parameters**: Configure soil type, pH, moisture, and nutrient levels
4. **Set Resources**: Define available water and fertilizer amounts
5. **Choose Algorithm**: Select optimization algorithm (A*, Greedy, GA, or CSP)
6. **Run Optimization**: Generate optimal resource allocation schedule
7. **View Results**: Analyze charts, schedules, and yield predictions

## 📊 Supported Crops

| Crop | Growth Duration | Optimal Temperature | Soil Preference |
|------|-----------------|-------------------|-----------------|
| Rice | 120 days | 25°C | Loamy soil |
| Maize | 100 days | 24°C | Loamy/Sandy soil |
| Wheat | 120 days | 21°C | Loamy soil |
| Tomato | 90 days | 24°C | Loamy soil |
| Cotton | 160 days | 27°C | Loamy/Sandy soil |
| Potato | 100 days | 20°C | Loamy soil |

## 🔬 API Endpoints

### POST `/api/optimize`
Optimize resource allocation using specified algorithm

**Request Body:**
```json
{
  "algorithm": "astar",
  "crop_type": "rice",
  "soil_type": 2,
  "temperature": 25.0,
  "humidity": 70.0,
  "water": 20000.0,
  "fertilizer": {"N": 80.0, "P": 45.0, "K": 40.0},
  "goal_yield": 1000.0
}
```

**Response:**
```json
{
  "schedule": [
    {
      "week": 1,
      "stage": 1,
      "waterTotal": 100,
      "fertilizerTotal": 20,
      "days": [
        {"day": 1, "water": 20, "fertilizer": 4}
      ]
    }
  ],
  "yield": 2008.3
}
```

### GET `/api/health`
Health check endpoint

## 🧪 Testing

Test all algorithms with sample data:

```bash
python scripts/test_algorithms.py
```

This will test each algorithm both directly and via API endpoints.

## 🛠️ Technologies Used

### Frontend
- React 18.3.1
- Tailwind CSS
- Chart.js & React-ChartJS-2
- Lucide React (icons)
- Framer Motion (animations)

### Backend
- FastAPI 0.109.2
- Uvicorn (ASGI server)
- Pandas & NumPy (data processing)
- Matplotlib (visualization)
- Scikit-learn (machine learning utilities)

### Development Tools
- Vite (build tool)
- ESLint (code linting)
- Python virtual environments

## 📈 Performance

- **A* Algorithm**: Optimal solutions, moderate computation time
- **Greedy Algorithm**: Fast execution, near-optimal solutions
- **Genetic Algorithm**: Handles complex scenarios, longer computation time
- **CSP**: Excellent for resource-constrained scenarios

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Dataset based on agricultural research data
- UI components inspired by modern farming management systems
- Algorithm implementations based on academic research in agricultural optimization

## 📞 Contact

**Your Name** - your.email@example.com

Project Link: [https://github.com/yourusername/smart-farming-ai](https://github.com/yourusername/smart-farming-ai)

---

⭐ **Star this repository if you found it helpful!**