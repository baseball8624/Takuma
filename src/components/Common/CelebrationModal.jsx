import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Star, Sparkles, Trophy, ArrowUp, X, Save, Copy } from 'lucide-react';
import { createBackupString } from '../../utils/backupUtils';

export default function CelebrationModal({ isOpen, onClose, character, level, isLevelUp }) {
    const [showContent, setShowContent] = useState(false);
    const [showLevel, setShowLevel] = useState(false);
    const [showBackup, setShowBackup] = useState(false);
    const [backupCode, setBackupCode] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Stagger animations
            setTimeout(() => setShowContent(true), 100);
            setTimeout(() => setShowLevel(true), 500);

            // Enhanced confetti
            const fireConfetti = () => {
                // Left side
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.6 },
                    colors: [character.color, '#FFD700', '#FF6B6B', '#4ECDC4', '#ffffff']
                });
                // Right side
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.6 },
                    colors: [character.color, '#FFD700', '#FF6B6B', '#4ECDC4', '#ffffff']
                });
            };

            fireConfetti();
            const interval = setInterval(fireConfetti, 600);

            setTimeout(() => {
                clearInterval(interval);
            }, 2500);

            return () => clearInterval(interval);
        } else {
            setShowContent(false);
            setShowLevel(false);
        }
    }, [isOpen, character]);

    if (!isOpen) return null;

    const hasImage = character.image && !character.emoji;

    const getPraise = () => {
        const praises = character.dialogues?.praise || ['すごい！'];
        return praises[Math.floor(Math.random() * praises.length)];
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
            }}
        >
            {/* Close hint */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                }}
            >
                <X size={20} color="white" />
            </button>

            {/* Level Up Badge */}
            {isLevelUp && showContent && (
                <div
                    style={{
                        background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF6B35)',
                        color: '#000',
                        padding: '14px 28px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 0 40px rgba(255,215,0,0.5), 0 4px 20px rgba(0,0,0,0.3)',
                        animation: 'fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        border: '2px solid rgba(255,255,255,0.3)'
                    }}
                >
                    <ArrowUp size={24} strokeWidth={3} />
                    LEVEL UP!
                    <ArrowUp size={24} strokeWidth={3} />
                </div>
            )}

            {/* Character */}
            {showContent && (
                <div
                    style={{
                        marginBottom: '24px',
                        animation: 'float 2s ease-in-out infinite'
                    }}
                >
                    {hasImage ? (
                        <img
                            src={character.image}
                            alt={character.name}
                            style={{
                                width: '180px',
                                height: '180px',
                                objectFit: 'contain',
                                filter: `drop-shadow(0 0 40px ${character.color})`,
                                animation: 'fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s both'
                            }}
                        />
                    ) : (
                        <div style={{
                            fontSize: '7rem',
                            filter: `drop-shadow(0 0 40px ${character.color})`,
                            animation: 'fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s both'
                        }}>
                            {character.emoji}
                        </div>
                    )}
                </div>
            )}

            {/* Speech Bubble */}
            {showContent && (
                <div
                    style={{
                        background: 'linear-gradient(145deg, var(--color-bg-card), rgba(22, 33, 62, 0.9))',
                        padding: '20px 32px',
                        borderRadius: 'var(--radius-lg)',
                        border: `3px solid ${character.color}`,
                        maxWidth: '90%',
                        textAlign: 'center',
                        marginBottom: '24px',
                        boxShadow: `0 0 30px ${character.color}40, 0 8px 32px rgba(0,0,0,0.4)`,
                        animation: 'fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both'
                    }}
                >
                    <p style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        margin: 0,
                        color: 'white',
                        lineHeight: 1.5
                    }}>
                        「{getPraise()}」
                    </p>
                </div>
            )}

            {/* Level Display */}
            {showLevel && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        animation: 'fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                >
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                        padding: '20px 40px',
                        borderRadius: 'var(--radius-lg)',
                        border: '2px solid rgba(255,255,255,0.2)',
                        textAlign: 'center',
                        boxShadow: '0 0 40px rgba(102, 126, 234, 0.3), 0 8px 32px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                            現在のレベル
                        </div>
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            color: '#FFD700',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            textShadow: '0 0 20px rgba(255,215,0,0.5)'
                        }}>
                            <Trophy size={32} />
                            Lv.{level}
                        </div>
                    </div>
                </div>
            )}

            {/* Tap hint */}
            {!showBackup && (
                <p style={{
                    marginTop: '32px',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.8rem',
                    animation: 'fadeIn 0.5s ease 0.8s both'
                }}>
                    タップして閉じる
                </p>
            )}

            {/* Backup Section */}
            {showContent && (
                <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '20px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {!showBackup ? (
                        <button
                            onClick={() => {
                                const code = createBackupString();
                                setBackupCode(code);
                                setShowBackup(true);
                            }}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                color: 'white',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                animation: 'fadeIn 0.5s ease 1s both'
                            }}
                        >
                            <Save size={16} />
                            今日のデータを保存する
                        </button>
                    ) : (
                        <div style={{
                            background: 'rgba(20, 20, 30, 0.9)',
                            padding: '16px',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            width: '100%',
                            animation: 'fadeInUp 0.3s ease'
                        }}>
                            <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '8px' }}>
                                以下のコードをコピーして保存してください：
                            </p>
                            <textarea
                                readOnly
                                value={backupCode}
                                style={{
                                    width: '100%',
                                    height: '80px',
                                    background: 'rgba(0,0,0,0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#eee',
                                    padding: '8px',
                                    fontSize: '0.7rem',
                                    fontFamily: 'monospace',
                                    resize: 'none',
                                    marginBottom: '8px'
                                }}
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(backupCode);
                                    alert('コードをコピーしました！');
                                }}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    background: 'var(--color-primary)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Copy size={16} />
                                コードをコピー
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
