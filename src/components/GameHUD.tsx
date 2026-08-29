import React from 'react';
import {
  Waves,
  BookOpen,
  Volume2,
  VolumeX,
  History,
  RotateCcw,
  GitBranch,
  GraduationCap,
  Mic,
  MicOff,
  ListOrdered,
} from 'lucide-react';
import { SceneData } from '../types/game';

interface GameHUDProps {
  scene: SceneData;
  playerName: string;
  morale: number;
  isMuted: boolean;
  isVoiceEnabled: boolean;
  studyMode: boolean;
  onToggleMute: () => void;
  onToggleVoice: () => void;
  onToggleStudyMode: () => void;
  onOpenCodex: () => void;
  onOpenHistory: () => void;
  onOpenFlowchart: () => void;
  onOpenLevelSelect?: () => void;
  onRestart: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  scene,
  playerName,
  morale,
  isMuted,
  isVoiceEnabled,
  studyMode,
  onToggleMute,
  onToggleVoice,
  onToggleStudyMode,
  onOpenCodex,
  onOpenHistory,
  onOpenFlowchart,
  onOpenLevelSelect,
  onRestart,
}) => {
  const getTideBadge = () => {
    switch (scene.tideState) {
      case 'high':
        return { text: 'Triều Cường (Nước Ngập Bãi Cọc)', classStyle: 'btn-material-iron' };
      case 'falling':
        return { text: 'Triều Rút Gấp (Cọc Nhô Lên)', classStyle: 'btn-material-bronze' };
      case 'low':
        return { text: 'Triều Kiệt (Lộ Đáy Sông)', classStyle: 'btn-material-wood' };
      default:
        return { text: 'Nước Đứng (Thủy Triều Bình Hoà)', classStyle: 'btn-material-iron' };
    }
  };

  const tide = getTideBadge();

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-3 md:px-6 py-2 flex items-center justify-between border-b-2 border-[#422c1b] bg-[#120d09] shadow-xl select-none">
      {/* Left: Chapter info, Branch Tag & Player Name */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-widest">
              {scene.chapter} • <span className="text-[#f5ebd9]">{playerName}</span>
            </span>
            {scene.branchTag && (
              <span className="px-2 py-0.5 rounded text-[9px] font-bold btn-material-wood text-[#d4af37]">
                {scene.branchTag}
              </span>
            )}
          </div>
          <h2 className="text-xs md:text-sm font-bold text-[#f5ebd9] truncate max-w-xs">
            {scene.title}
          </h2>
        </div>
        <div className="sm:hidden text-xs font-bold text-[#d4af37]">
          {scene.title}
        </div>
      </div>

      {/* Center: Tide state, Morale & Study Mode Toggle */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Solid Tide Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow-md ${tide.classStyle}`}
        >
          <Waves className="w-3.5 h-3.5 shrink-0 text-[#d4af37]" />
          <span className="hidden md:inline">{tide.text}</span>
          <span className="md:hidden">
            {scene.tideState === 'falling' ? 'Triều Rút' : scene.tideState === 'high' ? 'Triều Dâng' : 'Triều Kiệt'}
          </span>
        </div>

        {/* Morale Bar - Solid Wood & Bronze Style */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg wood-panel-solid text-xs font-bold border border-[#5a3d28]">
          <span className="text-[11px] text-[#faebd7]">Nhuệ Khí:</span>
          <div className="w-16 md:w-24 bg-[#0a0705] h-3 rounded-full overflow-hidden border border-[#3b2718] p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                morale >= 70 ? 'bg-[#b8860b]' : morale >= 40 ? 'bg-[#c85a17]' : 'bg-[#8b0000]'
              }`}
              style={{ width: `${Math.min(Math.max(morale, 0), 100)}%` }}
            />
          </div>
          <span className="text-[#faebd7] text-xs font-bold">{morale}</span>
        </div>

        {/* Study Mode Toggle */}
        <button
          onClick={onToggleStudyMode}
          title={studyMode ? 'Tắt Gợi Ý Chính Sử' : 'Bật Gợi Ý Chính Sử (Chế Độ Học Tập)'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
            studyMode ? 'btn-material-bronze text-[#faebd7]' : 'btn-material-iron text-[#b89f88]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span className="hidden sm:inline">{studyMode ? 'Học Tập: BẬT' : 'Gợi Ý: TẮT'}</span>
        </button>
      </div>

      {/* Right: Solid Material Action Buttons */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {onOpenLevelSelect && (
          <button
            onClick={onOpenLevelSelect}
            title="Đổi Màn Chơi / Chọn Chiến Dịch Khác"
            className="btn-material-wood flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-200 hover:text-amber-100 cursor-pointer border border-[#5c4028]"
          >
            <ListOrdered className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Đổi Màn</span>
          </button>
        )}

        <button
          onClick={onOpenFlowchart}
          title="Xem Cây Nhánh Kịch Bản"
          className="btn-material-bronze flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
        >
          <GitBranch className="w-4 h-4 text-[#faebd7]" />
          <span className="hidden sm:inline">Cây Nhánh</span>
        </button>

        <button
          onClick={onOpenCodex}
          title="Mở Sử Ký Tra Cứu"
          className="btn-material-iron p-2 rounded-lg text-xs cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenHistory}
          title="Xem Lịch Sử Thoại"
          className="btn-material-iron p-2 rounded-lg text-xs cursor-pointer"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Voice Speech Toggle */}
        <button
          onClick={onToggleVoice}
          title={isVoiceEnabled ? 'Tắt Lồng Tiếng' : 'Bật Lồng Tiếng'}
          className={`p-2 rounded-lg text-xs cursor-pointer ${
            isVoiceEnabled ? 'btn-material-bronze' : 'btn-material-iron'
          }`}
        >
          {isVoiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Sound Mute Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Bật Toàn Bộ Âm Thanh' : 'Tắt Âm Thanh'}
          className="btn-material-iron p-2 rounded-lg text-xs cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#d47260]" /> : <Volume2 className="w-4 h-4 text-[#86b595]" />}
        </button>

        <button
          onClick={onRestart}
          title="Chơi Lại Từ Đầu"
          className="btn-material-iron p-2 rounded-lg text-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
