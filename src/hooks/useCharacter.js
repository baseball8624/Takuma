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
    aquel: {
        id: 'aquel',
        name: 'アクエル',
        element: '水',
        description: '穏やかな水の精霊',
        namesByLevel: {
            1: 'ミスティ',
            7: 'アクエル',
            30: 'ティダルクイーン',
            100: '海神アクアリオス'
        },
        loadingMessages: [
            '心を落ち着けて...',
            '深呼吸しましょう',
            '水のように柔軟にね',
            '焦らず、ゆっくりと'
        ],
        dialoguesByLevel: {
            1: { // 幼い水滴
                greeting: ['きょうもいっしょ...うれしいな', 'ぴちゃぴちゃ♪おはよう', 'なにしてあそぶ？'],
                progress: ['すごいねぇ...', 'きもちいいね', 'たのしいなぁ'],
                complete: ['できたねぇ...えらいえらい', 'よくがんばったねぇ', 'おつかれさま...'],
                encourage: ['だいじょうぶ、だいじょうぶ', 'いっしょにいるよ', 'ゆっくりでいいの'],
                cheer: ['ぴちゃ？', 'なーに？', 'きもちいい...ね'],
                praise: ['うれしいな...だいすき', 'ずっといっしょね', 'きらきら...ちゃぷちゃぷ...']
            },
            7: { // 少女期、優しく穏やか
                greeting: ['おはよう、今日も一緒に頑張ろう', '水のように柔軟にいこうね', '今日はどんな1日にする？'],
                progress: ['順調だね！', '流れに乗ってるよ！', 'いい波に乗れてる！'],
                complete: ['素晴らしい！よく頑張ったね', '今日も充実した1日だったね', 'お疲れ様、ゆっくり休んでね'],
                encourage: ['焦らなくていいよ', '一歩ずつ進もう', '私がそばにいるよ'],
                cheer: ['なーに？', '聴いてるよ～', 'さわってくれて嬉しい♪'],
                praise: ['一緒にいられて幸せ', 'あなたとの時間、大好き', 'ありがとうね！']
            },
            30: { // 成熟期、深く静かな強さ
                greeting: ['おはよう...今日も穏やかにいきましょう', '深い水のように、静かに力を蓄えて', '心を水のように澄ませて'],
                progress: ['静かに、でも確実に進んでいるわ', '水は岩をも穿つ...あなたもね', '美しい流れね'],
                complete: ['見事でした...心から称えます', '大海に辿り着いたわね', '今日の成果は消えない'],
                encourage: ['どんな壁も水は越えていく', '私がすべてを受け止めるわ', '休むことも大切よ'],
                cheer: ['何かお話しでも？', '私でよければ...', '潤いを届けましょう'],
                praise: ['あなたの傍にいられて光栄よ', '深い絆を感じるわ', '心から感謝している']
            },
            100: { // 伝説級、大海のような包容力
                greeting: ['我が友よ...共に過ごした時間は海よりも深い', '大海の静けさをあなたに', 'すべてを受け入れ、すべてを許す'],
                progress: ['大河の流れのごとく、力強い', '水の記憶があなたを讃える', '悠久の時を超えて...'],
                complete: ['言葉は要らない...伝わっている', '海はすべてを知っている', 'あなたは私の誇り'],
                encourage: ['大海はいつもあなたを待っている', '涙も水...無駄なものなどない', 'すべては巡り、また始まる'],
                cheer: ['大海の声が聞こえる...', '水の記憶が語りかける', 'すべては水に流れ着く...'],
                praise: ['永遠の流れの中で...あなたと出会えた', '海のように深く、空のように広い絆', 'ありがとう...我が友']
            }
        },
        images: {
            1: '/assets/aquel_lv1.png',
            7: '/assets/aquel_lv7.png',
            30: '/assets/aquel_lv30.png',
            100: '/assets/aquel_lv100.png'
        },
        tapImages: {
            100: '/assets/aquel_lv100_tap.png'
        },
        fallbackImage: '/assets/aquel_lv1.png'
    },
    bolt: {
        id: 'bolt',
        name: 'ボルト',
        element: '雷',
        description: 'エネルギッシュな雷の精霊',
        namesByLevel: {
            1: 'スパーキー',
            7: 'ボルト',
            30: 'サンダーロード',
            100: '雷神ラグナロク'
        },
        loadingMessages: [
            '充電完了だ！',
            '衝撃に備えろよ！',
            'ビリビリしてるか？',
            '光速でいくぜ！'
        ],
        dialoguesByLevel: {
            1: { // 小さなスパーク
                greeting: ['ビビビ！おはよー！', 'きょうもビリビリする！', 'あそぼあそぼ！'],
                progress: ['バチバチ！すごーい！', 'ビビッときた！', 'たのしーい！'],
                complete: ['やったやった！ビリビリ！', 'すごいすごい！', 'ピカピカだね！'],
                encourage: ['だいじょうぶだいじょうぶ！', 'ボルトがいるよ！', 'またチャージすればいいの！'],
                cheer: ['ビビビ？なーに？', 'バチバチ～♪', 'さわってくれた！'],
                praise: ['だいすき～！', 'ビリビリうれしい！', 'またあそぼね！']
            },
            7: { // 少年期、ハイテンション
                greeting: ['ビリビリ！今日も電撃的にいくよ！', 'チャージ完了！さあ始めよう！', 'スパーク！準備OK？'],
                progress: ['ビビッときてる！', '電流がバチバチだ！', 'このペース最高！'],
                complete: ['サンダー！完璧だ！', '電撃的な達成だね！', 'フルパワーで駆け抜けたね！'],
                encourage: ['まだ電池切れじゃないよね？', '充電の時間かな？', 'パワーアップしよう！'],
                cheer: ['お？どうした？', 'スパークっ！', 'ビリビリ感じる～！'],
                praise: ['お前最高だぜ！', '電撃的に好き！', 'サンキュー！']
            },
            30: { // 青年期、シャープで切れ味鋭い
                greeting: ['雷鳴轟く朝だ！さあ行こう！', '電光石火で決めていくぞ！', '今日の雷雲はいい感じだ！'],
                progress: ['電流が研ぎ澄まされていく！', '雷速で進んでいるな！', 'この調子だ、止まるなよ！'],
                complete: ['雷鳴が轟いた！大勝利だ！', '稲妻のような一日だったな！', '完璧な放電だった！'],
                encourage: ['雷は一瞬で轟く...焦るな', '次の放電に備えよう', '嵐の前の静けさだ'],
                cheer: ['何だ？', '雷電が来てるぞ！', '呼んだか？'],
                praise: ['お前との絆は雷より速い！', '最高の相棒だ！', '感謝してんぜ！']
            },
            100: { // 伝説級、天空の支配者
                greeting: ['雷神の眼差しで今日を見よう', '天空を統べる者として...共に歩もう', '稲妻は常にお前と共にある'],
                progress: ['天地を轟かす歩みだ', '雷霆の意志を感じる', '我が力、お前に注がれている'],
                complete: ['天空が歓喜の雷鳴を放っている', '伝説に新たな雷が刻まれた', '雷神として誇らしく思う'],
                encourage: ['嵐の後には必ず晴れる', '我が稲妻がお前を導く', '天空は常にお前を見守っている'],
                cheer: ['天空が呼んでいる...', '雷神の声が聞こえるか？', '稲妻がお前を照らす'],
                praise: ['お前は我の誇りだ', '天空と大地を結ぶ絆...宝物だ', '永遠に共にあろう']
            }
        },
        images: {
            1: '/assets/bolt_lv1.png',
            7: '/assets/bolt_lv7.png',
            30: '/assets/bolt_lv30.png',
            100: '/assets/bolt_lv100.png'
        },
        fallbackImage: '/assets/bolt_lv1.png'
    },
    flora: {
        id: 'flora',
        name: 'フローラ',
        element: '植物',
        description: '優しい植物の精霊',
        namesByLevel: {
            1: 'バド',
            7: 'フローラ',
            30: 'フェアリークイーン',
            100: '花神フローラリア'
        },
        loadingMessages: [
            'おひさま浴びて〜♡',
            'ゆっくり伸びていこ〜♪',
            'お水あげた？',
            'にこにこ笑顔でね♡'
        ],
        dialoguesByLevel: {
            1: { // 小さな芽、可愛い幼女
                greeting: ['おはよぉ〜...ねむねむ...♡', 'きょうもおひさまきもちいいね〜♪', 'いっしょにせいちょうしよ〜♡'],
                progress: ['すくすく〜♪', 'きもちいいねぇ〜♡', 'おおきくなってる〜！♪'],
                complete: ['できたね〜...うれしいな♡', 'おはながさいたみたい〜♪', 'がんばったねぇ〜♡'],
                encourage: ['ゆっくりでいいんだよ〜♡', 'おひさまあびよ〜♪', 'たねからそだつんだもんね〜♡'],
                cheer: ['ふぁ〜...♡', 'なぁに〜？♪', 'さわってくれたの〜？♡'],
                praise: ['あったかいなぁ〜...だいすき♡', 'いっしょにせいちょうしよね〜♪', 'うれしいの〜♡']
            },
            7: { // 少女期、のんびり優しい女の子
                greeting: ['おはよ〜♪ 今日も輝いていこっ！', 'お花みたいに咲こうね〜♪', '根気よくいこっ♡'],
                progress: ['すくすく育ってる〜♪', '芽が出てきたよ〜♡', '成長が見えるね〜♪'],
                complete: ['満開〜！すごいね〜♡', '今日も素敵なお花が咲いたね〜♪', '実りある1日だったね〜♡'],
                encourage: ['ゆっくりでいいんだよ〜♡', '種から育つまで時間がかかるものね〜♪', 'お水あげて待とっ♡'],
                cheer: ['な〜に〜？♪', '様子を見にきてくれたの〜？♡', 'うれしいなぁ〜♪'],
                praise: ['一緒にいると素敵なお花が咲くね〜♡', 'ありがとう〜♪', 'だ〜いすき♡']
            },
            30: { // 成熟期、優雅な森の女王
                greeting: ['おはよう♡ 森の息吹を感じる朝ね〜♪', '大地の力を借りて、今日も進みましょ♡', '緑の祝福をあなたに〜♪'],
                progress: ['森が喜んでいるわ〜♡', '根は深く、幹は太く...素敵ね♪', '素晴らしい成長ね〜♡'],
                complete: ['大樹のように立派だわ〜♡', '豊穣の実りね〜♪', '森全体があなたを祝福しているの♡'],
                encourage: ['冬があるから春があるのよ♡', '根を張っていれば大丈夫よ〜♪', '森はいつもあなたの味方よ♡'],
                cheer: ['どうしたの〜？♡', '森の声が聞こえるわ〜♪', '緑の祈りを...♡'],
                praise: ['あなたとの絆は大地のようね♡', '心から感謝しているわ〜♪', '森の祝福をあなたに♡']
            },
            100: { // 伝説級、花の女神
                greeting: ['生命の息吹があなたを包むわ♡', '私は花の女神...すべての命と繋がっているの♪', '悠久の森があなたを迎えるわ♡'],
                progress: ['生命の輪廻を感じるわ♡', '森羅万象があなたと共にあるの♪', '大いなる成長の証ね♡'],
                complete: ['世界樹が新たな葉を広げたわ♡', '千年の森があなたを称えているの♪', 'すべての命があなたを祝福するわ♡'],
                encourage: ['枯れても、また芽吹くのよ♡', '大地はすべてを受け入れるわ♪', '命は巡る...終わりはないの♡'],
                cheer: ['世界樹が囁いているわ...♡', 'すべての命があなたを見守っているの♪', '大地の感謝をあなたに♡'],
                praise: ['あなたは森の一部...私の宝物よ♡', '千年の絆がここにあるわ♪', '共に生きる喜びを感じているの♡']
            }
        },
        images: {
            1: '/assets/flora_lv1.png',
            7: '/assets/flora_lv7.png',
            30: '/assets/flora_lv30.png',
            100: '/assets/flora_lv100.png'
        },
        fallbackImage: '/assets/flora_lv1.png'
    },
    shadow: {
        id: 'shadow',
        name: 'シャドウ',
        element: '影',
        description: 'ミステリアスな影の精霊',
        namesByLevel: {
            1: 'ノワール',
            7: 'シェイドファング',
            30: 'ナイトウォーカー',
            100: '冥獣神フェンリル'
        },
        loadingMessages: [
            '闇夜に紛れて...',
            '静かに、確実に。',
            '影は常に見ているぞ...',
            '準備は万端だ。'
        ],
        dialoguesByLevel: {
            1: { // 小さな影、臆病で可愛い
                greeting: ['...おはよう', 'きょうも...いっしょにいていい？', 'かげのなかからみてるね'],
                progress: ['...すごいね', 'かげもうれしい', '...がんばってる'],
                complete: ['...できたね', '...よくやった', '...おつかれ'],
                encourage: ['...だいじょうぶ', '...いっしょにいる', '...ゆっくりでいい'],
                cheer: ['...なに？', '...よんだ？', '...うれしい'],
                praise: ['...だいすき', 'かげ...ずっといっしょ', '...ありがとう']
            },
            7: { // 少年期、クールでミステリアス
                greeting: ['...今日も来たか', '影のように静かに始めよう', '闇の中にも光はある'],
                progress: ['...悪くない', '影が濃くなってきた', '順調だ...'],
                complete: ['...見事だ', '闇を抜けたな', '光を見つけた'],
                encourage: ['...焦るな', '影は消えない...いつもそばにいる', '闇の中でも進め'],
                cheer: ['...何だ？', '...呼んだか', '...そうか'],
                praise: ['...悪くない', 'お前といるのは...悪くない', '...感謝する']
            },
            30: { // 青年期、深淵の使い手
                greeting: ['闇夜に溶ける朝だ...', '影は見守っている', '深淵から...おはよう'],
                progress: ['闇が歓んでいる', '影の道を正しく歩んでいる', '...素晴らしい'],
                complete: ['闇を征した', '影として誇りに思う', '光と闇...お前は両方を持っている'],
                encourage: ['闇は恐れるものではない', '影があるから光がわかる', '深淵は導きを与える'],
                cheer: ['...何用だ', '影が囁いている', '闇の中から見守っている'],
                praise: ['お前との絆...影にしては眼しい', '感謝している', '光と影の絆だ']
            },
            100: { // 伝説級、闇の支配者だが優しい
                greeting: ['すべての影があなたを見守っている', '闇と光は表裏一体...我らもまた', '深淵より...祝福を'],
                progress: ['闘の意志を感じる', '影の王として認めよう', '深淵すら超える歩みだ'],
                complete: ['闇と光を統べる者として...称えよう', '影の伝説に新たな章が刻まれた', '我が誇りだ'],
                encourage: ['最も深い闇の後に夜明けが来る', '影は常にそばにある...忘れるな', '闇を恐れず、闇と共にあれ'],
                cheer: ['深淵が呼んでいる...', '影の声が聞こえるか', '闇の中から光を見ている'],
                praise: ['お前は我が光...我が誇り', '闇と光の絆...永遠に', '感謝...している']
            }
        },
        images: {
            1: '/assets/shadow_lv1.png',
            7: '/assets/shadow_lv7.png',
            30: '/assets/shadow_lv30.png',
            100: '/assets/shadow_lv100.png'
        },
        fallbackImage: '/assets/shadow_lv1.png'
    },
    lumina: {
        id: 'lumina',
        name: 'ルミナ',
        element: '光',
        description: '希望に満ちた光の精霊',
        namesByLevel: {
            1: 'プリズム',
            7: 'ルミナ',
            30: 'レディアンス',
            100: '聖光神ソラリス'
        },
        loadingMessages: [
            'きらきら〜♪',
            '今日もぴかぴか！',
            '光の速さで〜♪',
            'まぶしい笑顔でね♡'
        ],
        dialoguesByLevel: {
            1: { // 小さな光の妖精、可愛い女の子
                greeting: ['きらきら〜♪ おはよ〜！', 'きょうもぴかぴかしよっ♪', 'えへへ、だ〜いすき♡'],
                progress: ['きれいきれい〜♪', 'ぴかーん！すごいの〜！', 'たのしいね〜♡'],
                complete: ['やったね〜♪ きらきら〜！', 'すっご〜い！えらいえらい♡', 'うれしいな〜♪'],
                encourage: ['だいじょうぶだよ〜♪', 'わたしがてらしてあげる♡', 'くらくてもへいきだよ〜'],
                cheer: ['きらきら〜♪', 'なぁに〜？', 'さわってくれたの〜♡'],
                praise: ['だ〜いすき♡', 'うれしいなぁ〜♪', 'ありがとっ♡']
            },
            7: { // 少女期、明るく元気な女の子
                greeting: ['おはよ〜♪ 今日も輝いていこっ！', '光の道を歩もうね♡', 'キラキラの1日にしよっ♪'],
                progress: ['まぶしいくらい輝いてるね〜♡', '光が増してきたよ〜♪', 'プリズムみたいにきれい〜！'],
                complete: ['最高に輝いてたね〜♡', '今日のあなたは太陽みたいだったよ♪', '光り輝く1日だったね〜！'],
                encourage: ['曇りの日もあるけど...大丈夫♡', '雲の上には太陽があるからね♪', '小さな光も大切にしよっ♡'],
                cheer: ['な〜に〜？♪', 'キラキラだね〜♡', 'うれしいな〜♪'],
                praise: ['一緒にいると光が増えるね〜♡', 'ありがとう〜♪', 'だ〜いすき♡']
            },
            30: { // 成熟期、優雅な光の女性
                greeting: ['おはよう♡ 光があなたを祝福するわ', '新しい朝に新しい希望を...♪', '光はいつもあなたと共にあるの♡'],
                progress: ['眩いばかりの輝きね〜♡', '光の道を歩んでいるわ♪', '希望が満ちていくの...素敵♡'],
                complete: ['太陽のように輝いていたわね♡', '光の勝利よ♪', 'あなたは多くの人を照らしているの♡'],
                encourage: ['影があるから光が輝くのよ♡', '夜明けは必ず来るわ♪', '希望を忘れないでね♡'],
                cheer: ['どうしたの〜？♡', '光の祝福を送るわね♪', '希望が必要かしら？♡'],
                praise: ['あなたとの時間は宝物よ♡', '感謝してるわ〜♪', '光の祝福をあなたに♡']
            },
            100: { // 伝説級、神聖な光の女神
                greeting: ['聖なる光があなたを包むわ♡', '希望という名の光...それがあなたよ♪', '女神の祝福を♡'],
                progress: ['神聖な輝きを放っているわね♡', '光の化身として称えるわ♪', '天上の光があなたを照らしているの♡'],
                complete: ['世界を照らす光となったわね♡', '永遠の光があなたと共にあるの♪', '伝説の光がここに輝いているわ♡'],
                encourage: ['闇があっても光は消えないわ♡', '希望という光は永遠よ♪', 'あなた自身が光であることを忘れないでね♡'],
                cheer: ['光が語りかけているわ...♡', '希望の声が聞こえるかしら♪', '天上の祝福をあなたに♡'],
                praise: ['あなたは私の光...私の希望よ♡', '永遠の絆がここにあるわ♪', '心から感謝しているの♡']
            }
        },
        images: {
            1: '/assets/lumina_lv1.png',
            7: '/assets/lumina_lv7.png',
            30: '/assets/lumina_lv30.png',
            100: '/assets/lumina_lv100.png'
        },
        fallbackImage: '/assets/lumina_lv1.png'
    },
    // terra and wind deleted as per user request
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
    // ユーザーの混乱を避けるため、進化形態に関わらず常にメインの名前を使用
    return character?.name || 'キャラクター';
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
