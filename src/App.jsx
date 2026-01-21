import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useTodos } from './hooks/useTodos';
import { useCharacter } from './hooks/useCharacter';
import { useCharacterLevels } from './hooks/useCharacterLevels';
import { useTaskPresets } from './hooks/useTaskPresets';
import { useFont } from './hooks/useFont';
import useHistory from './hooks/useHistory';
import useNotifications from './hooks/useNotifications';
import useSoundAndHaptics from './hooks/useSoundAndHaptics';
import CharacterDisplay from './components/Character/CharacterDisplay';
import TodoList from './components/TodoList/TodoList';
import ScheduleWizard from './components/Scheduler/ScheduleWizard';
import SocialStats from './components/Social/SocialStats';
import HistoryView from './components/History/HistoryView';
import NotificationSettings from './components/Settings/NotificationSettings';
import BottomNav from './components/Common/BottomNav';
import CelebrationModal from './components/Common/CelebrationModal';
import { Settings, Sparkles, Type, Trophy, Lock, History, Bell } from 'lucide-react';

// Evolution stages based on level
const EVOLUTION_STAGES = [
  { minStreak: 0, name: '見習い', aura: 'none', multiplier: 1 },
  { minStreak: 7, name: '修行中', aura: 'rgba(255,215,0,0.3)', multiplier: 1.2 },
  { minStreak: 30, name: '熟練者', aura: 'rgba(147,112,219,0.4)', multiplier: 1.5 },
  { minStreak: 100, name: '伝説', aura: 'rgba(255,0,100,0.5)', multiplier: 2 },
];

function getEvolutionStage(level) {
  let stage = EVOLUTION_STAGES[0];
  for (const s of EVOLUTION_STAGES) {
    if (level >= s.minStreak) stage = s;
  }
  return stage;
}

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, getProgress } = useTodos();
  const progress = getProgress();
  const allCompleted = todos.length > 0 && todos.every(t => t.completed);

  // Get basic character first (for ID)
  const [selectedCharId, setSelectedCharId] = useState(() => localStorage.getItem('self_hero_char') || 'angel');

  // Get level for the selected character
  const { level, canLevelUp, blockedByOther, todayLeveledCharacter, getLevelForCharacter, setLevelForCharacter } = useCharacterLevels(selectedCharId, allCompleted, todos.length);

  // Now get character with evolved image based on level
  const { character, setCharacterId, currentDialogue, triggerReaction, availableCharacters, getCharacterForLevel } = useCharacter(progress, level);

  const { presets, addPreset, updatePreset } = useTaskPresets();
  const { font, setFontId, availableFonts } = useFont();
  const { history, recordToday, recordAchievement, getMonthlyData, getWeeklyData, getStats } = useHistory();
  const notifications = useNotifications(character?.displayName || character?.name);

  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasShownCelebration, setHasShownCelebration] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(level);

  const evolutionStage = getEvolutionStage(level);

  // Detect level up
  const isLevelUp = level > previousLevel;

  // Show celebration when all tasks completed
  useEffect(() => {
    if (allCompleted && todos.length > 0 && !hasShownCelebration && canLevelUp) {
      const timer = setTimeout(() => {
        setShowCelebration(true);
        setHasShownCelebration(true);
        setPreviousLevel(level);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [allCompleted, todos.length, hasShownCelebration, canLevelUp, level]);

  // Reset celebration flag when todos change
  useEffect(() => {
    if (!allCompleted) {
      setHasShownCelebration(false);
    }
  }, [allCompleted]);

  // Check for notification every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const hasIncompleteTasks = todos.some(t => !t.completed);
      notifications.checkAndNotify(hasIncompleteTasks, selectedCharId, level);
    }, 60000); // 1分ごと
    return () => clearInterval(interval);
  }, [todos, selectedCharId, level, notifications]);

  const handleTaskComplete = (id) => {
    const task = todos.find(t => t.id === id);
    if (task && !task.completed) {
      triggerReaction('praise');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [character.color, '#FFD700', '#FF6B6B']
      });
    }
    toggleTodo(id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="animate-pop">
            {/* Level indicator at top */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '10px',
              gap: '10px',
              alignItems: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                padding: '6px 16px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                <Trophy size={16} color="#FFD700" />
                <span style={{ color: '#FFD700', fontWeight: 'bold' }}>Lv.{level}</span>
                <span style={{ color: '#ccc', fontSize: '0.75rem' }}>({evolutionStage.name})</span>
              </div>

              {blockedByOther && (
                <div style={{
                  background: 'rgba(255,0,0,0.2)',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.7rem',
                  color: '#ff6b6b'
                }}>
                  <Lock size={12} />
                  本日レベルアップ済
                </div>
              )}
            </div>

            <CharacterDisplay
              character={character}
              dialogue={currentDialogue}
              onInteract={() => triggerReaction('cheer')}
              evolutionStage={evolutionStage}
              level={level}
            />
            <div className="card" style={{ marginTop: '-20px', position: 'relative', zIndex: 10, borderTop: '4px solid var(--color-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={18} color="var(--color-accent)" />
                  デイリーミッション
                </h3>
                <span style={{
                  fontSize: '0.85rem',
                  color: progress === 100 ? '#2ED573' : 'var(--color-accent)',
                  background: progress === 100 ? 'rgba(46,213,115,0.2)' : 'rgba(255,215,0,0.2)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: `1px solid ${progress === 100 ? '#2ED573' : 'var(--color-accent)'}`
                }}>
                  {progress === 100 ? '✨ COMPLETE!' : `${progress}% 完了`}
                </span>
              </div>
              <TodoList
                todos={todos}
                onAdd={addTodo}
                onToggle={handleTaskComplete}
                onDelete={deleteTodo}
                progress={progress}
              />
            </div>

            {/* リマインダー設定 */}
            <NotificationSettings
              permission={notifications.permission}
              notificationEnabled={notifications.notificationEnabled}
              setNotificationEnabled={notifications.setNotificationEnabled}
              notificationTime={notifications.notificationTime}
              setNotificationTime={notifications.setNotificationTime}
              requestPermission={notifications.requestPermission}
              characterName={character?.displayName || character?.name || 'パートナー'}
            />
          </div>
        );
      case 'schedule':
        // todosをpresetsに追加（重複を避ける）
        const todosAsPresets = todos.map(t => ({
          id: `todo_${t.id}`,
          name: `📋 ${t.text}`,
          duration: 30, // デフォルト30分
          color: '#FF6B6B',
          fromMission: true
        }));
        const combinedPresets = [
          ...todosAsPresets,
          ...presets.filter(p => !todosAsPresets.some(tp => tp.name.replace('📋 ', '') === p.name))
        ];
        return (
          <div className="animate-pop" style={{ paddingTop: '1rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem', color: 'var(--color-secondary)' }}>📅 スケジュール</h2>
            <ScheduleWizard presets={combinedPresets} onAddPreset={addPreset} onUpdatePreset={updatePreset} level={level} />
          </div>
        );
      case 'social':
        return (
          <div className="animate-pop" style={{ paddingTop: '1rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem', color: 'var(--color-accent)' }}>🏆 ランキング</h2>
            <SocialStats streak={level} level={level} evolutionStage={evolutionStage} />
            <div className="card" style={{ marginTop: '1rem' }}>
              <h3>殿堂入りユーザー</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                    <div style={{ width: '24px', textAlign: 'center', fontWeight: 'bold', color: i === 1 ? '#FFD700' : '#888' }}>{i}</div>
                    <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                    <div style={{ flex: 1, color: 'var(--color-text-main)' }}>User_{9900 + i}</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--color-accent)' }}>Lv.{365 - i * 12}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="animate-pop" style={{ paddingTop: '1rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem', color: 'var(--color-secondary)' }}>📊 履歴</h2>
            <HistoryView
              history={history}
              getMonthlyData={getMonthlyData}
              getWeeklyData={getWeeklyData}
              getStats={getStats}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container" style={{ padding: '20px', paddingBottom: '100px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', height: '40px' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--color-primary)', letterSpacing: '-0.5px', textShadow: '0 0 10px var(--color-primary)' }}>
          SelfHero
        </h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{ background: 'var(--color-bg-card)', border: '2px solid white', cursor: 'pointer', padding: '8px', borderRadius: '4px', boxShadow: 'var(--shadow-pixel)' }}
        >
          <Settings size={18} color="white" />
        </button>
      </header>

      {showSettings && (
        <div className="card animate-pop" style={{ marginBottom: '1rem', border: '2px solid var(--color-primary)', position: 'absolute', zIndex: 50, width: 'calc(100% - 40px)', background: 'var(--color-bg-card)', maxHeight: '80vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h3>設定</h3>
            <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>

          {/* Font Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Type size={16} /> フォント
            </h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {availableFonts.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFontId(f.id)}
                  style={{
                    padding: '8px 12px',
                    background: font.id === f.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                    border: font.id === f.id ? '2px solid white' : '2px solid transparent',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    fontFamily: f.family,
                    fontSize: '0.9rem'
                  }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Character Selection with individual levels */}
          <div>
            <h4 style={{ marginBottom: '8px' }}>コーチ選択（キャラ別レベル）</h4>
            {todayLeveledCharacter && (
              <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '10px' }}>
                ⚠️ 本日は別のキャラでレベルアップ済みです
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
              {availableCharacters.map(char => {
                const charLevel = getLevelForCharacter(char.id);
                const isSelected = character.id === char.id;
                const isBlockedToday = todayLeveledCharacter && todayLeveledCharacter !== char.id;

                return (
                  <div
                    key={char.id}
                    style={{
                      padding: '8px',
                      background: isSelected ? char.color : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '0.65rem',
                      border: isSelected ? '2px solid white' : '2px solid transparent',
                      boxShadow: isSelected ? 'var(--shadow-pixel)' : 'none',
                      opacity: isBlockedToday ? 0.6 : 1,
                      position: 'relative'
                    }}
                  >
                    {isBlockedToday && (
                      <Lock size={12} style={{ position: 'absolute', top: '4px', right: '4px' }} color="#ff6b6b" />
                    )}
                    <div
                      onClick={() => { setCharacterId(char.id); setSelectedCharId(char.id); }}
                      style={{ cursor: 'pointer' }}
                    >
                      {(() => {
                        const evolvedChar = getCharacterForLevel(char.id, charLevel);
                        return (
                          <>
                            {evolvedChar.image ? (
                              <img src={evolvedChar.image} alt={evolvedChar.displayName} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            ) : (
                              <div style={{ fontSize: '2rem' }}>{char.emoji}</div>
                            )}
                            <div style={{ marginTop: '4px', fontWeight: 'bold', fontSize: '0.6rem' }}>{evolvedChar.displayName}</div>
                          </>
                        );
                      })()}
                    </div>
                    {/* Level adjustment controls */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setLevelForCharacter(char.id, charLevel - 1); }}
                        style={{
                          width: '20px', height: '20px',
                          background: 'rgba(255,100,100,0.5)',
                          border: 'none', borderRadius: '4px',
                          color: 'white', cursor: 'pointer', fontSize: '0.8rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >−</button>
                      <span style={{ color: '#FFD700', fontSize: '0.7rem', fontWeight: 'bold', minWidth: '28px' }}>Lv.{charLevel}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setLevelForCharacter(char.id, charLevel + 1); }}
                        style={{
                          width: '20px', height: '20px',
                          background: 'rgba(100,255,100,0.5)',
                          border: 'none', borderRadius: '4px',
                          color: 'white', cursor: 'pointer', fontSize: '0.8rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <main style={{ minHeight: '80vh' }}>
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        character={character}
        level={level}
        isLevelUp={isLevelUp}
      />
    </div>
  );
}

export default App;
