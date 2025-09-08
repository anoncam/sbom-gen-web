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
    <div className="min-h-screen relative">
      <Header />
      
      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-black mb-6 glitch" data-text="SBOM Generator">
              <span className="gradient-text">SBOM Generator</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 terminal-text">
              <span className="text-green-400">$</span> analyze --container <span className="text-cyan-400">[image]</span> --scan-vulnerabilities
            </p>
            <div className="mt-4 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400">System Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400">Ready to Scan</span>
              </div>
            </div>
          </div>

          <div className="glass-morphism rounded-2xl p-8 mb-8 hover-lift">
            <ContainerInput onAnalyze={handleAnalyze} disabled={loading} />
          </div>

          {error && (
            <div className="mb-8">
              <ErrorAlert message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {loading && (
            <div className="glass-morphism rounded-2xl p-12 glow">
              <LoadingIndicator message={currentStep} />
            </div>
          )}

          {results && !loading && (
            <ResultsDisplay results={results} sessionId={sessionId} />
          )}
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 mt-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <div className="text-sm text-gray-500">
                <span className="text-gray-400 terminal-text">Powered by</span>
              </div>
              <div className="flex gap-6">
                <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300">
                  Syft
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300">
                  Grype
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300">
                  OSV-Scanner
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500 terminal-text">
              <span className="text-green-400">✓</span> Security Tools v1.0.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}