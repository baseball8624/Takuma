import { useState, useEffect } from 'react';

const STORAGE_KEY = 'self_hero_tasks_presets';

export function useTaskPresets() {
    const [presets, setPresets] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [
            { id: '1', name: '集中作業', duration: 60, color: '#FF6B6B' },
            { id: '2', name: '運動', duration: 30, color: '#4ECDC4' },
            { id: '3', name: '休憩', duration: 30, color: '#95E1D3' },
            { id: '4', name: '勉強', duration: 60, color: '#AA96DA' },
            { id: '5', name: '読書', duration: 30, color: '#FFE66D' },
        ];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    }, [presets]);

    const addPreset = (name, duration, color = '#FF6B6B') => {
        const newPreset = {
            id: Date.now().toString(),
            name,
            duration: parseInt(duration) || 30,
            color
        };
        setPresets([...presets, newPreset]);
        return newPreset;
    };

    const deletePreset = (id) => {
        setPresets(presets.filter(p => p.id !== id));
    };

    const updatePreset = (id, updates) => {
        setPresets(presets.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    return {
        presets,
        addPreset,
        deletePreset,
        updatePreset
    };
}
