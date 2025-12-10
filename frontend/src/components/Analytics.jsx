import React, { useState, useEffect } from 'react'
import { BarChart3, Loader2, AlertCircle, Trophy, BookOpen, Target } from 'lucide-react'
import { getPerformanceStats, listDocuments } from '../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

function Analytics() {
  const [documents, setDocuments] = useState([])
  const [selectedDocId, setSelectedDocId] = useState('')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loadingDocs, setLoadingDocs] = useState(true)

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    if (selectedDocId) {
      loadStats()
    }
  }, [selectedDocId])

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

  const loadStats = async () => {
    if (!selectedDocId) return

    try {
      setLoading(true)
      setError(null)
      const result = await getPerformanceStats(selectedDocId)
      setStats(result)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load performance stats')
      console.error('Stats loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  const topicPerformanceData = stats?.topic_performance
    ? Object.entries(stats.topic_performance).map(([topic, score]) => ({
        topic: topic.length > 20 ? topic.substring(0, 20) + '...' : topic,
        score: (score * 100).toFixed(1),
      }))
    : []

  const flashcardData = stats
    ? [
        {
          name: 'Mastered',
          value: stats.mastered_flashcards,
        },
        {
          name: 'In Progress',
          value: stats.total_flashcards - stats.mastered_flashcards,
        },
      ]
    : []

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Analytics & Performance</h2>

        {/* Document Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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

        {error && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_quizzes}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {(stats.average_score * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Flashcards</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_flashcards}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mastered</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.mastered_flashcards}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Target className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Topic Performance Chart */}
              {topicPerformanceData.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topicPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="topic" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#0ea5e9" name="Score (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Flashcard Mastery Chart */}
              {flashcardData.length > 0 && stats.total_flashcards > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Flashcard Mastery</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={flashcardData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {flashcardData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Topic Performance List */}
            {topicPerformanceData.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Performance Details</h3>
                <div className="space-y-3">
                  {Object.entries(stats.topic_performance).map(([topic, score]) => (
                    <div key={topic} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{topic}</span>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              score >= 0.7 ? 'bg-green-500' : score >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                          {(score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!stats && !loading && selectedDocId && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No performance data available yet. Start taking quizzes and studying flashcards!</p>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Loader2 className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analytics

