import React, { useEffect, useState } from 'react';
import { Star, Sparkles } from 'lucide-react';

// CSS for character animations
const characterStyles = `
  @keyframes idle-bounce {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-6px) scale(1.02); }
  }
  
  @keyframes idle-breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes evolution-glow {
    0%, 100% { filter: drop-shadow(0 0 10px var(--glow-color)); }
    50% { filter: drop-shadow(0 0 25px var(--glow-color)); }
  }
  
  @keyframes tap-bounce {
    0% { transform: scale(1); }
    25% { transform: scale(0.9); }
    50% { transform: scale(1.15) translateY(-10px); }
    75% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
  }
  
  .character-idle {
    animation: idle-bounce 2s ease-in-out infinite;
  }
  
  .character-breathe {
    animation: idle-breathe 3s ease-in-out infinite;
  }
  
  .character-tap {
    animation: tap-bounce 0.5s ease-out forwards;
  }
  
  .evolution-stage-1 { --glow-color: transparent; }
  .evolution-stage-2 { --glow-color: rgba(255,215,0,0.6); animation: evolution-glow 2s ease-in-out infinite; }
  .evolution-stage-3 { --glow-color: rgba(147,112,219,0.8); animation: evolution-glow 1.5s ease-in-out infinite; transform: scale(1.1); }
  .evolution-stage-4 { --glow-color: rgba(255,0,100,1); animation: evolution-glow 1s ease-in-out infinite; transform: scale(1.2); }
`;

export default function CharacterDisplay({ character, dialogue, onInteract, evolutionStage }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isTapped, setIsTapped] = useState(false);
    const [showSparkles, setShowSparkles] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 300);
        return () => clearTimeout(timer);
    }, [dialogue]);

    const handleTap = () => {
        setIsTapped(true);
        setShowSparkles(true);
        onInteract();

        setTimeout(() => setIsTapped(false), 500);
        setTimeout(() => setShowSparkles(false), 800);
    };

    const hasImage = character.image && !character.emoji;

    // Determine evolution class
    const getEvolutionClass = () => {
        if (!evolutionStage) return 'evolution-stage-1';
        if (evolutionStage.minStreak >= 100) return 'evolution-stage-4';
        if (evolutionStage.minStreak >= 30) return 'evolution-stage-3';
        if (evolutionStage.minStreak >= 7) return 'evolution-stage-2';
        return 'evolution-stage-1';
    };

    // Get evolution visual modifiers
    const getEvolutionStyle = () => {
        if (!evolutionStage || evolutionStage.minStreak === 0) return {};

        const baseStyle = {
            filter: `drop-shadow(0 8px 16px ${character.color}80)`,
        };

        if (evolutionStage.minStreak >= 100) {
            return {
                ...baseStyle,
                filter: `drop-shadow(0 0 30px ${character.color}) drop-shadow(0 0 60px rgba(255,0,100,0.8))`,
            };
        }
        if (evolutionStage.minStreak >= 30) {
            return {
                ...baseStyle,
                filter: `drop-shadow(0 0 20px ${character.color}) drop-shadow(0 0 40px rgba(147,112,219,0.6))`,
            };
        }
        if (evolutionStage.minStreak >= 7) {
            return {
                ...baseStyle,
                filter: `drop-shadow(0 0 15px rgba(255,215,0,0.8))`,
            };
        }
        return baseStyle;
    };

    // Get size based on evolution
    const getCharacterSize = () => {
        if (!evolutionStage) return 160;
        if (evolutionStage.minStreak >= 100) return 200;
        if (evolutionStage.minStreak >= 30) return 180;
        if (evolutionStage.minStreak >= 7) return 170;
        return 160;
    };

    return (
        <>
            <style>{characterStyles}</style>
            <div className="character-container" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                {/* Evolution Badge */}
                {evolutionStage && evolutionStage.minStreak > 0 && (
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: evolutionStage.minStreak >= 100
                            ? 'linear-gradient(135deg, #FF0055, #FF6B6B, #FFD700)'
                            : evolutionStage.minStreak >= 30
                                ? 'linear-gradient(135deg, #9B59B6, #8E44AD)'
                                : 'linear-gradient(135deg, #FFD700, #FFA500)',
                        color: '#fff',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        border: '2px solid rgba(255,255,255,0.3)'
                    }}>
                        <Star size={14} fill="#fff" />
                        {evolutionStage.name}
                        {evolutionStage.minStreak >= 30 && <Sparkles size={14} />}
                    </div>
                )}

                {/* Speech Bubble */}
                <div
                    className={`speech-bubble ${isAnimating ? 'animate-pop' : ''}`}
                    style={{
                        background: 'var(--color-bg-card)',
                        padding: '1rem 1.5rem',
                        borderRadius: '8px',
                        display: 'inline-block',
                        marginBottom: '1rem',
                        boxShadow: 'var(--shadow-pixel)',
                        maxWidth: '85%',
                        position: 'relative',
                        border: `3px solid ${character.color}`
                    }}
                >
                    <p style={{ fontWeight: 'bold', color: 'var(--color-text-main)', fontSize: '1rem', margin: 0 }}>
                        「{dialogue}」
                    </p>
                </div>

                {/* Character with Animation */}
                <div
                    onClick={handleTap}
                    className={`avatar-wrapper ${isTapped ? 'character-tap' : 'character-idle'} ${getEvolutionClass()}`}
                    style={{
                        cursor: 'pointer',
                        display: 'inline-block',
                        position: 'relative',
                        transition: 'transform 0.2s'
                    }}
                >
                    {/* Sparkle effects on tap */}
                    {showSparkles && (
                        <>
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        width: '20px',
                                        height: '20px',
                                        background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
                                        borderRadius: '50%',
                                        top: `${20 + Math.random() * 60}%`,
                                        left: `${10 + Math.random() * 80}%`,
                                        animation: `sparkle 0.6s ease-out ${i * 0.1}s forwards`,
                                        pointerEvents: 'none'
                                    }}
                                />
                            ))}
                        </>
                    )}

                    {/* Evolution Aura Effect */}
                    {evolutionStage && evolutionStage.minStreak >= 7 && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: `${getCharacterSize() + 80}px`,
                            height: `${getCharacterSize() + 80}px`,
                            borderRadius: '50%',
                            background: evolutionStage.minStreak >= 100
                                ? 'radial-gradient(circle, rgba(255,0,100,0.4) 0%, rgba(255,215,0,0.2) 50%, transparent 70%)'
                                : evolutionStage.minStreak >= 30
                                    ? 'radial-gradient(circle, rgba(147,112,219,0.4) 0%, transparent 70%)'
                                    : 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
                            animation: 'pulse 2s ease-in-out infinite',
                            pointerEvents: 'none'
                        }} />
                    )}

                    {hasImage ? (
                        <img
                            src={character.image}
                            alt={character.name}
                            className="character-breathe"
                            style={{
                                width: `${getCharacterSize()}px`,
                                height: `${getCharacterSize()}px`,
                                objectFit: 'contain',
                                ...getEvolutionStyle(),
                                position: 'relative',
                                zIndex: 1,
                                transition: 'width 0.3s, height 0.3s'
                            }}
                        />
                    ) : (
                        <div
                            className="character-breathe"
                            style={{
                                fontSize: `${getCharacterSize() / 2}px`,
                                ...getEvolutionStyle(),
                                position: 'relative',
                                zIndex: 1,
                                transition: 'font-size 0.3s'
                            }}
                        >
                            {character.emoji}
                        </div>
                    )}
                </div>

                <h2 style={{
                    marginTop: '0.75rem',
                    fontSize: '1.1rem',
                    color: character.color,
                    textShadow: evolutionStage && evolutionStage.minStreak >= 7
                        ? `0 0 15px ${character.color}`
                        : `0 0 10px ${character.color}50`
                }}>
                    {character.name}
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)', marginLeft: '8px' }}>
                        ({character.role})
                    </span>
                </h2>

                {/* Tap hint */}
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-sub)', marginTop: '4px', opacity: 0.7 }}>
                    タップで反応！
                </p>
            </div>
        </>
    );
}
