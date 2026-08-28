export type CharacterId = 'ngo_quyen' | 'nguyen_tat_to' | 'hoang_thao' | 'narrator' | 'soldier';

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  title: string;
  faction: 'viet' | 'han' | 'neutral';
  avatar: string;
  fullImage: string;
  themeColor: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
  tag?: string;
  description?: string;
  impactNote?: string;
  isOptimal?: boolean; // Đánh dấu lựa chọn tối ưu theo chính sử của Ngô Quyền
  historicalReason?: string; // Giải thích ngắn gọn lý do quân sự
  moraleChange?: number;
  nextSceneId: string;
}

export type SceneBackgroundId =
  | 'war_tent'
  | 'planting_stakes'
  | 'luring_enemy'
  | 'counter_attack'
  | 'victory_dawn';

export interface DialogueItem {
  id: string;
  speaker: CharacterId;
  speakerName?: string;
  text: string;
  emotion?: 'normal' | 'intense' | 'confident' | 'angry' | 'triumphant';
  soundEffect?: 'drum' | 'horn' | 'arrow' | 'splash' | 'victory' | 'clash' | 'wooden_crack' | 'fire' | 'battle_cry' | 'gong';
  bgm?: 'epic_war' | 'suspense' | 'victory' | 'calm';
}

export interface SceneData {
  id: string;
  title: string;
  chapter: string;
  branchTag?: string;
  background: SceneBackgroundId;
  tideState: 'high' | 'falling' | 'low' | 'rising' | 'neutral';
  timeOfDay: 'Đêm khuya' | 'Rạng đông' | 'Trưa triều dâng' | 'Xế chiều triều rút' | 'Bình minh khải hoàn';
  dialogues: DialogueItem[];
  choices?: ChoiceOption[];
  nextSceneId?: string;
  isEnding?: boolean;
  endingType?: 'triumphant' | 'good' | 'defeat' | 'special' | 'retreat';
  endingRank?: 'S+' | 'S' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  endingBadge?: string;
  endingTitle?: string;
  endingSummary?: string;
}

export interface GameState {
  playerName: string;
  currentSceneId: string;
  currentDialogueIndex: number;
  dialogueHistory: DialogueItem[];
  morale: number;
  visitedScenes: string[];
  selectedChoices: Record<string, string>;
  isMuted: boolean;
  isVoiceEnabled: boolean; // Bật/tắt giọng đọc lồng tiếng AI tiếng Việt
  studyMode: boolean; // Bật/tắt gợi ý chính sử tối ưu cho học viên
  gamePhase: 'landing' | 'intro' | 'playing' | 'ending';
  unlockedEndings: string[];
}
