'use client'

import { useState } from 'react'

interface ContainerInputProps {
  onAnalyze: (image: string) => void
  disabled?: boolean
}

export default function ContainerInput({ onAnalyze, disabled }: ContainerInputProps) {
  const [imageSpec, setImageSpec] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [isFocused, setIsFocused] = useState(false)

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
    { name: 'alpine:latest', color: 'from-blue-500 to-cyan-500' },
    { name: 'nginx:1.21', color: 'from-green-500 to-emerald-500' },
    { name: 'node:18-alpine', color: 'from-purple-500 to-pink-500' },
    { name: 'ghcr.io/owner/image:tag', color: 'from-orange-500 to-red-500' },
    { name: 'docker.io/library/ubuntu:22.04', color: 'from-indigo-500 to-purple-500' }
  ]

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="image-input" className="block text-sm font-medium text-gray-300 mb-3 terminal-text">
            <span className="text-cyan-400">›</span> Container Image Specification
          </label>
          <div className="relative group">
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${isFocused ? 'from-cyan-500 to-purple-500' : 'from-gray-600 to-gray-700'} rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300`}></div>
            <input
              id="image-input"
              type="text"
              value={imageSpec}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="alpine:latest"
              disabled={disabled}
              className={`relative w-full px-6 py-4 bg-black/80 border rounded-lg text-white placeholder-gray-600 focus:outline-none transition-all duration-300 terminal-text text-lg ${
                !isValid 
                  ? 'border-red-500/50 text-red-400' 
                  : isFocused
                  ? 'border-cyan-500/50 text-cyan-300'
                  : 'border-white/10 hover:border-white/20'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                textShadow: isFocused ? '0 0 10px rgba(0, 255, 255, 0.5)' : 'none'
              }}
            />
            {!isValid && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {imageSpec && isValid && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-green-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {!isValid && (
            <p className="mt-3 text-sm text-red-400 terminal-text animate-pulse">
              <span className="text-red-500">✗</span> Invalid OCI image specification format
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled || !imageSpec.trim()}
          className={`w-full relative group ${
            disabled || !imageSpec.trim()
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
          <div className={`relative px-8 py-4 bg-black rounded-lg leading-none flex items-center justify-center space-x-3 ${
            disabled || !imageSpec.trim() ? '' : 'hover:bg-gray-900'
          } transition-all duration-300`}>
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 uppercase tracking-wider">
              {disabled ? 'Analyzing...' : 'Analyze Container'}
            </span>
            {!disabled && (
              <svg className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </div>
        </button>
      </form>

      <div className="pt-6 border-t border-white/5">
        <p className="text-xs text-gray-500 mb-4 terminal-text uppercase tracking-wider">
          <span className="text-cyan-400">›</span> Quick Examples
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {examples.map((example) => (
            <button
              key={example.name}
              onClick={() => setImageSpec(example.name)}
              disabled={disabled}
              className="group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${example.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              <div className="relative px-3 py-2 bg-black/50 hover:bg-black/70 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300">
                <span className="text-xs text-gray-400 group-hover:text-white terminal-text block truncate">
                  {example.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}