import { useState, useEffect } from 'react';

const LEVELS_KEY = 'self_hero_character_levels';
const DAILY_KEY = 'self_hero_daily_levelup';

export function useCharacterLevels(characterId, allCompleted, todosCount) {
    // Load all character levels
    const [levels, setLevels] = useState(() => {
        const saved = localStorage.getItem(LEVELS_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    // Track which character leveled up today
    const [dailyLevelUp, setDailyLevelUp] = useState(() => {
        const saved = localStorage.getItem(DAILY_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            const today = new Date().toDateString();
            // Reset if it's a new day
            if (data.date !== today) {
                return { date: today, characterId: null };
            }
            return data;
        }
        return { date: new Date().toDateString(), characterId: null };
    });

    // Get current character's level (starts at 0)
    const currentLevel = levels[characterId] || 0;

    // Check if this character can level up today
    const canLevelUp = dailyLevelUp.characterId === null || dailyLevelUp.characterId === characterId;

    // Check if already leveled up today with a different character
    const blockedByOther = dailyLevelUp.characterId !== null && dailyLevelUp.characterId !== characterId;

    // Handle level up when all tasks completed
    useEffect(() => {
        const today = new Date().toDateString();

        // Reset daily tracking if new day
        if (dailyLevelUp.date !== today) {
            const newDaily = { date: today, characterId: null };
            setDailyLevelUp(newDaily);
            localStorage.setItem(DAILY_KEY, JSON.stringify(newDaily));
        }

        // Level up if: all completed, has tasks, can level up, and haven't leveled this char today
        if (allCompleted && todosCount > 0 && canLevelUp && dailyLevelUp.characterId !== characterId) {
            // Increment level
            const newLevels = { ...levels, [characterId]: currentLevel + 1 };
            setLevels(newLevels);
            localStorage.setItem(LEVELS_KEY, JSON.stringify(newLevels));

            // Mark this character as leveled up today
            const newDaily = { date: today, characterId: characterId };
            setDailyLevelUp(newDaily);
            localStorage.setItem(DAILY_KEY, JSON.stringify(newDaily));
        }
    }, [allCompleted, todosCount, characterId, canLevelUp]);

    // Get level for any character
    const getLevelForCharacter = (charId) => levels[charId] || 0;

    return {
        level: currentLevel,
        canLevelUp,
        blockedByOther,
        todayLeveledCharacter: dailyLevelUp.characterId,
        getLevelForCharacter,
        allLevels: levels
    };
}
