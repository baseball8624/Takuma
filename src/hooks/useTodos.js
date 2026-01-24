import { useState, useEffect } from 'react';

const STORAGE_KEY = 'self_hero_todos';
const LAST_OPENED_KEY = 'self_hero_last_date';

export function useTodos() {
  const [todos, setTodos] = useState(() => {
    let initialTodos = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          initialTodos = parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load todos:', e);
    }

    // Check if it's a new day
    const lastDate = localStorage.getItem(LAST_OPENED_KEY);
    const today = new Date().toDateString();

    // If date changed, reset completion status
    if (lastDate && lastDate !== today && initialTodos.length > 0) {
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

  const reorderTodos = (activeId, overId) => {
    setTodos(prevTodos => {
      const oldIndex = prevTodos.findIndex(t => t.id === activeId);
      const newIndex = prevTodos.findIndex(t => t.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prevTodos;

      const result = [...prevTodos];
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      return result;
    });
  };

  const updateTodo = (id, newText) => {
    setTodos(todos.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const moveTodo = (id, direction) => {
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === todos.length - 1) return;

    const newTodos = [...todos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    [newTodos[index], newTodos[targetIndex]] = [newTodos[targetIndex], newTodos[index]];
    setTodos(newTodos);
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    getProgress,
    reorderTodos,
    updateTodo,
    moveTodo
  };
}
