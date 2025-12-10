@echo off
echo Starting AI Study Assistant Frontend...
echo.

REM Navigate to frontend directory
cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Start the development server
echo Starting frontend on http://localhost:3000
echo.
npm run dev

pause

