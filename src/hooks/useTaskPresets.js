import { useState, useEffect } from 'react';

const STORAGE_KEY = 'self_hero_tasks_presets';

export function useTaskPresets() {
    const [presets, setPresets] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [
            // 生活基本
            { id: 'sleep', name: '睡眠', duration: 420, color: '#2C3E50' },
            { id: 'morning_prep', name: '朝の準備', duration: 30, color: '#95A5A6' },
            { id: 'breakfast', name: '朝食', duration: 30, color: '#FFB347' },
            { id: 'lunch', name: '昼食', duration: 60, color: '#FFB347' },
            { id: 'dinner', name: '夕食', duration: 60, color: '#FFB347' },
            { id: 'bath', name: '入浴', duration: 30, color: '#4ECDC4' },
            // 移動
            { id: 'commute_am', name: '通勤・通学', duration: 60, color: '#87CEEB' },
            { id: 'commute_pm', name: '帰宅', duration: 60, color: '#87CEEB' },
            // 仕事・学業
            { id: 'work', name: '仕事', duration: 480, color: '#3498DB' },
            { id: 'school', name: '授業・学校', duration: 360, color: '#9B59B6' },
            // 家事
            { id: 'housework', name: '家事', duration: 60, color: '#E74C3C' },
            { id: 'cooking', name: '料理', duration: 60, color: '#F39C12' },
            // リラックス
            { id: 'relax', name: 'リラックスタイム', duration: 60, color: '#AA96DA' },
            { id: 'tv_youtube', name: 'TV・YouTube', duration: 60, color: '#E91E63' },
            { id: 'game', name: 'ゲーム', duration: 60, color: '#8E44AD' },
            { id: 'sns', name: 'SNS', duration: 30, color: '#1DA1F2' },
            // 自己投資
            { id: 'study', name: '勉強', duration: 60, color: '#27AE60' },
            { id: 'exercise', name: '運動', duration: 30, color: '#E67E22' },
            { id: 'reading', name: '読書', duration: 30, color: '#FFE66D' },
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
