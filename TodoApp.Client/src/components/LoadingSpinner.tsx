export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center pointer-events-auto">
        <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-slate-700/50 flex items-center justify-center backdrop-blur-sm border border-slate-600/30">
          <svg className="w-10 h-10 text-slate-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-slate-100 text-lg font-semibold mb-1">
          Loading todos...
        </p>
        <p className="text-slate-500 text-sm">
          Please wait
        </p>
      </div>
    </div>
  )
}

