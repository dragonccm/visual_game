import React, { useEffect, useState } from 'react';
import { Play, Sliders, ArrowLeft, Award, Shield, User, RefreshCw, Lock, LogOut } from 'lucide-react';
import { CampaignLevel } from '../types/game';
import { levelStorage } from '../utils/levelStorage';
import { soundEngine } from '../utils/soundEngine';

interface LevelSelectScreenProps {
  playerName: string;
  onSelectLevel: (level: CampaignLevel) => void;
  onOpenAdmin: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onBackToLanding: () => void;
  isAdmin: boolean;
  unlockedEndings: string[];
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  playerName,
  onSelectLevel,
  onOpenAdmin,
  onOpenLogin,
  onLogout,
  onBackToLanding,
  isAdmin,
  unlockedEndings,
}) => {
  const [levels, setLevels] = useState<CampaignLevel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLevels = async () => {
      setIsLoading(true);
      try {
        const list = await levelStorage.initialize();
        setLevels(list);
      } catch (err) {
        console.error('Error fetching levels in selector:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLevels();
  }, []);

  const handleChooseLevel = (level: CampaignLevel) => {
    soundEngine.playSFX('horn');
    soundEngine.unlockAudio();
    onSelectLevel(level);
  };

  return (
    <div className="min-h-screen bg-[#0a0705] text-stone-100 flex flex-col relative overflow-x-hidden font-sans">
      {/* Historical Background Ambience */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-25 filter blur-[2px] pointer-events-none scale-105"
        style={{ backgroundImage: "url('/assets/images/scenes/war_tent.jpg')" }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-[#100b07]/90 to-[#0a0705] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 bg-[#160f0a]/90 backdrop-blur-md border-b border-[#4a3525] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLanding}
            className="btn-material-iron text-xs px-3 py-1.5 rounded flex items-center gap-1.5 text-stone-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Trang Bìa</span>
          </button>
          <div className="h-5 w-px bg-[#3d2a1c] hidden sm:block" />
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-stone-300">
              Chỉ huy: <strong className="text-amber-200">{playerName || 'Dũng Sĩ Đại Việt'}</strong>
            </span>
          </div>
        </div>

        {/* Admin Studio / Login Entry */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAdmin}
                className="btn-material-bronze text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 text-amber-100 font-bold cursor-pointer shadow-md"
                title="Mở Studio Quản Trị"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-300" />
                <span>Studio Quản Trị</span>
              </button>

              <button
                onClick={onLogout}
                className="btn-material-iron p-1.5 rounded text-stone-400 hover:text-red-300 transition cursor-pointer"
                title="Đăng xuất quyền Quản trị"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="btn-material-wood text-xs px-3 py-1.5 rounded flex items-center gap-1.5 text-amber-200 hover:text-amber-100 border border-[#5c4028] cursor-pointer"
              title="Đăng nhập dành cho Quản trị viên tạo màn chơi"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">Đăng Nhập Quản Trị</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Title Section */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/60 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Màn Hình Chọn Màn Chơi</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-100 font-serif tracking-wide drop-shadow-lg">
            CHỌN CHIẾN DỊCH LỊCH SỬ
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Chọn một chiến tích lịch sử hào hùng để trực tiếp vào vai chỉ huy, đưa ra quyết sách quân sự và định đoạt cục diện non sông.
          </p>
        </div>

        {/* Campaign Cards Grid */}
        {isLoading ? (
          <div className="text-center py-20 space-y-3">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-amber-500" />
            <p className="text-sm text-stone-400">Đang chuẩn bị sa bàn chiến dịch...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {levels.map((lvl) => {
              const sceneCount = Object.keys(lvl.scenes || {}).length;
              const hasCompleted = unlockedEndings && unlockedEndings.length > 0;

              return (
                <div
                  key={lvl.id}
                  className="wood-panel-solid rounded-2xl overflow-hidden border-2 border-[#5c4028] hover:border-amber-500/80 transition-all duration-300 shadow-2xl flex flex-col justify-between group hover:-translate-y-1"
                >
                  {/* Card Cover Art */}
                  <div className="relative h-56 w-full overflow-hidden bg-black/60">
                    <img
                      src={lvl.coverImage || '/assets/images/scenes/war_tent.jpg'}
                      alt={lvl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b140e] via-[#1b140e]/40 to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 flex gap-2">
                      <span className="px-2.5 py-1 rounded bg-amber-950/95 text-amber-200 border border-amber-600 text-xs font-bold tracking-wide shadow-md">
                        {lvl.era}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-black/80 text-stone-300 border border-stone-700 text-xs font-medium">
                        Độ khó: {lvl.difficulty}
                      </span>
                    </div>

                    {/* Ending Achievement badge if unlocked */}
                    {hasCompleted && (
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/90 text-emerald-200 border border-emerald-600 text-xs font-bold shadow-md">
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Đã Hoàn Thành</span>
                      </div>
                    )}

                    {/* Subtitle on image bottom */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-xs text-amber-300 font-serif italic line-clamp-1 drop-shadow-md">
                        {lvl.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between bg-[#1b140e]">
                    <div className="space-y-2.5">
                      <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-100 group-hover:text-amber-300 transition-colors">
                        {lvl.title}
                      </h2>
                      <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                        {lvl.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-2 border-t border-[#3d2a1c]">
                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <span>🏛️ {sceneCount} phân cảnh chiến thuật</span>
                        <span>👥 {Object.keys(lvl.characters || {}).length} nhân vật lịch sử</span>
                      </div>

                      <button
                        onClick={() => handleChooseLevel(lvl)}
                        className="btn-material-bronze w-full py-3.5 rounded-xl flex items-center justify-center gap-2.5 text-amber-100 font-bold text-sm uppercase tracking-wider cursor-pointer shadow-lg group-hover:brightness-110 transition-all"
                      >
                        <Play className="w-4 h-4 fill-amber-200 text-amber-200" />
                        <span>XUẤT TRẬN (CHƠI NGAY)</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
