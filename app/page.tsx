'use client'

import { useState } from 'react'
import ContainerInput from '@/components/ContainerInput'
import ResultsDisplay from '@/components/ResultsDisplay'
import LoadingIndicator from '@/components/LoadingIndicator'
import Header from '@/components/Header'
import ErrorAlert from '@/components/ErrorAlert'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState<string>('')
  const [sessionId, setSessionId] = useState<string | null>(null)

  const handleAnalyze = async (imageSpec: string) => {
    setLoading(true)
    setError(null)
    setResults(null)
    
    try {
      setCurrentStep('Initializing analysis...')
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageSpec }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      const data = await response.json()
      setSessionId(data.sessionId)
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
      setCurrentStep('')
    }
  }

  return (
    <div className="min-h-screen bg-dark matrix-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-hackerGreen">#!</span> SBOM GENERATOR
            </h1>
            <p className="text-xl text-gray-400 font-mono">
              Container Security Analysis Platform
            </p>
          </div>

          <div className="glass-panel rounded-lg p-8 mb-8 border border-hackerGreen/20 hover-lift">
            <ContainerInput onAnalyze={handleAnalyze} disabled={loading} />
          </div>

          {error && (
            <div className="mb-8">
              <ErrorAlert message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {loading && (
            <div className="glass-panel rounded-lg p-12 border border-hackerGreen/20">
              <LoadingIndicator message={currentStep} />
            </div>
          )}

          {results && !loading && (
            <ResultsDisplay results={results} sessionId={sessionId} />
          )}
        </div>
      </main>

      <footer className="border-t border-hackerGreen/20 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <span className="text-xs px-3 py-1 bg-hackerGreen/10 border border-hackerGreen/30 text-hackerGreen rounded">
              Syft
            </span>
            <span className="text-xs px-3 py-1 bg-hackerGreen/10 border border-hackerGreen/30 text-hackerGreen rounded">
              Grype
            </span>
            <span className="text-xs px-3 py-1 bg-hackerGreen/10 border border-hackerGreen/30 text-hackerGreen rounded">
              OSV-Scanner
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Security Tools Integrated
          </p>
        </div>
      </footer>
    </div>
  )
}