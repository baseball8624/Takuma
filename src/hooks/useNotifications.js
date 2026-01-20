import { useState, useEffect, useCallback } from 'react';

// 通知を管理するフック
export default function useNotifications(characterName = 'パートナー') {
    const [permission, setPermission] = useState(Notification.permission);
    const [notificationTime, setNotificationTime] = useState(() => {
        return localStorage.getItem('self_hero_notification_time') || '21:00';
    });
    const [notificationEnabled, setNotificationEnabled] = useState(() => {
        return localStorage.getItem('self_hero_notification_enabled') === 'true';
    });

    // キャラクター別のリマインダーセリフ
    const reminderMessages = {
        angel: [
            'まだタスクが残っているよ！一緒に頑張ろう💪',
            '今日のミッション、忘れてない？応援してるよ✨',
            'あと少しだよ！君ならできる！',
        ],
        ignis: [
            'おい、タスクが残ってるぞ。サボるなよ🔥',
            'まだ終わってないだろ？気合入れろ！',
            '俺を失望させるなよ。やることやれ💪',
        ],
        mochi: [
            'タスク残ってるよ〜？一緒にやろ〜🍡',
            'もちもちタイム終わりにタスクやろ〜✨',
            '頑張った後のもちもちは格別だよ〜💕',
        ],
        luna: [
            '...タスク、残ってるよ？気づいてる...？🌙',
            '月が見てる...今日のミッション...✨',
            '...私も応援してるから...頑張って...',
        ],
        default: [
            'タスクが残っています。完了しましょう！',
            '今日のミッションを忘れずに！',
            'もう少しで完了です。頑張りましょう！',
        ]
    };

    // 設定を保存
    useEffect(() => {
        localStorage.setItem('self_hero_notification_time', notificationTime);
    }, [notificationTime]);

    useEffect(() => {
        localStorage.setItem('self_hero_notification_enabled', String(notificationEnabled));
    }, [notificationEnabled]);

    // 通知許可をリクエスト
    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) {
            alert('このブラウザは通知に対応していません');
            return false;
        }

        const result = await Notification.requestPermission();
        setPermission(result);
        return result === 'granted';
    }, []);

    // 通知を送信
    const sendNotification = useCallback((charId = 'default') => {
        if (permission !== 'granted') return;

        const messages = reminderMessages[charId] || reminderMessages.default;
        const message = messages[Math.floor(Math.random() * messages.length)];
        const charNames = {
            angel: 'アンジェリカ',
            ignis: 'イグニス',
            mochi: 'もちよん',
            luna: 'ルナ',
            default: 'パートナー'
        };

        const notification = new Notification(`${charNames[charId] || charNames.default}からのメッセージ`, {
            body: message,
            icon: '/vite.svg', // アプリアイコン
            badge: '/vite.svg',
            tag: 'task-reminder',
            renotify: true,
            requireInteraction: true
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        return notification;
    }, [permission]);

    // スケジュール通知のチェック
    const checkAndNotify = useCallback((hasIncompleteTasks, charId) => {
        if (!notificationEnabled || !hasIncompleteTasks) return;

        const now = new Date();
        const [targetH, targetM] = notificationTime.split(':').map(Number);
        const currentH = now.getHours();
        const currentM = now.getMinutes();

        // 設定時刻と現在時刻が一致（1分以内）
        if (currentH === targetH && currentM === targetM) {
            sendNotification(charId);
        }
    }, [notificationEnabled, notificationTime, sendNotification]);

    return {
        permission,
        notificationTime,
        setNotificationTime,
        notificationEnabled,
        setNotificationEnabled,
        requestPermission,
        sendNotification,
        checkAndNotify
    };
}
