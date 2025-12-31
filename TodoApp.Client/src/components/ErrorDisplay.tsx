interface ErrorDisplayProps {
  error: string
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6 text-center backdrop-blur-sm">
      <p className="text-red-400 font-medium">{error}</p>
    </div>
  )
}

