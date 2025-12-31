import type { Todo } from '../types/todo'
import { TodoItem } from './TodoItem'

interface TodoSectionProps {
  title: string
  todos: Todo[]
  collapsed: boolean
  onToggleCollapse: () => void
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
  color: 'blue' | 'green'
  className?: string
}

export function TodoSection({
  title,
  todos,
  collapsed,
  onToggleCollapse,
  editingId,
  editText,
  loading,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onEditTextChange,
  onEditKeyPress,
  color,
  className = ''
}: TodoSectionProps) {
  if (todos.length === 0) return null

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500'
  }

  return (
    <div className={className}>
      <button
        onClick={onToggleCollapse}
        className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity duration-200 group"
      >
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${colorClasses[color]}`}></div>
          {title} ({todos.length})
        </h2>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {!collapsed && (
        <ul className="space-y-2.5">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              editingId={editingId}
              editText={editText}
              loading={loading}
              onToggle={onToggle}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onDelete={onDelete}
              onEditTextChange={onEditTextChange}
              onEditKeyPress={onEditKeyPress}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

