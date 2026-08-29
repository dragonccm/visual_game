export type CharacterFaction = 'viet' | 'han' | 'minh' | 'thanh' | 'enemy' | 'neutral';

export interface CharacterInfo {
  id: string;
  name: string;
  title: string;
  faction: CharacterFaction;
  avatar: string; // URL hoặc Base64 data
  fullImage: string; // URL hoặc Base64 data
  themeColor: string;
}

export type CharacterId = string;

export interface ChoiceOption {
  id: string;
  text: string;
  tag?: string;
  description?: string;
  impactNote?: string;
  isOptimal?: boolean; // Đánh dấu lựa chọn tối ưu theo chính sử
  historicalReason?: string; // Giải thích ngắn gọn lý do quân sự
  moraleChange?: number;
  nextSceneId: string;
}

export type SceneBackgroundId = string;

export interface DialogueItem {
  id: string;
  speaker: string; // Character ID hoặc 'narrator'
  speakerName?: string;
  text: string;
  emotion?: 'normal' | 'intense' | 'confident' | 'angry' | 'triumphant';
  soundEffect?: string;
  soundEffectCustomUrl?: string; // Custom audio URL/Base64 nếu có
  bgm?: string;
  bgmCustomUrl?: string; // Custom BGM URL/Base64 nếu có
  customVoiceUrl?: string; // Tải lên audio giọng đọc riêng (Base64 hoặc URL)
}

export interface SceneData {
  id: string;
  title: string;
  chapter: string;
  branchTag?: string;
  background: string; // Background ID hoặc URL/Base64
  customBackgroundUrl?: string;
  tideState?: 'high' | 'falling' | 'low' | 'rising' | 'neutral';
  timeOfDay: string;
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

export interface HistoricalFactItem {
  id: string;
  title: string;
  category: 'timeline' | 'tactics' | 'weapons' | 'figure' | 'lore';
  summary: string;
  content: string;
  quote?: string;
  source?: string;
}

export interface CampaignLevel {
  id: string;
  title: string;
  subtitle: string;
  era: string; // Ví dụ: "Năm 938 - Thời Tiền Ngô Vương"
  difficulty: 'Dễ' | 'Trung bình' | 'Khó' | 'Sử thi';
  coverImage: string; // URL hoặc Base64 data
  description: string;
  author: string;
  initialMorale: number;
  initialSceneId: string;
  characters: Record<string, CharacterInfo>;
  scenes: Record<string, SceneData>;
  historicalFacts?: HistoricalFactItem[];
  isDefault?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface GameState {
  currentLevelId: string;
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
  gamePhase: 'landing' | 'level_select' | 'intro' | 'playing' | 'ending' | 'admin';
  unlockedEndings: string[];
}
