import { useState, useCallback, useEffect } from 'react';
import { GameState, ChoiceOption, CharacterId, CampaignLevel } from './types/game';
import { DEFAULT_BACH_DANG_CAMPAIGN } from './data/defaultCampaigns';
import { levelStorage } from './utils/levelStorage';
import { soundEngine } from './utils/soundEngine';
import { LandingScreen } from './components/LandingScreen';
import { LevelSelectScreen } from './components/LevelSelectScreen';
import { AdminStudio } from './components/admin/AdminStudio';
import { GameHUD } from './components/GameHUD';
import { DialogueBox } from './components/DialogueBox';
import { CharacterSpriteDisplay } from './components/CharacterSpriteDisplay';
import { ChoiceModal } from './components/ChoiceModal';
import { HistoricalCodex } from './components/HistoricalCodex';
import { DialogueHistoryModal } from './components/DialogueHistoryModal';
import { StoryFlowchartModal } from './components/StoryFlowchartModal';
import { EndingScreen } from './components/EndingScreen';

const STORAGE_KEY_ENDINGS = 'history_game_unlocked_endings';

export function App() {
  const [currentCampaign, setCurrentCampaign] = useState<CampaignLevel>(DEFAULT_BACH_DANG_CAMPAIGN);

  const [gameState, setGameState] = useState<GameState>(() => {
    let savedEndings: string[] = [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_ENDINGS);
      if (data) savedEndings = JSON.parse(data);
    } catch {
      // Storage error
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
      isMuted: false,
      isVoiceEnabled: true,
      studyMode: true,
      gamePhase: 'landing',
      unlockedEndings: savedEndings,
    };
  });

  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isFlowchartOpen, setIsFlowchartOpen] = useState<boolean>(false);
  const [showChoices, setShowChoices] = useState<boolean>(false);

  // Initialize level storage on launch
  useEffect(() => {
    levelStorage.initialize().catch(console.error);
  }, []);

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

  // Start game from landing screen (plays default campaign or currently set campaign)
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

          try {
            localStorage.setItem(STORAGE_KEY_ENDINGS, JSON.stringify(newUnlocked));
          } catch {
            // Ignore
          }

          return {
            ...prev,
            gamePhase: 'ending',
            unlockedEndings: newUnlocked,
          };
        });
      } else if (currentScene.nextSceneId && currentCampaign.scenes[currentScene.nextSceneId]) {
        // Linear transition
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
      if (isCodexOpen || isHistoryOpen || isFlowchartOpen || showChoices) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleNextDialogue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gamePhase, isCodexOpen, isHistoryOpen, isFlowchartOpen, showChoices, handleNextDialogue]);

  // --- SCREEN RENDERING ---

  // 1. Landing Screen
  if (gameState.gamePhase === 'landing') {
    return (
      <LandingScreen
        onStartGame={handleStartGame}
        onOpenLevelSelect={() => setGameState((prev) => ({ ...prev, gamePhase: 'level_select' }))}
        onOpenAdmin={() => setGameState((prev) => ({ ...prev, gamePhase: 'admin' }))}
        isMuted={gameState.isMuted}
        onToggleMute={handleToggleMute}
      />
    );
  }

  // 2. Level Select Screen
  if (gameState.gamePhase === 'level_select') {
    return (
      <LevelSelectScreen
        playerName={gameState.playerName}
        onSelectLevel={handleSelectLevelAndPlay}
        onOpenAdmin={() => setGameState((prev) => ({ ...prev, gamePhase: 'admin' }))}
        onBackToLanding={() => setGameState((prev) => ({ ...prev, gamePhase: 'landing' }))}
        unlockedEndings={gameState.unlockedEndings}
      />
    );
  }

  // 3. Admin Studio
  if (gameState.gamePhase === 'admin') {
    return (
      <AdminStudio
        onBackToMenu={() => setGameState((prev) => ({ ...prev, gamePhase: 'level_select' }))}
        onPlayLevel={handleSelectLevelAndPlay}
      />
    );
  }

  // 4. Playing Visual Novel / Ending
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0c0805] select-none font-sans">
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
    </div>
  );
}

export default App;

