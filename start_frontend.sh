#!/bin/bash

# Start the frontend server
echo "Starting AI Study Assistant Frontend..."
echo ""

# Navigate to frontend directory
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server
echo "Starting frontend on http://localhost:3000"
echo ""
npm run dev

