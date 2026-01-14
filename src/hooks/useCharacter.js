import { useState, useEffect } from 'react';

const CHARACTERS = {
    angel: {
        id: 'angel',
        name: 'エールちゃん',
        role: '天使',
        color: '#4ECDC4',
        image: '/assets/angel.png',
        // Evolution images (optional - if not set, uses base image)
        evolutionImages: {
            // level 0-6: base image
            // level 7-29: stage 2
            // level 30-99: stage 3
            // level 100+: stage 4
        },
        dialogues: {
            greeting: ['今日も一緒に頑張りましょう！', 'おはようございます！いい一日になりそうですね'],
            cheer: ['その調子です！', 'あなたならできます！', '少し休憩してもいいんですよ？'],
            praise: ['すごい！やりましたね！', '素晴らしい進捗です！', '私がついてますからね！'],
            warning: ['まだ時間はあるはずです...', '一緒に深呼吸して、一つだけやりませんか？'],
        }
    },
    sergeant: {
        id: 'sergeant',
        name: '鬼教官',
        role: '軍曹',
        color: '#FF4757',
        image: '/assets/sergeant.png',
        evolutionImages: {},
        dialogues: {
            greeting: ['おい！準備はいいか！', 'たるんでいるぞ！気合を入れろ！'],
            cheer: ['止まるな！動け！', '軟弱な精神を叩き直してやる！', '言い訳は聞かん！'],
            praise: ['ほう、やるじゃないか', 'その調子だ、油断するなよ', '今日の貴様は悪くない'],
            warning: ['何をしている！サボるな！', '貴様の根性はそんなものか！', '腕立て100回だ！'],
        }
    },
    friend: {
        id: 'friend',
        name: 'ユウキ',
        role: '幼馴染',
        color: '#FFA502',
        image: '/assets/friend.png',
        evolutionImages: {},
        dialogues: {
            greeting: ['おっす！今日もやるか！', 'よっ、元気にしてた？'],
            cheer: ['一緒に最後まで走ろうぜ！', 'お前なら楽勝だって！', '終わったらラーメン行こうぜ'],
            praise: ['さすがだな！', '見直したぜ！', '最高じゃん！'],
            warning: ['おいおい、大丈夫か？', 'そろそろ本気出しなよー', '置いてくぞ？'],
        }
    },
    robot: {
        id: 'robot',
        name: 'アシスタント・ボット',
        role: 'AI',
        color: '#00D9FF',
        image: '/assets/robot.png',
        evolutionImages: {},
        dialogues: {
            greeting: ['システム起動完了。本日のタスクを開始します。', 'おはようございます。効率的な一日を設計しましょう。'],
            cheer: ['進捗率、順調です。', 'データ分析によると、あなたは優秀です。', '休憩の最適タイミングを計算中...'],
            praise: ['目標達成を確認。素晴らしい成果です。', 'パフォーマンス指標が向上しています。', '継続データを保存しました。'],
            warning: ['警告：タスク未着手を検知。', '生産性低下を検出。再起動を推奨します。', 'エラー：やる気信号が弱いです。'],
        }
    },
    cat: {
        id: 'cat',
        name: 'ニャックス',
        role: '魔法猫',
        color: '#9B59B6',
        image: '/assets/cat.png',
        evolutionImages: {},
        dialogues: {
            greeting: ['ふぁ〜あ...起きたのかにゃ', 'にゃ？やる気あるのかにゃ？'],
            cheer: ['まあまあだにゃ', 'もうちょっと頑張れるにゃ？', '昼寝したいにゃ...'],
            praise: ['ほう、やるじゃないかにゃ', 'ご褒美のチュールをあげるにゃ', '感心したにゃ！'],
            warning: ['サボりは許さんにゃ', 'こら！起きるにゃ！', '爪を研ぐぞにゃ？'],
        }
    },
    dragon: {
        id: 'dragon',
        name: 'イグニス',
        role: 'ドラゴン',
        color: '#FF6B35',
        image: '/assets/dragon.png',
        evolutionImages: {
            7: '/assets/dragon.png',        // Stage 2: same for now
            30: '/assets/dragon_evolved.png', // Stage 3: mecha dragon!
            100: '/assets/dragon_evolved.png' // Stage 4: mecha dragon
        },
        evolutionNames: {
            0: 'イグニス',
            7: 'イグニス',
            30: 'メカイグニス',
            100: 'メカイグニス・オメガ'
        },
        dialogues: {
            greeting: ['グオオオ！今日も燃えていくぞ！', 'フンッ、弱者め。ついてこれるか？'],
            cheer: ['その炎、まだ消えてないな！', '俺様についてこい！', '弱音を吐くな！'],
            praise: ['フハハ！見事だ！', '貴様、やるではないか！', '俺様が認めてやろう！'],
            warning: ['チッ、情けない...', '炎が消えてるぞ！燃やせ！', '俺様を失望させるな！'],
        }
    }
};

// Get evolution stage from level
function getEvolutionStage(level) {
    if (level >= 100) return 100;
    if (level >= 30) return 30;
    if (level >= 7) return 7;
    return 0;
}

export function useCharacter(progress = 0, level = 0) {
    const [characterId, setCharacterId] = useState(() => {
        const saved = localStorage.getItem('self_hero_char');
        if (saved && !CHARACTERS[saved]) {
            return 'angel';
        }
        return saved || 'angel';
    });

    const [currentDialogue, setCurrentDialogue] = useState('');

    const baseCharacter = CHARACTERS[characterId] || CHARACTERS['angel'];

    // Get evolved image and name based on level
    const evolvedImage = baseCharacter.evolutionImages?.[getEvolutionStage(level)] || baseCharacter.image;
    const evolvedName = baseCharacter.evolutionNames?.[getEvolutionStage(level)] || baseCharacter.name;

    const character = {
        ...baseCharacter,
        image: evolvedImage,
        displayName: evolvedName
    };

    useEffect(() => {
        localStorage.setItem('self_hero_char', characterId);
    }, [characterId]);

    useEffect(() => {
        const dialogues = character.dialogues;
        let type = 'cheer';

        if (progress === 100) type = 'praise';
        else if (progress === 0) type = 'greeting';
        else if (progress > 50) type = 'praise';

        const options = dialogues[type];
        const randomText = options[Math.floor(Math.random() * options.length)];
        setCurrentDialogue(randomText);

    }, [characterId, progress]);

    const triggerReaction = (type) => {
        const options = character.dialogues[type] || character.dialogues['cheer'];
        const text = options[Math.floor(Math.random() * options.length)];
        setCurrentDialogue(text);
    };

    return {
        character,
        setCharacterId,
        currentDialogue,
        triggerReaction,
        availableCharacters: Object.values(CHARACTERS)
    };
}
