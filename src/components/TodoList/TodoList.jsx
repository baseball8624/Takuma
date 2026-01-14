import React, { useState } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';

export default function TodoList({ todos, onAdd, onToggle, onDelete, progress }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onAdd(input);
        setInput('');
    };

    return (
        <div className="todo-section">
            <div className="progress-bar-container" style={{
                height: '8px',
                background: '#E0E0E0',
                borderRadius: '99px',
                margin: '1rem 0',
                overflow: 'hidden'
            }}>
                <div
                    className="progress-fill"
                    style={{
                        width: `${progress}%`,
                        background: 'var(--color-primary)',
                        height: '100%',
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="新しいタスク..."
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid transparent',
                        background: 'white',
                        boxShadow: 'var(--shadow-sm)',
                        fontSize: '1rem',
                        outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '0 16px', borderRadius: '12px' }}
                >
                    <Plus />
                </button>
            </form>

            <div className="list-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        className="todo-item card"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '16px',
                            margin: 0,
                            gap: '12px',
                            opacity: todo.completed ? 0.6 : 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        <div
                            onClick={() => onToggle(todo.id)}
                            style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                border: `2px solid ${todo.completed ? 'var(--color-success)' : '#ddd'}`,
                                background: todo.completed ? 'var(--color-success)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'white'
                            }}
                        >
                            {todo.completed && <Check size={16} />}
                        </div>

                        <span style={{
                            flex: 1,
                            textDecoration: todo.completed ? 'line-through' : 'none'
                        }}>
                            {todo.text}
                        </span>

                        <button
                            onClick={() => onDelete(todo.id)}
                            style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                {todos.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#999', margin: '2rem 0' }}>
                        タスクはまだありません。<br />今日やることを追加しましょう！
                    </p>
                )}
            </div>
        </div>
    );
}
