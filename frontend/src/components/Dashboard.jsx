import React, { useState, useEffect } from 'react'
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { uploadDocument, listDocuments } from '../services/api'

function Dashboard() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [error, setError] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const docs = await listDocuments()
      setDocuments(docs)
    } catch (err) {
      console.error('Failed to load documents:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'message/rfc822']
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.pdf') || selectedFile.name.endsWith('.docx') || selectedFile.name.endsWith('.eml')) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Please upload a PDF, DOCX, or EML file')
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    try {
      setUploading(true)
      setError(null)
      const result = await uploadDocument(file)
      setUploadResult(result)
      setFile(null)
      document.getElementById('file-input').value = ''
      await loadDocuments()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload document')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Upload Study Material</h2>
        
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-input"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOCX, or EML (MAX. 100MB)</p>
              </div>
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.docx,.eml"
              />
            </label>
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-primary-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">{file.name}</span>
              </div>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {uploadResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Upload Successful!</span>
              </div>
              <p className="text-sm text-green-700">
                Document ID: <code className="bg-green-100 px-2 py-1 rounded">{uploadResult.context_id}</code>
              </p>
              <p className="text-sm text-green-700 mt-1">
                Filename: {uploadResult.filename} ({uploadResult.text_length} characters)
              </p>
              <p className="text-xs text-green-600 mt-2">
                You can now generate flashcards, quizzes, and ask questions about this document.
              </p>
            </div>
          )}
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Documents</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          ) : documents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.filename}</p>
                        <p className="text-sm text-gray-500">
                          {doc.text_length} characters • {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {doc.id.substring(0, 8)}...
                    </code>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

