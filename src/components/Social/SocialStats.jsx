import React from 'react';
import { Trophy, TrendingUp, Users, Star, Zap, Crown, Flame, Target, Award, Calendar, Sparkles } from 'lucide-react';

// 継続日数に基づく称号システム
const getTitleByLevel = (level) => {
    if (level >= 365) return { title: '習慣の達人', icon: '👑', color: '#FFD700', desc: '1年間継続！' };
    if (level >= 100) return { title: '伝説の継続者', icon: '🔥', color: '#FF6B6B', desc: '100日継続達成！' };
    if (level >= 60) return { title: '習慣マスター', icon: '💎', color: '#00CED1', desc: '2ヶ月継続！' };
    if (level >= 30) return { title: '継続の鉄人', icon: '⚡', color: '#9B59B6', desc: '1ヶ月継続！' };
    if (level >= 14) return { title: '習慣の挑戦者', icon: '🌟', color: '#3498DB', desc: '2週間継続！' };
    if (level >= 7) return { title: '目覚めし者', icon: '✨', color: '#2ECC71', desc: '1週間継続！' };
    if (level >= 3) return { title: '新たな一歩', icon: '🌱', color: '#95A5A6', desc: '3日継続！' };
    return { title: '始まりの勇者', icon: '🎯', color: '#BDC3C7', desc: 'スタート！' };
};

// 週間チャレンジ（個人化対応）
const getWeeklyChallenge = (userTasks = []) => {
    // 基本チャレンジ
    const baseChallenges = [
        { name: '7日間連続達成', reward: '称号「完璧主義者」', icon: '🎯', type: 'streak' },
        { name: '全タスク完了を5回', reward: 'ボーナス経験値 x2', icon: '⚡', type: 'complete' },
    ];

    // 個人化チャレンジ（ユーザーのタスクに基づく）
    const personalChallenges = [];

    // 運動系タスクがあれば
    if (userTasks.some(t => ['運動', 'トレーニング', 'ジム', 'ラン', '筋トレ', 'ストレッチ'].some(k => t.includes(k)))) {
        personalChallenges.push({ name: '運動を週5回達成', reward: '称号「アスリート」', icon: '💪', type: 'exercise' });
    }

    // 読書系タスクがあれば
    if (userTasks.some(t => ['読書', '本', '勉強', '学習'].some(k => t.includes(k)))) {
        personalChallenges.push({ name: '読書を毎日30分', reward: '称号「読書家」', icon: '📚', type: 'reading' });
    }

    // 早起き系
    personalChallenges.push({ name: '朝6時前に起床を3回', reward: '称号「早起きマスター」', icon: '🌅', type: 'morning' });

    // 全チャレンジから週ごとにローテーション
    const allChallenges = [...baseChallenges, ...personalChallenges];
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    return allChallenges[weekNumber % allChallenges.length];
};

// 継続ボーナス計算
const getContinuationBonus = (level) => {
    if (level >= 30) return { multiplier: 2.0, label: 'x2.0', color: '#FFD700' };
    if (level >= 14) return { multiplier: 1.5, label: 'x1.5', color: '#C0C0C0' };
    if (level >= 7) return { multiplier: 1.2, label: 'x1.2', color: '#CD7F32' };
    return { multiplier: 1.0, label: 'x1.0', color: '#888' };
};

export default function SocialStats({ streak, level, evolutionStage }) {
    const titleInfo = getTitleByLevel(level);
    const weeklyChallenge = getWeeklyChallenge();
    const bonus = getContinuationBonus(level);

    const nextMilestones = [3, 7, 14, 30, 60, 100, 365];
    const nextMilestone = nextMilestones.find(m => m > level);
    const progressToNext = nextMilestone ? Math.round((level / nextMilestone) * 100) : 100;

    // 継続メッセージ
    const motivationalMsg = level >= 100
        ? "🔥 伝説級の継続力！あなたは本物です！"
        : level >= 30
            ? "💪 1ヶ月突破！習慣が定着してきましたね！"
            : level >= 7
                ? "✨ 1週間達成！最初の壁を越えました！"
                : level >= 3
                    ? "🌱 3日坊主を脱出！その調子！"
                    : "🎯 毎日続けることが最強の武器です！";

    return (
        <div className="animate-pop">
            {/* 称号カード */}
            <div
                className="card"
                style={{
                    background: `linear-gradient(145deg, ${titleInfo.color}40, ${titleInfo.color}20)`,
                    border: `2px solid ${titleInfo.color}60`,
                    position: 'relative',
                    overflow: 'hidden',
                    textAlign: 'center',
                    padding: '1.5rem'
                }}
            >
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{titleInfo.icon}</div>
                <h2 style={{ margin: '0 0 4px 0', color: titleInfo.color, fontSize: '1.4rem' }}>
                    {titleInfo.title}
                </h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                    {titleInfo.desc}
                </p>

                {/* 継続日数 */}
                <div style={{
                    marginTop: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Flame size={20} color="#FF6B6B" />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{level}</span>
                        <span style={{ fontSize: '0.8rem', color: '#888' }}>日継続</span>
                    </div>
                    <div style={{
                        background: bonus.color + '30',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${bonus.color}`,
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: bonus.color
                    }}>
                        継続ボーナス {bonus.label}
                    </div>
                </div>
            </div>

            {/* 次のマイルストーン */}
            {nextMilestone && (
                <div className="card" style={{ marginTop: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Target size={18} color="var(--color-accent)" />
                        <span style={{ fontWeight: 'bold' }}>次の目標: {nextMilestone}日継続</span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--color-accent)' }}>
                            あと{nextMilestone - level}日！
                        </span>
                    </div>
                    <div className="progress-bar" style={{ height: '10px' }}>
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${progressToNext}%`,
                                background: 'linear-gradient(90deg, #667eea, #764ba2)'
                            }}
                        />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '8px', marginBottom: 0 }}>
                        {motivationalMsg}
                    </p>
                </div>
            )}

            {/* 週間チャレンジ */}
            <div className="card" style={{ marginTop: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Sparkles size={18} color="#FFD700" />
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>今週のチャレンジ</h3>
                </div>
                <div style={{
                    background: 'rgba(255,215,0,0.1)',
                    border: '1px solid rgba(255,215,0,0.3)',
                    borderRadius: '8px',
                    padding: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{weeklyChallenge.icon}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{weeklyChallenge.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#FFD700' }}>🎁 {weeklyChallenge.reward}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 継続のコツ */}
            <div className="card" style={{ marginTop: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Award size={18} color="#2ECC71" />
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>継続のコツ</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                        { text: '毎日同じ時間に実行する', checked: level >= 3 },
                        { text: '小さく始めて徐々に増やす', checked: level >= 7 },
                        { text: '完璧を目指さない', checked: level >= 14 },
                        { text: '記録を可視化する', checked: level >= 30 },
                    ].map((tip, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            background: tip.checked ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.03)',
                            borderRadius: '6px',
                            fontSize: '0.85rem'
                        }}>
                            <span style={{ color: tip.checked ? '#2ECC71' : '#555' }}>
                                {tip.checked ? '✅' : '⬜'}
                            </span>
                            <span style={{ color: tip.checked ? '#fff' : '#888' }}>{tip.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 週間アクティビティ */}
            <div className="card" style={{ marginTop: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Calendar size={18} />
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>今週の記録</h3>
                </div>
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-end',
                    height: '70px'
                }}>
                    {['月', '火', '水', '木', '金', '土', '日'].map((day, i) => {
                        const isToday = i === (new Date().getDay() + 6) % 7;
                        const isPast = i < (new Date().getDay() + 6) % 7;
                        return (
                            <div key={day} style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{
                                    background: isToday
                                        ? 'linear-gradient(180deg, #FFD700, #FFA500)'
                                        : isPast
                                            ? 'rgba(46,204,113,0.6)'
                                            : 'rgba(255,255,255,0.15)',
                                    height: isToday ? '100%' : isPast ? '80%' : '40%',
                                    borderRadius: '4px',
                                    transition: 'all 0.3s ease',
                                    position: 'relative'
                                }}>
                                    {isToday && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-20px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontSize: '0.6rem',
                                            fontWeight: 'bold',
                                            background: 'rgba(0,0,0,0.5)',
                                            padding: '2px 6px',
                                            borderRadius: '10px'
                                        }}>今日</div>
                                    )}
                                </div>
                                <span style={{
                                    fontSize: '0.6rem',
                                    color: isToday ? '#FFD700' : '#888',
                                    marginTop: '4px',
                                    display: 'block'
                                }}>{day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 応援メッセージ */}
            <div style={{
                textAlign: 'center',
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                marginTop: '0.5rem'
            }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>
                    💡 <strong>継続は力なり</strong> - 毎日少しずつでも続けることが、大きな変化につながります
                </p>
            </div>
        </div>
    );
}
