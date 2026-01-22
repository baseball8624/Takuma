import React, { useState, useMemo } from 'react';
import { Clock, RefreshCcw, Plus, Trash2, Edit3, PieChart, Palette, Save, Star } from 'lucide-react';
import { useCharacter } from '../../hooks/useCharacter';
import { useScheduleTemplates } from '../../hooks/useScheduleTemplates';

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

// よくある1日のルーティン項目
const DAILY_ROUTINES = [
    // 生活基本
    { id: 'sleep', name: '睡眠', duration: 420, color: '#2C3E50', type: 'routine' },
    { id: 'morning_prep', name: '朝の準備', duration: 30, color: '#95A5A6', type: 'routine' },
    { id: 'breakfast', name: '朝食', duration: 30, color: '#FFB347', type: 'routine' },
    { id: 'lunch', name: '昼食', duration: 60, color: '#FFB347', type: 'routine' },
    { id: 'dinner', name: '夕食', duration: 60, color: '#FFB347', type: 'routine' },
    { id: 'bath', name: '入浴', duration: 30, color: '#4ECDC4', type: 'routine' },

    // 移動
    { id: 'commute_am', name: '通勤・通学', duration: 60, color: '#87CEEB', type: 'routine' },
    { id: 'commute_pm', name: '帰宅', duration: 60, color: '#87CEEB', type: 'routine' },

    // 仕事・学業
    { id: 'work', name: '仕事', duration: 480, color: '#3498DB', type: 'routine' },
    { id: 'school', name: '授業・学校', duration: 360, color: '#9B59B6', type: 'routine' },

    // 家事
    { id: 'housework', name: '家事', duration: 60, color: '#E74C3C', type: 'routine' },
    { id: 'cooking', name: '料理', duration: 60, color: '#F39C12', type: 'routine' },

    // リラックス
    { id: 'relax', name: 'リラックスタイム', duration: 60, color: '#AA96DA', type: 'routine' },
    { id: 'tv_youtube', name: 'TV・YouTube', duration: 60, color: '#E91E63', type: 'routine' },
    { id: 'game', name: 'ゲーム', duration: 60, color: '#8E44AD', type: 'routine' },
    { id: 'sns', name: 'SNS', duration: 30, color: '#1DA1F2', type: 'routine' },
];

const SCHEDULE_TEMPLATES = [
    // 働き方スタイル
    { id: 'office_worker', name: '会社員型', desc: '9-18時勤務の王道スタイル', icon: '💼', category: '働き方', wake: '07:00', bed: '23:00' },
    { id: 'remote_worker', name: 'リモート型', desc: '在宅勤務でフレキシブルに', icon: '🏠', category: '働き方', wake: '08:00', bed: '00:00' },
    { id: 'freelance', name: 'フリーランス型', desc: '自由な時間配分で効率UP', icon: '✨', category: '働き方', wake: '09:00', bed: '01:00' },
    { id: 'student', name: '学生型', desc: '授業と勉強の両立スタイル', icon: '📚', category: '働き方', wake: '07:30', bed: '00:00' },
    { id: 'part_time', name: 'アルバイト型', desc: 'シフト勤務に合わせて', icon: '🎯', category: '働き方', wake: '08:00', bed: '23:30' },

    // 生活リズム
    { id: 'early_bird', name: '朝型', desc: '5時起きで朝活を制する者', icon: '🌅', category: '生活リズム', wake: '05:00', bed: '22:00' },
    { id: 'night_owl', name: '夜型', desc: '夜に集中力が高まるタイプ', icon: '🌙', category: '生活リズム', wake: '10:00', bed: '02:00' },
    { id: 'balance', name: 'バランス型', desc: '攻守最強の安定スタイル', icon: '⚖️', category: '生活リズム', wake: '07:00', bed: '23:00' },

    // 目標重視
    { id: 'spartan', name: 'スパルタ型', desc: '経験値効率重視の修羅の道', icon: '🔥', category: '目標重視', wake: '05:30', bed: '23:00' },
    { id: 'chill', name: 'ゆとり型', desc: 'HP管理優先の安全策', icon: '🍃', category: '目標重視', wake: '08:00', bed: '22:00' },
    { id: 'productivity', name: '生産性特化型', desc: '集中時間を最大化', icon: '⚡', category: '目標重視', wake: '06:00', bed: '22:00' },
    { id: 'health', name: '健康重視型', desc: '運動と睡眠をしっかり確保', icon: '💪', category: '目標重視', wake: '06:30', bed: '22:30' },

    // 特殊スタイル
    { id: 'pomodoro', name: 'ポモドーロ型', desc: '25分集中+5分休憩の繰り返し', icon: '🍅', category: '特殊', wake: '07:00', bed: '23:00' },
    { id: 'deep_work', name: 'ディープワーク型', desc: '長時間の深い集中を確保', icon: '🧠', category: '特殊', wake: '06:00', bed: '22:00' },
    { id: 'creative', name: 'クリエイティブ型', desc: '創作活動に最適化', icon: '🎨', category: '特殊', wake: '09:00', bed: '01:00' },

    // 有名人スタイル
    {
        id: 'tanaka_kei',
        name: '田中渓さん型',
        desc: '3:45起床！朝トレ+ビジネスの超人スタイル',
        icon: '🏃',
        category: '有名人',
        wake: '03:45',
        bed: '21:00',
        defaultSchedule: [
            { time: '03:45', duration: 15, title: '起床', color: '#4CAF50' },
            { time: '04:00', duration: 120, title: 'ラン/バイク/スイム', color: '#FF5722' },
            { time: '06:00', duration: 30, title: 'コアトレ・その他トレーニング', color: '#FF9800' },
            { time: '06:30', duration: 50, title: '読書', color: '#9C27B0' },
            { time: '07:20', duration: 55, title: '家事等', color: '#607D8B' },
            { time: '08:15', duration: 30, title: '移動+語学学習+出社', color: '#00BCD4' },
            { time: '08:45', duration: 75, title: 'メール返信・To do指示・資料レビュー', color: '#3F51B5' },
            { time: '10:00', duration: 90, title: '社内外・打ち合わせ', color: '#E91E63' },
            { time: '11:30', duration: 120, title: '昼食+インプット（ニュース・AI壁打ち）', color: '#8BC34A' },
            { time: '13:30', duration: 150, title: '外部MTG', color: '#673AB7' },
            { time: '16:00', duration: 90, title: 'メール返信・To do指示・資料レビュー', color: '#2196F3' },
            { time: '17:30', duration: 30, title: '移動+電話会議', color: '#009688' },
            { time: '18:00', duration: 150, title: '会食または家族と食事', color: '#FFC107' },
            { time: '20:30', duration: 30, title: '就寝準備', color: '#795548' },
        ]
    },
];

// Round to nearest 15 minutes
const roundTo15Min = (minutes) => {
    return Math.round(minutes / 15) * 15;
};

const formatTime = (totalMinutes) => {
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export default function ScheduleWizard({ presets = [], onAddPreset, onUpdatePreset, level = 1 }) {
    const { character, triggerReaction, currentDialogue } = useCharacter(0, level);
    const [wakeTime, setWakeTime] = useState('07:00');
    const [bedTime, setBedTime] = useState('23:00');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [chosenTemplateId, setChosenTemplateId] = useState(null); // ユーザー選択
    const [schedule, setSchedule] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDuration, setNewTaskDuration] = useState(30);
    const [newTaskColor, setNewTaskColor] = useState(AVAILABLE_COLORS[0].color);
    const [showChart, setShowChart] = useState(false);
    const [editingPresetId, setEditingPresetId] = useState(null);

    // Template saving
    const { templates: customTemplates, saveTemplate, deleteTemplate } = useScheduleTemplates();
    const [newTemplateName, setNewTemplateName] = useState('');
    const [showSaveInput, setShowSaveInput] = useState(false);

    // Pie Chart interaction
    const [selectedSlice, setSelectedSlice] = useState(null);

    const handleSaveTemplate = () => {
        if (newTemplateName.trim()) {
            saveTemplate(newTemplateName, schedule, wakeTime, bedTime);
            setNewTemplateName('');
            setShowSaveInput(false);
            alert('テンプレートを保存しました！');
        }
    };

    const toggleTaskSelection = (preset) => {
        if (selectedTasks.find(t => t.id === preset.id)) {
            setSelectedTasks(selectedTasks.filter(t => t.id !== preset.id));
        } else {
            const roundedDuration = roundTo15Min(preset.duration) || 15;
            setSelectedTasks([...selectedTasks, { ...preset, duration: roundedDuration }]);
        }
    };

    const generateSchedule = () => {
        if (selectedTasks.length === 0) {
            alert('タスクを選択してください');
            return;
        }

        // ユーザーが選択したテンプレート、なければランダム
        const template = chosenTemplateId
            ? SCHEDULE_TEMPLATES.find(t => t.id === chosenTemplateId)
            : SCHEDULE_TEMPLATES[Math.floor(Math.random() * SCHEDULE_TEMPLATES.length)];
        setSelectedTemplate(template);

        const [wakeH, wakeM] = wakeTime.split(':').map(Number);
        const [bedH, bedM] = bedTime.split(':').map(Number);

        const wakeMinutes = wakeH * 60 + wakeM;
        const bedMinutes = bedH * 60 + bedM;

        let currentMinutes = roundTo15Min(wakeMinutes);
        const items = [];

        // 起床・準備
        items.push({
            id: 'wake',
            time: formatTime(currentMinutes),
            title: '起床・準備',
            duration: 30,
            editable: true,
            color: '#888',
            type: 'routine'
        });
        currentMinutes += 30;

        // 朝食
        items.push({
            id: 'breakfast',
            time: formatTime(currentMinutes),
            title: '朝食',
            duration: 30,
            editable: true,
            color: '#FFB347',
            type: 'routine'
        });
        currentMinutes += 30;

        // テンプレートに応じた午前の構成
        const isWorker = ['office_worker', 'remote_worker', 'part_time'].includes(template.id);
        const isStudent = template.id === 'student';
        const isFreelance = template.id === 'freelance';
        const isEarlyBird = template.id === 'early_bird';

        // 朝型・フリーランスは朝にタスクを入れる
        if (isEarlyBird || isFreelance) {
            const morningTasks = selectedTasks.slice(0, Math.ceil(selectedTasks.length / 2));
            morningTasks.forEach((task, idx) => {
                const taskDuration = roundTo15Min(task.duration) || 15;
                items.push({
                    id: `task-${task.id}-am-${idx}`,
                    time: formatTime(currentMinutes),
                    title: task.name,
                    duration: taskDuration,
                    editable: true,
                    color: task.color || AVAILABLE_COLORS[idx % AVAILABLE_COLORS.length].color,
                    type: 'task'
                });
                currentMinutes += taskDuration;

                // 休憩を挟む
                if (idx < morningTasks.length - 1) {
                    items.push({
                        id: `break-am-${idx}`,
                        time: formatTime(currentMinutes),
                        title: '休憩',
                        duration: 30,
                        editable: true,
                        color: '#4ECDC4',
                        type: 'break'
                    });
                    currentMinutes += 30;
                }
            });
        }

        // 通勤（会社員・学生）
        if (isWorker || isStudent) {
            items.push({
                id: 'commute_am',
                time: formatTime(currentMinutes),
                title: isStudent ? '通学' : '通勤',
                duration: 60,
                editable: true,
                color: '#87CEEB',
                type: 'routine'
            });
            currentMinutes += 60;

            // 午前の仕事/授業
            items.push({
                id: 'work_am',
                time: formatTime(currentMinutes),
                title: isStudent ? '午前の授業' : '午前の仕事',
                duration: 180,
                editable: true,
                color: '#95E1D3',
                type: 'routine'
            });
            currentMinutes += 180;
        }

        // 昼食（12時頃を目安に調整）
        if (currentMinutes < 12 * 60) {
            currentMinutes = 12 * 60;
        }
        items.push({
            id: 'lunch',
            time: formatTime(currentMinutes),
            title: '昼食',
            duration: 60,
            editable: true,
            color: '#FFB347',
            type: 'routine'
        });
        currentMinutes += 60;

        // 午後
        if (isWorker || isStudent) {
            // 午後の仕事/授業
            items.push({
                id: 'work_pm',
                time: formatTime(currentMinutes),
                title: isStudent ? '午後の授業' : '午後の仕事',
                duration: 240,
                editable: true,
                color: '#95E1D3',
                type: 'routine'
            });
            currentMinutes += 240;

            // 帰宅
            items.push({
                id: 'commute_pm',
                time: formatTime(currentMinutes),
                title: '帰宅',
                duration: 60,
                editable: true,
                color: '#87CEEB',
                type: 'routine'
            });
            currentMinutes += 60;
        } else {
            // フリーランス・その他は午後にタスクを配置
            const afternoonTasks = isEarlyBird ? selectedTasks.slice(Math.ceil(selectedTasks.length / 2)) : selectedTasks;
            afternoonTasks.forEach((task, idx) => {
                const taskDuration = roundTo15Min(task.duration) || 15;
                items.push({
                    id: `task-${task.id}-pm-${idx}`,
                    time: formatTime(currentMinutes),
                    title: task.name,
                    duration: taskDuration,
                    editable: true,
                    color: task.color || AVAILABLE_COLORS[idx % AVAILABLE_COLORS.length].color,
                    type: 'task'
                });
                currentMinutes += taskDuration;

                if (idx < afternoonTasks.length - 1) {
                    items.push({
                        id: `break-pm-${idx}`,
                        time: formatTime(currentMinutes),
                        title: '休憩',
                        duration: 30,
                        editable: true,
                        color: '#4ECDC4',
                        type: 'break'
                    });
                    currentMinutes += 30;
                }
            });
        }

        // 夕食（18時頃を目安）
        if (currentMinutes < 18 * 60) {
            currentMinutes = 18 * 60;
        }
        items.push({
            id: 'dinner',
            time: formatTime(currentMinutes),
            title: '夕食',
            duration: 60,
            editable: true,
            color: '#FFB347',
            type: 'routine'
        });
        currentMinutes += 60;

        // 夜のタスク（会社員・学生の場合）
        if (isWorker || isStudent) {
            selectedTasks.forEach((task, idx) => {
                const taskDuration = roundTo15Min(task.duration) || 15;
                items.push({
                    id: `task-${task.id}-eve-${idx}`,
                    time: formatTime(currentMinutes),
                    title: task.name,
                    duration: taskDuration,
                    editable: true,
                    color: task.color || AVAILABLE_COLORS[idx % AVAILABLE_COLORS.length].color,
                    type: 'task'
                });
                currentMinutes += taskDuration;
            });
        }

        // 入浴
        items.push({
            id: 'bath',
            time: formatTime(currentMinutes),
            title: '入浴',
            duration: 30,
            editable: true,
            color: '#4ECDC4',
            type: 'routine'
        });
        currentMinutes += 30;

        // リラックスタイム（就寝まで）
        const relaxTime = Math.max(30, roundTo15Min(bedMinutes - currentMinutes - 30));
        if (relaxTime >= 30) {
            items.push({
                id: 'relax',
                time: formatTime(currentMinutes),
                title: 'リラックスタイム',
                duration: relaxTime,
                editable: true,
                color: '#AA96DA',
                type: 'routine'
            });
            currentMinutes += relaxTime;
        }

        // 就寝
        items.push({
            id: 'sleep',
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
            value = roundTo15Min(parseInt(value) || 15);
        }
        newSchedule[index] = { ...newSchedule[index], [field]: value };
        setSchedule(newSchedule);
    };

    const deleteScheduleItem = (index) => {
        setSchedule(schedule.filter((_, i) => i !== index));
    };

    const handleAddNewPreset = () => {
        if (newTaskName.trim() && onAddPreset) {
            const roundedDuration = roundTo15Min(parseInt(newTaskDuration) || 15);
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
        const size = 360; // サイズ拡大
        const center = size / 2;
        const radius = size / 2 - 30;
        const innerRadius = radius * 0.5;
        const total24Hours = 24 * 60;

        const clockData = [];
        const scheduleItems = schedule.filter(item => item.duration > 0).map(item => {
            const [startH, startM] = (item.time || '00:00').split(':').map(Number);
            const startMinutes = startH * 60 + startM;
            const endMinutes = startMinutes + item.duration;
            const endTime = `${String(Math.floor(endMinutes / 60) % 24).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;
            const startAngle = (startMinutes / total24Hours) * 360;
            const endAngle = (endMinutes / total24Hours) * 360;

            return {
                ...item,
                startAngle,
                endAngle,
                timeRange: `${item.time}〜${endTime}`,
                startMinutes,
                endMinutes
            };
        });

        scheduleItems.sort((a, b) => a.startMinutes - b.startMinutes);

        let lastEnd = 0;
        scheduleItems.forEach(item => {
            if (item.startMinutes > lastEnd) {
                const gapStart = lastEnd;
                const gapEnd = item.startMinutes;
                const startTime = `${String(Math.floor(gapStart / 60)).padStart(2, '0')}:${String(gapStart % 60).padStart(2, '0')}`;
                const endTime = `${String(Math.floor(gapEnd / 60)).padStart(2, '0')}:${String(gapEnd % 60).padStart(2, '0')}`;
                clockData.push({
                    title: '⏳ 空き時間',
                    duration: gapEnd - gapStart,
                    color: '#37474f',
                    startAngle: (gapStart / total24Hours) * 360,
                    endAngle: (gapEnd / total24Hours) * 360,
                    timeRange: `${startTime}〜${endTime}`,
                    startMinutes: gapStart,
                    endMinutes: gapEnd,
                    isFreeTime: true
                });
            }
            clockData.push(item);
            lastEnd = item.endMinutes;
        });

        if (scheduleItems.length > 0) {
            const firstStart = scheduleItems[0].startMinutes;
            const lastEndTime = lastEnd;
            const sleepBeforeMorning = firstStart;
            const sleepAfterNight = total24Hours - lastEndTime;
            const totalSleep = sleepBeforeMorning + sleepAfterNight;

            if (totalSleep > 0) {
                const sleepStartTime = `${String(Math.floor(lastEndTime / 60)).padStart(2, '0')}:${String(lastEndTime % 60).padStart(2, '0')}`;
                const sleepEndTime = `${String(Math.floor(firstStart / 60)).padStart(2, '0')}:${String(firstStart % 60).padStart(2, '0')}`;

                if (sleepAfterNight > 0) {
                    clockData.push({
                        title: '💤 睡眠',
                        duration: totalSleep,
                        color: '#1a237e',
                        startAngle: (lastEndTime / total24Hours) * 360,
                        endAngle: 360,
                        timeRange: `${sleepStartTime}〜${sleepEndTime}`,
                        startMinutes: lastEndTime,
                        endMinutes: total24Hours,
                        isSleep: true,
                        continuesAfterMidnight: sleepBeforeMorning > 0
                    });
                }
                if (sleepBeforeMorning > 0) {
                    clockData.push({
                        title: '💤 睡眠',
                        duration: totalSleep,
                        color: '#1a237e',
                        startAngle: 0,
                        endAngle: (firstStart / total24Hours) * 360,
                        timeRange: `${sleepStartTime}〜${sleepEndTime}`,
                        startMinutes: 0,
                        endMinutes: firstStart,
                        isSleep: true,
                        hiddenInLegend: true
                    });
                }
            }
        }

        const hourMarks = [];
        for (let h = 0; h < 24; h += 3) {
            const angle = (h / 24) * 360 - 90;
            const rad = angle * Math.PI / 180;
            const x1 = center + (radius + 8) * Math.cos(rad);
            const y1 = center + (radius + 8) * Math.sin(rad);
            const x2 = center + (radius + 18) * Math.cos(rad);
            const y2 = center + (radius + 18) * Math.sin(rad);
            const textX = center + (radius + 30) * Math.cos(rad);
            const textY = center + (radius + 30) * Math.sin(rad) + 4;

            hourMarks.push(
                <g key={`mark-${h}`}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#555" strokeWidth="2" />
                    <text x={textX} y={textY} textAnchor="middle" fill="#888" fontSize="0.7rem" fontWeight="bold">{h}</text>
                </g>
            );
        }

        return (
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: 'var(--color-accent)', fontSize: '0.9rem' }}>🕐 24時間時計グラフ (タップで詳細)</h4>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <svg width={size} height={size} style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
                        <circle cx={center} cy={center} r={radius} fill="#222" stroke="#444" strokeWidth="2" />

                        {clockData.map((slice, i) => {
                            const startRad = (slice.startAngle - 90) * Math.PI / 180;
                            const endRad = (slice.endAngle - 90) * Math.PI / 180;
                            const largeArc = slice.endAngle - slice.startAngle > 180 ? 1 : 0;
                            const x1 = center + radius * Math.cos(startRad);
                            const y1 = center + radius * Math.sin(startRad);
                            const x2 = center + radius * Math.cos(endRad);
                            const y2 = center + radius * Math.sin(endRad);
                            const ix1 = center + innerRadius * Math.cos(startRad);
                            const iy1 = center + innerRadius * Math.sin(startRad);
                            const ix2 = center + innerRadius * Math.cos(endRad);
                            const iy2 = center + innerRadius * Math.sin(endRad);

                            const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;

                            const midAngle = ((slice.startAngle + slice.endAngle) / 2 - 90) * Math.PI / 180;
                            const labelRadius = (radius + innerRadius) / 2;
                            const labelX = center + labelRadius * Math.cos(midAngle);
                            const labelY = center + labelRadius * Math.sin(midAngle);

                            const isSelected = selectedSlice === i;
                            const showLabel = slice.duration >= 45; // 少し緩和

                            return (
                                <g
                                    key={i}
                                    onClick={() => setSelectedSlice(isSelected ? null : i)}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        transformOrigin: `${center}px ${center}px`,
                                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                        zIndex: isSelected ? 10 : 1,
                                        opacity: (selectedSlice !== null && !isSelected) ? 0.6 : 1
                                    }}
                                >
                                    <path
                                        d={path}
                                        fill={slice.color}
                                        stroke="var(--color-bg-card)"
                                        strokeWidth={isSelected ? "3" : "1"}
                                        style={{
                                            filter: isSelected ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.5)) brightness(1.1)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                                        }}
                                    />
                                    {showLabel && (
                                        <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="0.6rem" fontWeight="bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)', pointerEvents: 'none' }}>
                                            {slice.title.length > 5 ? slice.title.slice(0, 4) + '…' : slice.title}
                                        </text>
                                    )}
                                </g>
                            );
                        })}

                        <circle cx={center} cy={center} r={innerRadius - 5} fill="var(--color-bg-card)" />
                        {hourMarks}

                        {/* 中央テキスト (選択時は詳細) */}
                        <g onClick={() => setSelectedSlice(null)} style={{ cursor: selectedSlice !== null ? 'pointer' : 'default' }}>
                            {selectedSlice !== null ? (
                                <>
                                    <text x={center} y={center - 15} textAnchor="middle" fill="var(--color-accent)" fontSize="0.8rem" fontWeight="bold">
                                        {clockData[selectedSlice]?.timeRange}
                                    </text>
                                    <text x={center} y={center + 5} textAnchor="middle" fill="white" fontSize="0.9rem" fontWeight="bold">
                                        {clockData[selectedSlice]?.title}
                                    </text>
                                    <text x={center} y={center + 20} textAnchor="middle" fill="#ccc" fontSize="0.7rem">
                                        {Math.floor(clockData[selectedSlice]?.duration / 60)}h {clockData[selectedSlice]?.duration % 60}m
                                    </text>
                                </>
                            ) : (
                                <>
                                    <text x={center} y={center - 5} textAnchor="middle" fill="var(--color-accent)" fontSize="1.2rem" fontWeight="bold">
                                        24h
                                    </text>
                                    <text x={center} y={center + 12} textAnchor="middle" fill="#888" fontSize="0.6rem">
                                        Total
                                    </text>
                                </>
                            )}
                        </g>
                    </svg>
                </div>

                {/* 凡例 (選択連動) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px', marginTop: '16px', textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
                    {clockData.filter(item => !item.hiddenInLegend).map((item, i) => {
                        const hours = Math.floor(item.duration / 60);
                        const mins = item.duration % 60;
                        const durationStr = hours > 0 ? `${hours}h${mins > 0 ? mins + 'm' : ''}` : `${mins}m`;
                        const isSelected = selectedSlice === i;

                        return (
                            <div
                                key={i}
                                onClick={() => setSelectedSlice(isSelected ? null : i)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '8px 12px',
                                    background: isSelected ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                                    borderRadius: '6px',
                                    border: isSelected ? `1px solid ${item.color}` : '1px solid transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ width: '12px', height: '12px', background: item.color, borderRadius: '3px', flexShrink: 0 }} />
                                <span style={{ color: 'var(--color-secondary)', fontFamily: 'monospace', fontSize: '0.75rem', minWidth: '85px' }}>
                                    {item.timeRange}
                                </span>
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isSelected ? 'bold' : 'normal' }}>{item.title}</span>
                                <span style={{ color: 'var(--color-accent)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{durationStr}</span>
                            </div>
                        );
                    })}
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
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>15分単位・色カスタム可能</p>
                </div>
                {schedule.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setShowSaveInput(true)}
                            style={{
                                background: 'none', border: '1px solid #FFD700', borderRadius: '4px', padding: '6px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#FFD700'
                            }}
                        >
                            <Save size={16} /> 保存
                        </button>
                        <button onClick={() => setShowChart(!showChart)} style={{ background: 'none', border: '2px solid var(--color-accent)', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}>
                            <PieChart size={18} color="var(--color-accent)" />
                        </button>
                    </div>
                )}
            </div>

            {showSaveInput && (
                <div style={{ marginBottom: '1rem', padding: '10px', background: 'rgba(255,215,0,0.1)', borderRadius: '8px', border: '1px solid #FFD700', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={newTemplateName}
                        onChange={e => setNewTemplateName(e.target.value)}
                        placeholder="テンプレート名を入力（例：休日ルーティン）"
                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: 'none', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                    />
                    <button onClick={handleSaveTemplate} style={{ background: '#FFD700', border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', color: 'black', fontWeight: 'bold' }}>保存</button>
                    <button onClick={() => setShowSaveInput(false)} style={{ background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer', color: '#ccc' }}>キャンセル</button>
                </div>
            )}

            {/* Character Display */}
            <div
                onClick={() => triggerReaction(Math.random() > 0.5 ? 'cheer' : 'praise')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '1rem',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                }}
            >
                <img
                    src={character.image}
                    alt={character.name}
                    style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                />
                <div style={{ flex: 1 }}>
                    <div style={{
                        fontSize: '0.7rem',
                        color: 'var(--color-secondary)',
                        marginBottom: '2px'
                    }}>
                        {character.displayName || character.name}がサポート中
                    </div>
                    <div style={{
                        fontSize: '0.85rem',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '6px 10px',
                        borderRadius: '10px',
                        borderTopLeftRadius: '2px',
                        color: 'white'
                    }}>
                        {currentDialogue || '一緒にスケジュールを組もう！'}
                    </div>
                </div>
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

                    {/* Template Selection */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--color-accent)', display: 'block', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>🎯 スケジュールタイプを選択</span>
                        </label>

                        {/* Custom Templates */}
                        {customTemplates.length > 0 && (
                            <div style={{ marginBottom: '8px' }}>
                                <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '4px' }}>マイテンプレート</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {customTemplates.map(template => (
                                        <div key={template.id} style={{ position: 'relative' }}>
                                            <button
                                                onClick={() => {
                                                    if (chosenTemplateId === template.id) {
                                                        setChosenTemplateId(null);
                                                    } else {
                                                        setChosenTemplateId(template.id);
                                                        if (template.wake) setWakeTime(template.wake);
                                                        if (template.bed) setBedTime(template.bed);
                                                        if (template.schedule) {
                                                            setSchedule(template.schedule);
                                                            setSelectedTemplate(template);
                                                            // If we load a full schedule, we might want to skip generation or handled differently
                                                            // But for now let's treat it as applying settings
                                                        }
                                                    }
                                                }}
                                                style={{
                                                    padding: '8px 12px',
                                                    background: chosenTemplateId === template.id ? 'var(--color-primary)' : 'rgba(255,215,0,0.15)',
                                                    border: chosenTemplateId === template.id ? '2px solid white' : '1px solid #FFD700',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    fontFamily: 'inherit',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <span>{template.icon}</span>
                                                <span>{template.name}</span>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); if (confirm('削除しますか？')) deleteTemplate(template.id); }}
                                                style={{
                                                    position: 'absolute',
                                                    top: -5,
                                                    right: -5,
                                                    background: '#ff6b6b',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '16px',
                                                    height: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    color: 'white'
                                                }}
                                            >
                                                <Trash2 size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {SCHEDULE_TEMPLATES.map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => {
                                        if (chosenTemplateId === template.id) {
                                            setChosenTemplateId(null);
                                        } else {
                                            setChosenTemplateId(template.id);
                                            // テンプレートの時間を自動設定
                                            if (template.wake) setWakeTime(template.wake);
                                            if (template.bed) setBedTime(template.bed);
                                            // デフォルトスケジュールがあれば自動適用
                                            if (template.defaultSchedule) {
                                                setSchedule(template.defaultSchedule);
                                                setSelectedTemplate(template);
                                            }
                                        }
                                    }}
                                    style={{
                                        padding: '8px 12px',
                                        background: chosenTemplateId === template.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                        border: chosenTemplateId === template.id ? '2px solid white' : '2px solid #555',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    title={`${template.desc} (${template.wake}〜${template.bed})`}
                                >
                                    <span>{template.icon}</span>
                                    <span>{template.name}</span>
                                </button>
                            ))}
                        </div>
                        {!chosenTemplateId && (
                            <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '6px' }}>
                                ※未選択の場合はランダムで決定されます
                            </p>
                        )}
                    </div>

                    {/* Task Selection with Color */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--color-accent)', display: 'block', marginBottom: '8px' }}>
                            📋 やることリスト（タップで選択・長押しで色変更）
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {presets.map(preset => {
                                const isSelected = selectedTasks.find(t => t.id === preset.id);
                                const displayDuration = roundTo15Min(preset.duration) || 15;
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
                    <div style={{ textAlign: 'center', marginBottom: '1rem', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#888', display: 'block', marginBottom: '4px' }}>{selectedTemplate?.category}</span>
                        <div style={{ fontSize: '2rem', marginBottom: '4px' }}>{selectedTemplate?.icon}</div>
                        <h4 style={{ color: 'var(--color-accent)', fontSize: '1.2rem', marginTop: '0', marginBottom: '4px' }}>{selectedTemplate?.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#aaa', margin: 0 }}>{selectedTemplate?.desc}</p>
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
