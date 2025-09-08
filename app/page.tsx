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
      setCurrentStep('Validating container image...')
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
    <div className="min-h-screen bg-gradient-to-b from-background to-surface">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="gradient-text">Container Image Analysis</span>
            </h1>
            <p className="text-xl text-gray-400">
              Generate SBOMs and scan for vulnerabilities in container images
            </p>
          </div>

          <div className="glass-morphism rounded-2xl p-8 mb-8">
            <ContainerInput onAnalyze={handleAnalyze} disabled={loading} />
          </div>

          {error && (
            <div className="mb-8">
              <ErrorAlert message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {loading && (
            <div className="glass-morphism rounded-2xl p-12">
              <LoadingIndicator message={currentStep} />
            </div>
          )}

          {results && !loading && (
            <ResultsDisplay results={results} sessionId={sessionId} />
          )}
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>Powered by Syft, Grype, and OSV-Scanner</p>
        </div>
      </footer>
    </div>
  )
}