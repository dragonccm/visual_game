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
  customVoiceUrl?: string; // Tải lên audio giọng đọc riêng (Cloudinary / URL / Base64)
}

export type TerrainType =
  | 'river_sea' // Thủy chiến sông biển (Bạch Đằng, Rạch Gầm, Vân Đồn)
  | 'mountain_pass' // Đèo ải núi hiểm trở (Chi Lăng, Tam Điệp, Đèo Ngang)
  | 'dense_forest' // Rừng rậm mai phục (Lam Sơn, Yên Thế, Ba Bể)
  | 'citadel_fort' // Thành trì chiến lũy (Như Nguyệt, Đông Quan, Cổ Loa, Hà Nội)
  | 'plains' // Đồng bằng khoáng đạt (Đống Đa, Chúc Động, Tốt Động)
  | 'swamp' // Đầm lầy lau sậy (Dạ Trạch, Đồng Tháp Mười)
  | 'encampment' // Doanh trại trướng quân nghị kế
  | 'custom'; // Tùy biến tự do

export interface TacticalCondition {
  label: string; // Nhãn yếu tố (vd: "Thủy triều", "Địa thế", "Trận thế", "Khí quyển", "Chiến thuật")
  value: string; // Giá trị (vd: "Triều rút gấp lộ bãi cọc", "Đầm lầy bùn lún vây hãm", "Khói lửa mịt mù giặc loạn", "Sương mù che mắt")
  icon?: string; // Icon biểu thị (🌊, ⛰️, 🔥, 🌫️, 🏹, 🛡️, ⚔️, 🌲, 🏰, 💨)
  colorStyle?: 'bronze' | 'iron' | 'wood' | 'gold' | 'danger' | 'nature';
}

export interface SceneData {
  id: string;
  title: string;
  chapter: string;
  branchTag?: string;
  location?: string; // Địa điểm cụ thể (vd: "Cửa Biển Bạch Đằng", "Ải Chi Lăng - Đầm Lầy Mã Yên", "Đồn Ngọc Hồi")
  terrainType?: TerrainType; // Phân loại địa hình
  tacticalCondition?: TacticalCondition; // Điều kiện chiến thuật / yếu tố môi trường năng động
  weatherAmbiance?: string; // Khí quyển thời tiết (vd: "Sương mù sớm", "Mưa gió lạnh buốt", "Canh ba khói lửa")
  ambianceSound?: string; // Âm thanh nền môi trường (wind, waves, fire, night_insects, rain, army_camp)
  ambianceSoundCustomUrl?: string; // Custom audio URL nếu có
  background: string; // Background ID hoặc URL/Base64
  customBackgroundUrl?: string;
  tideState?: 'high' | 'falling' | 'low' | 'rising' | 'neutral'; // Backward compatibility cho Bạch Đằng
  timeOfDay: string; // Thời điểm trong ngày (vd: "Đêm khuya canh ba", "Bình minh rạng sáng", "Chính ngọ", "Hoàng hôn")
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
  era: string; // Ví dụ: "Năm 938 - Thời Tiền Ngô Vương", "Năm 1427 - Khởi Nghĩa Lam Sơn"
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
