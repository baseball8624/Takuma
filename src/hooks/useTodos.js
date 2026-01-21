import { useState, useEffect } from 'react';

const STORAGE_KEY = 'self_hero_todos';
const LAST_OPENED_KEY = 'self_hero_last_date';

export function useTodos() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let initialTodos = saved ? JSON.parse(saved) : [];

    // Check if it's a new day
    const lastDate = localStorage.getItem(LAST_OPENED_KEY);
    const today = new Date().toDateString();

    // If date changed, reset completion status
    if (lastDate && lastDate !== today) {
      initialTodos = initialTodos.map(todo => ({
        ...todo,
        completed: false
      }));
    }

    return initialTodos;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    // Update last opened date
    localStorage.setItem(LAST_OPENED_KEY, new Date().toDateString());
  }, [todos]);

  const addTodo = (text) => {
    setTodos([
      ...todos,
      {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const getProgress = () => {
    if (todos.length === 0) return 0;
    const completedCount = todos.filter((t) => t.completed).length;
    return Math.round((completedCount / todos.length) * 100);
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  }

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    getProgress,
    clearCompleted
  };
}
