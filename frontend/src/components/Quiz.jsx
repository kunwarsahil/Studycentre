import React, { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, XCircle, AlertCircle, Trophy, Sparkles } from 'lucide-react'
import { generateQuiz, gradeQuiz, listDocuments } from '../services/api'

function Quiz() {
  const [documents, setDocuments] = useState([])
  const [selectedDocId, setSelectedDocId] = useState('')
  const [difficulty, setDifficulty] = useState('Easy')
  const [numQuestions, setNumQuestions] = useState(5)
  const [quiz, setQuiz] = useState([])
  const [answers, setAnswers] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [grading, setGrading] = useState(false)
  const [error, setError] = useState(null)
  const [loadingDocs, setLoadingDocs] = useState(true)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoadingDocs(true)
      const docs = await listDocuments()
      setDocuments(docs)
      if (docs.length > 0 && !selectedDocId) {
        setSelectedDocId(docs[0].id)
      }
    } catch (err) {
      console.error('Failed to load documents:', err)
    } finally {
      setLoadingDocs(false)
    }
  }

  const handleGenerate = async () => {
    if (!selectedDocId) {
      setError('Please select a document first')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResults(null)
      const result = await generateQuiz(selectedDocId, difficulty, numQuestions)
      setQuiz(result.questions || [])
      setAnswers(new Array(result.questions?.length || 0).fill(''))
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate quiz')
      console.error('Quiz generation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    if (answers.some(a => !a.trim())) {
      setError('Please answer all questions before submitting')
      return
    }

    try {
      setGrading(true)
      setError(null)
      const result = await gradeQuiz(
        quiz.map(q => ({ q: q.q, a: q.a })),
        answers,
        selectedDocId,
        difficulty
      )
      setResults(result.results || [])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to grade quiz')
      console.error('Quiz grading error:', err)
    } finally {
      setGrading(false)
    }
  }

  const score = results ? results.filter(r => r.is_correct).length : 0
  const totalQuestions = quiz.length
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Quiz</h2>

        {/* Quiz Configuration */}
        {!quiz.length && !results && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Document
                </label>
                {loadingDocs ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                  </div>
                ) : (
                  <select
                    value={selectedDocId}
                    onChange={(e) => setSelectedDocId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a document...</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.filename}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !selectedDocId}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Quiz
                  </>
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quiz Questions */}
        {quiz.length > 0 && !results && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {difficulty} Quiz - {totalQuestions} Questions
            </h3>
            <div className="space-y-6">
              {quiz.map((question, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold mr-3">
                      {index + 1}
                    </span>
                    <p className="text-lg font-medium text-gray-900 flex-1">{question.q}</p>
                  </div>
                  <textarea
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows="3"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={grading || answers.some(a => !a.trim())}
              className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {grading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Grading...
                </>
              ) : (
                'Submit Quiz'
              )}
            </button>
          </div>
        )}

        {/* Quiz Results */}
        {results && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
                <Trophy className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Results</h3>
              <p className="text-4xl font-bold text-primary-600">
                {score} / {totalQuestions}
              </p>
              <p className="text-lg text-gray-600 mt-2">
                {percentage.toFixed(1)}% Correct
              </p>
            </div>

            <div className="space-y-6">
              {quiz.map((question, index) => {
                const result = results[index]
                const isCorrect = result?.is_correct || false
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start mb-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">{question.q}</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Your Answer:</p>
                            <p className="text-sm text-gray-600">{answers[index] || 'No answer provided'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Correct Answer:</p>
                            <p className="text-sm text-gray-600">{question.a}</p>
                          </div>
                          {result?.feedback && (
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Feedback:</p>
                              <p className="text-sm text-gray-600">{result.feedback}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={() => {
                setQuiz([])
                setAnswers([])
                setResults(null)
              }}
              className="mt-6 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Take Another Quiz
            </button>
          </div>
        )}

        {!quiz.length && !results && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Generate a quiz to test your knowledge!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz

