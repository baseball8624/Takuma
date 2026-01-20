import React, { useState } from 'react';
import { Plus, Check, Trash2, Sparkles } from 'lucide-react';

export default function TodoList({ todos, onAdd, onToggle, onDelete, progress }) {
    const [input, setInput] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onAdd(input);
            setInput('');
            setIsAdding(true);
            setTimeout(() => setIsAdding(false), 300);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Progress Bar */}
            <div className="progress-bar" style={{ marginBottom: '1.25rem' }}>
                <div
                    className="progress-bar-fill"
                    style={{
                        width: `${progress}%`,
                        background: progress === 100
                            ? 'linear-gradient(90deg, #2ed573, #17c0eb)'
                            : 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))'
                    }}
                />
            </div>

            {/* Add Task Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    transition: 'all var(--transition-fast)'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="新しいタスクを追加..."
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-main)',
                            fontSize: '0.95rem',
                            padding: '8px 12px',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        style={{
                            background: input.trim()
                                ? 'linear-gradient(135deg, var(--color-primary), #d4145a)'
                                : 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 16px',
                            cursor: input.trim() ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: 'white',
                            fontFamily: 'inherit',
                            fontSize: '0.85rem',
                            transition: 'all var(--transition-fast)',
                            opacity: input.trim() ? 1 : 0.5
                        }}
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </form>

            {/* Task List */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '350px',
                overflowY: 'auto',
                paddingRight: '4px'
            }}>
                {todos.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.9rem'
                    }}>
                        <Sparkles size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                        <p>タスクを追加して冒険を始めよう！</p>
                    </div>
                ) : (
                    todos.map((todo, index) => (
                        <div
                            key={todo.id}
                            className={`stagger-item ${isAdding && index === todos.length - 1 ? 'animate-bounce' : ''}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 16px',
                                background: todo.completed
                                    ? 'linear-gradient(135deg, rgba(46, 213, 115, 0.15), rgba(23, 192, 235, 0.1))'
                                    : 'rgba(255, 255, 255, 0.03)',
                                borderRadius: 'var(--radius-md)',
                                border: `1px solid ${todo.completed ? 'rgba(46, 213, 115, 0.3)' : 'var(--color-border)'}`,
                                transition: 'all var(--transition-normal)',
                                transform: todo.completed ? 'scale(0.98)' : 'scale(1)',
                                cursor: 'pointer'
                            }}
                            onClick={() => onToggle(todo.id)}
                        >
                            {/* Checkbox */}
                            <div
                                className={`task-checkbox ${todo.completed ? 'checked' : ''}`}
                                style={{
                                    background: todo.completed
                                        ? 'linear-gradient(135deg, #2ed573, #17c0eb)'
                                        : 'transparent',
                                    border: todo.completed ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
                                }}
                            >
                                {todo.completed && <Check size={14} color="white" strokeWidth={3} />}
                            </div>

                            {/* Task Text */}
                            <span style={{
                                flex: 1,
                                fontSize: '0.95rem',
                                color: todo.completed ? 'var(--color-text-sub)' : 'var(--color-text-main)',
                                textDecoration: todo.completed ? 'line-through' : 'none',
                                transition: 'all var(--transition-fast)',
                                opacity: todo.completed ? 0.7 : 1
                            }}>
                                {todo.text}
                            </span>

                            {/* Delete Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(todo.id);
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    borderRadius: 'var(--radius-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0.4,
                                    transition: 'all var(--transition-fast)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = '1';
                                    e.currentTarget.style.background = 'rgba(255, 71, 87, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = '0.4';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <Trash2 size={16} color="#ff4757" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Completed Count */}
            {todos.length > 0 && (
                <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-sub)'
                }}>
                    <span>{todos.filter(t => t.completed).length} / {todos.length} 完了</span>
                    {progress === 100 && (
                        <span className="badge badge-success" style={{ animation: 'pulse 2s infinite' }}>
                            <Sparkles size={12} />
                            オールクリア！
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
