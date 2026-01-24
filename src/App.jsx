import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useTodos } from './hooks/useTodos';
import { useCharacter, CHARACTERS } from './hooks/useCharacter';
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
import LoadingScreen from './components/LoadingScreen';
import BackupManager from './components/Settings/BackupManager';
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
  const { todos, addTodo, toggleTodo, deleteTodo, getProgress, reorderTodos, updateTodo, moveTodo } = useTodos();
  const progress = getProgress();
  const allCompleted = todos.length > 0 && todos.every(t => t.completed);

  // Get basic character first (for ID)
  const [selectedCharId, setSelectedCharId] = useState(() => localStorage.getItem('self_hero_selected_character') || 'ignis');

  // Get level for the selected character
  const { level, canLevelUp, blockedByOther, todayLeveledCharacter, getLevelForCharacter, setLevelForCharacter, attemptLevelUp } = useCharacterLevels(selectedCharId, allCompleted, todos.length);

  // Now get character with evolved image based on level
  const { character, setCharacterId, currentDialogue, triggerReaction, availableCharacters, getCharacterForLevel } = useCharacter(progress, level);

  const { presets, addPreset, updatePreset, reorderPresets } = useTaskPresets();
  const { font, setFontId, availableFonts } = useFont();
  const { history, recordToday, recordAchievement, getMonthlyData, getWeeklyData, getStats } = useHistory();
  const notifications = useNotifications(character?.displayName || character?.name);

  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  // Celebration states removed
  const [currentSchedule, setCurrentSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Loading Effect
  useEffect(() => {
    // Show splash screen for 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);
  const [previousLevel, setPreviousLevel] = useState(level);

  // Record history when data changes
  useEffect(() => {
    // Only record if we have meaningful data
    if (todos.length > 0 || currentSchedule.length > 0) {
      const isAllTasksCompleted = todos.length > 0 && todos.every(t => t.completed);
      recordToday(todos, currentSchedule, isAllTasksCompleted);
    }
  }, [todos, currentSchedule, recordToday]);

  const evolutionStage = getEvolutionStage(level);

  // Detect level up
  const isLevelUp = level > previousLevel;

  // Celebration logic removed for stability




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

      // Check if this action completes all tasks
      // todos is state, so we filter out the current one being toggled
      const remainingTasks = todos.filter(t => !t.completed && t.id !== id);
      if (remainingTasks.length === 0) {
        // All tasks will be complete! Try to level up manually.
        // We use a small timeout to ensure state settles
        setTimeout(() => {
          attemptLevelUp();
        }, 300);
      }
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
                  今日のタスク
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
                key="todo-list-v2"
                todos={todos}
                onAdd={addTodo}
                onToggle={handleTaskComplete}
                onDelete={deleteTodo}
                onReorder={reorderTodos}
                onUpdate={updateTodo}
                onMove={moveTodo}
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
            <ScheduleWizard
              presets={combinedPresets}
              onAddPreset={addPreset}
              onUpdatePreset={updatePreset}
              onReorderPresets={reorderPresets}
              level={level}
              schedule={currentSchedule}
              onScheduleChange={setCurrentSchedule}
            />
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
    <>
      {isLoading && (
        <LoadingScreen
          allCharacters={CHARACTERS}
          onFinish={() => setIsLoading(false)}
        />
      )}
      <div className="app-container" style={{ padding: '20px', paddingBottom: '100px', display: isLoading ? 'none' : 'block' }}>


        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', height: '40px' }}>
          <h1 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--color-primary)', letterSpacing: '-0.5px', textShadow: '0 0 10px var(--color-primary)' }}>
            Grow <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--color-text-main)', marginLeft: '4px' }}>- 育てる習慣</span>
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

            {/* Data Management */}
            <div style={{ marginBottom: '1.5rem', padding: '10px', background: 'rgba(78, 205, 196, 0.1)', borderRadius: '8px', border: '1px solid var(--color-primary)' }}>
              <h4 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)' }}>
                <Settings size={16} /> データ管理
              </h4>
              <button
                onClick={() => {
                  setShowSettings(false);
                  setShowSettingsModal(true);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(to right, #4ECDC4, #556270)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '10px'
                }}
              >
                <Settings size={16} />
                バックアップと復元
              </button>

              <button
                onClick={() => {
                  if (window.confirm('本当に全てのデータを初期化してリセットしますか？この操作は取り消せません。')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(255, 107, 107, 0.2)',
                  border: '1px solid #FF6B6B',
                  borderRadius: '6px',
                  color: '#FF6B6B',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Lock size={16} />
                全データをリセット（修復）
              </button>
            </div>

            {/* Character Selection with individual levels */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '8px' }}>コーチ選択</h4>

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
                      {/* 現在のレベル表示（変更不可） */}
                      <div style={{ marginTop: '4px', textAlign: 'center' }}>
                        <span style={{ color: '#FFD700', fontSize: '0.7rem', fontWeight: 'bold' }}>Lv.{charLevel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
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
          </div>
        )}

        <main style={{ minHeight: '80vh' }}>
          {renderContent()}
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />


        {/* Settings Modal (Backup) */}
        {showSettingsModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)'
          }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <BackupManager onClose={() => setShowSettingsModal(false)} />
            </div>
          </div>
        )}


      </div>
    </>
  );
}

export default App;
