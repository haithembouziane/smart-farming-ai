#!/usr/bin/env bash
# This script builds the frontend and starts the backend server

# Set working directory to project root
cd "$(dirname "$0")/.."

echo "===== Smart Farming System Deployment ====="

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: python3 is not installed. Please install Python 3."
    exit 1
fi

# Build the frontend
echo "Building frontend..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "Error: Frontend build failed. Check for errors above."
    exit 1
fi

# Create a Python virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate the virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Start the backend server
echo "Starting backend server..."
cd backend
python main.py

echo "Server stopped"