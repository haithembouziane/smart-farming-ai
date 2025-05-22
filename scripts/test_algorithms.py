#!/usr/bin/env python3
# This script tests each algorithm's API endpoint with sample data

import json
import requests
import time
import os
import sys

# Add algorithms directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'algorithms'))

# Import algorithm modules directly for testing
try:
    from astar import run_farming_simulation
    from genetic import run_genetic_algorithm
    from csp import run_csp_algorithm
except ImportError:
    print("Warning: Could not import algorithm modules directly.")

# Test data
test_payload = {
    "algorithm": "astar",  # Will be changed for each test
    "crop_type": "rice",
    "soil_type": 2,
    "temperature": 25.0,
    "humidity": 70.0,
    "rainfall": 10.0,
    "sunlight": 8.5,
    "wind_speed": 10.0,
    "ph": 6.5,
    "crop_area": 5.0,
    "crop_density": 12.0,
    "water": 20000.0,
    "fertilizer": {"N": 80.0, "P": 45.0, "K": 40.0},
    "pesticides": 20.0,
    "goal_yield": 1000.0,
    "max_steps": 30,
    "growth_stage": 1,
    "soil_moisture": 45.0,
    "soil_nutrients": {"N": 25.0, "P": 15.0, "K": 30.0},
    "crop_health": 0.6
}

def test_algorithm_direct(algorithm):
    """Test algorithm function directly"""
    print(f"\n=== Testing {algorithm} algorithm directly ===")
    
    # Create a copy of the payload with the right algorithm
    payload = test_payload.copy()
    payload["algorithm"] = algorithm
    
    try:
        # Call the appropriate function based on algorithm
        if algorithm == "astar" or algorithm == "greedy":
            result = run_farming_simulation(payload)
        elif algorithm == "genetic":
            result = run_genetic_algorithm(payload)
        elif algorithm == "csp":
            result = run_csp_algorithm(payload)
        else:
            print(f"Unknown algorithm: {algorithm}")
            return
        
        # Print the result
        print(f"Result from {algorithm}:")
        print(f"- Yield: {result.get('yield', 'N/A')}")
        print(f"- Schedule weeks: {len(result.get('schedule', []))}")
        
        # Validate schedule structure
        schedule = result.get('schedule', [])
        if not schedule:
            print("Warning: Empty schedule returned")
        else:
            # Check first week's format
            week1 = schedule[0]
            if all(k in week1 for k in ['week', 'stage', 'waterTotal', 'fertilizerTotal', 'days']):
                print("- Schedule format: Valid ✓")
            else:
                print("- Schedule format: Invalid ✗")
                print(f"  Missing keys: {set(['week', 'stage', 'waterTotal', 'fertilizerTotal', 'days']) - set(week1.keys())}")
        
    except Exception as e:
        print(f"Error testing {algorithm} directly: {str(e)}")

def test_algorithm_api(algorithm):
    """Test algorithm via API endpoint"""
    print(f"\n=== Testing {algorithm} algorithm via API ===")
    
    # Create a copy of the payload with the right algorithm
    payload = test_payload.copy()
    payload["algorithm"] = algorithm
    
    try:
        # Call the API
        response = requests.post(
            "http://localhost:8000/api/optimize",
            json=payload,
            timeout=30
        )
        
        # Check response
        if response.status_code == 200:
            result = response.json()
            print(f"Result from {algorithm} API:")
            print(f"- Yield: {result.get('yield', 'N/A')}")
            print(f"- Schedule weeks: {len(result.get('schedule', []))}")
            
            # Validate schedule structure
            schedule = result.get('schedule', [])
            if not schedule:
                print("Warning: Empty schedule returned")
            else:
                # Check first week's format
                week1 = schedule[0]
                if all(k in week1 for k in ['week', 'stage', 'waterTotal', 'fertilizerTotal', 'days']):
                    print("- Schedule format: Valid ✓")
                else:
                    print("- Schedule format: Invalid ✗")
                    print(f"  Missing keys: {set(['week', 'stage', 'waterTotal', 'fertilizerTotal', 'days']) - set(week1.keys())}")
        else:
            print(f"API returned error: {response.status_code}")
            print(response.text)
        
    except requests.exceptions.ConnectionError:
        print("Connection error: Is the API server running?")
    except Exception as e:
        print(f"Error testing {algorithm} via API: {str(e)}")

def main():
    algorithms = ["astar", "greedy", "csp", "genetic"]
    
    # Test direct function calls
    for algorithm in algorithms:
        test_algorithm_direct(algorithm)
    
    # Ask if user wants to test API endpoints
    test_api = input("\nDo you want to test API endpoints? (requires server running) [y/N]: ").strip().lower()
    if test_api == 'y':
        for algorithm in algorithms:
            test_algorithm_api(algorithm)
            time.sleep(1)  # Add delay between API calls

if __name__ == "__main__":
    main()