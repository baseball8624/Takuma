import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ characterImage, onFinish }) {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        // 2秒後にフェードアウト開始
        const timer = setTimeout(() => {
            setOpacity(0);
            // フェードアウト完了後にonFinish
            setTimeout(onFinish, 500);
        }, 2000);
        return () => clearTimeout(timer);
    }, [onFinish]);

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
            <div className="animate-pop" style={{ textAlign: 'center', padding: '20px' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '900',
                    color: 'var(--color-primary)',
                    marginBottom: '20px',
                    textShadow: '0 0 20px var(--color-primary)'
                }}>
                    Grow
                </h1>

                {characterImage && (
                    <div style={{
                        width: '120px',
                        height: '120px',
                        margin: '0 auto 30px',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            height: '100%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                            animation: 'pulse 2s infinite'
                        }} />
                        <img
                            src={characterImage}
                            alt="Loading Character"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                animation: 'float 3s ease-in-out infinite'
                            }}
                        />
                    </div>
                )}

                <p style={{
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    lineHeight: '1.6',
                    maxWidth: '80%',
                    margin: '0 auto'
                }}>
                    習慣化を身につけて<br />
                    キャラクターを育てよう！
                </p>

                <div style={{
                    marginTop: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '4px'
                }}>
                    <div className="loading-dot" style={{ animationDelay: '0s' }} />
                    <div className="loading-dot" style={{ animationDelay: '0.2s' }} />
                    <div className="loading-dot" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.2; }
                    100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
                }
                .loading-dot {
                    width: 8px;
                    height: 8px;
                    background: var(--color-accent);
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
