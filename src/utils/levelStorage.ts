import { CampaignLevel } from '../types/game';
import { INITIAL_DEFAULT_CAMPAIGNS, DEFAULT_BACH_DANG_CAMPAIGN } from '../data/defaultCampaigns';

const DB_NAME = 'VisualHistoryGameDB';
const DB_VERSION = 1;
const STORE_NAME = 'campaign_levels';
const LOCAL_STORAGE_BACKUP_KEY = 'visual_game_custom_levels';

class LevelStorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // Khởi tạo và nạp các chiến dịch mặc định vào Storage nếu chưa có
  public async initialize(): Promise<CampaignLevel[]> {
    try {
      const existing = await this.getAllLevels();
      if (existing.length === 0) {
        for (const camp of INITIAL_DEFAULT_CAMPAIGNS) {
          await this.saveLevel(camp);
        }
        return INITIAL_DEFAULT_CAMPAIGNS;
      }

      // Đảm bảo luôn có ít nhất màn Bạch Đằng mặc định
      const hasBachDang = existing.some((c) => c.id === DEFAULT_BACH_DANG_CAMPAIGN.id);
      if (!hasBachDang) {
        await this.saveLevel(DEFAULT_BACH_DANG_CAMPAIGN);
        return [DEFAULT_BACH_DANG_CAMPAIGN, ...existing];
      }

      return existing;
    } catch (e) {
      console.warn('[LevelStorage] IndexedDB fallback to memory/localStorage:', e);
      return INITIAL_DEFAULT_CAMPAIGNS;
    }
  }

  // Lấy danh sách tất cả màn chơi
  public async getAllLevels(): Promise<CampaignLevel[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const results: CampaignLevel[] = request.result || [];
          // Sort by updatedAt descending
          results.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
          resolve(results);
        };

        request.onerror = () => {
          resolve(this.getFallbackLevels());
        };
      });
    } catch {
      return this.getFallbackLevels();
    }
  }

  // Lấy 1 màn chơi theo ID
  public async getLevel(id: string): Promise<CampaignLevel | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
          resolve(request.result || null);
        };

        request.onerror = () => {
          const levels = this.getFallbackLevels();
          resolve(levels.find((l) => l.id === id) || null);
        };
      });
    } catch {
      const levels = this.getFallbackLevels();
      return levels.find((l) => l.id === id) || null;
    }
  }

  // Lưu hoặc Cập nhật màn chơi
  public async saveLevel(level: CampaignLevel): Promise<void> {
    const updatedLevel: CampaignLevel = {
      ...level,
      updatedAt: Date.now(),
      createdAt: level.createdAt || Date.now(),
    };

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(updatedLevel);

        request.onsuccess = () => {
          this.syncBackupToLocalStorage(updatedLevel);
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (e) {
      console.warn('[LevelStorage] Save fallback to localStorage', e);
      this.syncBackupToLocalStorage(updatedLevel);
    }
  }

  // Xóa màn chơi (chỉ cho phép xóa màn tùy biến do admin tạo)
  public async deleteLevel(id: string): Promise<boolean> {
    if (id === DEFAULT_BACH_DANG_CAMPAIGN.id) {
      throw new Error('Không thể xóa màn chơi cốt lõi mặc định của hệ thống.');
    }

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
          this.removeBackupFromLocalStorage(id);
          resolve(true);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch {
      this.removeBackupFromLocalStorage(id);
      return true;
    }
  }

  // Nhân bản một màn chơi
  public async duplicateLevel(sourceId: string): Promise<CampaignLevel> {
    const source = await this.getLevel(sourceId);
    if (!source) throw new Error('Không tìm thấy màn chơi gốc để nhân bản.');

    const newId = `campaign_${Date.now()}`;
    const duplicated: CampaignLevel = {
      ...source,
      id: newId,
      title: `${source.title} (Bản sao)`,
      isDefault: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await this.saveLevel(duplicated);
    return duplicated;
  }

  // Xuất màn chơi thành file JSON
  public exportLevelToJson(level: CampaignLevel): void {
    const jsonStr = JSON.stringify(level, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${level.id}_${level.title.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Nhập màn chơi từ chuỗi JSON
  public async importLevelFromJson(jsonString: string): Promise<CampaignLevel> {
    try {
      const parsed = JSON.parse(jsonString) as CampaignLevel;
      if (!parsed.title || !parsed.scenes || !parsed.initialSceneId) {
        throw new Error('Dữ liệu JSON không hợp lệ. Thiếu title, scenes hoặc initialSceneId.');
      }

      // Tạo ID mới nếu trùng hoặc để nguyên
      const levelToSave: CampaignLevel = {
        ...parsed,
        id: parsed.id ? (parsed.id === DEFAULT_BACH_DANG_CAMPAIGN.id ? `imported_${Date.now()}` : parsed.id) : `imported_${Date.now()}`,
        isDefault: false,
        updatedAt: Date.now(),
        createdAt: parsed.createdAt || Date.now(),
      };

      await this.saveLevel(levelToSave);
      return levelToSave;
    } catch (e) {
      throw new Error(`Lỗi nhập màn chơi JSON: ${(e as Error).message}`);
    }
  }

  // --- LocalStorage Fallback Helpers ---
  private getFallbackLevels(): CampaignLevel[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return INITIAL_DEFAULT_CAMPAIGNS;
  }

  private syncBackupToLocalStorage(level: CampaignLevel) {
    try {
      const list = this.getFallbackLevels().filter((l) => l.id !== level.id);
      list.unshift(level);
      localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(list));
    } catch {
      // Storage quota exceeded
    }
  }

  private removeBackupFromLocalStorage(id: string) {
    try {
      const list = this.getFallbackLevels().filter((l) => l.id !== id);
      localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(list));
    } catch {
      // Ignore
    }
  }
}

export const levelStorage = new LevelStorageService();
