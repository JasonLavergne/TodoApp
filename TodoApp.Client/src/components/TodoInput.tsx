import { useRef, useEffect } from 'react'

interface TodoInputProps {
  input: string
  initialLoading: boolean
  onInputChange: (value: string) => void
  onAdd: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
}

export function TodoInput({ input, initialLoading, onInputChange, onAdd, onKeyPress }: TodoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [initialLoading])

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 sm:px-6 py-4 z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="What needs to be done?"
            disabled={initialLoading}
            className="flex-1 min-w-0 px-5 py-2.5 bg-slate-700/40 border border-slate-600/40 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-inner"
          />
          <button
            onClick={onAdd}
            disabled={initialLoading || input.trim() === ''}
            className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 shrink-0"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

