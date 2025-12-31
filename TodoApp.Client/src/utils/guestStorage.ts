import type { Todo } from '../types/todo'
import { GUEST_TODOS_KEY } from './constants'

export const getGuestTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(GUEST_TODOS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (err) {
    console.error('Error loading guest todos:', err)
  }
  return []
}

export const saveGuestTodos = (todos: Todo[]) => {
  try {
    localStorage.setItem(GUEST_TODOS_KEY, JSON.stringify(todos))
  } catch (err) {
    console.error('Error saving guest todos:', err)
  }
}

