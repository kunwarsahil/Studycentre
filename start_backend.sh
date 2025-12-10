#!/bin/bash

# Start the backend server
echo "Starting AI Study Assistant Backend..."
echo "Make sure you have set your OPENAI_API_KEY in the .env file"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Start the server
echo "Starting server on http://localhost:8000"
echo "API docs available at http://localhost:8000/docs"
echo ""
uvicorn main:app --reload --port 8000

