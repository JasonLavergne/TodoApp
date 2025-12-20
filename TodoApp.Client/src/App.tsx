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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Todo App
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={addTodo}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No todos yet. Add one above!
            </p>
          ) : (
            <ul className="space-y-2">
              {todos.map(todo => (
                <li
                  key={todo.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    todo.completed 
                      ? 'bg-gray-50' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {todos.length > 0 && (
          <div className="mt-4 text-center text-gray-600">
            <p>
              {todos.filter(t => !t.completed).length} of {todos.length} tasks remaining
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
