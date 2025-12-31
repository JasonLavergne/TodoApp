export function EmptyState() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center pointer-events-auto">
        <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-slate-700/50 flex items-center justify-center backdrop-blur-sm border border-slate-600/30">
          <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-100 text-lg font-semibold mb-1">
          No tasks yet
        </p>
        <p className="text-slate-500 text-sm">
          Add your first task above to get started
        </p>
      </div>
    </div>
  )
}

