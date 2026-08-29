import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Download,
  Upload,
  Edit,
  Trash2,
  Copy,
  Play,
  ArrowLeft,
  RefreshCw,
  Sliders,
  CheckCircle,
  LogOut,
} from 'lucide-react';
import { CampaignLevel } from '../../types/game';
import { levelStorage } from '../../utils/levelStorage';
import { LevelEditorModal } from './LevelEditorModal';

interface AdminStudioProps {
  onBackToMenu: () => void;
  onPlayLevel: (level: CampaignLevel) => void;
  onLogout?: () => void;
}

export const AdminStudio: React.FC<AdminStudioProps> = ({ onBackToMenu, onPlayLevel, onLogout }) => {
  const [levels, setLevels] = useState<CampaignLevel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingLevel, setEditingLevel] = useState<CampaignLevel | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  const loadAllLevels = async () => {
    setIsLoading(true);
    try {
      const data = await levelStorage.initialize();
      setLevels(data);
    } catch (e) {
      console.error('Error loading levels:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllLevels();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  // Create new blank campaign
  const handleCreateNewLevel = () => {
    const newId = `campaign_${Date.now()}`;
    const newLevel: CampaignLevel = {
      id: newId,
      title: 'Chiến Dịch Lịch Sử Mới',
      subtitle: 'Mô tả tóm lược chiến công anh hùng',
      era: 'Niên đại lịch sử',
      difficulty: 'Trung bình',
      coverImage: '/assets/images/scenes/war_tent.jpg',
      description: 'Mô tả bối cảnh lịch sử, ý nghĩa quân sự của chiến dịch...',
      author: 'Admin Studio',
      initialMorale: 80,
      initialSceneId: 'scene_intro',
      characters: {
        hero: {
          id: 'hero',
          name: 'Tướng Quân',
          title: 'Thống Soái',
          faction: 'viet',
          avatar: '/assets/images/characters/ngo_quyen.jpg',
          fullImage: '/assets/images/characters/ngo_quyen.jpg',
          themeColor: '#e11d48',
        },
        narrator: {
          id: 'narrator',
          name: 'Sử Ký',
          title: 'Người Dẫn Chuyện',
          faction: 'neutral',
          avatar: '/assets/images/scenes/war_tent.jpg',
          fullImage: '/assets/images/scenes/war_tent.jpg',
          themeColor: '#d97706',
        },
      },
      scenes: {
        scene_intro: {
          id: 'scene_intro',
          title: 'Hồi 1: Binh Biến Biên Cương',
          chapter: 'Chương I: Bày Binh Bố Trận',
          branchTag: 'Khởi Đầu',
          background: 'war_tent',
          timeOfDay: 'Đêm khuya',
          dialogues: [
            {
              id: `d_${Date.now()}_1`,
              speaker: 'narrator',
              text: 'Quân giặc ồ ạt tiến sát bờ cõi! Đất nước đứng trước họa xâm lăng...',
              bgm: 'suspense',
              soundEffect: 'drum',
            },
            {
              id: `d_${Date.now()}_2`,
              speaker: 'hero',
              text: 'Ba quân tướng sĩ! Quyết tử cho Tổ quốc quyết sinh!',
              emotion: 'confident',
              soundEffect: 'gong',
            },
          ],
          choices: [
            {
              id: `c_${Date.now()}_1`,
              text: 'Bày trận mai phục hiểm địa',
              tag: '👑 CHÍNH SỬ',
              description: 'Lấy ít địch nhiều, tận dụng địa thế hiểm trở tiêu diệt địch.',
              moraleChange: 20,
              nextSceneId: 'scene_victory',
              isOptimal: true,
              historicalReason: 'Kế sách tối ưu trong binh pháp truyền thống.',
            },
          ],
        },
        scene_victory: {
          id: 'scene_victory',
          title: 'Hồi 2: Đại Thắng Khải Hoàn',
          chapter: 'Chương II: Non Sông Thái Bình',
          branchTag: 'Đại Thắng',
          background: 'victory_dawn',
          timeOfDay: 'Bình minh khải hoàn',
          dialogues: [
            {
              id: `d_${Date.now()}_3`,
              speaker: 'narrator',
              text: 'Quân giặc đại bại tan tác! Non sông sạch bóng thù!',
              soundEffect: 'victory',
              bgm: 'epic_war',
            },
          ],
          isEnding: true,
          endingType: 'triumphant',
          endingRank: 'S+',
          endingBadge: '👑 KHẢI HOÀN ĐẠI THẮNG',
          endingTitle: 'NON SÔNG ĐẠI VIỆT THÁI BÌNH',
          endingSummary: 'Lập nên chiến công oanh liệt, ghi danh vào trang sử vàng dân tộc.',
        },
      },
      isDefault: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setEditingLevel(newLevel);
    setIsEditorOpen(true);
  };

  const handleEditLevel = (lvl: CampaignLevel) => {
    setEditingLevel(JSON.parse(JSON.stringify(lvl)));
    setIsEditorOpen(true);
  };

  const handleSaveLevel = async (updated: CampaignLevel) => {
    await levelStorage.saveLevel(updated);
    setIsEditorOpen(false);
    setEditingLevel(null);
    await loadAllLevels();
    showNotification(`Đã lưu thành công chiến dịch: ${updated.title}`);
  };

  const handleDeleteLevel = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa màn chơi "${title}"?`)) return;
    try {
      await levelStorage.deleteLevel(id);
      await loadAllLevels();
      showNotification(`Đã xóa màn chơi "${title}"`);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDuplicateLevel = async (id: string) => {
    try {
      const cloned = await levelStorage.duplicateLevel(id);
      await loadAllLevels();
      showNotification(`Đã nhân bản màn chơi: ${cloned.title}`);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleExportLevel = (lvl: CampaignLevel) => {
    levelStorage.exportLevelToJson(lvl);
    showNotification(`Đã xuất file JSON: ${lvl.title}`);
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const imported = await levelStorage.importLevelFromJson(content);
        await loadAllLevels();
        showNotification(`Đã nhập thành công chiến dịch: ${imported.title}`);
      } catch (err) {
        alert(`Lỗi khi nhập file JSON: ${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
    if (jsonFileInputRef.current) jsonFileInputRef.current.value = '';
  };

  const handlePlaytest = (lvl: CampaignLevel) => {
    setIsEditorOpen(false);
    onPlayLevel(lvl);
  };

  return (
    <div className="min-h-screen bg-[#0d0906] text-stone-100 flex flex-col font-sans relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,#2c1a10_0%,#0c0805_70%)] pointer-events-none opacity-80" />

      {/* Header */}
      <header className="relative z-10 bg-[#160f0a] border-b border-[#4a3525] px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="btn-material-iron text-xs px-3 py-2 rounded flex items-center gap-1.5 text-stone-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Về Màn Hình Game</span>
          </button>
          <div className="h-6 w-px bg-[#3d2a1c] hidden sm:block" />
          <div>
            <h1 className="text-base sm:text-lg font-bold font-serif text-amber-200 tracking-wide flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              Studio Quản Trị & Sáng Tạo Màn Chơi
            </h1>
            <p className="text-[11px] text-stone-400">
              Tạo, chỉnh sửa, tải lên hình ảnh / âm thanh và quản lý các kịch bản lịch sử
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <input
            ref={jsonFileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportJsonFile}
            className="hidden"
          />

          <button
            onClick={() => jsonFileInputRef.current?.click()}
            className="btn-material-wood text-xs px-3.5 py-2 rounded flex items-center gap-1.5 text-stone-200 hover:text-amber-200 cursor-pointer border border-[#5c4028]"
            title="Nhập màn chơi từ file JSON trên máy"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Nhập File JSON</span>
          </button>

          <button
            onClick={handleCreateNewLevel}
            className="btn-material-bronze text-xs px-4 py-2 rounded flex items-center gap-2 text-amber-100 font-bold cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Tạo Màn Chơi Mới</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="btn-material-iron text-xs px-3 py-2 rounded flex items-center gap-1.5 text-stone-400 hover:text-red-300 cursor-pointer"
              title="Đăng xuất Quản trị viên"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </button>
          )}
        </div>
      </header>

      {/* Notification Banner */}
      {successMessage && (
        <div className="relative z-20 bg-emerald-950/90 border-b border-emerald-600 px-4 py-2 text-center text-emerald-200 text-xs font-medium flex items-center justify-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Stats & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#160f0a]/90 p-4 rounded-xl border border-[#3d2a1c]">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-stone-400">
              Tổng số chiến dịch: <strong className="text-amber-300 font-mono text-sm">{levels.length}</strong>
            </span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-400">
              Màn tùy biến: <strong className="text-emerald-400 font-mono text-sm">{levels.filter((l) => !l.isDefault).length}</strong>
            </span>
          </div>

          <button
            onClick={loadAllLevels}
            className="text-stone-400 hover:text-amber-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới danh sách</span>
          </button>
        </div>

        {/* Level Cards Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-stone-400 space-y-3">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-amber-500" />
            <p className="text-sm">Đang tải dữ liệu màn chơi từ hệ thống lưu trữ...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((lvl) => {
              const sceneCount = Object.keys(lvl.scenes || {}).length;
              const charCount = Object.keys(lvl.characters || {}).length;

              return (
                <div
                  key={lvl.id}
                  className="wood-panel-solid rounded-xl overflow-hidden border border-[#4a3525] flex flex-col justify-between hover:border-amber-600/80 transition-all duration-300 shadow-xl group"
                >
                  {/* Card Thumbnail & Badge */}
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-black/60">
                      <img
                        src={lvl.coverImage || '/assets/images/scenes/war_tent.jpg'}
                        alt={lvl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#160f0a] via-transparent to-black/40" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {lvl.isDefault ? (
                          <span className="px-2 py-0.5 rounded bg-amber-950/90 text-amber-200 border border-amber-600/70 text-[10px] font-bold tracking-wider">
                            👑 MẶC ĐỊNH
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-200 border border-emerald-600/70 text-[10px] font-bold tracking-wider">
                            ✨ TÙY BIẾN
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-black/70 text-stone-300 border border-stone-700 text-[10px]">
                          {lvl.difficulty}
                        </span>
                      </div>

                      {/* Era Tag */}
                      <div className="absolute bottom-2 left-3 text-[11px] font-semibold text-amber-300/90 drop-shadow">
                        {lvl.era}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2.5">
                      <h3 className="text-base font-bold text-amber-100 font-serif line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {lvl.title}
                      </h3>
                      <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                        {lvl.description || lvl.subtitle}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-400 border-t border-[#3d2a1c]">
                        <span>🏛️ {sceneCount} phân cảnh</span>
                        <span>👥 {charCount} tướng lĩnh</span>
                        <span>✍️ {lvl.author || 'Tác giả'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-[#120c08] p-3 border-t border-[#3d2a1c] flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => handlePlaytest(lvl)}
                      className="btn-material-bronze text-xs px-3 py-1.5 rounded flex items-center gap-1.5 text-amber-100 font-bold cursor-pointer"
                      title="Vào chơi thử nghiệm màn này"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Chơi Thử</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditLevel(lvl)}
                        className="p-1.5 rounded bg-[#241810] text-stone-300 hover:text-amber-300 hover:bg-[#382619] transition-colors border border-[#4a3525] cursor-pointer"
                        title="Chỉnh sửa nội dung, phân cảnh, ảnh và audio"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDuplicateLevel(lvl.id)}
                        className="p-1.5 rounded bg-[#241810] text-stone-300 hover:text-sky-300 hover:bg-[#382619] transition-colors border border-[#4a3525] cursor-pointer"
                        title="Nhân bản màn chơi này"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleExportLevel(lvl)}
                        className="p-1.5 rounded bg-[#241810] text-stone-300 hover:text-emerald-300 hover:bg-[#382619] transition-colors border border-[#4a3525] cursor-pointer"
                        title="Tải về file JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {!lvl.isDefault && (
                        <button
                          onClick={() => handleDeleteLevel(lvl.id, lvl.title)}
                          className="p-1.5 rounded bg-[#241810] text-stone-500 hover:text-red-400 hover:bg-red-950/60 transition-colors border border-[#4a3525] cursor-pointer"
                          title="Xóa màn chơi này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {isEditorOpen && editingLevel && (
        <LevelEditorModal
          level={editingLevel}
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingLevel(null);
          }}
          onSave={handleSaveLevel}
          onPlaytest={handlePlaytest}
        />
      )}
    </div>
  );
};
