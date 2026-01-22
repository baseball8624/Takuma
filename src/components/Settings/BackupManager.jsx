import React, { useState } from 'react';
import { Save, Download, Upload, Check, Copy, AlertTriangle } from 'lucide-react';

export default function BackupManager({ onClose }) {
    const [backupCode, setBackupCode] = useState('');
    const [importCode, setImportCode] = useState('');
    const [mode, setMode] = useState('menu'); // 'menu', 'export', 'import'
    const [status, setStatus] = useState(''); // 'success', 'error', 'copied'

    // アプリで使用しているlocalStorageのキー接頭辞
    const PREFIXT_LIST = [
        'self_hero_', // アプリ全体
    ];

    // 全データを取得してコード化
    const handleExport = () => {
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

            // Base64にエンコード（簡易的な難読化）
            const jsonString = JSON.stringify(backupData);
            const encoded = btoa(unescape(encodeURIComponent(jsonString)));
            setBackupCode(encoded);
            setMode('export');
        } catch (e) {
            console.error('Export failed:', e);
            setStatus('error');
        }
    };

    // クリップボードにコピー
    const handleCopy = () => {
        navigator.clipboard.writeText(backupCode).then(() => {
            setStatus('copied');
            setTimeout(() => setStatus(''), 2000);
        });
    };

    // データの復元
    const handleImport = () => {
        if (!importCode) return;

        if (!window.confirm('現在のデータが上書きされます。本当によろしいですか？\n※この操作は取り消せません。')) {
            return;
        }

        try {
            // デコード
            const jsonString = decodeURIComponent(escape(atob(importCode)));
            const backupData = JSON.parse(jsonString);

            // 検証
            if (!backupData.version || !backupData.data) {
                throw new Error('Invalid backup format');
            }

            // 復元実行
            Object.entries(backupData.data).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });

            alert('データの復元が完了しました！アプリを再読み込みします。');
            window.location.reload();

        } catch (e) {
            console.error('Import failed:', e);
            alert('復元に失敗しました。コードが正しいか確認してください。');
            setStatus('error');
        }
    };

    return (
        <div style={{
            background: 'rgba(20, 20, 30, 0.95)',
            padding: '2rem',
            borderRadius: '24px',
            maxWidth: '500px',
            width: '90%',
            color: 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            maxHeight: '80vh',
            overflowY: 'auto'
        }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Save size={24} color="var(--color-primary)" />
                データバックアップ
            </h2>

            {mode === 'menu' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ color: '#aaa', marginBottom: '1rem' }}>
                        データを「復活の呪文」として保存したり、呪文を使ってデータを復元したりできます。
                        機種変更の際などに使ってください。
                    </p>

                    <button
                        onClick={handleExport}
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)',
                            border: 'none',
                            color: 'white',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <Download size={20} />
                        データを保存（書き出し）
                    </button>

                    <button
                        onClick={() => setMode('import')}
                        style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <Upload size={20} />
                        データを復元（読み込み）
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#888',
                            cursor: 'pointer'
                        }}
                    >
                        閉じる
                    </button>
                </div>
            )}

            {mode === 'export' && (
                <div>
                    <p style={{ marginBottom: '1rem', color: '#4ECDC4', fontWeight: 'bold' }}>
                        以下の「復活の呪文」をコピーして、大切に保管してください。
                    </p>
                    <div style={{ position: 'relative' }}>
                        <textarea
                            readOnly
                            value={backupCode}
                            style={{
                                width: '100%',
                                height: '150px',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                color: '#eee',
                                padding: '1rem',
                                fontSize: '0.8rem',
                                fontFamily: 'monospace',
                                resize: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            onClick={handleCopy}
                            style={{
                                flex: 2,
                                padding: '1rem',
                                borderRadius: '12px',
                                background: status === 'copied' ? '#27ae60' : 'var(--color-primary)',
                                border: 'none',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {status === 'copied' ? <Check size={20} /> : <Copy size={20} />}
                            {status === 'copied' ? 'コピーしました！' : 'コピーする'}
                        </button>
                        <button
                            onClick={() => setMode('menu')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            戻る
                        </button>
                    </div>
                </div>
            )}

            {mode === 'import' && (
                <div>
                    <div style={{
                        background: 'rgba(255, 99, 71, 0.2)',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'start'
                    }}>
                        <AlertTriangle size={20} color="#ff6b6b" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '0.9rem', color: '#ffcccc' }}>
                            警告：復元を行うと、現在このアプリにあるデータはすべて上書きされます。
                        </p>
                    </div>

                    <p style={{ marginBottom: '0.5rem' }}>「復活の呪文」を貼り付けてください：</p>
                    <textarea
                        value={importCode}
                        onChange={(e) => setImportCode(e.target.value)}
                        placeholder="ここにコードを貼り付け..."
                        style={{
                            width: '100%',
                            height: '150px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: 'white',
                            padding: '1rem',
                            fontSize: '0.8rem',
                            fontFamily: 'monospace',
                            resize: 'none'
                        }}
                    />

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            onClick={handleImport}
                            disabled={!importCode}
                            style={{
                                flex: 2,
                                padding: '1rem',
                                borderRadius: '12px',
                                background: !importCode ? '#555' : '#e74c3c',
                                border: 'none',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: !importCode ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Upload size={20} />
                            復元を実行
                        </button>
                        <button
                            onClick={() => setMode('menu')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            戻る
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
