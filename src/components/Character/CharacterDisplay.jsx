import React, { useEffect, useState } from 'react';
import { Star, Sparkles } from 'lucide-react';

// Custom animation styles
const animationStyles = `
  @keyframes character-idle {
    0%, 100% { 
      transform: translateY(0) scale(1) rotate(0deg); 
    }
    15% { 
      transform: translateY(-8px) scale(1.02) rotate(0.5deg); 
    }
    30% { 
      transform: translateY(-4px) scale(1.01) rotate(-0.3deg); 
    }
    50% { 
      transform: translateY(-12px) scale(1.03) rotate(0.3deg); 
    }
    70% { 
      transform: translateY(-6px) scale(1.01) rotate(-0.5deg); 
    }
    85% { 
      transform: translateY(-10px) scale(1.02) rotate(0.2deg); 
    }
  }
  
  @keyframes character-breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }
  
  @keyframes character-power {
    0%, 100% { 
      transform: scale(1) translateY(0);
      filter: brightness(1);
    }
    25% { 
      transform: scale(1.05) translateY(-5px);
      filter: brightness(1.1);
    }
    50% { 
      transform: scale(1.08) translateY(-10px);
      filter: brightness(1.2);
    }
    75% { 
      transform: scale(1.05) translateY(-5px);
      filter: brightness(1.1);
    }
  }

  @keyframes energy-pulse {
    0%, 100% { 
      opacity: 0.3; 
      transform: translate(-50%, -50%) scale(1);
    }
    50% { 
      opacity: 0.8; 
      transform: translate(-50%, -50%) scale(1.2);
    }
  }
  
  @keyframes spark-fly {
    0% { 
      opacity: 1; 
      transform: translateY(0) scale(1);
    }
    100% { 
      opacity: 0; 
      transform: translateY(-30px) scale(0);
    }
  }
  
  @keyframes character-tap-react {
    0% { transform: scale(1); }
    15% { transform: scale(0.92); }
    30% { transform: scale(1.18) translateY(-20px); }
    50% { transform: scale(1.1) translateY(-15px); }
    70% { transform: scale(1.05) translateY(-8px); }
    100% { transform: scale(1) translateY(0); }
  }
  
  .character-idle-anim {
    animation: character-idle 3.5s ease-in-out infinite;
  }
  
  .character-power-anim {
    animation: character-power 2s ease-in-out infinite;
  }
  
  .character-tap-anim {
    animation: character-tap-react 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  }
`;

export default function CharacterDisplay({ character, dialogue, onInteract, evolutionStage }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isTapped, setIsTapped] = useState(false);
    const [showSparkles, setShowSparkles] = useState(false);
    const [sparks, setSparks] = useState([]);

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 400);
        return () => clearTimeout(timer);
    }, [dialogue]);

    const handleTap = () => {
        setIsTapped(true);
        setShowSparkles(true);

        // Generate random sparks
        const newSparks = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 0.3,
            color: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? character.color : '#fff'
        }));
        setSparks(newSparks);

        onInteract();

        setTimeout(() => setIsTapped(false), 600);
        setTimeout(() => setShowSparkles(false), 1000);
    };

    const hasImage = character.image && !character.emoji;

    // Evolution-based sizing - BIGGER for impact!
    const getCharacterSize = () => {
        let baseSize = 160;
        if (!evolutionStage) baseSize = 160;
        else if (evolutionStage.minStreak >= 100) baseSize = 360; // 伝説級は超巨大
        else if (evolutionStage.minStreak >= 30) baseSize = 260;  // 熟練者は大きめ
        else if (evolutionStage.minStreak >= 7) baseSize = 200;   // 修行中は少し成長

        // フローラは特別サイズ+40px（Lv100未満のみ）
        if (character.id === 'flora' && (!evolutionStage || evolutionStage.minStreak < 100)) {
            baseSize += 40;
        }

        return baseSize;
    };

    // Evolution-based glow effects - 属性ごとに専用エフェクト
    const getEvolutionStyle = () => {
        const baseStyle = {
            filter: `drop-shadow(0 10px 30px ${character.color}60)`,
        };

        const level = evolutionStage?.minStreak || 0;

        // 属性別エフェクト定義
        const elementEffects = {
            // 🔥 イグニス（炎属性）- 赤/オレンジの炎オーラ
            ignis: {
                0: `drop-shadow(0 10px 30px rgba(255,100,0,0.6))`,
                7: `drop-shadow(0 0 15px rgba(255,100,0,0.8)) drop-shadow(0 0 35px rgba(255,50,0,0.5))`,
                30: `drop-shadow(0 0 20px rgba(255,80,0,0.9)) drop-shadow(0 0 50px rgba(255,30,0,0.7)) drop-shadow(0 0 80px rgba(200,0,0,0.5))`,
                100: `drop-shadow(0 0 25px rgba(255,100,0,1)) drop-shadow(0 0 50px rgba(255,50,0,0.9)) drop-shadow(0 0 80px rgba(255,0,0,0.8)) drop-shadow(0 0 120px rgba(255,150,0,0.6)) brightness(1.1)`
            },
            // 💧 アクエル（水属性）- 青/シアンの水オーラ
            aquel: {
                0: `drop-shadow(0 10px 30px rgba(0,150,255,0.6))`,
                7: `drop-shadow(0 0 15px rgba(0,180,255,0.8)) drop-shadow(0 0 35px rgba(0,100,200,0.5))`,
                30: `drop-shadow(0 0 20px rgba(0,200,255,0.9)) drop-shadow(0 0 50px rgba(0,100,200,0.7)) drop-shadow(0 0 80px rgba(0,50,150,0.5))`,
                100: `drop-shadow(0 0 25px rgba(0,220,255,1)) drop-shadow(0 0 50px rgba(0,150,255,0.9)) drop-shadow(0 0 80px rgba(0,80,200,0.8)) drop-shadow(0 0 120px rgba(100,200,255,0.6)) brightness(1.1)`
            },
            // ⚡ ボルト（雷属性）- 黄/電撃オーラ
            bolt: {
                0: `drop-shadow(0 10px 30px rgba(255,220,0,0.6))`,
                7: `drop-shadow(0 0 15px rgba(255,230,0,0.9)) drop-shadow(0 0 35px rgba(200,180,0,0.6))`,
                30: `drop-shadow(0 0 20px rgba(255,240,0,1)) drop-shadow(0 0 50px rgba(255,200,0,0.8)) drop-shadow(0 0 80px rgba(200,150,0,0.5))`,
                100: `drop-shadow(0 0 25px rgba(255,255,100,1)) drop-shadow(0 0 50px rgba(255,230,0,1)) drop-shadow(0 0 80px rgba(255,180,0,0.9)) drop-shadow(0 0 120px rgba(200,200,100,0.6)) brightness(1.2)`
            },
            // 🌿 フローラ（植物属性）- 緑/黄緑の自然オーラ
            flora: {
                0: `drop-shadow(0 10px 30px rgba(0,200,100,0.6))`,
                7: `drop-shadow(0 0 15px rgba(100,220,100,0.8)) drop-shadow(0 0 35px rgba(50,180,50,0.5))`,
                30: `drop-shadow(0 0 20px rgba(100,255,100,0.9)) drop-shadow(0 0 50px rgba(50,200,50,0.7)) drop-shadow(0 0 80px rgba(0,150,50,0.5))`,
                100: `drop-shadow(0 0 25px rgba(150,255,150,1)) drop-shadow(0 0 50px rgba(100,230,100,0.9)) drop-shadow(0 0 80px rgba(50,200,80,0.8)) drop-shadow(0 0 120px rgba(200,255,150,0.6)) brightness(1.1)`
            },
            // 🌑 シャドウ（影属性）- 紫/黒の闇オーラ
            shadow: {
                0: `drop-shadow(0 10px 30px rgba(80,0,120,0.6))`,
                7: `drop-shadow(0 0 15px rgba(100,0,150,0.7)) drop-shadow(0 0 35px rgba(80,0,120,0.5))`,
                30: `drop-shadow(0 0 20px rgba(100,0,150,0.8)) drop-shadow(0 0 50px rgba(60,0,100,0.6)) drop-shadow(0 0 80px rgba(30,0,50,0.4))`,
                100: `drop-shadow(0 0 25px rgba(120,0,180,0.9)) drop-shadow(0 0 50px rgba(80,0,120,0.8)) drop-shadow(0 0 80px rgba(20,0,40,0.7)) drop-shadow(0 0 120px rgba(150,0,200,0.5))`
            },
            // ✨ ルミナ（光属性）- 白/金の光オーラ
            lumina: {
                0: `drop-shadow(0 10px 30px rgba(255,250,200,0.4))`,
                7: `drop-shadow(0 0 12px rgba(255,255,220,0.6)) drop-shadow(0 0 30px rgba(255,220,150,0.4))`,
                30: `drop-shadow(0 0 15px rgba(255,255,240,0.7)) drop-shadow(0 0 40px rgba(255,230,180,0.5)) drop-shadow(0 0 60px rgba(255,200,100,0.3))`,
                100: `drop-shadow(0 0 20px rgba(255,255,255,0.7)) drop-shadow(0 0 40px rgba(255,250,200,0.6)) drop-shadow(0 0 60px rgba(255,220,150,0.4))`
            },
            // ⚙️ ギア（機械属性）- 青緑/シアンのデジタルオーラ
            gear: {
                0: `drop-shadow(0 10px 30px rgba(0,200,200,0.6))`,
                7: `drop-shadow(0 0 15px rgba(0,220,220,0.8)) drop-shadow(0 0 35px rgba(0,150,180,0.5))`,
                30: `drop-shadow(0 0 20px rgba(0,255,255,0.9)) drop-shadow(0 0 50px rgba(0,180,200,0.7)) drop-shadow(0 0 80px rgba(0,100,150,0.5))`,
                100: `drop-shadow(0 0 25px rgba(100,255,255,1)) drop-shadow(0 0 50px rgba(0,230,230,0.9)) drop-shadow(0 0 80px rgba(0,180,200,0.8)) drop-shadow(0 0 120px rgba(50,200,220,0.6)) brightness(1.15)`
            }
        };

        const effects = elementEffects[character.id];
        if (effects) {
            let effectLevel = 0;
            if (level >= 100) effectLevel = 100;
            else if (level >= 30) effectLevel = 30;
            else if (level >= 7) effectLevel = 7;

            return { filter: effects[effectLevel] };
        }

        return baseStyle;
    };

    // Animation class based on evolution
    const getAnimationClass = () => {
        if (isTapped) return 'character-tap-anim';
        if (evolutionStage && evolutionStage.minStreak >= 30) return 'character-power-anim';
        return 'character-idle-anim';
    };

    return (
        <>
            <style>{animationStyles}</style>
            <div style={{ textAlign: 'center', padding: '0.5rem 0 1.5rem' }}>
                {/* Evolution Badge */}
                {evolutionStage && evolutionStage.minStreak > 0 && (
                    <div
                        className="animate-pop"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: evolutionStage.minStreak >= 100
                                ? 'linear-gradient(135deg, #FF2E63, #FF6B6B, #FFD700)'
                                : evolutionStage.minStreak >= 30
                                    ? 'linear-gradient(135deg, #764ba2, #667eea)'
                                    : 'linear-gradient(135deg, #FFD700, #FFA500)',
                            color: evolutionStage.minStreak >= 30 ? '#fff' : '#000',
                            padding: '8px 18px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                            border: '2px solid rgba(255,255,255,0.3)'
                        }}
                    >
                        <Star size={16} fill="currentColor" />
                        {evolutionStage.name}
                        {evolutionStage.minStreak >= 30 && <Sparkles size={16} />}
                    </div>
                )}

                {/* 次の進化までの表示 */}
                {evolutionStage && (() => {
                    const currentLevel = evolutionStage.minStreak;
                    const evolutionLevels = [7, 30, 100];
                    const nextEvolution = evolutionLevels.find(lvl => lvl > currentLevel);

                    if (nextEvolution) {
                        const remaining = nextEvolution - currentLevel;
                        // Lv1=第1形態、Lv7=第2形態、Lv30=第3形態、Lv100=第4形態（最終）
                        const nextEvolutionName = nextEvolution === 7 ? '第2形態' : nextEvolution === 30 ? '第3形態' : '第4形態（最終）';
                        return (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                background: 'rgba(255,255,255,0.1)',
                                padding: '6px 14px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                marginBottom: '8px',
                                color: 'var(--color-accent)'
                            }}>
                                <Sparkles size={12} />
                                <span>
                                    <span style={{ color: '#fff' }}>{nextEvolutionName}</span>まであと
                                    <span style={{ fontWeight: 'bold', color: '#FFD700', margin: '0 4px' }}>{remaining}</span>
                                    レベル
                                </span>
                            </div>
                        );
                    } else if (currentLevel >= 100) {
                        return (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,46,99,0.2))',
                                padding: '6px 14px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                marginBottom: '8px',
                                color: '#FFD700',
                                border: '1px solid rgba(255,215,0,0.3)'
                            }}>
                                <Star size={12} fill="currentColor" />
                                <span>最終形態到達！</span>
                                <Star size={12} fill="currentColor" />
                            </div>
                        );
                    }
                    return null;
                })()}

                {/* Speech Bubble */}
                <div
                    className={isAnimating ? 'animate-pop' : ''}
                    style={{
                        background: 'linear-gradient(145deg, var(--color-bg-card), rgba(22, 33, 62, 0.8))',
                        padding: '16px 24px',
                        borderRadius: 'var(--radius-md)',
                        display: 'inline-block',
                        marginBottom: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        maxWidth: '90%',
                        position: 'relative',
                        border: `2px solid ${character.color}50`,
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <p style={{
                        fontWeight: 'bold',
                        color: 'var(--color-text-main)',
                        fontSize: '1rem',
                        margin: 0,
                        lineHeight: 1.6
                    }}>
                        「{dialogue}」
                    </p>
                    <div style={{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderTop: `10px solid ${character.color}50`
                    }} />
                </div>

                {/* Character Container */}
                <div
                    onClick={handleTap}
                    style={{
                        cursor: 'pointer',
                        display: 'inline-block',
                        position: 'relative',
                        minHeight: `${getCharacterSize() + 40}px`
                    }}
                >
                    {/* Energy Aura for evolved forms - Lv7から表示 */}
                    {evolutionStage && evolutionStage.minStreak >= 7 && (
                        <>
                            {/* 外側オーラ (Lv30+) */}
                            {evolutionStage.minStreak >= 30 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: `${getCharacterSize() + 140}px`,
                                    height: `${getCharacterSize() + 140}px`,
                                    borderRadius: '50%',
                                    background: evolutionStage.minStreak >= 100
                                        ? 'radial-gradient(circle, rgba(255,46,99,0.5) 0%, rgba(255,215,0,0.3) 30%, rgba(147,112,219,0.2) 50%, transparent 70%)'
                                        : 'radial-gradient(circle, rgba(118,75,162,0.4) 0%, rgba(102,126,234,0.2) 40%, transparent 70%)',
                                    animation: 'energy-pulse 2.5s ease-in-out infinite',
                                    pointerEvents: 'none'
                                }} />
                            )}
                            {/* 中央オーラ */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: `${getCharacterSize() + 80}px`,
                                height: `${getCharacterSize() + 80}px`,
                                borderRadius: '50%',
                                background: evolutionStage.minStreak >= 100
                                    ? `radial-gradient(circle, ${character.color}50 0%, rgba(255,215,0,0.3) 40%, transparent 70%)`
                                    : evolutionStage.minStreak >= 30
                                        ? `radial-gradient(circle, ${character.color}40 0%, rgba(118,75,162,0.2) 50%, transparent 70%)`
                                        : `radial-gradient(circle, rgba(255,215,0,0.35) 0%, rgba(255,180,0,0.15) 50%, transparent 70%)`,
                                animation: 'energy-pulse 2s ease-in-out infinite',
                                pointerEvents: 'none'
                            }} />
                            {/* 内側オーラ */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: `${getCharacterSize() + 40}px`,
                                height: `${getCharacterSize() + 40}px`,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${character.color}40 0%, transparent 60%)`,
                                animation: 'energy-pulse 1.5s ease-in-out infinite 0.3s',
                                pointerEvents: 'none'
                            }} />
                        </>
                    )}

                    {/* Sparkle effects on tap */}
                    {showSparkles && sparks.map(spark => (
                        <div
                            key={spark.id}
                            style={{
                                position: 'absolute',
                                width: '8px',
                                height: '8px',
                                background: spark.color,
                                borderRadius: '50%',
                                top: `${spark.y}%`,
                                left: `${spark.x}%`,
                                animation: `spark-fly 0.8s ease-out ${spark.delay}s forwards`,
                                boxShadow: `0 0 10px ${spark.color}`,
                                pointerEvents: 'none',
                                zIndex: 10
                            }}
                        />
                    ))}

                    {/* Character Image */}
                    <div className={getAnimationClass()}>
                        {hasImage ? (
                            <img
                                src={character.image}
                                alt={character.name}
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
                                style={{
                                    fontSize: `${getCharacterSize() / 2}px`,
                                    ...getEvolutionStyle(),
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                {character.emoji}
                            </div>
                        )}
                    </div>
                </div>

                {/* Character Name */}
                <h2 style={{
                    marginTop: '8px',
                    fontSize: '1.15rem',
                    color: character.color,
                    textShadow: `0 0 25px ${character.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    {character.displayName || character.name}
                    <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-sub)',
                        fontWeight: 'normal',
                        background: 'rgba(255,255,255,0.1)',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)'
                    }}>
                        {character.role}
                    </span>
                </h2>

                <p style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '4px',
                    opacity: 0.6
                }}>
                    タップで反応！
                </p>
            </div>
        </>
    );
}
