import React, { useState } from 'react';
import { Calendar, BarChart3, Clock, CheckCircle, ChevronLeft, ChevronRight, Flame, Trophy, TrendingUp } from 'lucide-react';

export default function HistoryView({ history, getMonthlyData, getWeeklyData, getStats }) {
    const [activeTab, setActiveTab] = useState('calendar');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Debug logging
    console.log('History Data:', history);

    const stats = getStats();
    const monthlyData = getMonthlyData(currentMonth.getFullYear(), currentMonth.getMonth());
    const weeklyData = getWeeklyData();

    // カレンダーの日付を生成
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // 月初の曜日まで空白を追加
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // 日付を追加
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const record = history.dailyRecords.find(r => r.date === dateStr);
            days.push({
                day: d,
                date: dateStr,
                completed: record?.completed,
                hasRecord: !!record
            });
        }

        return days;
    };

    const tabs = [
        { id: 'calendar', label: 'カレンダー', icon: Calendar },
        { id: 'stats', label: 'レポート', icon: BarChart3 },
        { id: 'schedule', label: 'スケジュール', icon: Clock },
        { id: 'tasks', label: 'タスク', icon: CheckCircle },
    ];

    return (
        <div className="animate-pop">
            {/* タブ */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1,
                            padding: '8px',
                            background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            fontFamily: 'inherit'
                        }}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 統計サマリー */}
            <div className="card" style={{ marginBottom: '0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>{stats.completedDays}</div>
                        <div style={{ fontSize: '0.7rem', color: '#888' }}>達成日数</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2ECC71' }}>{stats.completionRate}%</div>
                        <div style={{ fontSize: '0.7rem', color: '#888' }}>達成率</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF6B6B' }}>{stats.maxStreak}</div>
                        <div style={{ fontSize: '0.7rem', color: '#888' }}>最長連続</div>
                    </div>
                </div>
            </div>

            {/* カレンダー表示 */}
            {activeTab === 'calendar' && (
                <div className="card" style={{ marginTop: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <ChevronLeft size={20} />
                        </button>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>
                            {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
                        </h3>
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* 曜日ヘッダー */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                            <div key={day} style={{ textAlign: 'center', fontSize: '0.7rem', color: '#888' }}>{day}</div>
                        ))}
                    </div>

                    {/* 日付グリッド */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                        {generateCalendarDays().map((day, i) => (
                            <div
                                key={i}
                                style={{
                                    aspectRatio: '1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    background: day?.completed
                                        ? 'linear-gradient(135deg, #2ECC71, #27AE60)'
                                        : day?.hasRecord
                                            ? 'rgba(255,107,107,0.3)'
                                            : 'rgba(255,255,255,0.05)',
                                    color: day?.completed ? '#fff' : day?.hasRecord ? '#FF6B6B' : '#666',
                                    fontWeight: day?.completed ? 'bold' : 'normal'
                                }}
                            >
                                {day?.day}
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', gap: '16px', justifyContent: 'center', fontSize: '0.7rem' }}>
                        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#2ECC71', borderRadius: '2px', marginRight: '4px' }}></span>達成</span>
                        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', background: 'rgba(255,107,107,0.3)', borderRadius: '2px', marginRight: '4px' }}></span>未達成</span>
                    </div>
                </div>
            )}

            {/* レポート表示 */}
            {activeTab === 'stats' && (
                <div className="card" style={{ marginTop: '0' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={18} />
                        週間レポート
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '100px', marginBottom: '1rem' }}>
                        {['月', '火', '水', '木', '金', '土', '日'].map((day, i) => {
                            const dayData = weeklyData.find(d => new Date(d.date).getDay() === (i + 1) % 7);
                            const height = dayData?.completed ? 100 : dayData ? 40 : 20;
                            return (
                                <div key={day} style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{
                                        height: `${height}%`,
                                        background: dayData?.completed
                                            ? 'linear-gradient(180deg, #FFD700, #FFA500)'
                                            : dayData
                                                ? 'rgba(255,107,107,0.5)'
                                                : 'rgba(255,255,255,0.1)',
                                        borderRadius: '4px',
                                        transition: 'all 0.3s ease'
                                    }} />
                                    <span style={{ fontSize: '0.6rem', color: '#888', marginTop: '4px', display: 'block' }}>{day}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.85rem' }}>今月の達成日数</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>{monthlyData.filter(d => d.completed).length}日</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.85rem' }}>累計記録日数</span>
                            <span style={{ fontWeight: 'bold', color: '#FFD700' }}>{stats.totalDays}日</span>
                        </div>
                    </div>
                </div>
            )}

            {/* スケジュール履歴 */}
            {activeTab === 'schedule' && (
                <div className="card" style={{ marginTop: '0' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={18} />
                        最近のスケジュール
                    </h3>
                    {history.dailyRecords.slice(-5).reverse().map((record, i) => (
                        <div key={i} style={{
                            padding: '12px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            marginBottom: '8px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 'bold' }}>{record.date}</span>
                                <span style={{ color: record.completed ? '#2ECC71' : '#FF6B6B', fontSize: '0.8rem' }}>
                                    {record.completed ? '✓ 達成' : '✗ 未達成'}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#888' }}>
                                {record.schedule?.slice(0, 3).map((s, j) => (
                                    <span key={j} style={{ marginRight: '8px' }}>{s.time} {s.title}</span>
                                ))}
                                {record.schedule?.length > 3 && <span>...他{record.schedule.length - 3}件</span>}
                            </div>
                        </div>
                    ))}
                    {history.dailyRecords.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>まだ記録がありません</p>
                    )}
                </div>
            )}

            {/* タスク完了履歴 */}
            {activeTab === 'tasks' && (
                <div className="card" style={{ marginTop: '0' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={18} />
                        タスク完了履歴
                    </h3>
                    {history.dailyRecords.slice(-10).reverse().map((record, i) => (
                        <div key={i} style={{
                            padding: '10px 12px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '6px',
                            marginBottom: '6px'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>{record.date}</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {record.tasks?.map((task, j) => (
                                    <span key={j} style={{
                                        padding: '2px 8px',
                                        background: task.done ? 'rgba(46,204,113,0.2)' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        color: task.done ? '#2ECC71' : '#888'
                                    }}>
                                        {task.done ? '✓' : '○'} {task.text}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                    {history.dailyRecords.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>まだ記録がありません</p>
                    )}
                </div>
            )}
        </div>
    );
}
