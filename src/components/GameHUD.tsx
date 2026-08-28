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
        return { text: 'Triều Cường (Nước Ngập Bãi Cọc)', color: 'bg-cyan-950 text-cyan-300 border-cyan-700/60' };
      case 'falling':
        return { text: 'Triều Rút Gấp (Cọc Nhô Lên)', color: 'bg-amber-950 text-amber-300 border-amber-600/70 animate-pulse' };
      case 'low':
        return { text: 'Triều Kiệt (Lộ Đáy Sông)', color: 'bg-emerald-950 text-emerald-300 border-emerald-700/60' };
      default:
        return { text: 'Nước Đứng (Thủy Triều Bình Hoà)', color: 'bg-stone-900 text-stone-300 border-stone-700' };
    }
  };

  const tide = getTideBadge();

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-3 md:px-6 py-2 flex items-center justify-between border-b border-amber-900/40 bg-stone-950/80 backdrop-blur-md select-none">
      {/* Left: Chapter info, Branch Tag & Player Name */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-amber-500/90 tracking-widest">
              {scene.chapter} • <span className="text-amber-200">{playerName}</span>
            </span>
            {scene.branchTag && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-950 border border-amber-700/60 text-amber-300">
                {scene.branchTag}
              </span>
            )}
          </div>
          <h2 className="text-xs md:text-sm font-bold text-stone-100 font-serif-epic truncate max-w-xs">
            {scene.title}
          </h2>
        </div>
        <div className="sm:hidden text-xs font-bold text-amber-200">
          {scene.title}
        </div>
      </div>

      {/* Center: Tide state, Morale & Study Mode Toggle */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Tide Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${tide.color} shadow-sm`}
        >
          <Waves className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden md:inline">{tide.text}</span>
          <span className="md:hidden">
            {scene.tideState === 'falling' ? 'Triều Rút' : scene.tideState === 'high' ? 'Triều Dâng' : 'Triều Kiệt'}
          </span>
        </div>

        {/* Morale Bar */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-stone-900/90 rounded-full border border-stone-700">
          <Award className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-xs text-stone-300 font-medium">Khí Thế:</span>
          <div className="w-16 bg-stone-800 rounded-full h-2 overflow-hidden border border-stone-700">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                morale > 70 ? 'bg-gradient-to-r from-emerald-500 to-amber-400' : morale > 40 ? 'bg-amber-500' : 'bg-rose-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(10, morale))}%` }}
            />
          </div>
          <span className="text-xs font-bold text-amber-300">{morale}</span>
        </div>

        {/* Study Mode (Gợi ý Chính Sử) Toggle Button */}
        <button
          onClick={onToggleStudyMode}
          title={studyMode ? 'Tắt Gợi Ý Học Tập' : 'Bật Gợi Ý Chính Sử Cho Học Viên'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold transition cursor-pointer shadow-sm ${
            studyMode
              ? 'border-amber-400 bg-amber-500 text-stone-950 glow-gold'
              : 'border-stone-700 bg-stone-900/90 text-stone-400 hover:text-stone-200'
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
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/70 bg-gradient-to-r from-amber-950/70 to-rose-950/70 hover:brightness-110 text-amber-200 text-xs font-bold cursor-pointer transition shadow-md"
        >
          <GitBranch className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Cây Nhánh</span>
        </button>

        <button
          onClick={onOpenCodex}
          title="Mở Sử Ký Tra Cứu"
          className="p-1.5 rounded-lg border border-amber-700/60 bg-amber-950/50 hover:bg-amber-900/60 text-amber-200 text-xs font-medium cursor-pointer transition"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
        </button>

        <button
          onClick={onOpenHistory}
          title="Xem Lịch Sử Thoại"
          className="p-1.5 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-200 cursor-pointer transition"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Voice Speech Toggle */}
        <button
          onClick={onToggleVoice}
          title={isVoiceEnabled ? 'Tắt Lồng Tiếng AI' : 'Bật Lồng Tiếng AI'}
          className={`p-1.5 rounded-lg border cursor-pointer transition ${
            isVoiceEnabled
              ? 'border-emerald-600/70 bg-emerald-950/60 text-emerald-300'
              : 'border-stone-700 bg-stone-900 text-stone-500'
          }`}
        >
          {isVoiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Sound Mute Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Bật Toàn Bộ Âm Thanh' : 'Tắt Âm Thanh'}
          className="p-1.5 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-200 cursor-pointer transition"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          onClick={onRestart}
          title="Chơi Lại Từ Đầu"
          className="p-1.5 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-rose-300 cursor-pointer transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
