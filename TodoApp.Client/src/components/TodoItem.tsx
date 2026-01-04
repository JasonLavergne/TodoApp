import type { Todo } from '../types/todo'

interface TodoItemProps {
  todo: Todo
  editingId: number | null
  editText: string
  loading: boolean
  onToggle: (id: number) => void
  onStartEdit: (id: number) => void
  onSaveEdit: (id: number) => void
  onCancelEdit: () => void
  onDelete: (id: number) => void
  onEditTextChange: (text: string) => void
  onEditKeyPress: (e: React.KeyboardEvent, id: number) => void
}

export function TodoItem({
  todo,
  editingId,
  editText,
  loading,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onEditTextChange,
  onEditKeyPress
}: TodoItemProps) {
  const isEditing = editingId === todo.id

  return (
    <li
      tabIndex={0}
      className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 ${
        todo.completed 
          ? 'bg-slate-700/20 border-slate-600/20' 
          : 'bg-slate-700/40 border-slate-600/40 hover:bg-slate-700/60 hover:border-slate-500/50'
      }`}
    >
      <div className="relative flex-shrink-0 flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          disabled={loading}
          className="w-5 h-5 rounded-md bg-slate-600/50 border-2 border-blue-500/60 accent-blue-600 focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer transition-all duration-200 checked:bg-blue-600 checked:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => onEditTextChange(e.target.value)}
          onKeyDown={(e) => onEditKeyPress(e, todo.id)}
          autoFocus
          className="flex-1 min-w-0 px-3 py-2.5 bg-slate-600/60 border border-blue-500/60 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all duration-200 text-base leading-normal"
        />
      ) : (
        <span
          className={`flex-1 min-w-0 px-3 py-2.5 border border-transparent rounded-lg transition-all duration-200 text-base leading-normal break-words ${
            todo.completed
              ? 'line-through text-slate-500'
              : 'text-slate-100'
          }`}
        >
          {todo.text}
        </span>
      )}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200">
        {isEditing ? (
          <>
            <button
              onClick={() => onSaveEdit(todo.id)}
              disabled={loading}
              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-green-500/20 hover:border-green-500/40"
              title="Save"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={onCancelEdit}
              disabled={loading}
              className="p-2 bg-slate-500/20 text-slate-400 rounded-lg hover:bg-slate-500/30 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-500/20 hover:border-slate-500/40"
              title="Cancel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onStartEdit(todo.id)}
              disabled={loading || todo.completed}
              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/20 hover:border-blue-500/40"
              title="Edit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              disabled={loading}
              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/20 hover:border-red-500/40"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      </div>
    </li>
  )
}

