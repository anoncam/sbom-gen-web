'use client'

import { useState } from 'react'

interface ContainerInputProps {
  onAnalyze: (image: string) => void
  disabled?: boolean
}

export default function ContainerInput({ onAnalyze, disabled }: ContainerInputProps) {
  const [imageSpec, setImageSpec] = useState('')
  const [isValid, setIsValid] = useState(true)

  const validateImageSpec = (spec: string) => {
    const patterns = [
      /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/i,
      /^[a-z0-9]+(?:[._-][a-z0-9]+)*:[a-z0-9]+(?:[._-][a-z0-9]+)*$/i,
      /^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*:[a-z0-9]+(?:[._-][a-z0-9]+)*$/i,
      /^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\.[a-z]{2,})+(?::[0-9]+)?\/[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*(?::[a-z0-9]+(?:[._-][a-z0-9]+)*)?$/i,
    ]
    
    return patterns.some(pattern => pattern.test(spec))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!imageSpec.trim()) {
      setIsValid(false)
      return
    }

    if (!validateImageSpec(imageSpec)) {
      setIsValid(false)
      return
    }

    onAnalyze(imageSpec)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setImageSpec(value)
    if (value.trim()) {
      setIsValid(validateImageSpec(value))
    } else {
      setIsValid(true)
    }
  }

  const examples = [
    'alpine:latest',
    'nginx:1.21',
    'node:18-alpine',
    'ghcr.io/owner/image:tag',
    'docker.io/library/ubuntu:22.04'
  ]

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="image-input" className="block text-sm font-semibold text-gray-300 mb-3">
            Container Image Specification
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-hackerGreen font-mono">$</span>
            <input
              id="image-input"
              type="text"
              value={imageSpec}
              onChange={handleInputChange}
              placeholder="alpine:latest"
              disabled={disabled}
              className={`w-full pl-10 pr-4 py-3 bg-dark border rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-hackerGreen focus:ring-1 focus:ring-hackerGreen transition-colors font-mono ${
                !isValid 
                  ? 'border-red-500' 
                  : 'border-hackerGreen/20 hover:border-hackerGreen/40'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {!isValid && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {!isValid && (
            <p className="mt-2 text-sm text-red-500">
              Invalid OCI image specification
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled || !imageSpec.trim()}
          className={`w-full btn ${
            disabled || !imageSpec.trim()
              ? 'bg-darkGrey/50 text-gray-500 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {disabled ? 'ANALYZING...' : 'ANALYZE IMAGE'}
        </button>
      </form>

      <div className="pt-6 border-t border-hackerGreen/20">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Examples</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => setImageSpec(example)}
              disabled={disabled}
              className="px-3 py-1 text-xs bg-dark border border-hackerGreen/20 hover:border-hackerGreen/40 hover:bg-hackerGreen/5 rounded text-gray-400 hover:text-hackerGreen transition-all font-mono"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}