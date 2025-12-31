import { useState } from 'react'
import { Header } from './components/Header'
import { useAuth } from './contexts/AuthContext'
import { useTodos } from './hooks/useTodos'
import { GuestWarning } from './components/GuestWarning'
import { ErrorDisplay } from './components/ErrorDisplay'
import { LoadingSpinner } from './components/LoadingSpinner'
import { EmptyState } from './components/EmptyState'
import { TodoStats } from './components/TodoStats'
import { TodoSection } from './components/TodoSection'
import { TodoInput } from './components/TodoInput'

function App() {
  const { user, isAuthenticated } = useAuth()
  const [input, setInput] = useState('')
  const [activeCollapsed, setActiveCollapsed] = useState(false)
  const [completedCollapsed, setCompletedCollapsed] = useState(false)

  const {
    todos,
    activeTodos,
    completedTodos,
    loading,
    initialLoading,
    error,
    editingId,
    editText,
    guestWarningDismissed,
    addTodo,
    toggleTodo,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteTodo,
    dismissGuestWarning,
    setEditText
  } = useTodos({ isAuthenticated, userId: user?.id })

  const handleAddTodo = async () => {
    await addTodo(input)
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  const handleEditKeyPress = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') {
      saveEdit(id)
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-[5.5rem] pb-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {!isAuthenticated && !guestWarningDismissed && (
            <GuestWarning onDismiss={dismissGuestWarning} />
          )}

          {error && <ErrorDisplay error={error} />}

          <div>
            {initialLoading && todos.length === 0 ? (
              <LoadingSpinner />
            ) : todos.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {todos.length > 0 && <TodoStats todos={todos} />}

                {activeTodos.length > 0 && (
                  <TodoSection
                    title="Active"
                    todos={activeTodos}
                    collapsed={activeCollapsed}
                    onToggleCollapse={() => setActiveCollapsed(!activeCollapsed)}
                    editingId={editingId}
                    editText={editText}
                    loading={loading}
                    onToggle={toggleTodo}
                    onStartEdit={startEdit}
                    onSaveEdit={saveEdit}
                    onCancelEdit={cancelEdit}
                    onDelete={deleteTodo}
                    onEditTextChange={setEditText}
                    onEditKeyPress={handleEditKeyPress}
                    color="blue"
                    className="mb-6"
                  />
                )}

                {completedTodos.length > 0 && (
                  <TodoSection
                    title="Completed"
                    todos={completedTodos}
                    collapsed={completedCollapsed}
                    onToggleCollapse={() => setCompletedCollapsed(!completedCollapsed)}
                    editingId={editingId}
                    editText={editText}
                    loading={loading}
                    onToggle={toggleTodo}
                    onStartEdit={startEdit}
                    onSaveEdit={saveEdit}
                    onCancelEdit={cancelEdit}
                    onDelete={deleteTodo}
                    onEditTextChange={setEditText}
                    onEditKeyPress={handleEditKeyPress}
                    color="green"
                    className={activeTodos.length > 0 ? 'pt-6 border-t border-slate-700/50' : ''}
                  />
                )}

                {activeTodos.length === 0 && completedTodos.length === 0 && (
                  <EmptyState />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <TodoInput
        input={input}
        initialLoading={initialLoading}
        isAuthenticated={isAuthenticated}
        onInputChange={setInput}
        onAdd={handleAddTodo}
        onKeyPress={handleKeyPress}
      />
    </div>
  )
}

export default App
