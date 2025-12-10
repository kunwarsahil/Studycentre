import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const uploadDocument = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const generateFlashcards = async (contextId) => {
  const response = await api.post('/flashcards', { context_id: contextId })
  return response.data
}

export const generateQuiz = async (contextId, difficulty = 'Easy', numQuestions = 5) => {
  const response = await api.post('/quiz/generate', {
    context_id: contextId,
    difficulty,
    num_questions: numQuestions,
  })
  return response.data
}

export const gradeQuiz = async (quizData, userAnswers, contextId, difficulty) => {
  const response = await api.post('/quiz/grade', {
    quiz_data: quizData,
    user_answers: userAnswers,
    context_id: contextId,
    difficulty,
  })
  return response.data
}

export const askQuestion = async (contextId, question) => {
  const response = await api.post('/doubt', {
    context_id: contextId,
    question,
  })
  return response.data
}

export const createRevisionPlan = async (contextId, examDate = null, topics = null) => {
  const response = await api.post('/planner/create', {
    context_id: contextId,
    exam_date: examDate,
    topics,
  })
  return response.data
}

export const analyzeTopics = async (contextId) => {
  const response = await api.post('/planner/topics', {
    context_id: contextId,
  })
  return response.data
}

export const getPerformanceStats = async (contextId) => {
  const response = await api.get(`/performance/${contextId}`)
  return response.data
}

export const listDocuments = async () => {
  const response = await api.get('/documents')
  return response.data
}

export default api

