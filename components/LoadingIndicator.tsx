interface LoadingIndicatorProps {
  message?: string
}

export default function LoadingIndicator({ message = 'Processing...' }: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-white">{message}</p>
        <p className="text-sm text-gray-400 mt-2">This may take a few moments...</p>
      </div>
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  )
}