import React from 'react';
import { Home, Calendar, Trophy } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'home', icon: Home, label: 'ホーム' },
        { id: 'schedule', icon: Calendar, label: '予定' },
        { id: 'social', icon: Trophy, label: 'ランク' },
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--color-bg-card)',
            borderTop: '2px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '12px 0 24px', // Extra padding for safe area
            zIndex: 100,
            boxShadow: '0 -4px 0px rgba(0,0,0,0.2)',
            maxWidth: '480px', // constrain to max-width of app
            margin: '0 auto' // center
        }}>
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        style={{
                            background: 'none',
                            border: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                            borderRadius: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            color: isActive ? 'var(--color-primary)' : 'var(--color-text-sub)',
                            cursor: 'pointer',
                            flex: 1,
                            transition: 'all 0.1s',
                            transform: isActive ? 'translateY(-4px)' : 'none',
                            margin: '0 4px',
                            padding: '6px 0'
                        }}
                    >
                        <Icon size={20} strokeWidth={isActive ? 3 : 2} />
                        <span style={{ fontSize: '0.6rem', fontWeight: isActive ? 'bold' : 'normal', fontFamily: '"DotGothic16"' }}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
