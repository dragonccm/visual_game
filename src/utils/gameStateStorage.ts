import { GameState } from '../types/game';
import { DEFAULT_BACH_DANG_CAMPAIGN } from '../data/defaultCampaigns';

const SESSION_STORAGE_KEY = 'visual_game_active_session_v1';
const SETTINGS_STORAGE_KEY = 'visual_game_user_settings_v1';
const ENDINGS_STORAGE_KEY = 'history_game_unlocked_endings';
const ACTIVE_CAMPAIGN_ID_KEY = 'visual_game_active_campaign_id';

export interface SavedUserSettings {
  isMuted: boolean;
  isVoiceEnabled: boolean;
  studyMode: boolean;
}

export interface SavedSessionData {
  gameState: GameState;
  activeCampaignId: string;
  savedAt: number;
}

export const gameStateStorage = {
  // 1. Lưu toàn bộ trạng thái phiên chơi hiện tại (Auto-save)
  saveSession(gameState: GameState, activeCampaignId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const data: SavedSessionData = {
        gameState,
        activeCampaignId,
        savedAt: Date.now(),
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(ACTIVE_CAMPAIGN_ID_KEY, activeCampaignId);

      // Đồng thời lưu settings và endings riêng biệt
      this.saveSettings({
        isMuted: gameState.isMuted,
        isVoiceEnabled: gameState.isVoiceEnabled,
        studyMode: gameState.studyMode,
      });

      if (gameState.unlockedEndings && gameState.unlockedEndings.length > 0) {
        localStorage.setItem(ENDINGS_STORAGE_KEY, JSON.stringify(gameState.unlockedEndings));
      }
    } catch (e) {
      console.warn('[gameStateStorage] Không thể lưu session vào localStorage:', e);
    }
  },

  // 2. Nạp phiên chơi đã lưu khi reload trang
  loadSession(): SavedSessionData | null {
    if (typeof window === 'undefined') return null;

    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;

      const parsed: SavedSessionData = JSON.parse(raw);
      if (!parsed || !parsed.gameState || !parsed.activeCampaignId) {
        return null;
      }

      return parsed;
    } catch (e) {
      console.warn('[gameStateStorage] Lỗi khi đọc session từ localStorage:', e);
      return null;
    }
  },

  // 3. Kiểm tra xem có ván chơi đang dở dang không (để hiển thị nút "Tiếp Tục Chơi")
  hasPlayableSession(): boolean {
    const session = this.loadSession();
    if (!session) return false;
    const { gameState } = session;

    // Có thể tiếp tục nếu đang trong phase chơi, hoặc đã đi qua ít nhất 1 cảnh/câu thoại
    return (
      (gameState.gamePhase === 'playing' || gameState.gamePhase === 'ending') &&
      Boolean(gameState.currentSceneId)
    );
  },

  // 4. Lấy ID chiến dịch đang chọn gần nhất
  getActiveCampaignId(): string {
    if (typeof window === 'undefined') return DEFAULT_BACH_DANG_CAMPAIGN.id;
    return localStorage.getItem(ACTIVE_CAMPAIGN_ID_KEY) || DEFAULT_BACH_DANG_CAMPAIGN.id;
  },

  // 5. Lưu & Đọc cài đặt âm thanh, chế độ học tập
  saveSettings(settings: SavedUserSettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('[gameStateStorage] Lỗi lưu settings:', e);
    }
  },

  loadSettings(): SavedUserSettings {
    const defaults: SavedUserSettings = {
      isMuted: false,
      isVoiceEnabled: true,
      studyMode: true,
    };

    if (typeof window === 'undefined') return defaults;

    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...defaults, ...parsed };
      }
    } catch {
      // Ignore
    }

    return defaults;
  },

  // 6. Lưu & Đọc danh sách kết cục đã mở khóa
  loadUnlockedEndings(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(ENDINGS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return [];
  },

  // 7. Xóa tiến trình ván chơi (Reset về màn hình chính)
  clearActiveSession(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn('[gameStateStorage] Lỗi xóa session:', e);
    }
  },
};
