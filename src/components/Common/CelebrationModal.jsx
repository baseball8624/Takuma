import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Star, Sparkles, Trophy, ArrowUp } from 'lucide-react';

// CSS for celebration animations
const celebrationStyles = `
  @keyframes character-celebrate {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-20px) rotate(-5deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
    75% { transform: translateY(-25px) rotate(-3deg); }
  }
  
  @keyframes level-up-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.5); }
    50% { box-shadow: 0 0 60px rgba(255,215,0,0.9), 0 0 100px rgba(255,100,0,0.5); }
  }
  
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse-scale {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  .celebrate-character {
    animation: character-celebrate 0.8s ease-in-out infinite;
  }
  
  .level-up-badge {
    animation: level-up-glow 1s ease-in-out infinite, pulse-scale 2s ease-in-out infinite;
  }
  
  .fade-in-up {
    animation: fade-in-up 0.5s ease-out forwards;
  }
`;

export default function CelebrationModal({ isOpen, onClose, character, level, isLevelUp }) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowConfetti(true);

            // Fire confetti multiple times
            const fireConfetti = () => {
                confetti({
                    particleCount: 80,
                    spread: 100,
                    origin: { y: 0.6, x: 0.5 },
                    colors: [character.color, '#FFD700', '#FF6B6B', '#4ECDC4']
                });
            };

            fireConfetti();
            const interval = setInterval(fireConfetti, 800);

            setTimeout(() => {
                clearInterval(interval);
                setShowConfetti(false);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [isOpen, character]);

    if (!isOpen) return null;

    const hasImage = character.image && !character.emoji;

    // Get praise dialogue for completion
    const getPraise = () => {
        const praises = character.dialogues?.praise || ['すごい！'];
        return praises[Math.floor(Math.random() * praises.length)];
    };

    return (
        <>
            <style>{celebrationStyles}</style>
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.85)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px',
                    cursor: 'pointer'
                }}
            >
                {/* Level Up Badge */}
                {isLevelUp && (
                    <div
                        className="level-up-badge fade-in-up"
                        style={{
                            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                            color: '#000',
                            padding: '12px 24px',
                            borderRadius: '30px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: '3px solid white'
                        }}
                    >
                        <ArrowUp size={24} />
                        LEVEL UP!
                        <ArrowUp size={24} />
                    </div>
                )}

                {/* Character */}
                <div className="celebrate-character" style={{ marginBottom: '20px' }}>
                    {hasImage ? (
                        <img
                            src={character.image}
                            alt={character.name}
                            style={{
                                width: '200px',
                                height: '200px',
                                objectFit: 'contain',
                                filter: `drop-shadow(0 0 30px ${character.color})`
                            }}
                        />
                    ) : (
                        <div style={{
                            fontSize: '8rem',
                            filter: `drop-shadow(0 0 30px ${character.color})`
                        }}>
                            {character.emoji}
                        </div>
                    )}
                </div>

                {/* Speech Bubble */}
                <div
                    className="fade-in-up"
                    style={{
                        background: 'var(--color-bg-card)',
                        padding: '20px 30px',
                        borderRadius: '12px',
                        border: `4px solid ${character.color}`,
                        maxWidth: '90%',
                        textAlign: 'center',
                        marginBottom: '20px',
                        animationDelay: '0.2s'
                    }}
                >
                    <p style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
                        「{getPraise()}」
                    </p>
                </div>

                {/* Level Display */}
                <div
                    className="fade-in-up"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        animationDelay: '0.4s'
                    }}
                >
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        padding: '15px 30px',
                        borderRadius: '12px',
                        border: '2px solid white',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '4px' }}>現在のレベル</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Trophy size={28} />
                            Lv.{level}
                        </div>
                    </div>
                </div>

                {/* Tap to close hint */}
                <p
                    className="fade-in-up"
                    style={{
                        marginTop: '30px',
                        color: '#888',
                        fontSize: '0.8rem',
                        animationDelay: '0.6s'
                    }}
                >
                    タップして閉じる
                </p>
            </div>
        </>
    );
}
