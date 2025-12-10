import React, { useState, useEffect, useRef } from 'react'
import { Send, Loader2, AlertCircle, MessageSquare } from 'lucide-react'
import { askQuestion, listDocuments } from '../services/api'

function Chat() {
  const [documents, setDocuments] = useState([])
  const [selectedDocId, setSelectedDocId] = useState('')
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingDocs, setLoadingDocs] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim() || !selectedDocId) {
      return
    }

    const userMessage = { type: 'user', content: question }
    setMessages([...messages, userMessage])
    setQuestion('')
    setLoading(true)

    try {
      const result = await askQuestion(selectedDocId, question)
      const assistantMessage = {
        type: 'assistant',
        content: result.answer,
        reference: result.reference,
      }
      setMessages([...messages, userMessage, assistantMessage])
    } catch (err) {
      const errorMessage = {
        type: 'error',
        content: err.response?.data?.detail || 'Failed to get answer',
      }
      setMessages([...messages, userMessage, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ask Questions</h2>

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
              onChange={(e) => {
                setSelectedDocId(e.target.value)
                setMessages([])
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

        {/* Chat Messages */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Start a conversation by asking a question about your document!</p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-primary-600 text-white'
                        : msg.type === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.reference && (
                      <div className="mt-2 pt-2 border-t border-gray-300">
                        <p className="text-xs font-semibold mb-1">Reference:</p>
                        <p className="text-xs italic text-gray-600">{msg.reference}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your document..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading || !selectedDocId}
            />
            <button
              type="submit"
              disabled={loading || !selectedDocId || !question.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat

