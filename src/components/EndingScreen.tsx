import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SceneData } from '../types/game';
import { Trophy, RotateCcw, Award, CheckCircle2, ShieldCheck, Share2, GitBranch, AlertTriangle, ListOrdered } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface EndingScreenProps {
  scene: SceneData;
  playerName: string;
  morale: number;
  visitedScenesCount: number;
  onRestart: () => void;
  onOpenFlowchart: () => void;
  onOpenLevelSelect?: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  scene,
  playerName,
  morale,
  visitedScenesCount,
  onRestart,
  onOpenFlowchart,
  onOpenLevelSelect,
}) => {
  const isVictory = scene.endingType === 'triumphant' || scene.endingType === 'special' || scene.endingType === 'good';
  const isDefeat = scene.endingType === 'defeat';

  useEffect(() => {
    if (isVictory) {
      soundEngine.playSFX('victory');
      try {
        const count = 180;
        const defaults = { origin: { y: 0.7 } };

        const fire = (particleRatio: number, opts: confetti.Options) => {
          confetti({
            ...defaults,
            ...opts,
            colors: ['#d4af37', '#aa8222', '#c49a62', '#8e6c38', '#ffffff'],
            particleCount: Math.floor(count * particleRatio),
          });
        };

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      } catch {
        // Confetti
      }
    } else {
      soundEngine.playSFX('drum');
    }
  }, [isVictory]);

  const getRankData = () => {
    if (scene.endingRank) {
      return {
        grade: scene.endingRank,
        color:
          scene.endingRank === 'S+' || scene.endingRank === 'S'
            ? 'text-[#d4af37]'
            : scene.endingRank.startsWith('A')
            ? 'text-[#86b595]'
            : scene.endingRank.startsWith('B')
            ? 'text-[#8fa5c4]'
            : 'text-[#e06d53]',
      };
    }
    if (morale >= 80) return { grade: 'S+', color: 'text-[#d4af37]' };
    if (morale >= 60) return { grade: 'A', color: 'text-[#86b595]' };
    return { grade: 'B', color: 'text-[#8fa5c4]' };
  };

  const rank = getRankData();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#0a0705]/95 backdrop-blur-md overflow-y-auto select-none">
      <div className="relative w-full max-w-2xl wood-panel-solid rounded-3xl p-6 sm:p-8 text-center border-4 border-[#5a3d28] shadow-2xl animate-fade-in my-auto">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full btn-material-bronze text-xs font-bold uppercase tracking-widest mb-4">
          {isVictory ? (
            <>
              <Trophy className="w-4 h-4 text-[#ffd700]" />
              <span>{scene.endingBadge || 'ĐẠI THẮNG SỬ SÁCH'}</span>
            </>
          ) : isDefeat ? (
            <>
              <AlertTriangle className="w-4 h-4 text-[#d47260]" />
              <span>{scene.endingBadge || 'BÀI HỌC QUÂN SỰ'}</span>
            </>
          ) : (
            <>
              <Award className="w-4 h-4 text-[#8fa5c4]" />
              <span>{scene.endingBadge || 'KẾT CỤC CHIẾN CÔNG'}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-4xl font-black text-[#faebd7] mb-2 tracking-wide">
          {scene.endingTitle || scene.title}
        </h2>

        <p className="text-xs uppercase tracking-widest text-[#d4af37] font-bold mb-6">
          Thống Soái Chỉ Huy: <span className="text-[#faebd7] underline">{playerName}</span>
        </p>

        {/* Summary Card */}
        <div className="card-solid-dark rounded-2xl p-5 mb-6 text-left border-2 border-[#422c1b]">
          <h3 className="text-xs font-black uppercase text-[#d4af37] tracking-wider mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Tổng Kết Binh Pháp & Sử Sách</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#d6c7ba] leading-relaxed font-medium">
            {scene.endingSummary ||
              'Trận chiến đã kết thúc. Mọi quyết sách quân sự của bạn trên sa bàn đều góp phần định đoạt dòng chảy lịch sử và vận mệnh dân tộc.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card-solid-dark p-4 rounded-xl border-2 border-[#422c1b]">
            <span className="block text-[10px] uppercase font-bold text-[#b89f88] tracking-widest mb-1">
              Xếp Hạng Binh Pháp
            </span>
            <span className={`text-3xl sm:text-4xl font-black ${rank.color}`}>
              {rank.grade}
            </span>
          </div>

          <div className="card-solid-dark p-4 rounded-xl border-2 border-[#422c1b]">
            <span className="block text-[10px] uppercase font-bold text-[#b89f88] tracking-widest mb-1">
              Nhuệ Khí Cuối Cùng
            </span>
            <span className="text-3xl sm:text-4xl font-black text-[#faebd7]">
              {morale}
            </span>
          </div>
        </div>

        {/* Historic Accomplishment Tag */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#86b595] btn-material-wood py-2.5 px-4 rounded-lg mb-6 border-2 border-[#422c1b]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Đã vượt qua {visitedScenesCount} cảnh diễn trong nhánh chiến dịch này</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
          {onOpenLevelSelect && (
            <button
              onClick={onOpenLevelSelect}
              className="btn-material-bronze w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider cursor-pointer shadow-xl"
            >
              <ListOrdered className="w-4 h-4 text-amber-200" />
              <span>Chọn Chiến Dịch Khác</span>
            </button>
          )}

          <button
            onClick={onOpenFlowchart}
            className="btn-material-wood w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider cursor-pointer border border-[#5c4028]"
          >
            <GitBranch className="w-4 h-4 text-[#faebd7]" />
            <span>Mở Cây Kịch Bản</span>
          </button>

          <button
            onClick={onRestart}
            className="btn-material-iron w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl cursor-pointer text-xs md:text-sm font-bold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại Màn Này</span>
          </button>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Đã sao chép liên kết trò chơi lịch sử!');
              }
            }}
            className="btn-material-iron w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs md:text-sm cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Chia Sẻ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
