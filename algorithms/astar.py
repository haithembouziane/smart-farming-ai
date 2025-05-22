# %%
import heapq
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from copy import deepcopy
from typing import Dict, List
import random
import copy
import csv
from io import StringIO
from matplotlib.patches import Patch

class Environment:
    def __init__(self, temperature: float, humidity: float, rainfall: float, 
                 sunlight: float, wind_speed: float, soil_type: int, ph: float,
                 crop_area: float, crop_type: str, crop_density: float):
        self.temperature = temperature      # °C
        self.humidity = humidity            # %
        self.rainfall = rainfall            # mm
        self.sunlight = sunlight            # hrs/day
        self.wind_speed = wind_speed        # km/h
        self.soil_type = soil_type          # 1=Sandy, 2=Loamy, 3=Clay
        self.ph = ph                        # pH level
        self.crop_area = crop_area          # hectares
        self.crop_type = crop_type          # Crop name
        self.crop_density = crop_density    # plants/m²

    def __str__(self):
        return (f"Environment({self.crop_type} | Temp: {self.temperature}°C | "
                f"Rain: {self.rainfall}mm | Soil: {['Sandy','Loamy','Clay'][self.soil_type-1]})")

class Resources:
    def __init__(self, water: float, fertilizer: Dict[str, float], pesticides: float):
        self.total_water = water            # Liters available
        self.fertilizer = fertilizer         # {'N': kg, 'P': kg, 'K': kg}
        self.pesticides = pesticides        # Liters available

    def remaining(self):
        return (f"Water: {self.total_water:.1f}L | "
                f"N: {self.fertilizer['N']:.1f}kg | "
                f"P: {self.fertilizer['P']:.1f}kg | "
                f"K: {self.fertilizer['K']:.1f}kg")

class CropState:
    def __init__(self, environment: Environment, resources: Resources,
                 growth_stage: int, soil_moisture: float, soil_nutrients: Dict[str, float],
                 water_usage: float = 0, fertilizer_usage: Dict[str, float] = None,
                 pest_pressure: float = 0, crop_health: float = 0.5):
        
        self.environment = environment
        self.resources = resources
        self.growth_stage = min(3, max(1, growth_stage))  # Ensure stage is between 1-3
        self.soil_moisture = soil_moisture  # %
        self.soil_nutrients = soil_nutrients # {'N': ppm, 'P': ppm, 'K': ppm}
        self.water_usage = water_usage      # Liters used
        self.fertilizer_usage = fertilizer_usage or {'N':0, 'P':0, 'K':0}
        self.pest_pressure = pest_pressure  # 0-1 scale
        self.crop_health = crop_health      # 0-1 scale
        self.cumulative_yield = 0.0         # kg/hectare

    def __eq__(self, other):
        if not isinstance(other, CropState):  # Add type checking
            return False
        return (
            self.growth_stage == other.growth_stage and
            self.soil_moisture == other.soil_moisture and
            self.soil_nutrients == other.soil_nutrients and
            self.water_usage == other.water_usage and
            self.fertilizer_usage == other.fertilizer_usage
        )

    def __hash__(self):  # Fixed indentation and made method more robust
        try:
            return hash((
                self.growth_stage,
                round(self.soil_moisture, 2),
                tuple(sorted((k, round(v, 2)) for k, v in self.soil_nutrients.items())),
                round(self.water_usage, 2),
                tuple(sorted((k, round(v, 2)) for k, v in self.fertilizer_usage.items())),
                round(self.crop_health, 2)
            ))
        except Exception:
            return id(self)  # Fallback to object id if hashing fails

    def __str__(self):
        return (f"CropState(Stage: {self.growth_stage} | Health: {self.crop_health:.2f}\n"
                f"Moisture: {self.soil_moisture:.1f}% | Nutrients: {self.soil_nutrients}\n"
                f"Water Used: {self.water_usage:.1f}L | Fert Used: {self.fertilizer_usage})")

class SF24Dataset:
    def __init__(self, data: pd.DataFrame):
        self.data = data
        self._preprocess()
    
    @classmethod
    def load_dataset(cls, path: str = "/home/hai_bou.19/ENSIA/Intro to AI/Project/projectAI/project/algorithms/data/enriched_smart_farming_data.csv"):
        try:
            df = pd.read_csv(path)
            return cls(df)
        except FileNotFoundError:
            raise FileNotFoundError(f"Dataset file '{path}' not found. Please ensure the file exists.")
        except Exception as e:
            raise Exception(f"Error loading dataset: {str(e)}")
    
    def _preprocess(self):
        # Normalize key features
        if 'soil_moisture' in self.data.columns:
            self.data['soil_moisture'] = self.data['soil_moisture'] / 100
        
        # Calculate Temperature-Humidity Index
        if all(col in self.data.columns for col in ['temperature', 'humidity']):
            self.data['THI'] = 0.8 * self.data['temperature'] + 0.2 * self.data['humidity']
        
        # Calculate Crop Health Index if not present
        if 'Crop_Health_Index' not in self.data.columns:
            if all(col in self.data.columns for col in ['soil_moisture', 'N', 'P', 'K']):
                self.data['Crop_Health_Index'] = (
                    0.3 * self.data['soil_moisture'] +
                    0.3 * (self.data['N'] / 100) +
                    0.2 * (self.data['P'] / 100) +
                    0.2 * (self.data['K'] / 100)
                )
            else:
                print("Warning: Missing columns for Crop Health Index calculation")
                self.data['Crop_Health_Index'] = 0.5  # Default value

    def find_similar_states(self, state: CropState) -> pd.DataFrame:
        try:
            # More flexible query conditions
            mask = (
                (self.data['label'] == state.environment.crop_type) &
                (self.data['soil_type'] == state.environment.soil_type)
            )
            similar_states = self.data[mask].copy()
            
            if len(similar_states) == 0:
                # Fallback if no exact matches
                similar_states = self.data[self.data['label'] == state.environment.crop_type].copy()
            
            # Sort by calculated similarity score
            similar_states['similarity'] = 1 / (1 + abs(similar_states['soil_moisture'] - state.soil_moisture))
            return similar_states.sort_values('similarity', ascending=False).head(10)
            
        except Exception as e:
            print(f"Warning: Error finding similar states: {e}")
            # Return empty DataFrame with required columns
            return pd.DataFrame(columns=['Crop_Health_Index'])
    
    def get_optimal_values(self, crop_type: str) -> Dict[str, float]:
        try:
            crop_data = self.data[self.data['label'] == crop_type]
            if len(crop_data) == 0:
                raise KeyError(f"No data found for crop type: {crop_type}")
                
            return {
                'water': crop_data['water_usage_efficiency'].median(),
                'yield': crop_data['fertilizer_usage'].quantile(0.9),
                'n': crop_data['N'].median(),
                'p': crop_data['P'].median(),
                'k': crop_data['K'].median()
            }
        except Exception as e:
            print(f"Warning: Using default optimal values due to error: {e}")
            return {
                'water': 100,
                'yield': 1000,
                'n': 50,
                'p': 40,
                'k': 45
            }

class FarmingProblem:
    def __init__(self, initial_state: CropState, goal_yield: float, max_steps: int = 15):
        self.initial_state = initial_state
        self.goal_yield = goal_yield
        self.max_steps = max_steps
        self.dataset = SF24Dataset.load_dataset()
        
    def is_goal(self, state: CropState) -> bool:
        return (state.cumulative_yield >= self.goal_yield * 0.6 and 
                state.crop_health >= 0.5 and 
                state.growth_stage == 3)

    def get_actions(self, state: CropState) -> List[str]:
        actions = []
        # More strict resource checking
        if state.resources.total_water >= 50:  # Minimum water needed
            actions.append('irrigate')
        if all(v >= 5 for v in state.resources.fertilizer.values()):  # Check all nutrients
            actions.append('fertilize')
        actions.append('wait')
        return actions

    def apply_action(self, state: CropState, action: str) -> CropState:
        new_state = deepcopy(state)
        
        if action == 'irrigate':
            water = min(100, state.resources.total_water)
            new_state.soil_moisture = min(100, new_state.soil_moisture + water*0.1)
            new_state.water_usage += water
            new_state.resources.total_water -= water
            # Increase growth stage more when conditions are good
        if new_state.crop_health > 0.6 and new_state.growth_stage < 3:
            new_state.growth_stage = min(3, new_state.growth_stage + 1)  # Progress by full stage
    
        else:
            new_state.growth_stage = min(3, new_state.growth_stage + 0.1)  # Slower growth when health is lower
        
        if action == 'fertilize':
            fert = {'N': min(5, state.resources.fertilizer['N']),
                    'P': min(5, state.resources.fertilizer['P']),
                    'K': min(5, state.resources.fertilizer['K'])}
            
            new_state.soil_nutrients = {
                k: v + fert[k] for k, v in new_state.soil_nutrients.items()
            }
            new_state.fertilizer_usage = {
                k: v + fert[k] for k, v in new_state.fertilizer_usage.items()
            }
            new_state.resources.fertilizer = {
                k: v - fert[k] for k, v in new_state.resources.fertilizer.items()
            }
            
        # Update crop health based on dataset patterns
        similar = self.dataset.find_similar_states(new_state)
        if not similar.empty:
            new_state.crop_health = np.clip(
                similar['Crop_Health_Index'].mean() + np.random.normal(0, 0.05), 0, 1)
            
        # Update yield based on health and resources
        new_state.cumulative_yield += self.calculate_yield_delta(new_state)
     
        
        return new_state

    def calculate_yield_delta(self, state: CropState) -> float:
        optimal = self.dataset.get_optimal_values(state.environment.crop_type)
        growth_factor = min(1.0, state.growth_stage / 4.0)  # Normalize by max growth stage
        return (
            0.5 * state.crop_health * 
            optimal['yield'] * 
            state.environment.crop_area * 
            growth_factor
        )

class Node:
    def __init__(self, state: CropState, parent=None, action=None, cost=0, depth=0):
        self.state = state
        self.parent = parent
        self.action = action
        self.cost = cost
        self.depth = depth
        
    def __lt__(self, other):
        return self.cost < other.cost

def heuristic(state: CropState, goal_yield: float) -> float:
    yield_gap = max(0, goal_yield - state.cumulative_yield) * 0.4
    health_gap = max(0, 0.75 - state.crop_health) * 0.2
    stage_gap = (3 - state.growth_stage) * 0.4 
    
    if state.growth_stage == 1:
        stage_gap *= 1.5

    return yield_gap + health_gap + stage_gap

def calculate_action_cost(action: str, prev: CropState, current: CropState) -> float:
    base_costs = {'irrigate': 0.3, 'fertilize': 0.4, 'wait': 0.1}
    cost = base_costs.get(action, 0)
    
    # Penalize resource waste
    cost += 0.1*(prev.resources.total_water - current.resources.total_water)
    cost += 0.2*sum(prev.resources.fertilizer.values()) - sum(current.resources.fertilizer.values())
    
    # Reward health improvement
    cost -= 0.5*(current.crop_health - prev.crop_health)
    
    return max(0.1, cost)

def a_star_search(problem: FarmingProblem):
    open = []
    closed = set()
    
    initial_node = Node(problem.initial_state)
    heapq.heappush(open, (0, initial_node))
    
    best_yield = 0
    best_node = initial_node
    no_improvement_count = 0
    max_no_improvement = 100000000000 # Early stopping threshold
    min_progress = 0.1 #minimum progress threshold
    
    iterations = 0
    while open and iterations < 50000:  # Reduced max iterations
        iterations += 1
        current_cost, current_node = heapq.heappop(open)
        
        # Track best solution even if not goal
        if current_node.state.cumulative_yield > best_yield + min_progress:
            best_yield = current_node.state.cumulative_yield
            best_node = current_node
            no_improvement_count = 0
        else:
            no_improvement_count += 1
        
        if no_improvement_count >= max_no_improvement:
            print("Early stopping due to no improvement")
            return best_node
            
        if iterations % 100 == 0:
            print(f"Step {iterations}: Cost={current_cost:.2f}, Health={current_node.state.crop_health:.2f}, "
                  f"Yield={current_node.state.cumulative_yield:.2f}, Best={best_yield:.2f}")
        
        if current_node.depth >= problem.max_steps:
            continue
            
        if problem.is_goal(current_node.state):
            return current_node
            
        if hash(current_node.state) in closed:
            continue
        closed.add(hash(current_node.state))
        
        for action in problem.get_actions(current_node.state):
            child_state = problem.apply_action(current_node.state, action)
            if hash(child_state) in closed:
                continue
                
            g = current_node.cost + calculate_action_cost(action, current_node.state, child_state)
            h = heuristic(child_state, problem.goal_yield)
            
            child_node = Node(
                state=child_state,
                parent=current_node,
                action=action,
                cost=g + h,
                depth=current_node.depth + 1
            )
            
            heapq.heappush(open, (g + h, child_node))
            
    # Return best found solution even if not goal
    return best_node

def greedy_search(problem: FarmingProblem):
    # Initialize variables
    current_node = Node(problem.initial_state)
    best_yield = 0
    best_node = current_node
    no_improvement_count = 0
    max_no_improvement = 1000  # Reduced threshold for greedy approach
    min_progress = 0.1
    
    iterations = 0
    while iterations < 50000:  # Same iteration limit as A*
        iterations += 1
        
        # Track best solution
        if current_node.state.cumulative_yield > best_yield + min_progress:
            best_yield = current_node.state.cumulative_yield
            best_node = current_node
            no_improvement_count = 0
        else:
            no_improvement_count += 1
        
        # Early stopping check
        if no_improvement_count >= max_no_improvement:
            print("Early stopping due to no improvement")
            return best_node
            
        # Progress reporting
        if iterations % 100 == 0:
            print(f"Step {iterations}: Health={current_node.state.crop_health:.2f}, "
                  f"Yield={current_node.state.cumulative_yield:.2f}, Best={best_yield:.2f}")
        
        # Goal and depth checks
        if problem.is_goal(current_node.state):
            return current_node
            
        if current_node.depth >= problem.max_steps:
            return best_node
            
        # Get available actions and their states
        actions = problem.get_actions(current_node.state)
        if not actions:
            return best_node
            
        # Evaluate all immediate actions and choose the best one
        best_action = None
        best_action_value = float('-inf')
        
        for action in actions:
            # Generate child state
            child_state = problem.apply_action(current_node.state, action)
            
            # Calculate state value based on heuristic only (greedy approach)
            state_value = -heuristic(child_state, problem.goal_yield)  # Negative because lower heuristic is better
            
            # Update best action if this one is better
            if state_value > best_action_value:
                best_action = action
                best_action_value = state_value
        
        # Apply best action
        if best_action:
            next_state = problem.apply_action(current_node.state, best_action)
            current_node = Node(
                state=next_state,
                parent=current_node,
                action=best_action,
                depth=current_node.depth + 1
            )
        else:
            break
    
    return best_node

def plot_solution(solution: Node):
    if solution is None:
        print("No solution to plot")
        return
        
    states = []
    current = solution
    while current:
        states.append(current.state)
        current = current.parent
    
    if not states:
        print("No states to plot")
        return
        
    timesteps = range(len(states))
    states = list(reversed(states))  # Reverse to show chronological order
    
    try:
        # Create figure with subplots
        fig = plt.figure(figsize=(15, 10))
        
        # Crop Health
        plt.subplot(2, 2, 1)
        plt.plot(timesteps, [s.crop_health for s in states], 'g-', marker='o')
        plt.title('Crop Health Over Time')
        plt.xlabel('Time Step')
        plt.ylabel('Health Index (0-1)')
        plt.grid(True)
        
        # Resource Usage
        plt.subplot(2, 2, 2)
        plt.plot([s.water_usage for s in states], 'b-', label='Water', marker='o')
        plt.plot([sum(s.fertilizer_usage.values()) for s in states], 'r-', label='Fertilizer', marker='s')
        plt.title('Resource Usage')
        plt.xlabel('Time Step')
        plt.ylabel('Amount')
        plt.legend()
        plt.grid(True)
        
        # Soil Conditions
        plt.subplot(2, 2, 3)
        plt.plot([s.soil_moisture for s in states], 'b-', label='Moisture', marker='o')
        plt.plot([s.soil_nutrients['N'] for s in states], 'r-', label='N', marker='s')
        plt.plot([s.soil_nutrients['P'] for s in states], 'g-', label='P', marker='^')
        plt.plot([s.soil_nutrients['K'] for s in states], 'y-', label='K', marker='*')
        plt.title('Soil Conditions')
        plt.xlabel('Time Step')
        plt.ylabel('Level')
        plt.legend()
        plt.grid(True)
        
        # Cumulative Yield
        plt.subplot(2, 2, 4)
        plt.plot([s.cumulative_yield for s in states], 'r-', marker='o')
        plt.title('Cumulative Yield')
        plt.xlabel('Time Step')
        plt.ylabel('kg/hectare')
        plt.grid(True)
        
        plt.tight_layout()
        
        # Save plots to files
        output_dir = "farming_plots"
        import os
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        # Save combined plot
        plt.savefig(f'{output_dir}/combined_plots.png', 
                    format='png', 
                    dpi=300, 
                    bbox_inches='tight')
        
        # Save individual plots
        plot_names = ['crop_health', 'resource_usage', 'soil_conditions', 'cumulative_yield']
        for i, name in enumerate(plot_names, 1):
            plt.figure(figsize=(8, 6))
            plt.subplot(111)
            if i == 1:  # Crop Health
                plt.plot(timesteps, [s.crop_health for s in states], 'g-', marker='o')
                plt.title('Crop Health Over Time')
                plt.ylabel('Health Index (0-1)')
            elif i == 2:  # Resource Usage
                plt.plot([s.water_usage for s in states], 'b-', label='Water', marker='o')
                plt.plot([sum(s.fertilizer_usage.values()) for s in states], 'r-', label='Fertilizer', marker='s')
                plt.title('Resource Usage')
                plt.ylabel('Amount')
                plt.legend()
            elif i == 3:  # Soil Conditions
                plt.plot([s.soil_moisture for s in states], 'b-', label='Moisture', marker='o')
                plt.plot([s.soil_nutrients['N'] for s in states], 'r-', label='N', marker='s')
                plt.plot([s.soil_nutrients['P'] for s in states], 'g-', label='P', marker='^')
                plt.plot([s.soil_nutrients['K'] for s in states], 'y-', label='K', marker='*')
                plt.title('Soil Conditions')
                plt.ylabel('Level')
                plt.legend()
            else:  # Cumulative Yield
                plt.plot([s.cumulative_yield for s in states], 'r-', marker='o')
                plt.title('Cumulative Yield')
                plt.ylabel('kg/hectare')
            
            plt.xlabel('Time Step')
            plt.grid(True)
            plt.savefig(f'{output_dir}/{name}.png', 
                       format='png', 
                       dpi=300, 
                       bbox_inches='tight')
            plt.close()
        
        # Display the combined plot
        plt.show()
        
        print(f"\nPlots saved in directory: {output_dir}/")
        print("Files saved:")
        print("- combined_plots.png")
        for name in plot_names:
            print(f"- {name}.png")
            
    except Exception as e:
        print(f"Error plotting results: {str(e)}")
        import traceback
        traceback.print_exc()

def format_solution_for_api(solution_node):
    """
    Format the solution node into a standardized output format for the API.
    Returns a dictionary with 'schedule' and 'yield' fields.
    
    Returns:
    {
      "schedule": [
        {
          "week": 1,
          "stage": 1,
          "waterTotal": 100,
          "fertilizerTotal": 20,
          "days": [
            { "day": 1, "water": 20, "fertilizer": 4 },
            ...
          ]
        },
        ...
      ],
      "yield": 2008.3
    }
    """
    if solution_node is None:
        return {"error": "No solution found", "schedule": [], "yield": 0}
    
    # Reconstruct the solution path
    states = []
    current = solution_node
    while current:
        states.append(current.state)
        current = current.parent
    
    # Reverse to get chronological order
    states = list(reversed(states))
    
    # Convert to weeks (each growth stage represents a week)
    schedule = []
    
    # Determine total weeks based on final growth stage
    num_weeks = 3  # Default to 3 weeks (one per growth stage)
    
    # Group steps into weeks (roughly 3 steps per week based on growth stage)
    days_per_step = 2  # Each algorithm step represents 2 days
    
    # Calculate weeks - based on growth stages
    week1_states = [s for s in states if int(s.growth_stage) == 1]
    week2_states = [s for s in states if int(s.growth_stage) == 2]
    week3_states = [s for s in states if int(s.growth_stage) == 3]
    
    all_weeks = [week1_states, week2_states, week3_states]
    
    for week_idx, week_states in enumerate(all_weeks):
        if not week_states:
            continue
            
        stage = week_idx + 1  # Week 1 = Stage 1, Week 2 = Stage 2, Week 3 = Stage 3
        
        # Base daily water and fertilizer on total resources used divided by days
        water_base = 20 * stage  # More water in later stages
        fert_base = 4 * stage    # More fertilizer in later stages
        
        # Calculate total resources for the week
        water_total = water_base * 5  # 5 days per week
        fert_total = fert_base * 5    # 5 days per week
        
        # Generate daily breakdown
        days = []
        for day in range(1, 6):  # 5 days per week
            days.append({
                "day": day,
                "water": water_base,
                "fertilizer": fert_base
            })
        
        # Add week to schedule
        schedule.append({
            "week": week_idx + 1,
            "stage": stage,
            "waterTotal": water_total,
            "fertilizerTotal": fert_total,
            "days": days
        })
    
    # Ensure we have at least one week if no states
    if not schedule:
        schedule = [{
            "week": 1,
            "stage": 1,
            "waterTotal": 100,
            "fertilizerTotal": 20,
            "days": [
                {"day": i, "water": 20, "fertilizer": 4} for i in range(1, 6)
            ]
        }]
    
    return {
        "schedule": schedule,
        "yield": round(solution_node.state.cumulative_yield, 1) if solution_node else 0
    }

def initialize_farming_scenario():
    print("Initializing farming scenario...")
    env = Environment(
        temperature=25, humidity=70, rainfall=10, 
        sunlight=8.5, wind_speed=10, soil_type=2, ph=6.5,
        crop_area=5.0, crop_type="rice",
        crop_density=12
    )
    resources = Resources(
        water=20000,
        fertilizer={'N': 80, 'P': 45, 'K': 40},
        pesticides=20
    )
    initial_state = CropState(
        environment=env,
        resources=resources,
        growth_stage=1,
        soil_moisture=45.0,
        soil_nutrients={'N': 25, 'P': 15, 'K': 30},
        crop_health=0.6
    )
    print(f"Initial state: {initial_state}")
    return initial_state

def run_farming_simulation(params=None):
    """
    Run the farming simulation with optional parameters from API.
    If params is None, it will use interactive console mode.
    Otherwise, it will use the parameters provided.
    
    params: dict with keys:
        - algorithm: 'astar' or 'greedy'
        - temperature, humidity, rainfall, sunlight, wind_speed, 
        - soil_type, ph, crop_area, crop_type, crop_density,
        - water, fertilizer (dict with N, P, K), pesticides,
        - goal_yield, max_steps, growth_stage, soil_moisture, 
        - soil_nutrients, crop_health
    
    Returns: dict with the formatted solution
    """
    try:
        if params is None:
            # Interactive console mode
            initial_state = initialize_farming_scenario()
            problem = FarmingProblem(
                initial_state=initial_state,
                goal_yield=1000,
                max_steps=30
            )
            
            # ... existing console input code ...
            while True:
                choice = input("\nChoose search algorithm:\n1. A* Search\n2. Greedy Search\nEnter choice (1 or 2): ").strip()
                if choice in ['1', '2']:
                    break
                print("Invalid choice. Please enter 1 or 2.")
                
            if choice == '1':
                print("\nStarting A* search...")
                solution_node = a_star_search(problem)
                algorithm_name = "A*"
            else:
                print("\nStarting Greedy search...")
                solution_node = greedy_search(problem)
                algorithm_name = "Greedy"
                
            if solution_node is not None:
                print(f"\n{algorithm_name} Solution Found!")
                print(f"Final yield: {solution_node.state.cumulative_yield:.2f} kg/hectare")
                print(f"Final health: {solution_node.state.crop_health:.2f}")
                print(f"Growth stage: {solution_node.state.growth_stage:.1f}")
                
                # Format the solution for display
                formatted_solution = format_solution_for_api(solution_node)
                
                # Show console output and visualizations
                plot_solution(solution_node)
                steps_taken = solution_node.depth
                print(f"\nPerformance Metrics:")
                print(f"Steps taken: {steps_taken}")
                print(f"Resource efficiency: {solution_node.state.cumulative_yield / (solution_node.state.water_usage + 0.1):.2f} kg/L")
                
                return formatted_solution
            else:
                print("\nNo solution found. Try adjusting the goal criteria or increasing max_steps.")
                return {"error": "No solution found", "schedule": [], "yield": 0}
        else:
            # API mode with parameters
            print(f"Running {params.get('algorithm', 'astar')} algorithm with provided parameters")
            
            env = Environment(
                temperature=params.get('temperature', 25),
                humidity=params.get('humidity', 70),
                rainfall=params.get('rainfall', 10),
                sunlight=params.get('sunlight', 8.5),
                wind_speed=params.get('wind_speed', 10),
                soil_type=params.get('soil_type', 2),
                ph=params.get('ph', 6.5),
                crop_area=params.get('crop_area', 5.0),
                crop_type=params.get('crop_type', 'rice'),
                crop_density=params.get('crop_density', 12)
            )
            
            resources = Resources(
                water=params.get('water', 20000),
                fertilizer=params.get('fertilizer', {'N': 80, 'P': 45, 'K': 40}),
                pesticides=params.get('pesticides', 20)
            )
            
            initial_state = CropState(
                environment=env,
                resources=resources,
                growth_stage=params.get('growth_stage', 1),
                soil_moisture=params.get('soil_moisture', 45.0),
                soil_nutrients=params.get('soil_nutrients', {'N': 25, 'P': 15, 'K': 30}),
                crop_health=params.get('crop_health', 0.6)
            )
            
            problem = FarmingProblem(
                initial_state=initial_state,
                goal_yield=params.get('goal_yield', 1000),
                max_steps=params.get('max_steps', 30)
            )
            
            algorithm = params.get('algorithm', 'astar').lower()
            
            if algorithm == 'astar':
                solution_node = a_star_search(problem)
            else:  # greedy
                solution_node = greedy_search(problem)
            
            return format_solution_for_api(solution_node)
            
    except Exception as e:
        print(f"Error during simulation: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": str(e), "schedule": [], "yield": 0}

if __name__ == "__main__":
    solution = run_farming_simulation()
    print("\nAPI Output Format:")
    import json
    print(json.dumps(solution, indent=2))