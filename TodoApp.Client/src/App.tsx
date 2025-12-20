import { useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim() === '') return
    
    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      completed: false
    }
    
    setTodos([...todos, newTodo])
    setInput('')
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
            Todo App
          </h1>
          <p className="text-slate-400 text-lg">Stay organized, stay productive</p>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              className="flex-1 px-5 py-3.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            />
            <button
              onClick={addTodo}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-95"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
          {todos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-400 text-lg font-medium">
                No tasks yet
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Add your first task above to get started
              </p>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {todos.map(todo => (
                  <li
                    key={todo.id}
                    className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                      todo.completed 
                        ? 'bg-slate-700/30 border-slate-600/30' 
                        : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-700/70 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="w-6 h-6 rounded-lg bg-slate-600 border-slate-500 text-purple-600 focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer transition-all checked:bg-gradient-to-r checked:from-purple-600 checked:to-pink-600"
                      />
                    </div>
                    <span
                      className={`flex-1 text-slate-100 transition-all ${
                        todo.completed
                          ? 'line-through text-slate-500'
                          : 'text-slate-200'
                      }`}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 px-4 py-2 text-sm font-medium bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all active:scale-95"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              
              {todos.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {todos.filter(t => t.completed).length} of {todos.length} completed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 rounded-full"
                          style={{ width: `${todos.length > 0 ? (todos.filter(t => t.completed).length / todos.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-slate-400 font-medium min-w-[3rem] text-right">
                        {Math.round((todos.filter(t => t.completed).length / todos.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
