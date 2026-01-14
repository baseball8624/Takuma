import React from 'react';
import { Trophy, TrendingUp, Users, Star, Zap } from 'lucide-react';

export default function SocialStats({ streak, level, evolutionStage }) {
    const userRank = streak > 30 ? "伝説" : streak > 7 ? "上位 10%" : streak > 0 ? "上位 45%" : "駆け出し";
    const motivationalMsg = streak > 30
        ? "あなたは伝説の領域に到達しました！"
        : streak > 7
            ? "素晴らしい継続力です！"
            : "みんな最初はここからスタートです。";

    // Next evolution milestone
    const nextMilestone = streak < 7 ? 7 : streak < 30 ? 30 : streak < 100 ? 100 : null;
    const progressToNext = nextMilestone ? Math.round((streak / nextMilestone) * 100) : 100;

    return (
        <div className="card" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            marginTop: '1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative background circle */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={20} className="animate-float" />
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>ランク: {userRank}</h3>
                </div>
                <div style={{ fontSize: '0.9rem', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px' }}>
                    🔥 継続 {streak} 日目
                </div>
            </div>

            {/* Evolution Progress */}
            {evolutionStage && (
                <div style={{ marginBottom: '1rem', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Zap size={16} color="#FFD700" />
                        <span style={{ fontSize: '0.85rem' }}>現在の称号: <strong>{evolutionStage.name}</strong></span>
                    </div>
                    {nextMilestone && (
                        <>
                            <div style={{ fontSize: '0.75rem', marginBottom: '4px', opacity: 0.8 }}>
                                次の進化まで: {nextMilestone - streak}日
                            </div>
                            <div style={{ height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${progressToNext}%`,
                                    background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                                    transition: 'width 0.5s'
                                }} />
                            </div>
                        </>
                    )}
                </div>
            )}

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '60px', marginBottom: '10px' }}>
                {/* Mock Bar Chart */}
                {[30, 45, 60, 80, 50, 30].map((h, i) => (
                    <div key={i} style={{
                        flex: 1,
                        background: i === 3 ? '#FFE66D' : 'rgba(255,255,255,0.3)',
                        height: `${h}%`,
                        borderRadius: '4px',
                        position: 'relative'
                    }}>
                        {i === 3 && (
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap'
                            }}>
                                You
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <p style={{ fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} />
                {motivationalMsg}
            </p>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '0.8rem', opacity: 0.9 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Users size={14} />
                    <span>同世代のユーザー 1,240人が今日タスクを完了しました</span>
                </div>
            </div>
        </div>
    );
}
