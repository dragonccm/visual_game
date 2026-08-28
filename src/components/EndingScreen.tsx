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
        const count = 200;
        const defaults = { origin: { y: 0.7 } };

        const fire = (particleRatio: number, opts: confetti.Options) => {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        };

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      } catch {
        // Confetti fallback
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
            ? 'text-amber-400'
            : scene.endingRank.startsWith('A')
            ? 'text-emerald-400'
            : scene.endingRank.startsWith('B')
            ? 'text-sky-400'
            : 'text-rose-500',
      };
    }
    if (morale >= 80) return { grade: 'S+', color: 'text-amber-400' };
    if (morale >= 60) return { grade: 'A', color: 'text-emerald-400' };
    return { grade: 'B', color: 'text-sky-400' };
  };

  const rank = getRankData();

  return (
    <div className="relative w-full h-screen overflow-y-auto bg-stone-950 flex flex-col items-center justify-center p-4 select-none z-30 animate-fade-in">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={isDefeat ? '/assets/images/scenes/war_tent.jpg' : '/assets/images/scenes/victory_dawn.jpg'}
          alt="Kết Cục"
          className="w-full h-full object-cover filter brightness-45"
        />
        <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-sm" />
      </div>

      {/* Main Ending Card */}
      <div className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-500/80 rounded-2xl p-6 md:p-8 shadow-2xl glow-gold text-center my-auto">
        {/* Top Trophy / Alert Icon */}
        <div
          className={`w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center text-stone-950 shadow-xl mb-4 animate-bounce ${
            isDefeat
              ? 'bg-gradient-to-br from-rose-600 to-stone-900 border-rose-400 shadow-rose-950 text-white'
              : 'bg-gradient-to-br from-amber-400 to-rose-600 border-amber-200 shadow-amber-950'
          }`}
        >
          {isDefeat ? <AlertTriangle className="w-8 h-8" /> : <Trophy className="w-8 h-8" />}
        </div>

        {/* Badge & Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500 text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          {scene.endingBadge || 'Kết Cục Chiến Dịch Lịch Sử'}
        </div>

        <h1 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-rose-400 font-serif-epic mb-3">
          {scene.endingTitle || scene.title}
        </h1>

        <p className="text-xs md:text-sm text-stone-300 leading-relaxed max-w-xl mx-auto mb-6 bg-stone-900/70 p-4 rounded-xl border border-amber-900/40 text-left">
          {scene.endingSummary}
        </p>

        {/* Score & Rank Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3">
            <span className="text-[11px] uppercase text-stone-400 font-medium block">Người Chỉ Huy</span>
            <span className="text-sm md:text-base font-bold text-amber-200 truncate block mt-0.5">
              {playerName}
            </span>
          </div>

          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3">
            <span className="text-[11px] uppercase text-stone-400 font-medium block">Khí Thế Đạt Được</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <Award className="w-4 h-4 text-rose-500" />
              <span className="text-sm md:text-base font-bold text-rose-300">{morale} / 100</span>
            </div>
          </div>

          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3">
            <span className="text-[11px] uppercase text-stone-400 font-medium block">Hạng Thao Lược</span>
            <span className={`text-base md:text-lg font-black ${rank.color} block`}>
              Rank {rank.grade}
            </span>
          </div>
        </div>

        {/* Historic Accomplishment Tag */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 py-2 px-4 rounded-lg mb-6">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Đã vượt qua {visitedScenesCount} cảnh diễn trong nhánh chiến dịch này</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenFlowchart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white font-bold text-sm uppercase tracking-wider font-serif-epic hover:brightness-110 active:scale-98 transition cursor-pointer shadow-lg shadow-rose-950"
          >
            <GitBranch className="w-4 h-4" />
            <span>Mở Cây Kịch Bản (Khám Phá Nhánh Khác)</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-stone-700 bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800 active:scale-98 transition cursor-pointer text-sm font-semibold"
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-amber-700/60 bg-stone-900 text-amber-200 font-semibold text-sm hover:bg-stone-800 active:scale-98 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Chia Sẻ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
