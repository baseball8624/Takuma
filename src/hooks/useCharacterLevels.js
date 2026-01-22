import { useState, useEffect } from 'react';

const LEVELS_KEY = 'self_hero_character_levels';
const DAILY_KEY = 'self_hero_daily_levelup';

export function useCharacterLevels(characterId, allCompleted, todosCount) {
    // Load all character levels
    const [levels, setLevels] = useState(() => {
        try {
            const saved = localStorage.getItem(LEVELS_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error('Failed to load levels:', e);
            return {};
        }
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

    // AUTO-REPAIR: If daily flag is set for THIS character, but level is 0, reset the flag.
    // This fixes the "stuck" state where the app thinks you leveled up but data wasn't saved.
    useEffect(() => {
        if (dailyLevelUp.characterId === characterId && currentLevel === 0) {
            console.log("Auto-repairing stuck state: Resetting daily flag for level 0");
            const today = new Date().toDateString();
            const newDaily = { date: today, characterId: null };
            setDailyLevelUp(newDaily);
            localStorage.setItem(DAILY_KEY, JSON.stringify(newDaily));
        }
    }, [dailyLevelUp, characterId, currentLevel]);

    // Manual level up trigger (imperative)
    const attemptLevelUp = () => {
        const today = new Date().toDateString();
        // Allow if standard checks pass OR if we are stuck at level 0 (force retry)
        const isLevelZero = currentLevel === 0;

        if ((canLevelUp && dailyLevelUp.characterId !== characterId) || isLevelZero) {
            // Increment level using functional update
            const newLevelStart = levels[characterId] || 0;
            const nextLevel = newLevelStart + 1;

            const newLevels = { ...levels, [characterId]: nextLevel };
            setLevels(newLevels);
            localStorage.setItem(LEVELS_KEY, JSON.stringify(newLevels));

            // Mark this character as leveled up today
            const newDaily = { date: today, characterId: characterId };
            setDailyLevelUp(newDaily);
            localStorage.setItem(DAILY_KEY, JSON.stringify(newDaily));

            return true;
        }
        return false;
    };

    // New Day Reset Check
    useEffect(() => {
        const today = new Date().toDateString();
        if (dailyLevelUp.date !== today) {
            const newDaily = { date: today, characterId: null };
            setDailyLevelUp(newDaily);
            localStorage.setItem(DAILY_KEY, JSON.stringify(newDaily));
        }
    }, [dailyLevelUp.date]);

    // Get level for any character
    const getLevelForCharacter = (charId) => levels[charId] || 0;

    // Set level for any character (for dev/testing)
    const setLevelForCharacter = (charId, newLevel) => {
        const clampedLevel = Math.max(0, newLevel);
        const newLevels = { ...levels, [charId]: clampedLevel };
        setLevels(newLevels);
        localStorage.setItem(LEVELS_KEY, JSON.stringify(newLevels));
    };

    return {
        level: currentLevel,
        canLevelUp,
        blockedByOther,
        todayLeveledCharacter: dailyLevelUp.characterId,
        getLevelForCharacter,
        setLevelForCharacter,
        attemptLevelUp,
        allLevels: levels
    };
}
