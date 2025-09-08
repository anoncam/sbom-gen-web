'use client'

import { useState } from 'react'
import SBOMResults from './SBOMResults'
import VulnerabilityResults from './VulnerabilityResults'

interface ResultsDisplayProps {
  results: {
    image: string
    sboms: Record<string, any>
    vulnerabilities?: {
      grype?: any
      osv?: any
    }
    metadata?: {
      analyzedAt: string
      duration: number
    }
  }
  sessionId: string | null
}

export default function ResultsDisplay({ results, sessionId }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<'sbom' | 'vulnerabilities'>('sbom')

  return (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
            <p className="text-gray-400 mt-1">Image: <code className="text-primary">{results.image}</code></p>
          </div>
          {results.metadata && (
            <div className="text-sm text-gray-400">
              <p>Analyzed: {new Date(results.metadata.analyzedAt).toLocaleString()}</p>
              <p>Duration: {(results.metadata.duration / 1000).toFixed(2)}s</p>
            </div>
          )}
        </div>

        <div className="border-b border-white/10">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('sbom')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'sbom'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              SBOM Files
            </button>
            <button
              onClick={() => setActiveTab('vulnerabilities')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'vulnerabilities'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Vulnerabilities
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'sbom' && (
            <SBOMResults sboms={results.sboms} image={results.image} sessionId={sessionId} />
          )}
          {activeTab === 'vulnerabilities' && (
            <VulnerabilityResults 
              vulnerabilities={results.vulnerabilities || {}} 
              image={results.image}
              sessionId={sessionId}
            />
          )}
        </div>
      </div>
    </div>
  )
}