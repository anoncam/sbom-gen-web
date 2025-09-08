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
    // Basic validation for OCI image format
    const patterns = [
      /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/i, // Simple image name
      /^[a-z0-9]+(?:[._-][a-z0-9]+)*:[a-z0-9]+(?:[._-][a-z0-9]+)*$/i, // image:tag
      /^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*:[a-z0-9]+(?:[._-][a-z0-9]+)*$/i, // registry/image:tag
      /^[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\.[a-z]{2,})+(?::[0-9]+)?\/[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)*(?::[a-z0-9]+(?:[._-][a-z0-9]+)*)?$/i, // Full registry URL
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="image-input" className="block text-sm font-medium text-gray-300 mb-2">
            Container Image
          </label>
          <div className="relative">
            <input
              id="image-input"
              type="text"
              value={imageSpec}
              onChange={handleInputChange}
              placeholder="alpine:latest"
              disabled={disabled}
              className={`w-full px-4 py-3 bg-surface border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                !isValid 
                  ? 'border-danger focus:ring-danger' 
                  : 'border-white/20 focus:ring-primary focus:border-primary'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {!isValid && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-danger" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {!isValid && (
            <p className="mt-2 text-sm text-danger">
              Please enter a valid OCI image specification
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled || !imageSpec.trim()}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition transform hover:scale-[1.02] ${
            disabled || !imageSpec.trim()
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/50'
          }`}
        >
          {disabled ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </form>

      <div className="pt-4 border-t border-white/10">
        <p className="text-sm text-gray-400 mb-3">Examples:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => setImageSpec(example)}
              disabled={disabled}
              className="px-3 py-1 text-xs bg-surface-light hover:bg-white/10 rounded-full text-gray-300 transition"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}