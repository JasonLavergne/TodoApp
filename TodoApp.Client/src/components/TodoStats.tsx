import type { Todo } from '../types/todo'

interface TodoStatsProps {
  todos: Todo[]
}

export function TodoStats({ todos }: TodoStatsProps) {
  const completedCount = todos.filter(t => t.completed).length
  const totalCount = todos.length
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="mb-6 pb-6 border-b border-slate-700/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-sm">
          <div className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-slate-400 font-medium">
            {completedCount} of {totalCount} completed
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none h-2.5 w-32 bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 rounded-full"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <span className="text-slate-400 font-semibold min-w-[3.5rem] text-right text-sm">
            {completionPercentage}%
          </span>
        </div>
      </div>
    </div>
  )
}

