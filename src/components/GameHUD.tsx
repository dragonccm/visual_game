import React from 'react';
import {
  Waves,
  BookOpen,
  Volume2,
  VolumeX,
  History,
  RotateCcw,
  Award,
  GitBranch,
  GraduationCap,
  Mic,
  MicOff,
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
  onRestart,
}) => {
  const getTideBadge = () => {
    switch (scene.tideState) {
      case 'high':
        return { text: 'Triều Cường (Nước Ngập Bãi Cọc)', color: 'bg-[#16212b] text-[#8cb0cf] border-[#2d3e4f]' };
      case 'falling':
        return { text: 'Triều Rút Gấp (Cọc Nhô Lên)', color: 'bg-[#2b1b11] text-[#d4af37] border-[#7d5830]' };
      case 'low':
        return { text: 'Triều Kiệt (Lộ Đáy Sông)', color: 'bg-[#15241b] text-[#86b595] border-[#294232]' };
      default:
        return { text: 'Nước Đứng (Thủy Triều Bình Hoà)', color: 'bg-[#171412] text-[#b09e8f] border-[#382b22]' };
    }
  };

  const tide = getTideBadge();

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-3 md:px-6 py-2 flex items-center justify-between border-b border-[#3b2718] bg-[#120d09]/85 backdrop-blur-md select-none">
      {/* Left: Chapter info, Branch Tag & Player Name */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-[#b89558] tracking-widest">
              {scene.chapter} • <span className="text-[#e0d3c5]">{playerName}</span>
            </span>
            {scene.branchTag && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#26180f] border border-[#523722] text-[#c49a62]">
                {scene.branchTag}
              </span>
            )}
          </div>
          <h2 className="text-xs md:text-sm font-bold text-[#f2e7dc] font-serif-epic truncate max-w-xs">
            {scene.title}
          </h2>
        </div>
        <div className="sm:hidden text-xs font-bold text-[#d4af37]">
          {scene.title}
        </div>
      </div>

      {/* Center: Tide state, Morale & Study Mode Toggle */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Tide Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${tide.color} shadow-sm`}
        >
          <Waves className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden md:inline">{tide.text}</span>
          <span className="md:hidden">
            {scene.tideState === 'falling' ? 'Triều Rút' : scene.tideState === 'high' ? 'Triều Dâng' : 'Triều Kiệt'}
          </span>
        </div>

        {/* Morale Bar - Antique Bronze & Iron Style */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#1c140e] rounded-md border border-[#3b291c]">
          <Award className="w-3.5 h-3.5 text-[#b8934a]" />
          <span className="text-xs text-[#a69483] font-medium">Khí Thế:</span>
          <div className="w-16 bg-[#0f0a07] rounded-sm h-2 overflow-hidden border border-[#2e1f14]">
            <div
              className="h-full transition-all duration-500 bg-gradient-to-r from-[#6b4e2b] via-[#a37a3e] to-[#d4af37]"
              style={{ width: `${Math.min(100, Math.max(10, morale))}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[#d4af37]">{morale}</span>
        </div>

        {/* Study Mode (Gợi ý Chính Sử) Toggle Button */}
        <button
          onClick={onToggleStudyMode}
          title={studyMode ? 'Tắt Gợi Ý Học Tập' : 'Bật Gợi Ý Chính Sử Cho Học Viên'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold transition cursor-pointer shadow-sm ${
            studyMode
              ? 'border-[#c8963e] bg-[#3d2716] text-[#f7e9c8]'
              : 'border-[#382618] bg-[#140e0a] text-[#8c7867] hover:text-[#d4b483]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{studyMode ? 'Học Tập: BẬT' : 'Gợi Ý: TẮT'}</span>
        </button>
      </div>

      {/* Right: Audio & Navigation Controls */}
      <div className="flex items-center gap-1.5 md:gap-2">
        <button
          onClick={onOpenFlowchart}
          title="Xem Cây Nhánh Kịch Bản"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#7d5830] bg-[#24170e] hover:border-[#b8934a] text-[#d4af37] text-xs font-bold cursor-pointer transition shadow-md"
        >
          <GitBranch className="w-4 h-4" />
          <span className="hidden sm:inline">Cây Nhánh</span>
        </button>

        <button
          onClick={onOpenCodex}
          title="Mở Sử Ký Tra Cứu"
          className="p-1.5 rounded-md border border-[#3d2919] bg-[#1a110a] hover:bg-[#2e1d10] text-[#c4b3a3] hover:text-[#d4af37] text-xs font-medium cursor-pointer transition"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenHistory}
          title="Xem Lịch Sử Thoại"
          className="p-1.5 rounded-md border border-[#382618] bg-[#150e09] hover:bg-[#24170e] text-[#8c7867] hover:text-[#f0e4d6] cursor-pointer transition"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Voice Speech Toggle */}
        <button
          onClick={onToggleVoice}
          title={isVoiceEnabled ? 'Tắt Lồng Tiếng AI' : 'Bật Lồng Tiếng AI'}
          className={`p-1.5 rounded-md border cursor-pointer transition ${
            isVoiceEnabled
              ? 'border-[#5a4225] bg-[#291b10] text-[#d4af37]'
              : 'border-[#2e2015] bg-[#120c08] text-[#5e4d3f]'
          }`}
        >
          {isVoiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Sound Mute Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Bật Toàn Bộ Âm Thanh' : 'Tắt Âm Thanh'}
          className="p-1.5 rounded-md border border-[#382618] bg-[#150e09] hover:bg-[#24170e] text-[#8c7867] hover:text-[#f0e4d6] cursor-pointer transition"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#8a4e40]" /> : <Volume2 className="w-4 h-4 text-[#6e9b7b]" />}
        </button>

        <button
          onClick={onRestart}
          title="Chơi Lại Từ Đầu"
          className="p-1.5 rounded-md border border-[#382618] bg-[#150e09] hover:bg-[#24170e] text-[#8c7867] hover:text-[#a85848] cursor-pointer transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
