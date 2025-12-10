@echo off
echo Starting AI Study Assistant Backend...
echo Make sure you have set your OPENAI_API_KEY in the .env file
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Start the server
echo Starting server on http://localhost:8000
echo API docs available at http://localhost:8000/docs
echo.
uvicorn main:app --reload --port 8000

pause

