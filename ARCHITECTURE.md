# System Architecture

## Overview

The AI Study Assistant is a multi-agent system built with a FastAPI backend and React frontend. It uses OpenAI's GPT models to power various AI agents that help students study more effectively.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Dashboard │ │Flashcards│ │   Quiz   │ │   Chat   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐                                 │
│  │ Planner  │ │Analytics │                                 │
│  └──────────┘ └──────────┘                                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/REST API
                          │
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Endpoints Layer                      │  │
│  │  /upload, /flashcards, /quiz, /doubt, /planner       │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Agent Layer                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │
│  │  │ Reader   │ │Flashcard │ │   Quiz   │            │  │
│  │  │  Agent   │ │  Agent   │ │  Agent   │            │  │
│  │  └──────────┘ └──────────┘ └──────────┘            │  │
│  │  ┌──────────┐ ┌──────────┐                         │  │
│  │  │ Planner  │ │  Doubt   │                         │  │
│  │  │  Agent   │ │  Agent   │                         │  │
│  │  └──────────┘ └──────────┘                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Database Layer (SQLite)                  │  │
│  │  Documents, Flashcards, Quiz Results, Performance    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              External Services                        │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │           OpenAI API (GPT-4o-mini)            │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Agent Design

### 1. Reader Agent (DocumentTextExtractor)

**Purpose**: Extracts text and content from various document formats.

**Responsibilities**:
- Download documents from URLs
- Extract text from PDFs, DOCX, and EML files
- Convert tables to markdown format
- Handle file size and security checks

**Implementation**:
- Uses `pdfplumber` for PDF extraction
- Uses `python-docx` for DOCX extraction
- Uses `eml_parser` for EML extraction
- Stores extracted text in SQLite database

### 2. Flashcard Agent (FlashcardGenerator)

**Purpose**: Generates concise Q/A flashcards from study material.

**Responsibilities**:
- Analyze document text
- Identify key concepts and definitions
- Generate question-answer pairs
- Store flashcards in database

**Implementation**:
- Uses OpenAI GPT-4o-mini for content generation
- Returns JSON format with flashcards
- Stores flashcards with mastery tracking

### 3. Quiz Agent (QuizAgent)

**Purpose**: Generates adaptive quizzes and grades student answers.

**Responsibilities**:
- Generate quizzes at different difficulty levels
- Grade student answers
- Track accuracy and adjust difficulty
- Store quiz results

**Implementation**:
- Uses OpenAI GPT-4o-mini for quiz generation
- Batch grading for efficiency
- Adaptive difficulty based on performance
- Stores results in database

### 4. Planner Agent (PlannerAgent)

**Purpose**: Creates personalized revision schedules.

**Responsibilities**:
- Analyze topics and their importance
- Create daily revision plans
- Consider performance data
- Generate spaced repetition schedules

**Implementation**:
- Uses OpenAI GPT-4o-mini for planning
- Considers topic weightage
- Adjusts plan based on performance
- Stores plans in database

### 5. Doubt Agent (DoubtAgent)

**Purpose**: Answers contextual questions about study material.

**Responsibilities**:
- Answer questions based on document content
- Provide references from the document
- Avoid using outside knowledge
- Return structured answers

**Implementation**:
- Uses OpenAI GPT-4o-mini for Q&A
- Context-aware responses
- Reference extraction
- JSON format responses

## Data Flow

### Document Upload Flow

1. User uploads document through frontend
2. Frontend sends file to `/upload` endpoint
3. Backend extracts text using Reader Agent
4. Text is stored in database with unique ID
5. Document ID is returned to frontend

### Flashcard Generation Flow

1. User selects document and clicks "Generate Flashcards"
2. Frontend sends request to `/flashcards` endpoint
3. Backend retrieves document text from database
4. Flashcard Agent generates flashcards using OpenAI
5. Flashcards are stored in database
6. Flashcards are returned to frontend

### Quiz Flow

1. User selects document and difficulty level
2. Frontend sends request to `/quiz/generate` endpoint
3. Backend generates quiz using Quiz Agent
4. Quiz is returned to frontend
5. User answers questions
6. Frontend sends answers to `/quiz/grade` endpoint
7. Backend grades quiz and stores results
8. Results are returned to frontend

### Chat Flow

1. User asks a question about a document
2. Frontend sends request to `/doubt` endpoint
3. Backend retrieves document text
4. Doubt Agent generates answer using OpenAI
5. Answer with references is returned to frontend

### Planner Flow

1. User selects document and optionally sets exam date
2. Frontend sends request to `/planner/create` endpoint
3. Backend analyzes topics and performance data
4. Planner Agent generates revision plan
5. Plan is stored in database
6. Plan is returned to frontend

## Database Schema

### Documents Table
- `id`: Unique document identifier
- `filename`: Original filename
- `text_content`: Extracted text content
- `uploaded_at`: Upload timestamp
- `text_length`: Length of text content

### Flashcards Table
- `id`: Unique flashcard identifier
- `document_id`: Reference to document
- `question`: Flashcard question
- `answer`: Flashcard answer
- `created_at`: Creation timestamp
- `last_reviewed`: Last review timestamp
- `review_count`: Number of reviews
- `mastery_level`: Mastery level (0.0 to 1.0)

### Quiz Results Table
- `id`: Unique quiz result identifier
- `document_id`: Reference to document
- `difficulty`: Quiz difficulty level
- `score`: Quiz score (0.0 to 1.0)
- `total_questions`: Number of questions
- `completed_at`: Completion timestamp

### Performance Metrics Table
- `id`: Unique metric identifier
- `document_id`: Reference to document
- `topic`: Topic name
- `score`: Performance score (0.0 to 1.0)
- `metric_type`: Type of metric (quiz, flashcard, etc.)
- `recorded_at`: Recording timestamp

### Revision Plans Table
- `id`: Unique plan identifier
- `document_id`: Reference to document
- `plan_data`: JSON plan data
- `exam_date`: Exam date
- `created_at`: Creation timestamp

## Inter-Agent Communication

Agents communicate through:

1. **Shared Database**: Agents read and write to the same database
2. **Central Controller**: API endpoints act as central controller
3. **Context Passing**: Document context is passed between agents
4. **Performance Data**: Performance metrics are shared across agents

## Security Considerations

1. **File Upload**: File size limits and type validation
2. **CORS**: Configured for frontend access
3. **API Keys**: Stored in environment variables
4. **Database**: SQLite with proper connection handling
5. **Input Validation**: Pydantic models for request validation

## Performance Optimization

1. **Database Indexing**: Indexed on frequently queried fields
2. **Caching**: Document text cached in database
3. **Batch Processing**: Quiz grading done in batches
4. **Text Truncation**: Long texts truncated for AI processing
5. **Connection Pooling**: SQLAlchemy connection pooling

## Scalability Considerations

1. **Database**: Can be migrated to PostgreSQL for better performance
2. **Caching**: Can add Redis for caching
3. **Queue**: Can add Celery for async task processing
4. **Load Balancing**: Can add multiple backend instances
5. **CDN**: Can serve static files through CDN

## Future Enhancements

1. **User Authentication**: Add user accounts and authentication
2. **Multi-Document Support**: Support for multiple documents per user
3. **Collaborative Features**: Share flashcards and quizzes
4. **Offline Mode**: Local model support for offline usage
5. **Mobile App**: Native mobile app support
6. **Advanced Analytics**: More detailed performance analytics
7. **Export Features**: Export flashcards and quizzes
8. **Integration**: Integration with calendar apps

