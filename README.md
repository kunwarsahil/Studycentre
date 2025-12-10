# AI Study Assistant

A multi-agent AI system that acts as a personalized study assistant. This application helps students read and understand study material, create flashcards and quizzes automatically, design adaptive revision plans, and answer conceptual doubts directly from uploaded materials.

## Features

### Core Functional Modules

1. **Reader Agent** - Extracts text and content from PDFs, slides, or handwritten notes
2. **Flashcard Agent** - Automatically generates concise Q/A flashcards for quick revision
3. **Quiz Agent** - Generates short, adaptive quizzes with multiple difficulty levels
4. **Planner Agent** - Builds smart revision schedules based on topic weightage and user progress
5. **Chat/Doubt Agent** - Answers contextual questions about uploaded material

### Additional Features

- Performance Tracking: Detailed analytics dashboard showing progress and weak areas
- Smart Reminders: Study streaks, upcoming tests, and daily goal alerts
- Topic Analysis: Automatic extraction of topics with importance scores
- Adaptive Learning: Quiz difficulty adjusts based on student performance
- Database Storage: SQLite database for persistent data storage

## Tech Stack

### Backend
- Python 3.8+
- FastAPI - Modern, fast web framework for building APIs
- SQLAlchemy - SQL toolkit and ORM
- OpenAI API - For AI-powered content generation
- PDFPlumber - PDF text extraction
- Python-docx - DOCX file handling

### Frontend
- React 18 - Modern React with hooks
- Vite - Fast build tool
- Tailwind CSS - Utility-first CSS framework
- React Router - Client-side routing
- Axios - HTTP client
- Recharts - Chart library for analytics
- Lucide React - Icon library

## Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- OpenAI API key

### Backend Setup

1. Clone the repository:
```bash
cd "gooner ai"
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

5. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

6. Run the backend server:
```bash
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

### 1. Upload Documents

- Navigate to the Dashboard
- Upload a PDF, DOCX, or EML file
- Wait for the document to be processed
- You'll receive a document ID that you can use for other features

### 2. Generate Flashcards

- Go to the Flashcards page
- Select a document
- Click "Generate Flashcards"
- Review flashcards by clicking to flip between question and answer
- Navigate through flashcards using Previous/Next buttons

### 3. Take Quizzes

- Go to the Quiz page
- Select a document
- Choose difficulty level (Easy, Medium, Hard)
- Set the number of questions
- Click "Generate Quiz"
- Answer the questions
- Submit to get instant feedback and grading

### 4. Ask Questions

- Go to the Chat page
- Select a document
- Type your question about the document
- Get contextual answers based on the document content
- View references from the document

### 5. Create Revision Plan

- Go to the Planner page
- Select a document
- Optionally set an exam date
- Click "Analyze Topics" to see topic breakdown
- Click "Create Revision Plan" to generate a personalized study schedule
- Review the daily revision plan with topics and time estimates

### 6. View Analytics

- Go to the Analytics page
- Select a document
- View performance statistics:
  - Total quizzes taken
  - Average quiz score
  - Total flashcards
  - Mastered flashcards
  - Topic-wise performance charts

## API Endpoints

### Document Management
- `POST /upload` - Upload a document
- `GET /documents` - List all documents

### Flashcards
- `POST /flashcards` - Generate flashcards from a document

### Quizzes
- `POST /quiz/generate` - Generate a quiz
- `POST /quiz/grade` - Grade a completed quiz

### Chat/Doubt
- `POST /doubt` - Ask a question about a document

### Planner
- `POST /planner/create` - Create a revision plan
- `POST /planner/topics` - Analyze topics in a document

### Analytics
- `GET /performance/{context_id}` - Get performance statistics

## Project Structure

```
gooner ai/
├── main.py                 # Backend FastAPI application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables example
├── .gitignore            # Git ignore file
├── README.md             # This file
├── study_assistant.db    # SQLite database (generated)
└── frontend/
    ├── package.json      # Frontend dependencies
    ├── vite.config.js    # Vite configuration
    ├── tailwind.config.js # Tailwind CSS configuration
    ├── index.html        # HTML entry point
    └── src/
        ├── main.jsx      # React entry point
        ├── App.jsx       # Main React component
        ├── index.css     # Global styles
        ├── services/
        │   └── api.js    # API service layer
        └── components/
            ├── Dashboard.jsx    # Document upload dashboard
            ├── Flashcards.jsx   # Flashcard component
            ├── Quiz.jsx         # Quiz component
            ├── Chat.jsx         # Chat/Doubt component
            ├── Planner.jsx      # Revision planner component
            └── Analytics.jsx    # Analytics component
```

## Database Schema

The application uses SQLite with the following tables:

- **documents** - Stores uploaded documents and their extracted text
- **flashcards** - Stores generated flashcards with mastery tracking
- **quiz_results** - Stores quiz attempts and scores
- **performance_metrics** - Stores performance data by topic
- **revision_plans** - Stores generated revision plans

## Configuration

### Backend Configuration

The backend can be configured through environment variables:

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- Database is stored in `study_assistant.db` (SQLite)

### Frontend Configuration

The frontend can be configured through environment variables:

- `VITE_API_URL` - Backend API URL (default: http://localhost:8000)

## Development

### Running in Development Mode

1. Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

### Building for Production

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. The built files will be in `frontend/dist/`

## Troubleshooting

### Common Issues

1. **OpenAI API Key Error**: Make sure you've set the `OPENAI_API_KEY` in your `.env` file
2. **CORS Error**: The backend has CORS middleware enabled for all origins. If you encounter issues, check the CORS configuration in `main.py`
3. **Database Errors**: If you encounter database errors, delete `study_assistant.db` and restart the server to recreate the database
4. **Port Already in Use**: Change the port in the uvicorn command or frontend vite config

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- OpenAI for providing the GPT API
- FastAPI for the excellent web framework
- React team for the amazing frontend framework
- All the open-source libraries used in this project

