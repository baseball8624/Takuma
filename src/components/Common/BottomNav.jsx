import React from 'react';
import { Home, Calendar, Trophy, BarChart3 } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'home', icon: Home, label: 'ホーム' },
        { id: 'schedule', icon: Calendar, label: '予定' },
        { id: 'history', icon: BarChart3, label: '履歴' },
        { id: 'social', icon: Trophy, label: 'ランク' },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '480px',
            background: 'linear-gradient(180deg, rgba(22, 33, 62, 0.95) 0%, rgba(15, 15, 26, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--color-border)',
            padding: '8px 16px',
            paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 100,
            boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.3)'
        }}>
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '10px 24px',
                            background: isActive
                                ? 'linear-gradient(135deg, rgba(255, 46, 99, 0.2), rgba(8, 217, 214, 0.1))'
                                : 'transparent',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-normal)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Active indicator */}
                        {isActive && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '30px',
                                height: '3px',
                                background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                                borderRadius: '0 0 4px 4px'
                            }} />
                        )}

                        <Icon
                            size={22}
                            color={isActive ? 'var(--color-primary)' : 'var(--color-text-sub)'}
                            style={{
                                transition: 'all var(--transition-normal)',
                                filter: isActive ? 'drop-shadow(0 0 8px var(--color-primary-glow))' : 'none'
                            }}
                        />
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'var(--color-text-main)' : 'var(--color-text-sub)',
                            transition: 'all var(--transition-fast)'
                        }}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
