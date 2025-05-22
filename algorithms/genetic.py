import random
import copy
import csv
from io import StringIO
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Patch

class SmartFarming:

    # Store the fertilizer data in memory to avoid repeated file reads 
    _fertilizer_data = None
    _crop_lifespans = None
    _optimal_values = None
   

   # loading the random ranges from the data set 
    @staticmethod
    def _load_fertilizer_data(path='/home/hai_bou.19/ENSIA/Intro to AI/Project/projectAI/project/algorithms/data/max_fertilizer_usage_flat.csv'):
        try:
            df = pd.read_csv(path)
            data = {}
            crop_lifespans = {}
            optimal_values = {1: {}, 2: {}, 3: {}}

            for _, row in df.iterrows():
                crop = row['label'].strip().lower()
                soil = int(row['soil_type'])
                stage = int(row['growth_stage'])
                
                # Store crop lifespan (only once per crop)
                if crop not in crop_lifespans:
                    crop_lifespans[crop] = int(row['crop_lifespans'])
                
                # Store optimal values (only once per crop and stage)
                if crop not in optimal_values[stage]:
                    optimal_values[stage][crop] = {
                        'fertilizer': float(row['optimal_fertilizer_usage(Per GS)']),
                        'irrigation_frequency': int(row['optimal_irrigation_frequency(Per week)'])
                    }

                if crop not in data:
                    data[crop] = {}
                if soil not in data[crop]:
                    data[crop][soil] = {}
                
                data[crop][soil][stage] = {
                    'max_fertilizer': round(float(row['max_fertilizer_usage(Per day)']), 3),
                    'max_water': round(float(row['max_water_usage(Per day)']), 3)
                }

            SmartFarming._fertilizer_data = data
            SmartFarming._crop_lifespans = crop_lifespans
            SmartFarming._optimal_values = optimal_values
        except Exception as e:
            print("Error loading fertilizer data:", e)
            SmartFarming._fertilizer_data = {}
            SmartFarming._crop_lifespans = {}
            SmartFarming._optimal_values = {1: {}, 2: {}, 3: {}}


# get the lifespan of each crop type from the dataset 
    @staticmethod
    def get_crop_lifespans():
        if SmartFarming._fertilizer_data is None:
            SmartFarming._load_fertilizer_data()
        return SmartFarming._crop_lifespans


# get the optimal values of each crop type from the dataset to be used in the fitness function 
    @staticmethod
    def get_optimal_values():
        if SmartFarming._fertilizer_data is None: 
            SmartFarming._load_fertilizer_data()
        return SmartFarming._optimal_values


# Max value of fertilizer used in the random range of fertilizer allocation 
    @staticmethod
    def get_max_fertilizer(crop_label, soil_type, growth_stage):
        if SmartFarming._fertilizer_data is None:
            SmartFarming._load_fertilizer_data()

        try:
            data = SmartFarming._fertilizer_data
            crop_label = crop_label.strip().lower()

            if crop_label in data:
                soil_data = data[crop_label]
                if soil_type in soil_data:
                    stage_data = soil_data[soil_type]
                    if growth_stage in stage_data:
                        return stage_data[growth_stage]['max_fertilizer']
            print("Fertilizer data not found for given parameters.")
            return 0.0
        except Exception as e:
            print("Error retrieving fertilizer data:", e)
            return 0.0
        

    # Max value of water used in the random range of water allocation 
    @staticmethod
    def get_max_water(crop_label, soil_type, growth_stage):
        if SmartFarming._fertilizer_data is None:
            SmartFarming._load_fertilizer_data()

        try:
            data = SmartFarming._fertilizer_data
            crop_label = crop_label.strip().lower()

            if crop_label in data:
                soil_data = data[crop_label]
                if soil_type in soil_data:
                    stage_data = soil_data[soil_type]
                    if growth_stage in stage_data:
                        return stage_data[growth_stage]['max_water']
            print("Water data not found for given parameters.")
            return 0.0
        except Exception as e:
            print("Error retrieving water data:", e)
            return 0.0


# Function used to divide the lifespn of the crop into equal stages for approximation 
    @staticmethod
    def assign_growth_stage(week, lifespan_weeks):
        stage_length = lifespan_weeks // 3
        if week < stage_length:
            return 1
        elif week < 2 * stage_length:
            return 2
        else:
            return 3


# This function is used to generate a randam day allocation (allele of the gene) using random values from the dataset (csv file)
    @staticmethod
    def generate_random_day(stage, crop, soil_type):
        allocations = []
        
        # 50% chance of not applying fertilizer
        max_fert = SmartFarming.get_max_fertilizer(crop, soil_type, stage)
        fertilizer_value = 0 if random.random() < 0.5 else round(random.uniform(0, max_fert), 4)
        allocations.append(("fertilizer", fertilizer_value))

        # 50% chance of not applying water
        max_water = SmartFarming.get_max_water(crop, soil_type, stage)
        water_value = 0 if random.random() < 0.5 else round(random.uniform(0, max_water), 4)
        allocations.append(("water", water_value))

        return allocations


# Function to generate a full gene of the chromosome 
    @staticmethod
    def generate_week(stage, crop, soil_type):
        return [SmartFarming.generate_random_day(stage, crop, soil_type) for _ in range(7)]


# This function is used to generate a dummy week to fill in the remaing weeks of the chromosome in case the crop was short-period 
    @staticmethod
    def generate_dummy_week():
        return [[("fertilizer", -1), ("water", -1)] for _ in range(7)]


# Generate the full chromosme filled in with random values, and in case the week was out of its lifespan will be a dummy week 
    @staticmethod
    def generate_chromosome(lifespan_weeks, crop, soil_type=1):
        SmartFarming._load_fertilizer_data()
        chromosome = []
        for week in range(416):  # Maximum weeks
            if week < lifespan_weeks:
                stage = SmartFarming.assign_growth_stage(week, lifespan_weeks)
                chromosome.append(SmartFarming.generate_week(stage, crop, soil_type))
            else:
                chromosome.append(SmartFarming.generate_dummy_week())
        return chromosome


# Function counts for the irrigation frequency 
    @staticmethod
    def calculate_irrigation_frequency(week):
        irrigation_count = 0
        for day in week:
            for resource, value in day:
                if resource == "water" and value > 0:
                    irrigation_count += 1
                    break
        return irrigation_count


# related irrigation frequency function  
    @staticmethod
    def calculate_weekly_irrigation_frequencies(chromosome, lifespan_weeks):
        irrigation_frequencies = []
        for week_idx in range(lifespan_weeks):
            week = chromosome[week_idx]
            frequency = SmartFarming.calculate_irrigation_frequency(week)
            irrigation_frequencies.append((week_idx + 1, frequency))
        return irrigation_frequencies


# Identify the weeks of each groth stage 
    @staticmethod
    def get_weeks_by_growth_stage(chromosome, lifespan_weeks):
        stage_weeks = {1: [], 2: [], 3: []}
        for week_idx in range(lifespan_weeks):
            stage = SmartFarming.assign_growth_stage(week_idx, lifespan_weeks)
            stage_weeks[stage].append(week_idx)
        return stage_weeks


# The crossover function it exchanges between the weeks (genes) of the same stage  
    @staticmethod
    def crossover_same_stage(parent1, parent2, lifespan_weeks, crossover_probability=0.7):
        offspring1 = copy.deepcopy(parent1)
        offspring2 = copy.deepcopy(parent2)

        if random.random() > crossover_probability:
            return offspring1, offspring2

        stage_weeks = SmartFarming.get_weeks_by_growth_stage(parent1, lifespan_weeks)

        for stage, week_indices in stage_weeks.items():
            if len(week_indices) < 2:
                continue
            crossover_point = random.randint(1, len(week_indices) - 1)
            for i in range(crossover_point, len(week_indices)):
                week_idx = week_indices[i]
                offspring1[week_idx], offspring2[week_idx] = offspring2[week_idx], offspring1[week_idx]

        return offspring1, offspring2


# Mutate function is used to mutate within the values of the alleles (days)
    @staticmethod
    def mutate_resource_values(chromosome, lifespan_weeks, crop, soil_type, mutation_rate=0.1, mutation_strength=0.5):
        mutated_chromosome = copy.deepcopy(chromosome)
        for week_idx in range(lifespan_weeks):
            stage = SmartFarming.assign_growth_stage(week_idx, lifespan_weeks)
            for day_idx in range(7):
                for res_idx, (resource, value) in enumerate(mutated_chromosome[week_idx][day_idx]):
                    if random.random() > mutation_rate:
                        continue
                    if resource == "water":
                        if value == 0 and random.random() < 0.5:
                           new_value = SmartFarming.get_max_water(crop, soil_type, stage)
                        else:
                            max_val = SmartFarming.get_max_water(crop, soil_type, stage)
                            change = value * (random.random() * 3 - 1) * mutation_strength
                            new_value = round(max(0, min(max_val, value + change)), 3)
                        mutated_chromosome[week_idx][day_idx][res_idx] = (resource, new_value)

                    elif resource == "fertilizer":
                        if value == 0 and random.random() < 0.3:
                            new_value = SmartFarming.get_max_fertilizer(crop, soil_type, stage)
                        else:
                            max_val = SmartFarming.get_max_fertilizer(crop, soil_type, stage)
                            change = value * (random.random() * 2 - 1) * mutation_strength
                            new_value = round(max(0, min(max_val, value + change)), 3)
                        mutated_chromosome[week_idx][day_idx][res_idx] = (resource, new_value)
        return mutated_chromosome


# Visualization function to represent the water and fertilizer allocation throughout each stage of the lifespan of the crop (Bar chart)
    @staticmethod
    def visualize_schedule(chromosome, lifespan_weeks, crop_type, soil_type, start_stage=1, single_stage_only=False):
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(15, 10), sharex=True)
        
        # Prepare data
        growth_stages = []
        weekly_water = []
        weekly_fertilizer = []
        stage_start_weeks = []
        
        # First, determine all growth stages
        for week_idx in range(lifespan_weeks):
            stage = SmartFarming.assign_growth_stage(week_idx, lifespan_weeks)
            growth_stages.append(stage)
            
            # Mark the first week of each stage
            if week_idx == 0 or growth_stages[week_idx] != growth_stages[week_idx-1]:
                stage_start_weeks.append(week_idx + 1)  # +1 because weeks are 1-indexed in display
        
        # Calculate the data only for weeks of the requested stage(s)
        visible_weeks = []
        visible_stages = []
        
        for week_idx in range(lifespan_weeks):
            stage = growth_stages[week_idx]
            
            # Skip weeks that don't match our criteria
            if stage < start_stage:
                continue
                
            # If single_stage_only is True, only include the exact stage requested
            if single_stage_only and stage != start_stage:
                continue
                
            week_num = week_idx + 1  # For display purposes
            visible_weeks.append(week_num)
            visible_stages.append(stage)
            
            week_water = 0
            week_fertilizer = 0
            
            for day in chromosome[week_idx]:
                water = day[1][1]  # (resource, value)
                fertilizer = day[0][1]
                week_water += water
                week_fertilizer += fertilizer
                
            weekly_water.append(week_water)
            weekly_fertilizer.append(week_fertilizer)
        
        # If no weeks match our criteria, inform and exit
        if not visible_weeks:
            plt.close(fig)
            print(f"No data to display for stage {start_stage}{'only' if single_stage_only else ' onwards'}")
            return
            
        # Plot weekly totals
        colors = ['green', 'orange', 'red']
        stage_colors = [colors[stage-1] for stage in visible_stages]

        # Water plot
        bars = ax1.bar(visible_weeks, weekly_water, color=stage_colors)
        ax1.set_ylabel('Weekly Water (mm)')
        
        # Set title based on what we're showing
        stage_text = f"Stage {start_stage}" if single_stage_only else f"From Stage {start_stage}"
        ax1.set_title(f'Water Allocation Schedule ({crop_type.capitalize()}, Soil {soil_type}) - {stage_text}')
        
        # Fertilizer plot
        ax2.bar(visible_weeks, weekly_fertilizer, color=stage_colors)
        ax2.set_ylabel('Weekly Fertilizer (kg/ha)')
        ax2.set_xlabel('Week Number')
        ax2.set_title('Fertilizer Allocation Schedule')
        
        # Create legend only for stages actually shown
        unique_stages = sorted(set(visible_stages))
        legend_elements = []
        stage_labels = {
            1: 'Stage 1: Vegetative',
            2: 'Stage 2: Reproductive',
            3: 'Stage 3: Ripening'
        }
        
        for stage in unique_stages:
            legend_elements.append(Patch(facecolor=colors[stage-1], label=stage_labels[stage]))
        
        ax1.legend(handles=legend_elements, loc='upper right')
        
        # Add vertical lines to mark stage transitions if showing multiple stages
        if not single_stage_only:
            for stage_week in stage_start_weeks:
                if stage_week > min(visible_weeks) and stage_week <= max(visible_weeks):
                    ax1.axvline(x=stage_week - 0.5, color='black', linestyle='--', alpha=0.5)
                    ax2.axvline(x=stage_week - 0.5, color='black', linestyle='--', alpha=0.5)
        
        # Set x-axis limits to show only the relevant weeks
        ax1.set_xlim(min(visible_weeks) - 0.5, max(visible_weeks) + 0.5)
        
        plt.tight_layout()
        plt.show()


# Class to identify our GA 
class GeneticAlgorithm:
    def __init__(self, problem, population_size=100, generations=1000,
                 mutation_rate=0.1, tournament_size=3, selection_method='tournament'):
        self.problem = problem
        self.population_size = population_size
        self.generations = generations
        self.mutation_rate = mutation_rate
        self.tournament_size = tournament_size
        self.selection_method = selection_method
        self.best_solution = None
        self.best_score = float('-inf')
        self.generations_without_improvement = 0


# Initialize population of the GA using the pre-defined chromosomes 
    def initialize_population(self):
        return [
            SmartFarming.generate_chromosome(
                self.problem.lifespan_weeks,
                self.problem.crop_type,
                self.problem.soil_type
            )
            for _ in range(self.population_size)
        ]


# Fitness function to evaluate our chromosome allocation plan
# It takes into account: ferilizer usage, irrigation frequency, and water optimallity 

    def evaluate_fitness(self, chromosome):
        optimal_values = SmartFarming.get_optimal_values()
        crop_type = self.problem.crop_type
        
        try:
            optimal_fert = {
                1: optimal_values[1][crop_type]['fertilizer'],
                2: optimal_values[2][crop_type]['fertilizer'],
                3: optimal_values[3][crop_type]['fertilizer']
            }
            optimal_irr = {
                1: optimal_values[1][crop_type]['irrigation_frequency'],
                2: optimal_values[2][crop_type]['irrigation_frequency'],
                3: optimal_values[3][crop_type]['irrigation_frequency']
            }
        except KeyError:
            print(f"Warning: Optimal values not found for crop {crop_type}")
            return 0

        stage_fert_sums = {1: 0.0, 2: 0.0, 3: 0.0}
        irrigation_violations = {1: 0, 2: 0, 3: 0}
        total_penalty = 0

        for week_idx in range(self.problem.lifespan_weeks):
            stage = SmartFarming.assign_growth_stage(week_idx, self.problem.lifespan_weeks)
            week = chromosome[week_idx]

            for day in week:
                stage_fert_sums[stage] += day[0][1]

            actual_irr = SmartFarming.calculate_irrigation_frequency(week)
            if actual_irr != optimal_irr[stage]:
                irrigation_violations[stage] += 1

        stage_scores = {}
        for stage in [1, 2, 3]:
            fert_score = 50 if abs(stage_fert_sums[stage] - optimal_fert[stage]) < 0.001 else 0
            irr_score = 50 if irrigation_violations[stage] == 0 else 0
            stage_scores[stage] = fert_score + irr_score

        total_score = (stage_scores[1] * 0.3 +
                       stage_scores[2] * 0.4 +
                       stage_scores[3] * 0.3 +
                       total_penalty)

        return total_score


# This function defines how we select individuals from the current population to serve as parents that produce the next generation
    def select_parent(self, population):
        if self.selection_method == 'roulette':
            fitnesses = [max(0.001, self.evaluate_fitness(ind)) for ind in population]
            total = sum(fitnesses)
            probs = [f / total for f in fitnesses]
            return random.choices(population, weights=probs)[0]
        else:
            tournament = random.sample(population, self.tournament_size)
            return max(tournament, key=lambda x: self.evaluate_fitness(x))


    def perform_crossover(self, parent1, parent2):
        return SmartFarming.crossover_same_stage(
            parent1, parent2,
            self.problem.lifespan_weeks,
            crossover_probability=0.7
        )


    def perform_mutation(self, individual):
        if random.random() < self.mutation_rate:
            return SmartFarming.mutate_resource_values(
                individual,
                self.problem.lifespan_weeks,
                self.problem.crop_type,
                self.problem.soil_type
            )
        return individual

# Function that creates the next generation of the population from the current one
    def evolve_population(self, population):
        new_population = [max(population, key=lambda x: self.evaluate_fitness(x))]

        while len(new_population) < self.population_size:
            parent1 = self.select_parent(population)
            parent2 = self.select_parent(population)
            child1, child2 = self.perform_crossover(parent1, parent2)
            child1 = self.perform_mutation(child1)

            new_population.append(child1)
            if len(new_population) < self.population_size:
                new_population.append(child2)

        return new_population

# This is the main engine of the GA where the termination point is identified 
    def solve(self):
        population = self.initialize_population()
        fitness_history = []

        for gen in range(self.generations):
            population = self.evolve_population(population)
            current_best = max(population, key=lambda x: self.evaluate_fitness(x))
            current_score = self.evaluate_fitness(current_best)
            fitness_history.append(current_score)

            if current_score > self.best_score:
                self.best_score = current_score
                self.best_solution = copy.deepcopy(current_best)
                self.generations_without_improvement = 0
            else:
                self.generations_without_improvement += 1

            if self.generations_without_improvement >= 50:
                break

        return self.best_solution, self.best_score, fitness_history

# Crop specific class 
class CropProblem:
    def __init__(self, crop_type, soil_type=1):
        self.crop_type = crop_type
        self.soil_type = soil_type
        lifespans = SmartFarming.get_crop_lifespans()
        self.lifespan_weeks = lifespans.get(crop_type, 12)  # Default to 12 weeks if not found


# Function used in the output to dispaly the full allocation plan for the crop - chromosme dispaly 
def display_chromosome(chromosome, lifespan_weeks, start_stage=1):
    print(f"Best Resource Allocation Plan")
    print(f"Lifespan: {lifespan_weeks} weeks")
    print(f"Displaying from Growth Stage {start_stage} onwards")
    print("=" * 60)

    for week_num in range(lifespan_weeks):
        week = chromosome[week_num]
        stage = SmartFarming.assign_growth_stage(week_num, lifespan_weeks)

        if stage < start_stage:
            continue

        print(f"\n🌱 GROWTH STAGE {stage} | 📅 WEEK {week_num + 1}")
        print("-" * 60)

        for day_num, day in enumerate(week):
            resources = []
            for res, val in day:
                if res == "water":
                    resources.append(f"💦 {res}: {val} mm")
                else:
                    resources.append(f"🧪 {res}: {val} kg/ha")
            print(f"  📆 Day {day_num + 1}: {' | '.join(resources)}")
        print("-" * 60)


# Main function to run the GA on the inputs of the user -> Plot the solution visually to the farmer in bar charts 
def test_schedule():
    # First load the data to get all available crop labels
    SmartFarming._load_fertilizer_data()
    if not SmartFarming._fertilizer_data:
        print("Error: Could not load crop data.")
        return
    
    # Get all available crop labels (exactly as they appear in the dataset)
    available_crops = list(SmartFarming._fertilizer_data.keys())
    print("Available crops:", available_crops)

    while True:
        crop_type = input("\nEnter crop type exactly as listed (or 'quit'): ").strip().lower()
        if crop_type == 'quit':
            break

        # Check if the input matches any crop label exactly (case-insensitive)
        matching_crops = [crop for crop in available_crops if crop.lower() == crop_type.lower()]
        
        if not matching_crops:
            print(f"Invalid crop type. Please choose from: {available_crops}")
            continue
        
        # Use the exact label from the dataset (preserving original case)
        exact_crop_label = matching_crops[0]
        
        soil_type = int(input("Enter soil type (1, 2, or 3): ").strip())
        if soil_type not in [1, 2, 3]:
            print("Invalid soil type. Using default soil type 1.")
            soil_type = 1

        start_stage = int(input("Enter starting growth stage (1, 2, or 3): ").strip())
        if start_stage not in [1, 2, 3]:
            print("Invalid growth stage. Using default stage 1.")
            start_stage = 1

        rainfall = int(input("Enter average rainfall in your area: ").strip()) 
        humidity = int(input("Enter average humidity in your area: : ").strip())
        temp = int(input("Enter average temperature in your area:: ").strip())
        wind_speed = int(input("Enter average wind speed in your area: ").strip())   

        lifespan = SmartFarming.get_crop_lifespans().get(exact_crop_label, 12)
        print(f"Using lifespan: {lifespan} weeks for {exact_crop_label} with soil type {soil_type}")

        problem = CropProblem(exact_crop_label, soil_type)
        ga = GeneticAlgorithm(problem)
        print(f"\nRunning genetic algorithm for {exact_crop_label}...")
        best_solution, best_score, fitness_history = ga.solve()

        print(f"\nOptimal schedule for {exact_crop_label} with soil type {soil_type} (score: {best_score:.2f})")
        display_chromosome(best_solution, lifespan, start_stage)
        
        # Show visualizations
        SmartFarming.visualize_schedule(best_solution, lifespan, exact_crop_label, soil_type, start_stage)


def format_solution_for_api(solution, lifespan_weeks, crop_type, goal_yield):
    """
    Format the genetic algorithm solution into a standardized output format for the API.
    Returns a dictionary with 'schedule' and 'yield' fields.
    
    Schedule format:
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
      "yield": 3500
    }
    """
    if solution is None:
        return {"error": "No solution found", "schedule": [], "yield": 0}
    
    # Convert genetic algorithm solution to the standard format
    schedule = []
    
    for week_idx in range(lifespan_weeks):
        # Determine growth stage based on week
        stage = 1
        if week_idx >= lifespan_weeks * 2/3:
            stage = 3
        elif week_idx >= lifespan_weeks * 1/3:
            stage = 2
            
        week = solution[week_idx]
        
        # Calculate totals for the week
        water_total = sum(day[1][1] for day in week)  # (resource, value)
        fertilizer_total = sum(day[0][1] for day in week)
        
        days = []
        for day_idx, day in enumerate(week):
            days.append({
                "day": day_idx + 1,
                "water": round(day[1][1], 1),  # water value
                "fertilizer": round(day[0][1], 1)  # fertilizer value
            })
        
        schedule.append({
            "week": week_idx + 1,
            "stage": stage,
            "waterTotal": round(water_total, 1),
            "fertilizerTotal": round(fertilizer_total, 1),
            "days": days
        })
    
    # Estimate yield based on solution quality
    # This is a simplified approach - you should adapt based on how your GA calculates fitness
    # For now, we'll use 80% of goal yield as an approximation
    estimated_yield = round(goal_yield * 0.8, 1)
    
    return {
        "schedule": schedule,
        "yield": estimated_yield
    }

# Add a run function for the API
def run_genetic_algorithm(params):
    """
    Run the genetic algorithm with parameters from the API.
    
    params: dict with keys:
        - crop_type, soil_type, temperature, etc.
        
    Returns: dict with the formatted solution
    """
    try:
        # Create crop problem instance with parameters
        crop_type = params.get('crop_type', 'rice')
        soil_type = params.get('soil_type', 2)
        temperature = params.get('temperature', 25)
        
        # Setup other parameters needed for your GA
        # This will depend on your specific implementation
        lifespan_weeks = 12  # Example value
        
        # Create problem instance and run GA
        problem = CropProblem(crop_type=crop_type)
        ga = GeneticAlgorithm(problem)
        solution = ga.solve()[0]
        
        # Format and return solution
        return format_solution_for_api(solution, lifespan_weeks, crop_type, params.get('goal_yield', 1000))
        
    except Exception as e:
        print(f"Error in genetic algorithm: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": str(e), "schedule": [], "yield": 0}


if __name__ == "__main__":
    test_schedule()