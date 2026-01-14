import { useState, useEffect } from 'react';

const STORAGE_KEY = 'self_hero_todos';

export function useTodos() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
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
