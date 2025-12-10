import React, { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, XCircle, RotateCcw, ChevronLeft, ChevronRight, Sparkles, AlertCircle } from 'lucide-react'
import { generateFlashcards, listDocuments } from '../services/api'

function Flashcards() {
  const [documents, setDocuments] = useState([])
  const [selectedDocId, setSelectedDocId] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
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
      const result = await generateFlashcards(selectedDocId)
      setFlashcards(result.flashcards || [])
      setCurrentIndex(0)
      setFlipped(false)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate flashcards')
      console.error('Flashcard generation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setFlipped(false)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setFlipped(false)
    }
  }

  const currentCard = flashcards[currentIndex]

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Flashcards</h2>

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
          <button
            onClick={handleGenerate}
            disabled={loading || !selectedDocId}
            className="mt-4 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Flashcards
              </>
            )}
          </button>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}
        </div>

        {/* Flashcard Display */}
        {flashcards.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4 text-center text-sm text-gray-500">
              Card {currentIndex + 1} of {flashcards.length}
            </div>
            
            <div
              className="relative h-64 mb-6 cursor-pointer"
              onClick={() => setFlipped(!flipped)}
            >
              <div className="absolute inset-0 w-full h-full transition-opacity duration-300">
                {!flipped ? (
                  <div className="h-full bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-lg p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-primary-100 text-sm font-semibold mb-2">QUESTION</div>
                      <div className="text-white text-xl font-medium">{currentCard.q}</div>
                      <div className="text-primary-100 text-xs mt-4">Click to reveal answer</div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-green-100 text-sm font-semibold mb-2">ANSWER</div>
                      <div className="text-white text-xl font-medium">{currentCard.a}</div>
                      <div className="text-green-100 text-xs mt-4">Click to see question</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={prevCard}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Previous
              </button>
              
              <button
                onClick={() => setFlipped(!flipped)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Flip Card
              </button>
              
              <button
                onClick={nextCard}
                disabled={currentIndex === flashcards.length - 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        )}

        {flashcards.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Generate flashcards to start studying!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Flashcards

