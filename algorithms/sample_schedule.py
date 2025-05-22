#!/usr/bin/env python3
# Quick CSP tester to demonstrate the API output format

import json

def generate_sample_schedule():
    """
    Generate a sample farming schedule in the standardized format
    """
    schedule = []
    
    # Week 1 (Stage 1)
    week1 = {
        "week": 1,
        "stage": 1,
        "waterTotal": 100,
        "fertilizerTotal": 20,
        "days": [
            {"day": 1, "water": 20, "fertilizer": 4},
            {"day": 2, "water": 20, "fertilizer": 4},
            {"day": 3, "water": 20, "fertilizer": 4},
            {"day": 4, "water": 20, "fertilizer": 4},
            {"day": 5, "water": 20, "fertilizer": 4}
        ]
    }
    
    # Week 2 (Stage 2)
    week2 = {
        "week": 2,
        "stage": 2,
        "waterTotal": 150,
        "fertilizerTotal": 30,
        "days": [
            {"day": 1, "water": 30, "fertilizer": 6},
            {"day": 2, "water": 30, "fertilizer": 6},
            {"day": 3, "water": 30, "fertilizer": 6},
            {"day": 4, "water": 30, "fertilizer": 6},
            {"day": 5, "water": 30, "fertilizer": 6}
        ]
    }
    
    # Week 3 (Stage 3)
    week3 = {
        "week": 3,
        "stage": 3,
        "waterTotal": 200,
        "fertilizerTotal": 40,
        "days": [
            {"day": 1, "water": 40, "fertilizer": 8},
            {"day": 2, "water": 40, "fertilizer": 8},
            {"day": 3, "water": 40, "fertilizer": 8},
            {"day": 4, "water": 40, "fertilizer": 8},
            {"day": 5, "water": 40, "fertilizer": 8}
        ]
    }
    
    schedule = [week1, week2, week3]
    return {
        "schedule": schedule,
        "yield": 3500
    }

if __name__ == "__main__":
    print("Generating sample schedule in API format...")
    sample_output = generate_sample_schedule()
    print(json.dumps(sample_output, indent=2))
    print("\nThis is the standard output format that all algorithms (A*, Greedy, CSP, GA) will use.")