# Quick Setup Guide

## Prerequisites

1. Python 3.8 or higher
2. Node.js 16 or higher
3. OpenAI API key

## Step 1: Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the backend:
```bash
# On Linux/Mac:
./start_backend.sh

# On Windows:
start_backend.bat

# Or manually:
uvicorn main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

## Step 2: Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend:
```bash
# On Linux/Mac:
../start_frontend.sh

# On Windows:
../start_frontend.bat

# Or manually:
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Step 3: Usage

1. Open `http://localhost:3000` in your browser
2. Upload a PDF, DOCX, or EML document
3. Start using the features:
   - Generate flashcards
   - Take quizzes
   - Ask questions
   - Create revision plans
   - View analytics

## Troubleshooting

### Backend Issues

- **OpenAI API Key Error**: Make sure you've set the `OPENAI_API_KEY` in your `.env` file
- **Port Already in Use**: Change the port in the uvicorn command
- **Database Errors**: Delete `study_assistant.db` and restart the server

### Frontend Issues

- **Cannot Connect to Backend**: Make sure the backend is running on `http://localhost:8000`
- **CORS Errors**: The backend has CORS enabled. If issues persist, check the CORS configuration in `main.py`
- **Port Already in Use**: Change the port in `vite.config.js`

### Common Issues

1. **Module Not Found**: Run `pip install -r requirements.txt` again
2. **Node Modules Error**: Run `npm install` in the frontend directory
3. **Database Locked**: Make sure only one instance of the backend is running

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Frontend (.env in frontend directory - optional)
```
VITE_API_URL=http://localhost:8000
```

## Database

The application uses SQLite database stored in `study_assistant.db` in the root directory. This file is automatically created when you first run the backend.

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` to see the interactive API documentation.

## Next Steps

1. Upload your first document
2. Generate flashcards
3. Take a quiz
4. Ask questions about your document
5. Create a revision plan
6. View your performance analytics

Enjoy studying with AI!

