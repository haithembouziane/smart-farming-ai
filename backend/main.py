import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Union, Any, Optional
import sys

# Add algorithms directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'algorithms'))

# Import algorithm modules
try:
    from astar import run_farming_simulation
    from genetic import run_genetic_algorithm
    from csp import run_csp_algorithm
except ImportError as e:
    print(f"Warning: Algorithm import error: {e}")

# FastAPI app
app = FastAPI(title="Smart Farming Optimization API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input model
class OptimizationRequest(BaseModel):
    algorithm: str
    crop_type: str
    soil_type: int
    temperature: float
    humidity: float
    rainfall: float
    sunlight: float
    wind_speed: float
    ph: float
    crop_area: float
    crop_density: float
    water: float
    fertilizer: Dict[str, float]
    pesticides: float
    goal_yield: float
    max_steps: int
    growth_stage: int
    soil_moisture: float
    soil_nutrients: Dict[str, float]
    crop_health: float

# Output model
class ScheduleDay(BaseModel):
    day: int
    water: float
    fertilizer: float

class ScheduleWeek(BaseModel):
    week: int
    stage: int
    waterTotal: float
    fertilizerTotal: float
    days: List[ScheduleDay]

class OptimizationResponse(BaseModel):
    schedule: List[ScheduleWeek]
    yield_: float = None

    class Config:
        fields = {'yield_': 'yield'}

@app.post("/api/optimize")
async def optimize(request: OptimizationRequest):
    """Run the optimization algorithm with the given parameters"""
    try:
        # Convert pydantic model to dict
        params = request.dict()
        
        # Determine which algorithm to use
        algorithm = params.get("algorithm", "astar").lower()
        
        # Call the appropriate algorithm
        if algorithm in ["astar", "greedy"]:
            result = run_farming_simulation(params)
        elif algorithm == "genetic":
            result = run_genetic_algorithm(params)
        elif algorithm == "csp":
            result = run_csp_algorithm(params)
        else:
            raise HTTPException(status_code=400, detail=f"Unknown algorithm: {algorithm}")
        
        # Check if result contains an error
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return result
    
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)