import { useState, useEffect } from 'react';

// 履歴データを管理するフック
export default function useHistory() {
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('self_hero_history');
        return saved ? JSON.parse(saved) : {
            dailyRecords: [], // { date: 'YYYY-MM-DD', completed: true/false, tasks: [], schedule: [] }
            achievements: [], // { date, type, title }
            streakHistory: [], // { startDate, endDate, days }
        };
    });

    // 保存
    useEffect(() => {
        localStorage.setItem('self_hero_history', JSON.stringify(history));
    }, [history]);

    // 今日の記録を追加/更新
    const recordToday = (tasks, schedule, completed = false) => {
        // use local date
        const d = new Date();
        const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const existingIndex = history.dailyRecords.findIndex(r => r.date === today);

        const record = {
            date: today,
            completed,
            tasks: tasks.map(t => ({ text: t.text, done: t.done })),
            schedule: schedule.map(s => ({ title: s.title, time: s.time, duration: s.duration })),
            timestamp: Date.now()
        };

        if (existingIndex >= 0) {
            const newRecords = [...history.dailyRecords];
            newRecords[existingIndex] = record;
            setHistory(prev => ({ ...prev, dailyRecords: newRecords }));
        } else {
            setHistory(prev => ({
                ...prev,
                dailyRecords: [...prev.dailyRecords, record].slice(-365) // 1年分保持
            }));
        }
    };

    // 達成を記録
    const recordAchievement = (type, title) => {
        setHistory(prev => ({
            ...prev,
            achievements: [...prev.achievements, {
                date: (() => {
                    const d = new Date();
                    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                })(),
                type,
                title,
                timestamp: Date.now()
            }].slice(-100) // 最新100件
        }));
    };

    // 月間データを取得
    const getMonthlyData = (year, month) => {
        const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
        return history.dailyRecords.filter(r => r.date.startsWith(monthStr));
    };

    // 週間データを取得
    const getWeeklyData = () => {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekAgoStr = `${weekAgo.getFullYear()}-${String(weekAgo.getMonth() + 1).padStart(2, '0')}-${String(weekAgo.getDate()).padStart(2, '0')}`;
        return history.dailyRecords.filter(r => r.date >= weekAgoStr);
    };

    // 統計を計算
    const getStats = () => {
        const records = history.dailyRecords;
        const completedDays = records.filter(r => r.completed).length;
        const totalDays = records.length;
        const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

        // 最長継続記録
        let maxStreak = 0;
        let currentStreak = 0;
        const sortedRecords = [...records].sort((a, b) => a.date.localeCompare(b.date));

        sortedRecords.forEach((record, i) => {
            if (record.completed) {
                currentStreak++;
                if (currentStreak > maxStreak) maxStreak = currentStreak;
            } else {
                currentStreak = 0;
            }
        });

        return {
            totalDays,
            completedDays,
            completionRate,
            maxStreak,
            achievementsCount: history.achievements.length
        };
    };

    // 履歴をクリア
    const clearHistory = () => {
        if (confirm('履歴をすべて削除しますか？')) {
            setHistory({
                dailyRecords: [],
                achievements: [],
                streakHistory: []
            });
        }
    };

    return {
        history,
        recordToday,
        recordAchievement,
        getMonthlyData,
        getWeeklyData,
        getStats,
        clearHistory
    };
}
