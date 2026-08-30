import { useState, useCallback, useEffect } from 'react';
import { GameState, ChoiceOption, CharacterId, CampaignLevel } from './types/game';
import { DEFAULT_BACH_DANG_CAMPAIGN } from './data/defaultCampaigns';
import { levelStorage } from './utils/levelStorage';
import { soundEngine } from './utils/soundEngine';
import { authService } from './utils/auth';
import { gameStateStorage } from './utils/gameStateStorage';
import { LandingScreen } from './components/LandingScreen';
import { LevelSelectScreen } from './components/LevelSelectScreen';
import { AdminStudio } from './components/admin/AdminStudio';
import { LoginModal } from './components/admin/LoginModal';
import { GameHUD } from './components/GameHUD';
import { DialogueBox } from './components/DialogueBox';
import { CharacterSpriteDisplay } from './components/CharacterSpriteDisplay';
import { ChoiceModal } from './components/ChoiceModal';
import { HistoricalCodex } from './components/HistoricalCodex';
import { DialogueHistoryModal } from './components/DialogueHistoryModal';
import { StoryFlowchartModal } from './components/StoryFlowchartModal';
import { EndingScreen } from './components/EndingScreen';

export function App() {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => authService.isAdminLoggedIn());
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  // 1. Phục hồi toàn bộ trạng thái tiến trình và cài đặt khi reload trang
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedSession = gameStateStorage.loadSession();
    const settings = gameStateStorage.loadSettings();
    const unlockedEndings = gameStateStorage.loadUnlockedEndings();
    const adminLoggedIn = authService.isAdminLoggedIn();

    if (savedSession && savedSession.gameState) {
      const restored = savedSession.gameState;
      const phase =
        restored.gamePhase === 'admin' && !adminLoggedIn
          ? 'level_select'
          : restored.gamePhase;

      return {
        ...restored,
        gamePhase: phase || 'landing',
        isMuted: settings.isMuted,
        isVoiceEnabled: settings.isVoiceEnabled,
        studyMode: settings.studyMode,
        unlockedEndings:
          unlockedEndings.length > 0 ? unlockedEndings : restored.unlockedEndings || [],
      };
    }

    return {
      currentLevelId: DEFAULT_BACH_DANG_CAMPAIGN.id,
      playerName: 'Dũng Sĩ Đại Việt',
      currentSceneId: DEFAULT_BACH_DANG_CAMPAIGN.initialSceneId,
      currentDialogueIndex: 0,
      dialogueHistory: [],
      morale: DEFAULT_BACH_DANG_CAMPAIGN.initialMorale || 80,
      visitedScenes: [DEFAULT_BACH_DANG_CAMPAIGN.initialSceneId],
      selectedChoices: {},
      isMuted: settings.isMuted,
      isVoiceEnabled: settings.isVoiceEnabled,
      studyMode: settings.studyMode,
      gamePhase: 'landing',
      unlockedEndings,
    };
  });

  const [currentCampaign, setCurrentCampaign] = useState<CampaignLevel>(DEFAULT_BACH_DANG_CAMPAIGN);

  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isFlowchartOpen, setIsFlowchartOpen] = useState<boolean>(false);
  const [showChoices, setShowChoices] = useState<boolean>(false);

  // 2. Khởi tạo storage và nạp đúng Campaign Level đang chơi dở
  useEffect(() => {
    const initializeAppStorage = async () => {
      await levelStorage.initialize();
      const targetLevelId = gameState.currentLevelId || gameStateStorage.getActiveCampaignId();
      if (targetLevelId) {
        const found = await levelStorage.getLevel(targetLevelId);
        if (found) {
          setCurrentCampaign(found);
        }
      }
    };

    initializeAppStorage().catch(console.error);
  }, []);

  // 3. Cơ chế Auto-Save: Tự động lưu toàn bộ State Data vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    if (currentCampaign && currentCampaign.id) {
      gameStateStorage.saveSession(gameState, currentCampaign.id);
    }
  }, [gameState, currentCampaign]);

  // 4. Đồng bộ âm thanh với SoundEngine
  useEffect(() => {
    soundEngine.setMuted(gameState.isMuted);
    soundEngine.setVoiceEnabled(gameState.isVoiceEnabled);
  }, [gameState.isMuted, gameState.isVoiceEnabled]);

  const currentScene =
    currentCampaign.scenes[gameState.currentSceneId] ||
    currentCampaign.scenes[currentCampaign.initialSceneId] ||
    Object.values(currentCampaign.scenes)[0];

  const currentDialogue = currentScene ? currentScene.dialogues[gameState.currentDialogueIndex] : undefined;
  const isLastDialogue = currentScene ? gameState.currentDialogueIndex >= currentScene.dialogues.length - 1 : false;
  const hasChoices = Boolean(currentScene && currentScene.choices && currentScene.choices.length > 0);

  // Background map to image file path
  const getSceneBackgroundUrl = (bgId: string) => {
    if (!bgId) return '/assets/images/scenes/war_tent.jpg';
    if (bgId.startsWith('data:') || bgId.startsWith('http') || bgId.startsWith('/assets/')) {
      return bgId;
    }
    switch (bgId) {
      case 'war_tent':
        return '/assets/images/scenes/war_tent.jpg';
      case 'planting_stakes':
        return '/assets/images/scenes/planting_stakes.jpg';
      case 'luring_enemy':
        return '/assets/images/scenes/luring_enemy.jpg';
      case 'counter_attack':
        return '/assets/images/scenes/counter_attack.jpg';
      case 'victory_dawn':
        return '/assets/images/scenes/victory_dawn.jpg';
      default:
        return '/assets/images/scenes/war_tent.jpg';
    }
  };

  // Toggle Mute
  const handleToggleMute = useCallback(() => {
    setGameState((prev) => {
      const nextMuted = !prev.isMuted;
      soundEngine.setMuted(nextMuted);
      return { ...prev, isMuted: nextMuted };
    });
  }, []);

  // Toggle Voice Acting
  const handleToggleVoice = useCallback(() => {
    setGameState((prev) => {
      const nextVoice = !prev.isVoiceEnabled;
      soundEngine.setVoiceEnabled(nextVoice);
      return { ...prev, isVoiceEnabled: nextVoice };
    });
  }, []);

  // Toggle Study Mode
  const handleToggleStudyMode = useCallback(() => {
    setGameState((prev) => ({ ...prev, studyMode: !prev.studyMode }));
  }, []);

  // Login Handlers
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setGameState((prev) => ({ ...prev, gamePhase: 'admin' }));
  };

  const handleLogout = () => {
    authService.logout();
    setIsAdmin(false);
    if (gameState.gamePhase === 'admin') {
      setGameState((prev) => ({ ...prev, gamePhase: 'level_select' }));
    }
  };

  // Start a new game from landing screen
  const handleStartGame = (playerName: string, _hero: CharacterId) => {
    setGameState((prev) => ({
      ...prev,
      playerName,
      gamePhase: 'playing',
      currentSceneId: currentCampaign.initialSceneId,
      currentDialogueIndex: 0,
      dialogueHistory: [],
      visitedScenes: [currentCampaign.initialSceneId],
      morale: currentCampaign.initialMorale || 80,
      selectedChoices: {},
    }));
    setShowChoices(false);
  };

  // Resume game from where player left off
  const handleResumeGame = () => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: 'playing',
    }));
  };

  // Select level from LevelSelectScreen and play
  const handleSelectLevelAndPlay = (level: CampaignLevel) => {
    setCurrentCampaign(level);
    setGameState((prev) => ({
      ...prev,
      currentLevelId: level.id,
      gamePhase: 'playing',
      currentSceneId: level.initialSceneId,
      currentDialogueIndex: 0,
      dialogueHistory: [],
      visitedScenes: [level.initialSceneId],
      selectedChoices: {},
      morale: level.initialMorale || 80,
    }));
    setShowChoices(false);
  };

  // Restart current level
  const handleRestart = () => {
    soundEngine.stopBGM();
    soundEngine.stopSpeech();
    setGameState((prev) => ({
      ...prev,
      gamePhase: 'playing',
      currentSceneId: currentCampaign.initialSceneId,
      currentDialogueIndex: 0,
      dialogueHistory: [],
      morale: currentCampaign.initialMorale || 80,
      visitedScenes: [currentCampaign.initialSceneId],
      selectedChoices: {},
    }));
    setShowChoices(false);
  };

  // Jump to specific scene from Flowchart
  const handleJumpToScene = (sceneId: string) => {
    if (!currentCampaign.scenes[sceneId]) return;
    soundEngine.playSFX('drum');
    soundEngine.stopSpeech();
    setGameState((prev) => ({
      ...prev,
      gamePhase: 'playing',
      currentSceneId: sceneId,
      currentDialogueIndex: 0,
      visitedScenes: prev.visitedScenes.includes(sceneId) ? prev.visitedScenes : [...prev.visitedScenes, sceneId],
    }));
    setShowChoices(false);
  };

  // Next dialogue step or transition
  const handleNextDialogue = useCallback(() => {
    if (!currentDialogue) return;

    // Add current dialogue to history
    setGameState((prev) => ({
      ...prev,
      dialogueHistory: [...prev.dialogueHistory, currentDialogue],
    }));

    if (!isLastDialogue) {
      setGameState((prev) => ({
        ...prev,
        currentDialogueIndex: prev.currentDialogueIndex + 1,
      }));
    } else {
      if (hasChoices) {
        soundEngine.playSFX('horn');
        setShowChoices(true);
      } else if (currentScene.isEnding) {
        setGameState((prev) => {
          const newUnlocked = prev.unlockedEndings.includes(currentScene.id)
            ? prev.unlockedEndings
            : [...prev.unlockedEndings, currentScene.id];

          return {
            ...prev,
            gamePhase: 'ending',
            unlockedEndings: newUnlocked,
          };
        });
      } else if (currentScene.nextSceneId && currentCampaign.scenes[currentScene.nextSceneId]) {
        const nextId = currentScene.nextSceneId;
        setGameState((prev) => ({
          ...prev,
          currentSceneId: nextId,
          currentDialogueIndex: 0,
          visitedScenes: prev.visitedScenes.includes(nextId) ? prev.visitedScenes : [...prev.visitedScenes, nextId],
        }));
      }
    }
  }, [currentDialogue, isLastDialogue, hasChoices, currentScene, currentCampaign]);

  // Choice selected handler
  const handleSelectChoice = (choice: ChoiceOption) => {
    soundEngine.playSFX('gong');
    soundEngine.stopSpeech();

    const targetSceneId = choice.nextSceneId;
    const moraleDelta = choice.moraleChange || 0;

    setGameState((prev) => {
      const nextMorale = Math.max(0, Math.min(100, prev.morale + moraleDelta));
      const nextVisited = prev.visitedScenes.includes(targetSceneId)
        ? prev.visitedScenes
        : [...prev.visitedScenes, targetSceneId];

      return {
        ...prev,
        morale: nextMorale,
        currentSceneId: targetSceneId,
        currentDialogueIndex: 0,
        visitedScenes: nextVisited,
        selectedChoices: {
          ...prev.selectedChoices,
          [gameState.currentSceneId]: choice.id,
        },
      };
    });

    setShowChoices(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gamePhase !== 'playing') return;
      if (isCodexOpen || isHistoryOpen || isFlowchartOpen || showChoices || isLoginOpen) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleNextDialogue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gamePhase, isCodexOpen, isHistoryOpen, isFlowchartOpen, showChoices, isLoginOpen, handleNextDialogue]);

  // --- SCREEN RENDERING ---

  // 1. Landing Screen
  if (gameState.gamePhase === 'landing') {
    const hasSavedPlayable = gameStateStorage.hasPlayableSession();

    return (
      <>
        <LandingScreen
          onStartGame={handleStartGame}
          onResumeGame={handleResumeGame}
          hasSavedSession={hasSavedPlayable}
          savedSessionLevelTitle={currentCampaign.title}
          onOpenLevelSelect={() => setGameState((prev) => ({ ...prev, gamePhase: 'level_select' }))}
          onOpenAdmin={() => setGameState((prev) => ({ ...prev, gamePhase: 'admin' }))}
          onOpenLogin={() => setIsLoginOpen(true)}
          onLogout={handleLogout}
          isAdmin={isAdmin}
          isMuted={gameState.isMuted}
          onToggleMute={handleToggleMute}
        />
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // 2. Level Select Screen
  if (gameState.gamePhase === 'level_select') {
    return (
      <>
        <LevelSelectScreen
          playerName={gameState.playerName}
          onSelectLevel={handleSelectLevelAndPlay}
          onOpenAdmin={() => setGameState((prev) => ({ ...prev, gamePhase: 'admin' }))}
          onOpenLogin={() => setIsLoginOpen(true)}
          onLogout={handleLogout}
          onBackToLanding={() => setGameState((prev) => ({ ...prev, gamePhase: 'landing' }))}
          isAdmin={isAdmin}
          unlockedEndings={gameState.unlockedEndings}
        />
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // 3. Admin Studio (Requires Admin Auth)
  if (gameState.gamePhase === 'admin') {
    if (!isAdmin) {
      // Auto redirect unauthenticated users to Level Select
      return (
        <LevelSelectScreen
          playerName={gameState.playerName}
          onSelectLevel={handleSelectLevelAndPlay}
          onOpenAdmin={() => setGameState((prev) => ({ ...prev, gamePhase: 'admin' }))}
          onOpenLogin={() => setIsLoginOpen(true)}
          onLogout={handleLogout}
          onBackToLanding={() => setGameState((prev) => ({ ...prev, gamePhase: 'landing' }))}
          isAdmin={isAdmin}
          unlockedEndings={gameState.unlockedEndings}
        />
      );
    }

    return (
      <AdminStudio
        onBackToMenu={() => setGameState((prev) => ({ ...prev, gamePhase: 'level_select' }))}
        onPlayLevel={handleSelectLevelAndPlay}
        onLogout={handleLogout}
      />
    );
  }

  // 4. Playing Visual Novel / Ending
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0c0805] select-none">
      {/* Background Image Display */}
      {currentScene && (
        <div className="absolute inset-0 z-0 transition-opacity duration-700 ease-in-out">
          <img
            src={getSceneBackgroundUrl(currentScene.customBackgroundUrl || currentScene.background)}
            alt={currentScene.title}
            className="w-full h-full object-cover object-center filter brightness-45 contrast-110 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0805] via-[#0c0805]/40 to-transparent" />
        </div>
      )}

      {/* Game HUD */}
      {currentScene && (
        <GameHUD
          scene={currentScene}
          playerName={gameState.playerName}
          morale={gameState.morale}
          isMuted={gameState.isMuted}
          isVoiceEnabled={gameState.isVoiceEnabled}
          studyMode={gameState.studyMode}
          onToggleMute={handleToggleMute}
          onToggleVoice={handleToggleVoice}
          onToggleStudyMode={handleToggleStudyMode}
          onOpenCodex={() => setIsCodexOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenFlowchart={() => setIsFlowchartOpen(true)}
          onOpenLevelSelect={() => setGameState((prev) => ({ ...prev, gamePhase: 'level_select' }))}
          onRestart={handleRestart}
        />
      )}

      {/* Character Sprite Display */}
      {currentDialogue && (
        <CharacterSpriteDisplay
          currentSpeaker={currentDialogue.speaker}
          emotion={currentDialogue.emotion}
          characters={currentCampaign.characters}
        />
      )}

      {/* Dialogue Box */}
      {currentDialogue && (
        <DialogueBox
          dialogue={currentDialogue}
          onNext={handleNextDialogue}
          isLastDialogue={isLastDialogue}
          hasChoices={hasChoices}
          characters={currentCampaign.characters}
        />
      )}

      {/* Choice Modal */}
      {showChoices && currentScene && currentScene.choices && (
        <ChoiceModal
          choices={currentScene.choices}
          onSelectChoice={handleSelectChoice}
          studyMode={gameState.studyMode}
        />
      )}

      {/* Ending Screen */}
      {gameState.gamePhase === 'ending' && currentScene && (
        <EndingScreen
          scene={currentScene}
          playerName={gameState.playerName}
          morale={gameState.morale}
          visitedScenesCount={gameState.visitedScenes.length}
          onRestart={handleRestart}
          onOpenFlowchart={() => setIsFlowchartOpen(true)}
          onOpenLevelSelect={() => setGameState((prev) => ({ ...prev, gamePhase: 'level_select' }))}
        />
      )}

      {/* Historical Codex Modal */}
      <HistoricalCodex
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
      />

      {/* Dialogue History Modal */}
      <DialogueHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={gameState.dialogueHistory}
      />

      {/* Story Flowchart Modal */}
      <StoryFlowchartModal
        isOpen={isFlowchartOpen}
        onClose={() => setIsFlowchartOpen(false)}
        visitedScenes={gameState.visitedScenes}
        unlockedEndings={gameState.unlockedEndings}
        currentSceneId={gameState.currentSceneId}
        onJumpToScene={handleJumpToScene}
        scenes={currentCampaign.scenes}
      />

      {/* Global Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
