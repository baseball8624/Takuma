
// アプリで使用しているlocalStorageのキー接頭辞
const PREFIXT_LIST = [
    'self_hero_', // アプリ全体
];

/**
 * localStorageからデータを取得し、バックアップ用文字列（Base64）に変換する
 */
export const createBackupString = () => {
    try {
        const data = {};
        // localStorageから関連データを収集
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (PREFIXT_LIST.some(prefix => key.startsWith(prefix))) {
                data[key] = localStorage.getItem(key);
            }
        }

        const backupData = {
            version: 1,
            timestamp: new Date().toISOString(),
            data: data
        };

        // Base64にエンコード
        const jsonString = JSON.stringify(backupData);
        // 日本語対応のためにURIComponentを使用
        const encoded = btoa(unescape(encodeURIComponent(jsonString)));
        return encoded;
    } catch (e) {
        console.error('Export failed:', e);
        return null;
    }
};

/**
 * バックアップ用文字列（Base64）からlocalStorageにデータを復元する
 */
export const restoreFromBackupString = (backupString) => {
    try {
        // デコード
        const jsonString = decodeURIComponent(escape(atob(backupString)));
        const backupData = JSON.parse(jsonString);

        // 検証
        if (!backupData.version || !backupData.data) {
            throw new Error('Invalid backup format');
        }

        // 復元実行
        Object.entries(backupData.data).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });

        return true;
    } catch (e) {
        console.error('Import failed:', e);
        return false;
    }
};
