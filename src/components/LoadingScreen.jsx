import React, { useEffect, useState, useMemo } from 'react';

export default function LoadingScreen({ allCharacters, onFinish }) {
    const [opacity, setOpacity] = useState(1);

    // ランダムにキャラクター、形態、セリフを選択
    const displayData = useMemo(() => {
        if (!allCharacters) return null;

        const charKeys = Object.keys(allCharacters);
        const randomCharKey = charKeys[Math.floor(Math.random() * charKeys.length)];
        const character = allCharacters[randomCharKey];

        // ランダムなレベル（画像）を選択 (ユーザー要望により第一形態のみ)
        const randomLevel = 1;
        const image = character.images[randomLevel] || character.fallbackImage;

        // ランダムなメッセージを選択
        const messages = character.loadingMessages || [
            '習慣化を身につけてキャラクターを育てよう！',
            '毎日の積み重ねが大事だよ！',
            '準備はいい？さあ始めよう！'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        return {
            image,
            message: randomMessage,
            color: getCharacterColor(character.element)
        };
    }, [allCharacters]);

    useEffect(() => {
        // 2.5秒後にフェードアウト開始
        const timer = setTimeout(() => {
            setOpacity(0);
            // フェードアウト完了後にonFinish
            setTimeout(onFinish, 500);
        }, 2500);
        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!displayData) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'var(--color-bg-main)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            transition: 'opacity 0.5s ease',
            opacity: opacity
        }}>
            <div className="animate-pop" style={{ textAlign: 'center', padding: '20px', width: '100%' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: 'var(--color-primary)',
                    marginBottom: '5px',
                    textShadow: '0 0 20px var(--color-primary)'
                }}>
                    Grow
                </h1>
                <p style={{
                    fontSize: '1rem',
                    color: 'var(--color-text-sub)',
                    fontWeight: 'bold',
                    marginBottom: '40px',
                    letterSpacing: '2px'
                }}>
                    - 育てる習慣 -
                </p>

                <div style={{
                    width: '180px',
                    height: '180px',
                    margin: '0 auto 40px',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '120%',
                        height: '120%',
                        background: `radial-gradient(circle, ${displayData.color}40 0%, transparent 70%)`,
                        animation: 'pulse 2s infinite'
                    }} />
                    <img
                        src={displayData.image}
                        alt="Loading Character"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            animation: 'float 3s ease-in-out infinite',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                        }}
                    />
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '15px 25px',
                    borderRadius: '20px',
                    backdropFilter: 'blur(5px)',
                    maxWidth: '90%',
                    margin: '0 auto',
                    border: `1px solid ${displayData.color}60`
                }}>
                    <p style={{
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        lineHeight: '1.6',
                        margin: 0
                    }}>
                        {displayData.message}
                    </p>
                </div>

                <div style={{
                    marginTop: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6px'
                }}>
                    <div className="loading-dot" style={{ animationDelay: '0s', background: displayData.color }} />
                    <div className="loading-dot" style={{ animationDelay: '0.2s', background: displayData.color }} />
                    <div className="loading-dot" style={{ animationDelay: '0.4s', background: displayData.color }} />
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.4; }
                    100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
                }
                .loading-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    animation: bounce 0.6s infinite alternate;
                }
                @keyframes bounce {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(-10px); opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}

function getCharacterColor(element) {
    switch (element) {
        case '炎': return '#FF6B6B';
        case '水': return '#4ECDC4';
        case '雷': return '#FFD93D';
        case '植物': return '#95E1D3';
        case '影': return '#A8A4CE'; // or purple
        case '光': return '#FFE66D';
        case '土': return '#D4A5A5';
        case '風': return '#A8D8EA';
        default: return '#FF2E63';
    }
}
