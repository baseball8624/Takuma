import React, { useEffect, useState } from 'react';
import { Star, Sparkles } from 'lucide-react';

// 極限強化版アニメーションスタイル
const animationStyles = `
  /* 🌊 メイン浮遊アニメーション - より大きく滑らかに */
  @keyframes character-float {
    0%, 100% { 
      transform: translateY(0) scale(1) rotate(0deg); 
    }
    15% { 
      transform: translateY(-20px) scale(1.02) rotate(1.5deg); 
    }
    30% { 
      transform: translateY(-12px) scale(1.01) rotate(-0.5deg); 
    }
    50% { 
      transform: translateY(-28px) scale(1.03) rotate(-1deg); 
    }
    70% { 
      transform: translateY(-15px) scale(1.02) rotate(0.5deg); 
    }
    85% { 
      transform: translateY(-25px) scale(1.01) rotate(-0.5deg); 
    }
  }

  /* 💨 呼吸アニメーション */
  @keyframes character-breathe {
    0%, 100% { 
      transform: scaleY(1) scaleX(1);
    }
    30% { 
      transform: scaleY(1.02) scaleX(0.99);
    }
    60% { 
      transform: scaleY(0.98) scaleX(1.01);
    }
  }

  /* ✨ 横揺れアニメーション */
  @keyframes character-sway {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    25% { transform: translateX(-5px) rotate(-0.5deg); }
    50% { transform: translateX(3px) rotate(0.3deg); }
    75% { transform: translateX(-3px) rotate(-0.3deg); }
  }

  /* 👁️ まばたきエフェクト（明るさ変化） */
  @keyframes character-blink {
    0%, 90%, 100% { filter: brightness(1); }
    92% { filter: brightness(0.95); }
    94% { filter: brightness(0.9); }
    96% { filter: brightness(0.95); }
  }

  /* 🔥 パワーモードアニメーション */
  @keyframes character-power {
    0%, 100% { 
      transform: scale(1) translateY(0) rotate(0deg);
      filter: brightness(1);
    }
    20% { 
      transform: scale(1.06) translateY(-15px) rotate(1deg);
      filter: brightness(1.15);
    }
    40% { 
      transform: scale(1.08) translateY(-10px) rotate(-1deg);
      filter: brightness(1.25);
    }
    60% { 
      transform: scale(1.1) translateY(-20px) rotate(0.5deg);
      filter: brightness(1.3);
    }
    80% { 
      transform: scale(1.06) translateY(-12px) rotate(-0.5deg);
      filter: brightness(1.15);
    }
  }

  /* 💫 オーラ脈動アニメーション */
  @keyframes aura-pulse {
    0%, 100% { 
      opacity: 0.4; 
      transform: translate(-50%, -50%) scale(1);
      filter: blur(20px);
    }
    50% { 
      opacity: 0.8; 
      transform: translate(-50%, -50%) scale(1.15);
      filter: blur(25px);
    }
  }

  /* 🌟 パーティクル上昇アニメーション */
  @keyframes particle-rise {
    0% { 
      opacity: 0;
      transform: translateY(0) translateX(0) scale(0.5);
    }
    20% { 
      opacity: 1;
    }
    80% { 
      opacity: 1;
    }
    100% { 
      opacity: 0;
      transform: translateY(-100px) translateX(var(--x-drift, 10px)) scale(0);
    }
  }

  /* 🌈 虹色のキラキラ */
  @keyframes sparkle-rainbow {
    0%, 100% { color: #FFD700; opacity: 0.8; }
    25% { color: #FF6B6B; opacity: 1; }
    50% { color: #4ECDC4; opacity: 0.9; }
    75% { color: #A855F7; opacity: 1; }
  }

  /* 🔮 影の動きアニメーション */
  @keyframes shadow-float {
    0%, 100% { 
      transform: translateX(-50%) scaleX(1) scaleY(1);
      opacity: 0.3;
    }
    25% { 
      transform: translateX(-52%) scaleX(0.9) scaleY(0.85);
      opacity: 0.25;
    }
    50% { 
      transform: translateX(-50%) scaleX(0.85) scaleY(0.8);
      opacity: 0.2;
    }
    75% { 
      transform: translateX(-48%) scaleX(0.9) scaleY(0.85);
      opacity: 0.25;
    }
  }

  /* 👆 タップリアクション */
  @keyframes character-tap-react {
    0% { transform: scale(1); }
    10% { transform: scale(0.9); }
    25% { transform: scale(1.2) translateY(-30px) rotate(5deg); }
    40% { transform: scale(1.15) translateY(-20px) rotate(-3deg); }
    60% { transform: scale(1.1) translateY(-15px) rotate(2deg); }
    80% { transform: scale(1.05) translateY(-8px) rotate(-1deg); }
    100% { transform: scale(1) translateY(0) rotate(0deg); }
  }

  /* ⚡ エネルギースパーク */
  @keyframes energy-spark {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
  }

  /* 🎭 複合アニメーションクラス */
  .character-idle-anim {
    animation: 
      character-float 3s ease-in-out infinite,
      character-breathe 4s ease-in-out infinite,
      character-sway 5s ease-in-out infinite,
      character-blink 8s ease-in-out infinite;
  }
  
  .character-power-anim {
    animation: 
      character-power 2s ease-in-out infinite,
      character-breathe 2.5s ease-in-out infinite;
  }
  
  .character-tap-anim {
    animation: character-tap-react 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  }

  /* 🌟 パーティクルコンテナ */
  .particle {
    position: absolute;
    pointer-events: none;
    animation: particle-rise 2s ease-out forwards;
  }

  /* ✨ キラキラエフェクト */
  .sparkle-effect {
    animation: sparkle-rainbow 2s ease-in-out infinite;
  }

  /* 🔮 影エフェクト */
  .character-shadow {
    animation: shadow-float 3s ease-in-out infinite;
  }

  /* 💫 オーラエフェクト */
  .aura-effect {
    animation: aura-pulse 2s ease-in-out infinite;
  }
`;

export default function CharacterDisplay({ character, dialogue, onInteract, evolutionStage, level = 1 }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [sparks, setSparks] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);

  // スプライトアニメーション（複数フレームがある場合）
  useEffect(() => {
    if (character?.spriteFrames) {
      let levelKey = 1;
      if (level >= 100) levelKey = 100;
      else if (level >= 30) levelKey = 30;
      else if (level >= 7) levelKey = 7;

      const frames = character.spriteFrames[levelKey];
      if (frames && frames.length > 1) {
        const interval = setInterval(() => {
          setCurrentFrame(prev => (prev + 1) % frames.length);
        }, 400); // 400msごとにフレーム切り替え
        return () => clearInterval(interval);
      }
    }
  }, [character, level]);

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

    setTimeout(() => setIsTapped(false), 2000); // アクション画像をしっかり見せるため2秒に延長
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
        {/* Evolution Badge Removed */}

        {/* Next Evolution Hint Removed */}

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
          {/* Energy Aura Removed */}

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

          {/* 🔮 浮遊する影 */}
          <div
            className="character-shadow"
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: `${getCharacterSize() * 0.6}px`,
              height: '15px',
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />

          {/* Character Image */}
          <div className={getAnimationClass()}>
            {hasImage ? (() => {
              // レベルキー取得
              let levelKey = 1;
              if (level >= 100) levelKey = 100;
              else if (level >= 30) levelKey = 30;
              else if (level >= 7) levelKey = 7;

              // タップアクション画像があるかチェック
              const tapImage = character.tapImages?.[levelKey];

              // スプライトフレームがあるかチェック
              const frames = character.spriteFrames?.[levelKey];

              // 画像ソース決定：タップ中かつタップ画像あり > スプライト > 通常画像
              let imageSrc = character.image;
              let scale = 1;

              if (isTapped && tapImage) {
                imageSrc = tapImage;
                scale = 1.3; // タップ画像は1.3倍
              } else if (frames && frames.length > 0) {
                imageSrc = frames[currentFrame % frames.length];
              }

              return (
                <img
                  src={imageSrc}
                  alt={character.name}
                  style={{
                    width: `${getCharacterSize() * scale}px`,
                    height: `${getCharacterSize()}px`,
                    objectFit: 'contain',
                    ...getEvolutionStyle(),
                    position: 'relative',
                    zIndex: 1,
                    transition: 'opacity 0.2s ease-in-out', // 画像切り替えをスムーズに
                    filter: isTapped ? 'brightness(1.2) drop-shadow(0 0 15px currentColor)' : 'none' // タップ時に発光
                  }}
                />
              );
            })() : (
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
