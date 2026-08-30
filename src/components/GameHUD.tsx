import React from 'react';
import {
  MapPin,
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
  // Dynamic Tactical & Environmental Condition Badge (Universal for all historical battles)
  const getTacticalBadge = () => {
    if (scene.tacticalCondition && scene.tacticalCondition.value) {
      const { label, value, icon, colorStyle } = scene.tacticalCondition;
      let btnStyle = 'btn-material-bronze';
      if (colorStyle === 'iron') btnStyle = 'btn-material-iron';
      else if (colorStyle === 'wood') btnStyle = 'btn-material-wood';
      else if (colorStyle === 'danger') btnStyle = 'bg-red-950/90 text-red-200 border-2 border-red-600 shadow-md';
      else if (colorStyle === 'nature') btnStyle = 'bg-emerald-950/90 text-emerald-200 border-2 border-emerald-600 shadow-md';

      return {
        icon: icon || '⚔️',
        fullText: `${label ? `${label}: ` : ''}${value}`,
        shortText: value,
        classStyle: btnStyle,
      };
    }

    // Fallback: Tide state for naval campaigns or general time of day
    if (scene.tideState && scene.tideState !== 'neutral') {
      switch (scene.tideState) {
        case 'high':
          return { icon: '🌊', fullText: 'Thủy Triều: Triều Cường Ngập Bãi Cọc', shortText: 'Triều Cường', classStyle: 'btn-material-iron' };
        case 'falling':
          return { icon: '🌊', fullText: 'Thủy Triều: Triều Rút Gấp Lộ Bãi Cọc', shortText: 'Triều Rút', classStyle: 'btn-material-bronze' };
        case 'low':
          return { icon: '🌊', fullText: 'Thủy Triều: Triều Kiệt Đáy Sông', shortText: 'Triều Kiệt', classStyle: 'btn-material-wood' };
        default:
          break;
      }
    }

    return {
      icon: '⏳',
      fullText: `${scene.timeOfDay || 'Chiến Cục Diễn Biến'}`,
      shortText: scene.timeOfDay || 'Chiến Cục',
      classStyle: 'btn-material-iron',
    };
  };

  const badge = getTacticalBadge();

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-3 md:px-6 py-2 flex items-center justify-between border-b-2 border-[#422c1b] bg-[#120d09] shadow-xl select-none">
      {/* Left: Chapter info, Location, Branch Tag & Commander Name */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-widest flex items-center gap-1">
              <span>{scene.chapter || 'Hồi Trận'}</span>
              <span>•</span>
              <span className="text-[#f5ebd9]">{playerName}</span>
            </span>
            {scene.location && (
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#1e150f] text-amber-300 border border-[#5a3d28] flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-amber-400" />
                <span>{scene.location}</span>
              </span>
            )}
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
        <div className="sm:hidden text-xs font-bold text-[#d4af37] flex items-center gap-1">
          {scene.location && <MapPin className="w-3 h-3" />}
          <span className="truncate max-w-[120px]">{scene.location || scene.title}</span>
        </div>
      </div>

      {/* Center: Dynamic Tactical/Terrain Condition, Morale & Study Mode Toggle */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Dynamic Tactical Condition Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow-md ${badge.classStyle}`}
          title={badge.fullText}
        >
          <span className="text-sm shrink-0">{badge.icon}</span>
          <span className="hidden md:inline">{badge.fullText}</span>
          <span className="md:hidden">{badge.shortText}</span>
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
            studyMode
              ? 'btn-material-bronze text-amber-200 ring-2 ring-amber-400/60'
              : 'btn-material-iron text-stone-300 hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{studyMode ? 'Gợi Ý: BẬT' : 'Gợi Ý'}</span>
        </button>
      </div>

      {/* Right: Actions (Codex, History, Voice, Mute, Flowchart, Level Select) */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {onOpenLevelSelect && (
          <button
            onClick={onOpenLevelSelect}
            className="btn-material-wood flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-200 hover:text-amber-100 cursor-pointer border border-[#5c4028]"
            title="Quay lại danh sách màn chơi"
          >
            <ListOrdered className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Chọn Màn</span>
          </button>
        )}

        <button
          onClick={onOpenCodex}
          className="btn-material-bronze flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
          title="Mở Binh Pháp & Sử Liệu"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sử Liệu</span>
        </button>

        <button
          onClick={onOpenFlowchart}
          className="btn-material-wood p-1.5 md:px-2.5 md:py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer border border-[#5a3f28]"
          title="Xem Sa Bàn Nhánh Kịch Bản"
        >
          <GitBranch className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="hidden lg:inline">Sa Bàn</span>
        </button>

        <button
          onClick={onOpenHistory}
          className="btn-material-iron p-1.5 md:p-2 rounded-lg text-xs cursor-pointer"
          title="Nhật ký đối thoại"
        >
          <History className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ede4dc]" />
        </button>

        <button
          onClick={onToggleVoice}
          className={`p-1.5 md:p-2 rounded-lg text-xs cursor-pointer ${
            isVoiceEnabled ? 'btn-material-bronze text-amber-200' : 'btn-material-iron text-stone-400'
          }`}
          title={isVoiceEnabled ? 'Tắt đọc giọng lồng tiếng' : 'Bật đọc giọng lồng tiếng AI'}
        >
          {isVoiceEnabled ? (
            <Mic className="w-3.5 h-3.5 md:w-4 md:h-4" />
          ) : (
            <MicOff className="w-3.5 h-3.5 md:w-4 md:h-4" />
          )}
        </button>

        <button
          onClick={onToggleMute}
          className="btn-material-iron p-1.5 md:p-2 rounded-lg text-xs cursor-pointer"
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ede4dc]" />
          )}
        </button>

        <button
          onClick={onRestart}
          className="btn-material-iron p-1.5 md:p-2 rounded-lg text-xs cursor-pointer"
          title="Chơi lại từ đầu"
        >
          <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ede4dc]" />
        </button>
      </div>
    </header>
  );
};
