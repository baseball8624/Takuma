import React from 'react';
import { Bell, BellOff, Clock } from 'lucide-react';

export default function NotificationSettings({
    permission,
    notificationEnabled,
    setNotificationEnabled,
    notificationTime,
    setNotificationTime,
    requestPermission,
    characterName = 'パートナー'
}) {
    const handleToggle = async () => {
        if (!notificationEnabled && permission !== 'granted') {
            const granted = await requestPermission();
            if (granted) {
                setNotificationEnabled(true);
            }
        } else {
            setNotificationEnabled(!notificationEnabled);
        }
    };

    return (
        <div className="card" style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <Bell size={20} color="var(--color-accent)" />
                <h3 style={{ margin: 0, fontSize: '1rem' }}>リマインダー通知</h3>
            </div>

            {/* 通知ON/OFFトグル */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                marginBottom: '12px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {notificationEnabled ? <Bell size={18} /> : <BellOff size={18} color="#888" />}
                    <span style={{ fontSize: '0.9rem' }}>通知を受け取る</span>
                </div>
                <button
                    onClick={handleToggle}
                    style={{
                        width: '50px',
                        height: '28px',
                        borderRadius: '14px',
                        border: 'none',
                        background: notificationEnabled ? 'var(--color-primary)' : '#555',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: '3px',
                        left: notificationEnabled ? '25px' : '3px',
                        transition: 'all 0.3s ease'
                    }} />
                </button>
            </div>

            {/* 通知時間設定 */}
            {notificationEnabled && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    marginBottom: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Clock size={18} />
                        <span style={{ fontSize: '0.9rem' }}>通知時刻</span>
                    </div>
                    <input
                        type="time"
                        value={notificationTime}
                        onChange={(e) => setNotificationTime(e.target.value)}
                        style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #555',
                            background: '#222',
                            color: 'white',
                            fontFamily: 'inherit',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
            )}

            {/* 説明 */}
            <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>
                {notificationEnabled
                    ? `📱 タスクが未完了の場合、${notificationTime}に${characterName}がリマインドします`
                    : '通知をONにすると、タスク未完了時にリマインドが届きます'}
            </p>

            {/* 権限の状態 */}
            {permission === 'denied' && (
                <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    background: 'rgba(255,107,107,0.2)',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#FF6B6B'
                }}>
                    ⚠️ ブラウザで通知がブロックされています。設定から許可してください。
                </div>
            )}
        </div>
    );
}
