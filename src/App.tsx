import { useState, useCallback, useEffect } from 'react';
import { GameState, ChoiceOption, CharacterId } from './types/game';
import { STORY_SCENES } from './data/storyData';
import { soundEngine } from './utils/soundEngine';
import { LandingScreen } from './components/LandingScreen';
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
  const [gameState, setGameState] = useState<GameState>(() => {
    let savedEndings: string[] = [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_ENDINGS);
      if (data) savedEndings = JSON.parse(data);
    } catch {
      // Storage error
    }

    return {
      playerName: 'Dũng Sĩ Đại Việt',
      currentSceneId: 'scene_intro_crisis',
      currentDialogueIndex: 0,
      dialogueHistory: [],
      morale: 80,
      visitedScenes: ['scene_intro_crisis'],
      selectedChoices: {},
      isMuted: false,
      isVoiceEnabled: true,
      studyMode: true, // Mặc định bật chế độ gợi ý chính sử cho học viên
      gamePhase: 'landing',
      unlockedEndings: savedEndings,
    };
  });

  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isFlowchartOpen, setIsFlowchartOpen] = useState<boolean>(false);
  const [showChoices, setShowChoices] = useState<boolean>(false);

  const currentScene = STORY_SCENES[gameState.currentSceneId] || STORY_SCENES.scene_intro_crisis;
  const currentDialogue = currentScene.dialogues[gameState.currentDialogueIndex];
  const isLastDialogue = gameState.currentDialogueIndex >= currentScene.dialogues.length - 1;
  const hasChoices = Boolean(currentScene.choices && currentScene.choices.length > 0);

  // Background map to image file path
  const getSceneBackgroundUrl = (bgId: string) => {
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

  // Start game from landing
  const handleStartGame = (playerName: string, _hero: CharacterId) => {
    setGameState((prev) => ({
      ...prev,
      playerName,
      gamePhase: 'playing',
      currentSceneId: 'scene_intro_crisis',
      currentDialogueIndex: 0,
      dialogueHistory: [],
      visitedScenes: ['scene_intro_crisis'],
      morale: 80,
    }));
  };

  // Restart game
  const handleRestart = () => {
    soundEngine.stopBGM();
    soundEngine.stopSpeech();
    setGameState((prev) => ({
      ...prev,
      gamePhase: 'landing',
      currentSceneId: 'scene_intro_crisis',
      currentDialogueIndex: 0,
      dialogueHistory: [],
      morale: 80,
      visitedScenes: ['scene_intro_crisis'],
      selectedChoices: {},
    }));
    setShowChoices(false);
  };

  // Jump to specific scene from Flowchart
  const handleJumpToScene = (sceneId: string) => {
    if (!STORY_SCENES[sceneId]) return;
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
      // Advance to next dialogue within scene
      setGameState((prev) => ({
        ...prev,
        currentDialogueIndex: prev.currentDialogueIndex + 1,
      }));
    } else {
      // Last dialogue reached
      if (currentScene.isEnding) {
        setGameState((prev) => {
          const newUnlocked = prev.unlockedEndings.includes(currentScene.id)
            ? prev.unlockedEndings
            : [...prev.unlockedEndings, currentScene.id];

          try {
            localStorage.setItem(STORAGE_KEY_ENDINGS, JSON.stringify(newUnlocked));
          } catch {
            // Storage
          }

          return {
            ...prev,
            gamePhase: 'ending',
            unlockedEndings: newUnlocked,
          };
        });
        return;
      }

      if (hasChoices) {
        setShowChoices(true);
      } else if (currentScene.nextSceneId && STORY_SCENES[currentScene.nextSceneId]) {
        const nextId = currentScene.nextSceneId;
        setGameState((prev) => ({
          ...prev,
          currentSceneId: nextId,
          currentDialogueIndex: 0,
          visitedScenes: prev.visitedScenes.includes(nextId) ? prev.visitedScenes : [...prev.visitedScenes, nextId],
        }));
      }
    }
  }, [currentDialogue, isLastDialogue, currentScene, hasChoices]);

  // Handle choice selection
  const handleSelectChoice = (choice: ChoiceOption) => {
    setShowChoices(false);
    soundEngine.stopSpeech();
    const nextSceneId = choice.nextSceneId;
    const moraleDelta = choice.moraleChange || 0;

    setGameState((prev) => {
      const nextMorale = Math.max(0, Math.min(100, prev.morale + moraleDelta));
      return {
        ...prev,
        currentSceneId: nextSceneId,
        currentDialogueIndex: 0,
        morale: nextMorale,
        visitedScenes: prev.visitedScenes.includes(nextSceneId)
          ? prev.visitedScenes
          : [...prev.visitedScenes, nextSceneId],
        selectedChoices: {
          ...prev.selectedChoices,
          [gameState.currentSceneId]: choice.id,
        },
      };
    });
  };

  // Switch BGM when scene changes
  useEffect(() => {
    if (gameState.gamePhase === 'playing' && currentScene) {
      const firstBgm = currentScene.dialogues[0]?.bgm;
      if (firstBgm) {
        soundEngine.playBGM(firstBgm);
      }
    }
  }, [gameState.currentSceneId, gameState.gamePhase, currentScene]);

  // Render Landing Phase
  if (gameState.gamePhase === 'landing') {
    return (
      <LandingScreen
        onStartGame={handleStartGame}
        isMuted={gameState.isMuted}
        onToggleMute={handleToggleMute}
      />
    );
  }

  // Render Ending Phase
  if (gameState.gamePhase === 'ending' || currentScene.isEnding) {
    return (
      <>
        <EndingScreen
          scene={currentScene}
          playerName={gameState.playerName}
          morale={gameState.morale}
          visitedScenesCount={gameState.visitedScenes.length}
          onRestart={handleRestart}
          onOpenFlowchart={() => setIsFlowchartOpen(true)}
        />
        <StoryFlowchartModal
          isOpen={isFlowchartOpen}
          onClose={() => setIsFlowchartOpen(false)}
          visitedScenes={gameState.visitedScenes}
          unlockedEndings={gameState.unlockedEndings}
          currentSceneId={gameState.currentSceneId}
          onJumpToScene={handleJumpToScene}
        />
      </>
    );
  }

  // Render Gameplay Phase
  return (
    <div className="relative w-full h-screen overflow-hidden bg-stone-950 flex flex-col justify-between select-none">
      {/* Background Image with Dynamic Fade Transitions */}
      <div className="absolute inset-0 z-0">
        <img
          key={currentScene.id}
          src={getSceneBackgroundUrl(currentScene.background)}
          alt={currentScene.title}
          className="w-full h-full object-cover object-center filter brightness-65 contrast-105 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/60" />
      </div>

      {/* Top HUD */}
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
        onRestart={handleRestart}
      />

      {/* Character Sprite Display */}
      {currentDialogue && (
        <CharacterSpriteDisplay
          currentSpeaker={currentDialogue.speaker}
          emotion={currentDialogue.emotion}
        />
      )}

      {/* Main Dialogue Box with Auto Voice Speech */}
      <div className="relative z-20 w-full mt-auto">
        {currentDialogue && (
          <DialogueBox
            dialogue={currentDialogue}
            onNext={handleNextDialogue}
            isLastDialogue={isLastDialogue}
            hasChoices={hasChoices}
          />
        )}
      </div>

      {/* Decision Choice Modal */}
      {showChoices && currentScene.choices && (
        <ChoiceModal
          choices={currentScene.choices}
          studyMode={gameState.studyMode}
          onSelectChoice={handleSelectChoice}
        />
      )}

      {/* Story Flowchart Mindmap Modal */}
      <StoryFlowchartModal
        isOpen={isFlowchartOpen}
        onClose={() => setIsFlowchartOpen(false)}
        visitedScenes={gameState.visitedScenes}
        unlockedEndings={gameState.unlockedEndings}
        currentSceneId={gameState.currentSceneId}
        onJumpToScene={handleJumpToScene}
      />

      {/* Historical Codex Encyclopedia */}
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
    </div>
  );
}

export default App;
