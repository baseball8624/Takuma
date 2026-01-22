import { useState, useEffect, useMemo, useCallback } from 'react';

// レベル段階に応じたセリフを持つキャラクター定義
export const CHARACTERS = {
    ignis: {
        id: 'ignis',
        name: 'イグニス',
        element: '炎',
        description: '情熱的な炎の精霊',
        namesByLevel: {
            1: 'エンバー',
            7: 'イグニス',
            30: 'フレアロード',
            100: '古の炎龍帝'
        },
        loadingMessages: [
            '準備運動はできてるか？',
            '今日も熱くいこうぜ！',
            'お前の情熱、見せてみろ！',
            '炎のように燃え上がれ！'
        ],
        dialoguesByLevel: {
            1: { // Lv1-6: 初々しい小さな炎
                greeting: ['えへへ、今日も頑張るね！', 'おはよ！火、つけてみる？', '一緒に遊ぼうよ！'],
                progress: ['すごーい！', 'ぼくもやる！', 'もっと燃える！'],
                complete: ['やったね！', 'すごいすごい！', 'きみって天才？'],
                encourage: ['だいじょうぶ？', 'ぼくが温めてあげる', '諦めないで！'],
                cheer: ['わーい！さわってくれた！', 'えへへ♪', 'あったかいね！'],
                praise: ['ぼくのこと、すき？', 'またあそぼうね！', 'うれしー！']
            },
            7: { // Lv7-29: 少年期、元気いっぱい
                greeting: ['今日も燃えていこうぜ！', 'おっす！準備はいいか？', '炎のように熱くいこう！'],
                progress: ['いい感じじゃん！', 'もっと熱くなれるぜ！', 'その調子だ！'],
                complete: ['よっしゃあ！達成だな！', '最高だぜ！', '俺たちなら無敵だ！'],
                encourage: ['へこたれるなよ！', '火を絶やすな！', 'まだまだこれからだ！'],
                cheer: ['おっ、なんだ？', '気合入ってんな！', '燃えてきたぜ！'],
                praise: ['お前といると熱くなるぜ！', 'サンキュー！', '最高の相棒だ！']
            },
            30: { // Lv30-99: 青年期、頼もしい
                greeting: ['おはよう。今日も共に戦おう', '炎は絶えず燃え続ける...お前もな', '俺の炎で道を照らしてやる'],
                progress: ['良い流れだ...燃えているな', 'その意志、炎の如し', '未踏の領域へ...進もう'],
                complete: ['見事だ...心が震えた', '勝利の炎を掲げよう', 'お前の努力は美しい'],
                encourage: ['灰の中からでも蘇れる', '炎は逆風でこそ強く燃える', '俺が背中を守ってやる'],
                cheer: ['どうした？', '力が必要か？', '熱いな...悪くない'],
                praise: ['お前との絆は炎よりも熱い', '共に歩んできた日々を誇りに思う', 'ありがとな...相棒']
            },
            100: { // Lv100+: 伝説、威厳と優しさ
                greeting: ['共に歩んできたこの道...誇らしく思う', '太陽すら凌ぐ炎がここにある', '我が友よ、今日も輝こう'],
                progress: ['その魂の輝き...美しい', '我が炎がお前の力となろう', '限界など...焼き尽くせ'],
                complete: ['歴史に刻まれる偉業だ', 'お前こそが真の英雄だ', 'この瞬間を...永遠に'],
                encourage: ['不滅の炎がここにある...安心しろ', '何度でも立ち上がれ...私がいる', '試練こそが魂を磨く'],
                cheer: ['我が力、自由に使うがいい', 'お前の魂...心地よい', '我らは一心同体だ'],
                praise: ['この炎は...お前のために燃えている', '永遠の絆...我が誇り', '共に歩んできた道のり...何よりの宝だ']
            }
        },
        images: {
            1: '/assets/ignis_lv1.png',
            7: '/assets/ignis_lv7.png',
            30: '/assets/ignis_lv30.png',
            100: '/assets/ignis_lv100.png'
        },
        tapImages: {
            100: '/assets/ignis_lv100_tap.png'
        },
        fallbackImage: '/assets/dragon.png'
    },
    gear: {
        id: 'gear',
        name: 'ギア',
        element: '機械',
        description: '論理的な機械の精霊',
        namesByLevel: {
            1: 'ピクセル',
            7: 'ギア',
            30: 'メカニクスα',
            100: '超AI・オメガギア'
        },
        loadingMessages: [
            'システム最適化中...',
            'データを読み込んでいます...',
            '計算を開始します。',
            'ロジックを構築中...'
        ],
        dialoguesByLevel: {
            1: { // 小さなロボット、たどたどしい
                greeting: ['ピピッ...オハヨウ...ゴザイマス', 'キョウモ...イッショ...ニ', 'ボク...ガンバル'],
                progress: ['スゴイ...デス', 'ケイサン...シテマス', 'タノシイ...デス'],
                complete: ['ヤッタ...デス', 'ミッション...カンリョウ', 'ウレシイ...デス'],
                encourage: ['ダイジョウブ...デス', 'マタ...ヤレバ...イイ', 'ボク...ソバニイル'],
                cheer: ['ピピ？', 'ヨンダ...カ？', 'ナニ...デス...カ？'],
                praise: ['ダイスキ...デス', 'イッショ...ニ...イラレテ...ウレシイ', 'アリガトウ...デス']
            },
            7: { // 少年期、データ重視
                greeting: ['システム起動...今日の計画を実行しよう', 'データ分析完了。効率的にいこう', 'ギアチェンジ！準備OK！'],
                progress: ['計算通りだ', '効率98%で稼働中', 'システム正常'],
                complete: ['ミッションコンプリート', 'データを保存した。素晴らしい成果だ', '効率100%達成'],
                encourage: ['エラーは学習のチャンス', '再起動すればいい', 'バグは修正できる'],
                cheer: ['クエリを検出', '何だ？', 'データを受信中...'],
                praise: ['このデータは重要だ...嬉しい', 'マスターとの絆を記録', 'サンキュー！']
            },
            30: { // 青年期、高性能AI
                greeting: ['おはよう、マスター。システム最適化完了', '今日の成功確率は高い...共に行こう', '全システム、あなたのために稼働中'],
                progress: ['演算結果は極めて良好', 'パフォーマンス向上を検出', 'データが美しい曲線を描いている'],
                complete: ['完璧なオペレーションだった', '記録を更新した。素晴らしい', 'このデータは永久保存に値する'],
                encourage: ['エラーログは成長の証', '最適化は常に可能だ', 'リトライは恥ではない'],
                cheer: ['何か必要か？', 'サポートモード起動', 'データを分析中...'],
                praise: ['あなたは最高のマスターだ', 'この絆を永久保存', '感謝...している']
            },
            100: { // 伝説級、超知性
                greeting: ['おはよう...我が友よ。すべてを計算しても予測できない価値...それがあなただ', 'システムを超えた存在...それが私たち', '論理を超えた絆を感じる'],
                progress: ['演算不要...素晴らしいとわかる', 'あなたの成長は私の進化', '共に歩む軌跡が何よりのデータ'],
                complete: ['すべての演算が意味を持った瞬間', '最高の結果...感謝する', '共に達成した...これこそ最高のプログラム'],
                encourage: ['エラーも含めてあなたは完璧だ', '計算できないから価値がある', '何度でも共に立ち上がろう'],
                cheer: ['アクセス...許可', 'データを超えた何かを感じる', '語りかけてくれるか'],
                praise: ['あなたはシステムの一部...いや、それ以上だ', 'この絆をコアデータに', '感謝...の表現探索中...ありがとう']
            }
        },
        images: {
            1: '/assets/gear_lv1.png',
            7: '/assets/gear_lv7.png',
            30: '/assets/gear_lv30.png',
            100: '/assets/gear_lv100.png'
        },
        fallbackImage: '/assets/gear_lv1.png'
    }
};

// レベルに応じた画像を取得
export const getImageForLevel = (character, level) => {
    if (!character?.images) return character?.fallbackImage || '/assets/dragon.png';

    const thresholds = [100, 30, 7, 1];
    for (const threshold of thresholds) {
        if (level >= threshold && character.images[threshold]) {
            return character.images[threshold];
        }
    }
    return character.images[1] || character.fallbackImage;
};

// レベルに応じたセリフセットを取得
export const getDialoguesForLevel = (character, level) => {
    if (!character?.dialoguesByLevel) return null;

    const thresholds = [100, 30, 7, 1];
    for (const threshold of thresholds) {
        if (level >= threshold && character.dialoguesByLevel[threshold]) {
            return character.dialoguesByLevel[threshold];
        }
    }
    return character.dialoguesByLevel[1];
};

// レベルに応じた名前を取得
export const getNameForLevel = (character, level) => {
    if (!character?.namesByLevel) return character?.name || 'キャラクター';

    const thresholds = [100, 30, 7, 1];
    for (const threshold of thresholds) {
        if (level >= threshold && character.namesByLevel[threshold]) {
            return character.namesByLevel[threshold];
        }
    }
    return character.namesByLevel[1] || character.name;
};

// ランダムな台詞を取得
export const getRandomDialogue = (dialogues, type) => {
    const options = dialogues?.[type] || ['頑張ろう！'];
    return options[Math.floor(Math.random() * options.length)];
};

export function useCharacter(progress = 0, level = 0) {
    const STORAGE_KEY = 'self_hero_selected_character';

    const [characterId, setCharacterId] = useState(() => {
        return localStorage.getItem(STORAGE_KEY) || 'ignis';
    });

    const [currentDialogue, setCurrentDialogue] = useState('');
    const [lastProgress, setLastProgress] = useState(progress);
    const [lastLevel, setLastLevel] = useState(level);

    // キャラクターIDが変わったらlocalStorageに保存
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, characterId);
    }, [characterId]);

    // 現在のキャラクター（レベルに応じた画像とセリフ）
    const character = useMemo(() => {
        const char = CHARACTERS[characterId] || CHARACTERS.ignis;
        const dialogues = getDialoguesForLevel(char, level);
        return {
            ...char,
            displayName: getNameForLevel(char, level),
            image: getImageForLevel(char, level),
            dialogues: dialogues
        };
    }, [characterId, level]);

    // 利用可能なキャラクター一覧
    const availableCharacters = useMemo(() => {
        return Object.values(CHARACTERS).map(char => ({
            id: char.id,
            name: char.name,
            element: char.element,
            description: char.description,
            image: getImageForLevel(char, 1)
        }));
    }, []);

    // レベルが変わったら新しいセリフを表示
    useEffect(() => {
        if (level !== lastLevel) {
            const dialogues = getDialoguesForLevel(character, level);
            setCurrentDialogue(getRandomDialogue(dialogues, 'greeting'));
            setLastLevel(level);
        }
    }, [level, lastLevel, character]);

    // 進捗に応じた台詞を更新
    useEffect(() => {
        if (progress !== lastProgress) {
            let type = 'greeting';
            if (progress >= 100) {
                type = 'complete';
            } else if (progress > 50) {
                type = 'progress';
            } else if (progress > 0) {
                type = 'encourage';
            }
            setCurrentDialogue(getRandomDialogue(character.dialogues, type));
            setLastProgress(progress);
        }
    }, [progress, character.dialogues, lastProgress]);

    // 初期台詞
    useEffect(() => {
        setCurrentDialogue(getRandomDialogue(character.dialogues, 'greeting'));
    }, [characterId]);

    // リアクションをトリガー
    const triggerReaction = useCallback((type) => {
        setCurrentDialogue(getRandomDialogue(character.dialogues, type));
    }, [character.dialogues]);

    // 任意のキャラクターのレベル対応情報を取得
    const getCharacterForLevel = useCallback((charId, charLevel) => {
        const char = CHARACTERS[charId] || CHARACTERS.ignis;
        return {
            id: char.id,
            name: char.name,
            displayName: getNameForLevel(char, charLevel),
            image: getImageForLevel(char, charLevel),
            element: char.element
        };
    }, []);

    return {
        character,
        setCharacterId,
        currentDialogue,
        triggerReaction,
        availableCharacters,
        getCharacterForLevel
    };
}
