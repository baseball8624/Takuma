import React, { useState, useMemo } from 'react';
import { Clock, RefreshCcw, Plus, Trash2, Edit3, PieChart, Palette } from 'lucide-react';

// Color palette for tasks (user can pick from these)
const AVAILABLE_COLORS = [
    { id: 'red', color: '#FF6B6B', name: '赤' },
    { id: 'cyan', color: '#4ECDC4', name: '水色' },
    { id: 'yellow', color: '#FFE66D', name: '黄' },
    { id: 'mint', color: '#95E1D3', name: 'ミント' },
    { id: 'coral', color: '#F38181', name: 'コーラル' },
    { id: 'purple', color: '#AA96DA', name: '紫' },
    { id: 'pink', color: '#FCBAD3', name: 'ピンク' },
    { id: 'blue', color: '#A8D8EA', name: '青' },
    { id: 'orange', color: '#FFB347', name: 'オレンジ' },
    { id: 'sky', color: '#87CEEB', name: '空色' },
];

const SCHEDULE_TEMPLATES = [
    { id: 'balance', name: 'バランス型', desc: '攻守最強の安定スタイル', breakRatio: 0.15 },
    { id: 'spartan', name: 'スパルタ型', desc: '経験値効率重視の修羅の道', breakRatio: 0.05 },
    { id: 'chill', name: 'ゆとり型', desc: 'HP管理優先の安全策', breakRatio: 0.25 },
];

// Round to nearest 30 minutes
const roundTo30Min = (minutes) => {
    return Math.round(minutes / 30) * 30;
};

const formatTime = (totalMinutes) => {
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export default function ScheduleWizard({ presets = [], onAddPreset, onUpdatePreset }) {
    const [wakeTime, setWakeTime] = useState('07:00');
    const [bedTime, setBedTime] = useState('23:00');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDuration, setNewTaskDuration] = useState(30);
    const [newTaskColor, setNewTaskColor] = useState(AVAILABLE_COLORS[0].color);
    const [showChart, setShowChart] = useState(false);
    const [editingPresetId, setEditingPresetId] = useState(null);

    const toggleTaskSelection = (preset) => {
        if (selectedTasks.find(t => t.id === preset.id)) {
            setSelectedTasks(selectedTasks.filter(t => t.id !== preset.id));
        } else {
            const roundedDuration = roundTo30Min(preset.duration) || 30;
            setSelectedTasks([...selectedTasks, { ...preset, duration: roundedDuration }]);
        }
    };

    const generateSchedule = () => {
        if (selectedTasks.length === 0) {
            alert('タスクを選択してください');
            return;
        }

        const template = SCHEDULE_TEMPLATES[Math.floor(Math.random() * SCHEDULE_TEMPLATES.length)];
        setSelectedTemplate(template);

        const [wakeH, wakeM] = wakeTime.split(':').map(Number);
        const [bedH, bedM] = bedTime.split(':').map(Number);

        const wakeMinutes = wakeH * 60 + wakeM;
        const bedMinutes = bedH * 60 + bedM;
        const totalMinutes = ((bedMinutes - wakeMinutes) + 1440) % 1440;
        const taskTotalMinutes = selectedTasks.reduce((sum, t) => sum + t.duration, 0);
        const freeMinutes = totalMinutes - taskTotalMinutes - 60;

        let currentMinutes = roundTo30Min(wakeMinutes);
        const items = [];

        items.push({
            time: formatTime(currentMinutes),
            title: '起床・準備',
            duration: 30,
            editable: false,
            color: '#888',
            type: 'system'
        });
        currentMinutes += 30;

        const breakDuration = roundTo30Min(Math.max(30, (freeMinutes * template.breakRatio) / (selectedTasks.length + 1)));
        const fillerDuration = roundTo30Min(Math.max(30, (freeMinutes * (1 - template.breakRatio)) / (selectedTasks.length + 1)));

        selectedTasks.forEach((task, idx) => {
            if (fillerDuration >= 30) {
                items.push({
                    id: `free-${idx}`,
                    time: formatTime(currentMinutes),
                    title: idx === 0 ? '朝活タイム' : '自由時間',
                    duration: fillerDuration,
                    editable: true,
                    color: '#555',
                    type: 'free'
                });
                currentMinutes += fillerDuration;
            }

            const taskDuration = roundTo30Min(task.duration) || 30;
            items.push({
                id: `task-${task.id}-${idx}`,
                time: formatTime(currentMinutes),
                title: task.name,
                duration: taskDuration,
                editable: true,
                color: task.color || AVAILABLE_COLORS[idx % AVAILABLE_COLORS.length].color,
                type: 'task'
            });
            currentMinutes += taskDuration;

            if (breakDuration >= 30 && idx < selectedTasks.length - 1) {
                items.push({
                    id: `break-${idx}`,
                    time: formatTime(currentMinutes),
                    title: '休憩',
                    duration: breakDuration,
                    editable: true,
                    color: '#4ECDC4',
                    type: 'break'
                });
                currentMinutes += breakDuration;
            }
        });

        const remainingMinutes = roundTo30Min(bedMinutes - currentMinutes - 30);
        if (remainingMinutes >= 30) {
            items.push({
                id: 'evening-free',
                time: formatTime(currentMinutes),
                title: '夜のリラックスタイム',
                duration: remainingMinutes,
                editable: true,
                color: '#9B59B6',
                type: 'free'
            });
        }

        items.push({
            time: bedTime,
            title: '就寝',
            duration: 0,
            editable: false,
            color: '#888',
            type: 'system'
        });

        setSchedule(items);
    };

    const updateScheduleItem = (index, field, value) => {
        const newSchedule = [...schedule];
        if (field === 'duration') {
            value = roundTo30Min(parseInt(value) || 30);
        }
        newSchedule[index] = { ...newSchedule[index], [field]: value };
        setSchedule(newSchedule);
    };

    const deleteScheduleItem = (index) => {
        setSchedule(schedule.filter((_, i) => i !== index));
    };

    const handleAddNewPreset = () => {
        if (newTaskName.trim() && onAddPreset) {
            const roundedDuration = roundTo30Min(parseInt(newTaskDuration) || 30);
            onAddPreset(newTaskName, roundedDuration, newTaskColor);
            setNewTaskName('');
            setNewTaskDuration(30);
            setNewTaskColor(AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)].color);
        }
    };

    const handleUpdatePresetColor = (presetId, newColor) => {
        if (onUpdatePreset) {
            onUpdatePreset(presetId, { color: newColor });
        }
        setEditingPresetId(null);
    };

    const resetSchedule = () => {
        setSchedule([]);
        setSelectedTemplate(null);
    };

    const pieData = useMemo(() => {
        const total = schedule.reduce((sum, item) => sum + (item.duration || 0), 0);
        if (total === 0) return [];

        let cumulative = 0;
        return schedule.filter(item => item.duration > 0).map(item => {
            const start = cumulative;
            cumulative += (item.duration / total) * 360;
            return { ...item, startAngle: start, endAngle: cumulative };
        });
    }, [schedule]);

    const renderPieChart = () => {
        const size = 200;
        const center = size / 2;
        const radius = size / 2 - 10;

        return (
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <svg width={size} height={size} style={{ margin: '0 auto', display: 'block' }}>
                    {pieData.map((slice, i) => {
                        const startRad = (slice.startAngle - 90) * Math.PI / 180;
                        const endRad = (slice.endAngle - 90) * Math.PI / 180;
                        const largeArc = slice.endAngle - slice.startAngle > 180 ? 1 : 0;
                        const x1 = center + radius * Math.cos(startRad);
                        const y1 = center + radius * Math.sin(startRad);
                        const x2 = center + radius * Math.cos(endRad);
                        const y2 = center + radius * Math.sin(endRad);
                        const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                        return <path key={i} d={path} fill={slice.color} stroke="var(--color-bg-card)" strokeWidth="2" />;
                    })}
                    <circle cx={center} cy={center} r={radius * 0.4} fill="var(--color-bg-card)" />
                </svg>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
                    {schedule.filter(s => s.duration > 0).map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
                            <div style={{ width: '10px', height: '10px', background: item.color, borderRadius: '2px' }} />
                            {item.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="card" style={{ border: '2px solid var(--color-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                <Clock size={24} color="var(--color-secondary)" />
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0 }}>戦術プラン作成</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>30分単位・色カスタム可能</p>
                </div>
                {schedule.length > 0 && (
                    <button onClick={() => setShowChart(!showChart)} style={{ background: 'none', border: '2px solid var(--color-accent)', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}>
                        <PieChart size={18} color="var(--color-accent)" />
                    </button>
                )}
            </div>

            {schedule.length === 0 ? (
                <>
                    {/* Time Settings */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', display: 'block', marginBottom: '4px' }}>START</label>
                            <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} step="1800"
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '2px solid #555', background: '#000', color: 'white', fontFamily: 'inherit', fontSize: '1rem' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', display: 'block', marginBottom: '4px' }}>END</label>
                            <input type="time" value={bedTime} onChange={e => setBedTime(e.target.value)} step="1800"
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '2px solid #555', background: '#000', color: 'white', fontFamily: 'inherit', fontSize: '1rem' }} />
                        </div>
                    </div>

                    {/* Task Selection with Color */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--color-accent)', display: 'block', marginBottom: '8px' }}>
                            📋 やることリスト（タップで選択・長押しで色変更）
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {presets.map(preset => {
                                const isSelected = selectedTasks.find(t => t.id === preset.id);
                                const displayDuration = roundTo30Min(preset.duration) || 30;
                                const presetColor = preset.color || AVAILABLE_COLORS[0].color;

                                return (
                                    <div key={preset.id} style={{ position: 'relative' }}>
                                        <button
                                            onClick={() => toggleTaskSelection(preset)}
                                            onContextMenu={(e) => { e.preventDefault(); setEditingPresetId(preset.id); }}
                                            style={{
                                                padding: '8px 12px',
                                                background: isSelected ? presetColor : 'rgba(255,255,255,0.1)',
                                                border: isSelected ? '2px solid white' : `2px solid ${presetColor}`,
                                                borderRadius: '4px',
                                                color: 'white',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                fontFamily: 'inherit',
                                                boxShadow: isSelected ? '2px 2px 0 rgba(0,0,0,0.3)' : 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <div style={{ width: '12px', height: '12px', background: presetColor, borderRadius: '2px', border: '1px solid rgba(255,255,255,0.5)' }} />
                                            {preset.name} ({displayDuration}分)
                                        </button>

                                        {/* Color picker popup */}
                                        {editingPresetId === preset.id && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                background: 'var(--color-bg-card)',
                                                border: '2px solid white',
                                                borderRadius: '8px',
                                                padding: '8px',
                                                zIndex: 100,
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '4px',
                                                width: '150px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                            }}>
                                                {AVAILABLE_COLORS.map(c => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => handleUpdatePresetColor(preset.id, c.color)}
                                                        style={{
                                                            width: '28px',
                                                            height: '28px',
                                                            background: c.color,
                                                            border: preset.color === c.color ? '2px solid white' : '2px solid transparent',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer'
                                                        }}
                                                        title={c.name}
                                                    />
                                                ))}
                                                <button
                                                    onClick={() => setEditingPresetId(null)}
                                                    style={{ width: '100%', marginTop: '4px', padding: '4px', background: '#555', border: 'none', borderRadius: '4px', color: 'white', fontSize: '0.7rem', cursor: 'pointer' }}
                                                >
                                                    閉じる
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add new preset with color picker */}
                        <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                                <input type="text" placeholder="新しいタスク名" value={newTaskName} onChange={e => setNewTaskName(e.target.value)}
                                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '2px solid #555', background: '#000', color: 'white', fontFamily: 'inherit', fontSize: '0.85rem' }} />
                                <select value={newTaskDuration} onChange={e => setNewTaskDuration(e.target.value)}
                                    style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '2px solid #555', background: '#000', color: 'white', fontFamily: 'inherit', fontSize: '0.85rem' }}>
                                    <option value={30}>30分</option>
                                    <option value={60}>60分</option>
                                    <option value={90}>90分</option>
                                    <option value={120}>120分</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Palette size={16} color="#888" />
                                <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                                    {AVAILABLE_COLORS.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => setNewTaskColor(c.color)}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                background: c.color,
                                                border: newTaskColor === c.color ? '2px solid white' : '2px solid transparent',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                                <button onClick={handleAddNewPreset} className="btn btn-secondary" style={{ padding: '6px 12px' }}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <button onClick={generateSchedule} className="btn btn-primary" style={{ width: '100%', fontWeight: 'bold' }} disabled={selectedTasks.length === 0}>
                        AIにスケジュールを組んでもらう ({selectedTasks.length}個)
                    </button>
                </>
            ) : (
                <div className="animate-pop">
                    <div style={{ textAlign: 'center', marginBottom: '1rem', padding: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#ccc' }}>プランタイプ</span>
                        <h4 style={{ color: 'var(--color-accent)', fontSize: '1.2rem', marginTop: '2px', marginBottom: '0' }}>{selectedTemplate?.name}</h4>
                        <p style={{ fontSize: '0.7rem', color: '#888', margin: 0 }}>{selectedTemplate?.desc}</p>
                    </div>

                    {showChart && renderPieChart()}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
                        {schedule.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', borderLeft: `4px solid ${item.color}` }}>
                                {isEditing && item.editable ? (
                                    <>
                                        <input type="time" value={item.time} onChange={e => updateScheduleItem(idx, 'time', e.target.value)} step="1800"
                                            style={{ width: '75px', padding: '4px', borderRadius: '4px', border: '1px solid #555', background: '#000', color: 'var(--color-accent)', fontFamily: 'monospace', fontSize: '0.8rem' }} />
                                        <input type="text" value={item.title} onChange={e => updateScheduleItem(idx, 'title', e.target.value)}
                                            style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid #555', background: '#000', color: 'white', fontFamily: 'inherit', fontSize: '0.85rem' }} />
                                        {/* Color picker for schedule item */}
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {AVAILABLE_COLORS.slice(0, 5).map(c => (
                                                <button key={c.id} onClick={() => updateScheduleItem(idx, 'color', c.color)}
                                                    style={{ width: '18px', height: '18px', background: c.color, border: item.color === c.color ? '2px solid white' : 'none', borderRadius: '2px', cursor: 'pointer' }} />
                                            ))}
                                        </div>
                                        <select value={item.duration} onChange={e => updateScheduleItem(idx, 'duration', e.target.value)}
                                            style={{ width: '65px', padding: '4px', borderRadius: '4px', border: '1px solid #555', background: '#000', color: 'white', fontFamily: 'inherit', fontSize: '0.75rem' }}>
                                            <option value={30}>30分</option>
                                            <option value={60}>60分</option>
                                            <option value={90}>90分</option>
                                            <option value={120}>120分</option>
                                            <option value={180}>180分</option>
                                        </select>
                                        <button onClick={() => deleteScheduleItem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                                            <Trash2 size={14} color="#ff4757" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span style={{ color: 'var(--color-accent)', minWidth: '50px', fontFamily: 'monospace', fontSize: '0.85rem' }}>{item.time}</span>
                                        <span style={{ flex: 1, fontSize: '0.85rem', color: item.type === 'system' ? '#888' : 'white' }}>{item.title}</span>
                                        {item.duration > 0 && <span style={{ fontSize: '0.7rem', color: '#666', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '10px' }}>{item.duration}分</span>}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={() => setIsEditing(!isEditing)} className="btn btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}>
                            <Edit3 size={14} /> {isEditing ? '完了' : '編集'}
                        </button>
                        <button onClick={generateSchedule} className="btn btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}>
                            <RefreshCcw size={14} /> 再生成
                        </button>
                        <button onClick={resetSchedule} className="btn btn-primary" style={{ flex: 1, fontSize: '0.85rem' }}>リセット</button>
                    </div>
                </div>
            )}
        </div>
    );
}
