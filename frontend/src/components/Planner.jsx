import React, { useState, useEffect } from 'react'
import { Calendar, Loader2, AlertCircle, Sparkles, CheckCircle2, Clock } from 'lucide-react'
import { createRevisionPlan, analyzeTopics, listDocuments } from '../services/api'
import { format, parseISO } from 'date-fns'

function Planner() {
  const [documents, setDocuments] = useState([])
  const [selectedDocId, setSelectedDocId] = useState('')
  const [examDate, setExamDate] = useState('')
  const [plan, setPlan] = useState(null)
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingTopics, setLoadingTopics] = useState(false)
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

  const handleAnalyzeTopics = async () => {
    if (!selectedDocId) {
      setError('Please select a document first')
      return
    }

    try {
      setLoadingTopics(true)
      setError(null)
      const result = await analyzeTopics(selectedDocId)
      setTopics(result.topics || [])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze topics')
      console.error('Topic analysis error:', err)
    } finally {
      setLoadingTopics(false)
    }
  }

  const handleCreatePlan = async () => {
    if (!selectedDocId) {
      setError('Please select a document first')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await createRevisionPlan(
        selectedDocId,
        examDate || null,
        topics.length > 0 ? topics.map(t => t.name) : null
      )
      setPlan(result)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create revision plan')
      console.error('Plan creation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (focus) => {
    switch (focus?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Revision Planner</h2>

        {/* Configuration */}
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
                  onChange={(e) => {
                    setSelectedDocId(e.target.value)
                    setPlan(null)
                    setTopics([])
                  }}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Date (Optional)
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAnalyzeTopics}
                disabled={loadingTopics || !selectedDocId}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loadingTopics ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Topics'
                )}
              </button>
              <button
                onClick={handleCreatePlan}
                disabled={loading || !selectedDocId}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Revision Plan
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Topics Analysis */}
        {topics.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Topics Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                    <span className="text-sm text-gray-500">Weight: {topic.weight}/10</span>
                  </div>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revision Plan */}
        {plan && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Revision Plan</h3>
              {plan.summary && (
                <p className="text-gray-600 mb-4">{plan.summary}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Exam Date: {plan.exam_date ? format(parseISO(plan.exam_date), 'MMMM dd, yyyy') : 'Not set'}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Days until exam: {plan.days_until_exam}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {plan.plan?.map((dayPlan, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg ${getPriorityColor(dayPlan.focus)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Day {dayPlan.day || index + 1}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="px-2 py-1 bg-white rounded border">
                        {dayPlan.focus || 'Medium'} Priority
                      </span>
                      <span className="px-2 py-1 bg-white rounded border">
                        {dayPlan.duration_minutes || 60} min
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mb-2">
                    Date: {dayPlan.date ? format(parseISO(dayPlan.date), 'MMMM dd, yyyy') : 'TBD'}
                  </p>
                  <div>
                    <p className="text-sm font-semibold mb-1">Topics to Review:</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(dayPlan.topics) ? (
                        dayPlan.topics.map((topic, topicIndex) => (
                          <span
                            key={topicIndex}
                            className="px-2 py-1 bg-white rounded text-xs border"
                          >
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-600">No specific topics listed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!plan && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Create a revision plan to organize your study schedule!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Planner

