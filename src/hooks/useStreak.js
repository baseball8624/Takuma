import { useState, useEffect } from 'react';

const STREAK_KEY = 'self_hero_streak';

export function useStreak(todos) {
    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem(STREAK_KEY);
        return saved ? JSON.parse(saved) : { count: 0, lastDate: null, celebratedToday: false };
    });

    // Check if all tasks are completed
    const allCompleted = todos.length > 0 && todos.every(t => t.completed);

    useEffect(() => {
        const today = new Date().toDateString();

        // If all tasks completed and we haven't celebrated today
        if (allCompleted && !streak.celebratedToday) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            let newCount;
            if (streak.lastDate === yesterday.toDateString()) {
                // Continue streak
                newCount = streak.count + 1;
            } else if (streak.lastDate === today) {
                // Already counted today
                newCount = streak.count;
            } else {
                // Reset or start new streak
                newCount = 1;
            }

            const newStreak = { count: newCount, lastDate: today, celebratedToday: true };
            setStreak(newStreak);
            localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
        }

        // Reset celebratedToday flag if it's a new day
        if (streak.lastDate && streak.lastDate !== today && streak.celebratedToday) {
            const newStreak = { ...streak, celebratedToday: false };
            setStreak(newStreak);
            localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
        }
    }, [todos, allCompleted]);

    // Function to check if this completion triggers a level up (new day)
    const checkLevelUp = () => {
        const today = new Date().toDateString();
        return !streak.celebratedToday && allCompleted;
    };

    return {
        level: streak.count,
        streak: streak.count,
        celebratedToday: streak.celebratedToday,
        isLevelUp: checkLevelUp(),
        allCompleted
    };
}
