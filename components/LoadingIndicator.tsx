interface LoadingIndicatorProps {
  message?: string
}

export default function LoadingIndicator({ message = 'Processing...' }: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-24 h-24 relative">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-purple-400 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-4 border-4 border-transparent border-t-pink-400 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 terminal-text">
          {message}
        </p>
        <div className="flex items-center justify-center space-x-1">
          <span className="text-xs text-gray-500 terminal-text">Processing</span>
          <div className="loading-dots flex space-x-1">
            <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
            <span className="w-1 h-1 bg-pink-400 rounded-full"></span>
          </div>
        </div>
      </div>
      <div className="w-full max-w-xs">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  )
}