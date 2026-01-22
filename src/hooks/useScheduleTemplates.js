import { useState, useEffect } from 'react';

const STORAGE_KEY = 'self_hero_schedule_templates';

export function useScheduleTemplates() {
    const [templates, setTemplates] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load schedule templates:', e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    }, [templates]);

    const saveTemplate = (name, schedule, wakeTime, bedTime) => {
        const newTemplate = {
            id: Date.now().toString(),
            name,
            // 保存に必要なデータのみを抽出（必要に応じて）
            schedule,
            wake: wakeTime,
            bed: bedTime,
            createdAt: new Date().toISOString(),
            type: 'custom',
            icon: '⭐' // カスタムテンプレートのアイコン
        };
        setTemplates([...templates, newTemplate]);
        return newTemplate;
    };

    const deleteTemplate = (id) => {
        setTemplates(templates.filter(t => t.id !== id));
    };

    return {
        templates,
        saveTemplate,
        deleteTemplate
    };
}
