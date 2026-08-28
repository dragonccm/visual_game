import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SceneData } from '../types/game';
import { Trophy, RotateCcw, Award, CheckCircle2, ShieldCheck, Share2, GitBranch, AlertTriangle } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface EndingScreenProps {
  scene: SceneData;
  playerName: string;
  morale: number;
  visitedScenesCount: number;
  onRestart: () => void;
  onOpenFlowchart: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  scene,
  playerName,
  morale,
  visitedScenesCount,
  onRestart,
  onOpenFlowchart,
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
            ? 'text-[#8cb0cf]'
            : 'text-[#a85848]',
      };
    }
    if (morale >= 80) return { grade: 'S+', color: 'text-[#d4af37]' };
    if (morale >= 60) return { grade: 'A', color: 'text-[#86b595]' };
    return { grade: 'B', color: 'text-[#8cb0cf]' };
  };

  const rank = getRankData();

  return (
    <div className="relative w-full h-screen overflow-y-auto bg-[#0a0705] flex flex-col items-center justify-center p-4 select-none z-30 animate-fade-in">
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={isDefeat ? '/assets/images/scenes/war_tent.jpg' : '/assets/images/scenes/victory_dawn.jpg'}
          alt="Kết Cục"
          className="w-full h-full object-cover filter brightness-35"
        />
        <div className="absolute inset-0 bg-[#0c0805]/80 backdrop-blur-sm" />
      </div>

      {/* Main Ending Card - Carved Lim Wood & Bronze Trim */}
      <div className="relative z-10 w-full max-w-2xl wood-panel rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-[#7a5832] text-center my-auto">
        {/* Top Trophy / Alert Icon */}
        <div
          className={`w-16 h-16 mx-auto rounded-xl border-2 flex items-center justify-center text-[#140d07] shadow-xl mb-4 ${
            isDefeat
              ? 'bg-gradient-to-br from-[#5a2e24] to-[#2e140f] border-[#7d3e30] text-[#f2dedb]'
              : 'bg-gradient-to-br from-[#c8963e] to-[#7d5830] border-[#d4af37]'
          }`}
        >
          {isDefeat ? <AlertTriangle className="w-8 h-8" /> : <Trophy className="w-8 h-8" />}
        </div>

        {/* Badge & Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#24170e] border border-[#5a3f28] text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
          <ShieldCheck className="w-4 h-4 text-[#86b595]" />
          {scene.endingBadge || 'Kết Cục Chiến Dịch Lịch Sử'}
        </div>

        <h1 className="text-xl md:text-3xl font-black metallic-gold-text font-serif-epic mb-3">
          {scene.endingTitle || scene.title}
        </h1>

        <p className="text-xs md:text-sm text-[#d1c3b6] leading-relaxed max-w-xl mx-auto mb-6 bg-[#140e0a] p-4 rounded-xl border border-[#3b2718] text-left">
          {scene.endingSummary}
        </p>

        {/* Score & Rank Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-[#140d08] border border-[#332215] rounded-xl p-3">
            <span className="text-[11px] uppercase text-[#8c7867] font-medium block">Người Chỉ Huy</span>
            <span className="text-sm md:text-base font-bold text-[#ede3d8] truncate block mt-0.5">
              {playerName}
            </span>
          </div>

          <div className="bg-[#140d08] border border-[#332215] rounded-xl p-3">
            <span className="text-[11px] uppercase text-[#8c7867] font-medium block">Khí Thế Đạt Được</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <Award className="w-4 h-4 text-[#b8934a]" />
              <span className="text-sm md:text-base font-bold text-[#d4af37]">{morale} / 100</span>
            </div>
          </div>

          <div className="bg-[#140d08] border border-[#332215] rounded-xl p-3">
            <span className="text-[11px] uppercase text-[#8c7867] font-medium block">Hạng Thao Lược</span>
            <span className={`text-base md:text-lg font-black ${rank.color} block`}>
              Rank {rank.grade}
            </span>
          </div>
        </div>

        {/* Historic Accomplishment Tag */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#86b595] bg-[#142119] border border-[#273d2f] py-2 px-4 rounded-lg mb-6">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Đã vượt qua {visitedScenesCount} cảnh diễn trong nhánh chiến dịch này</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenFlowchart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#5a3e26] via-[#7d5632] to-[#5a3e26] text-[#f5ebd9] font-bold text-sm uppercase tracking-wider font-serif-epic border border-[#b8934a] hover:brightness-115 active:scale-98 transition cursor-pointer shadow-xl shadow-black/80"
          >
            <GitBranch className="w-4 h-4 text-[#e8c77b]" />
            <span>Mở Cây Kịch Bản (Khám Phá Nhánh Khác)</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#3d2919] bg-[#140e0a] text-[#b8a798] hover:text-[#f0e4d6] hover:bg-[#24170e] active:scale-98 transition cursor-pointer text-sm font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại Từ Đầu</span>
          </button>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Đã sao chép liên kết trò chơi lịch sử!');
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#3d2919] bg-[#140e0a] text-[#c4b3a3] hover:text-[#d4af37] font-semibold text-sm hover:bg-[#24170e] active:scale-98 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Chia Sẻ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
