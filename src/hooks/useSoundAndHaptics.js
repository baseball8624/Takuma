import { useCallback } from 'react';

// サウンドと振動を管理するフック
export default function useSoundAndHaptics() {
    // サウンドを有効/無効にする設定
    const soundEnabled = localStorage.getItem('self_hero_sound') !== 'false';
    const hapticEnabled = localStorage.getItem('self_hero_haptic') !== 'false';

    // サウンドエフェクト（Web Audio API使用）
    const playSound = useCallback((type) => {
        if (!soundEnabled) return;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch (type) {
            case 'complete': // タスク完了
                oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
                oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
                oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.4);
                break;

            case 'levelup': // レベルアップ
                oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
                oscillator.frequency.setValueAtTime(523, audioContext.currentTime + 0.15); // C5
                oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.3); // E5
                oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.45); // G5
                oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.6); // C6
                gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.8);
                break;

            case 'tap': // タップ
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                break;

            case 'error': // エラー
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
                break;

            case 'notification': // 通知
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
                break;

            default:
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.15);
        }
    }, [soundEnabled]);

    // 振動フィードバック
    const vibrate = useCallback((type) => {
        if (!hapticEnabled || !('vibrate' in navigator)) return;

        switch (type) {
            case 'complete': // タスク完了 - 少し長めの振動
                navigator.vibrate([50, 30, 50]);
                break;
            case 'levelup': // レベルアップ - 派手な振動
                navigator.vibrate([100, 50, 100, 50, 100]);
                break;
            case 'tap': // タップ - 軽い振動
                navigator.vibrate(10);
                break;
            case 'error': // エラー - 2回振動
                navigator.vibrate([100, 50, 100]);
                break;
            case 'notification': // 通知
                navigator.vibrate([50, 100, 50]);
                break;
            default:
                navigator.vibrate(15);
        }
    }, [hapticEnabled]);

    // サウンドと振動を同時に実行
    const feedback = useCallback((type) => {
        playSound(type);
        vibrate(type);
    }, [playSound, vibrate]);

    return {
        playSound,
        vibrate,
        feedback,
        soundEnabled,
        hapticEnabled
    };
}
