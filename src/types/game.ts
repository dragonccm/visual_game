export type CharacterFaction = 'viet' | 'han' | 'minh' | 'thanh' | 'enemy' | 'neutral';

export interface CharacterInfo {
  id: string;
  name: string;
  title: string;
  faction: CharacterFaction;
  avatar: string; // URL hoặc Cloudinary / Base64 data
  fullImage: string; // URL hoặc Cloudinary / Base64 data
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
  historicalReason?: string; // Giải thích ngắn gọn lý do quân sự (cho chế độ học tập)
  moraleChange?: number;
  nextSceneId: string;
}

export interface DialogueItem {
  id: string;
  speaker: string; // Character ID hoặc 'narrator'
  speakerName?: string;
  text: string;
  emotion?: 'normal' | 'intense' | 'confident' | 'angry' | 'triumphant';
  soundEffect?: string;
  soundEffectCustomUrl?: string;
  bgm?: string;
  bgmCustomUrl?: string;
  customVoiceUrl?: string; // Tải lên audio giọng đọc riêng (Cloudinary / URL)
}

export interface SceneData {
  id: string;
  title: string;
  chapter: string;
  // 1 dòng duy nhất mô tả không gian / trạng thái chiến trường (vd: "📍 Cửa Sông Bạch Đằng • 🌊 Triều rút gấp")
  battlefieldInfo?: string;
  background: string; // Background ID hoặc URL/Base64
  customBackgroundUrl?: string;
  bgm?: string;
  dialogues: DialogueItem[];
  choices?: ChoiceOption[];
  nextSceneId?: string;
  isEnding?: boolean;
  endingType?: 'triumphant' | 'good' | 'defeat' | 'special' | 'retreat';
  endingRank?: 'S+' | 'S' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  endingBadge?: string;
  endingTitle?: string;
  endingSummary?: string;

  // Backward compatibility fields
  branchTag?: string;
  location?: string;
  timeOfDay?: string;
  tideState?: 'high' | 'falling' | 'low' | 'rising' | 'neutral';
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
