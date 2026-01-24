import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, Trash2, Sparkles, GripVertical, Settings, Edit3, ArrowUp, ArrowDown, X } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
const SortableTodoItem = ({ id, todo, index, isAdding, todosCount, onToggle, onDelete, onUpdate, onMove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSaveEdit = () => {
        if (editText.trim()) {
            onUpdate(todo.id, editText);
            setIsEditing(false);
            setIsMenuOpen(false);
        }
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 0 : (isMenuOpen ? 1000 : 1), // メニューが開いている時は最前面に
        position: 'relative',
        opacity: isDragging ? 0.3 : 1, // ドラッグ中は薄くする
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        background: todo.completed
            ? 'linear-gradient(135deg, rgba(46, 213, 115, 0.15), rgba(23, 192, 235, 0.1))'
            : 'rgba(255, 255, 255, 0.03)',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${todo.completed ? 'rgba(46, 213, 115, 0.3)' : 'var(--color-border)'}`,
        cursor: 'pointer',
        marginBottom: '8px',
        // touchAction: 'none' // Removed to allow scrolling
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            // listenersをここから削除
            className={`stagger-item ${isAdding && index === todosCount - 1 ? 'animate-bounce' : ''}`}
            onClick={() => !isDragging && !isEditing && !isMenuOpen && onToggle(todo.id)}
        >
            {/* Grip Icon (Drag Handle) */}
            <div
                {...listeners}
                style={{
                    color: '#888',
                    display: 'flex',
                    cursor: 'grab',
                    padding: '8px 4px',
                    marginLeft: '-8px',
                    touchAction: 'none'
                }}
            >
                <GripVertical size={20} />
            </div>

            {/* Checkbox */}
            <div
                className={`task-checkbox ${todo.completed ? 'checked' : ''}`}
                style={{
                    background: todo.completed
                        ? 'linear-gradient(135deg, #2ed573, #17c0eb)'
                        : 'transparent',
                    border: todo.completed ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
                    flexShrink: 0
                }}
            >
                {todo.completed && <Check size={14} color="white" strokeWidth={3} />}
            </div>

            {/* Task Text or Edit Input */}
            {isEditing ? (
                <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        style={{
                            flex: 1,
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid var(--color-primary)',
                            borderRadius: '4px',
                            color: 'white',
                            padding: '4px 8px',
                            fontSize: '0.95rem'
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') {
                                setIsEditing(false);
                                setEditText(todo.text);
                            }
                        }}
                    />
                    <button
                        onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }}
                        style={{ background: 'var(--color-primary)', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}
                    >
                        <Check size={16} color="white" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditText(todo.text); }}
                        style={{ background: '#555', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}
                    >
                        <X size={16} color="white" />
                    </button>
                </div>
            ) : (
                <span style={{
                    flex: 1,
                    fontSize: '0.95rem',
                    color: todo.completed ? 'var(--color-text-sub)' : 'var(--color-text-main)',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    transition: 'all var(--transition-fast)',
                    opacity: todo.completed ? 0.7 : 1,
                    userSelect: 'none'
                }}>
                    {todo.text}
                </span>
            )}

            {/* Settings Menu Button */}
            <div style={{ position: 'relative' }} ref={menuRef}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                    style={{
                        background: isMenuOpen ? 'rgba(255,255,255,0.1)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isMenuOpen ? 'white' : '#888',
                        transition: 'all var(--transition-fast)'
                    }}
                >
                    <Settings size={18} />
                </button>

                {/* Popup Menu */}
                {isMenuOpen && (
                    <div style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: '4px',
                        background: 'var(--color-bg-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        padding: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        zIndex: 100,
                        width: '140px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        animation: 'fadeIn 0.1s ease'
                    }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsEditing(true); setIsMenuOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', borderRadius: '4px', fontSize: '0.85rem' }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                            <Edit3 size={14} /> 編集
                        </button>

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2px 0' }} />

                        <button
                            onClick={(e) => { e.stopPropagation(); onMove(todo.id, 'up'); }}
                            disabled={index === 0}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'transparent', border: 'none', color: index === 0 ? '#555' : 'white', cursor: index === 0 ? 'default' : 'pointer', textAlign: 'left', borderRadius: '4px', fontSize: '0.85rem' }}
                            onMouseEnter={(e) => index !== 0 && (e.target.style.background = 'rgba(255,255,255,0.1)')}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                            <ArrowUp size={14} /> 上へ移動
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); onMove(todo.id, 'down'); }}
                            disabled={index === todosCount - 1}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'transparent', border: 'none', color: index === todosCount - 1 ? '#555' : 'white', cursor: index === todosCount - 1 ? 'default' : 'pointer', textAlign: 'left', borderRadius: '4px', fontSize: '0.85rem' }}
                            onMouseEnter={(e) => index !== todosCount - 1 && (e.target.style.background = 'rgba(255,255,255,0.1)')}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                            <ArrowDown size={14} /> 下へ移動
                        </button>

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2px 0' }} />

                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', textAlign: 'left', borderRadius: '4px', fontSize: '0.85rem' }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255,100,100,0.1)'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                            <Trash2 size={14} /> 削除
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ドラッグ中に表示されるオーバーレイ用コンポーネント
const TodoItemOverlay = ({ todo }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        background: 'rgba(50, 50, 50, 0.95)',
        borderRadius: 'var(--radius-md)',
        border: '2px solid var(--color-primary)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        width: '100%',
        cursor: 'grabbing',
        transform: 'scale(1.05)',
    }}>
        <GripVertical size={18} color="var(--color-primary)" />
        <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '4px'
        }} />
        <span style={{ flex: 1, color: 'white', fontSize: '0.95rem' }}>{todo.text}</span>
        <Trash2 size={16} color="#555" />
    </div>
);

export default function TodoList({ todos, onAdd, onToggle, onDelete, onReorder, onUpdate, onMove, progress }) {
    const [input, setInput] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, // スケジュール画面と同じ設定
                tolerance: 5, // スケジュール画面と同じ設定
            },
        })
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onAdd(input);
            setInput('');
            setIsAdding(true);
            setTimeout(() => setIsAdding(false), 300);
        }
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        if (over && active.id !== over.id) {
            onReorder(active.id, over.id);
        }
    };

    const activeTodo = activeId ? todos.find(t => t.id === activeId) : null;

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
                            opacity: input.trim() ? 1 : 0.5
                        }}
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </form>

            <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                ✨ カードを長押しして自由に並べ替え！
            </span>

            {/* Task List */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                maxHeight: '380px',
                overflowY: 'auto',
                paddingRight: '4px',
                paddingBottom: '100px' // メニューが見切れないように余白を追加
            }}>
                {todos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                        <Sparkles size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                        <p>タスクを追加して冒険を始めよう！</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragCancel={() => setActiveId(null)}
                    >
                        <SortableContext
                            items={todos.map(t => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {todos.map((todo, index) => (
                                <SortableTodoItem
                                    key={todo.id}
                                    id={todo.id}
                                    todo={todo}
                                    index={index}
                                    isAdding={isAdding}
                                    todosCount={todos.length}
                                    onToggle={onToggle}
                                    onDelete={onDelete}
                                    onUpdate={onUpdate}
                                    onMove={onMove}
                                />
                            ))}
                        </SortableContext>

                        <DragOverlay
                            dropAnimation={{
                                sideEffects: defaultDropAnimationSideEffects({
                                    styles: {
                                        active: {
                                            opacity: '0.5',
                                        },
                                    },
                                }),
                            }}
                        >
                            {activeId && activeTodo ? (
                                <TodoItemOverlay todo={activeTodo} />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
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
                            <Sparkles size={12} /> オールクリア！
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
