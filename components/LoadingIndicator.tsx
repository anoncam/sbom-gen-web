interface LoadingIndicatorProps {
  message?: string
}

export default function LoadingIndicator({ message = 'Processing...' }: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-darkGrey rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-hackerGreen rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-hackerGreen terminal-cursor">
          {message}
        </p>
        <p className="text-sm text-gray-500 mt-2">Please wait...</p>
      </div>
    </div>
  )
}