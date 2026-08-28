import React from 'react';
import { X, GitBranch, Trophy, Lock, Play, Award } from 'lucide-react';
import { STORY_SCENES } from '../data/storyData';

interface StoryFlowchartModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitedScenes: string[];
  unlockedEndings: string[];
  currentSceneId: string;
  onJumpToScene: (sceneId: string) => void;
}

export const StoryFlowchartModal: React.FC<StoryFlowchartModalProps> = ({
  isOpen,
  onClose,
  visitedScenes,
  unlockedEndings,
  currentSceneId,
  onJumpToScene,
}) => {
  if (!isOpen) return null;

  const totalEndings = Object.values(STORY_SCENES).filter((s) => s.isEnding);
  const discoveredCount = unlockedEndings.length;

  const branches = [
    {
      name: '🌳 TUYẾN A: Bãi Cọc Ngầm Thủy Triều (Chiến lược Lịch sử)',
      color: 'border-emerald-700/60 bg-emerald-950/40 text-emerald-300',
      scenes: [
        'scene_planting_stakes',
        'scene_lure_deep_water',
        'scene_early_clash_danger',
      ],
      endings: [
        'ending_true_legendary_victory',
        'ending_fire_stake_victory',
        'ending_pyrrhic_victory',
        'ending_stakes_exposed_retreat',
      ],
    },
    {
      name: '🔥 TUYẾN B: Hỏa Công & Đột Kích Đêm (Chiến lược Du kích)',
      color: 'border-amber-700/60 bg-amber-950/40 text-amber-300',
      scenes: [
        'scene_canyon_ambush_prep',
        'scene_night_fire_ambush',
        'scene_decoy_ship_trap',
      ],
      endings: [
        'ending_night_inferno_victory',
        'ending_heroic_duel_victory',
        'ending_decoy_triumph',
      ],
    },
    {
      name: '⚔️ TUYẾN C: Nghênh Chiến Trực Diện Thuyền To (Chiến lược Cường công)',
      color: 'border-rose-700/60 bg-rose-950/40 text-rose-300',
      scenes: [
        'scene_direct_clash_battle',
        'scene_boarding_bloodbath',
        'scene_emergency_pivot',
      ],
      endings: [
        'ending_costly_stalemate',
        'ending_crushing_defeat',
        'ending_narrow_escape_victory',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-600/70 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-900/50 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-950 border border-amber-500/60 flex items-center justify-center text-amber-300">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-amber-200 font-serif-epic">
                CÂY NHÁNH KỊCH BẢN & KẾT CỤC
              </h2>
              <p className="text-xs text-stone-400">
                Đã khám phá {discoveredCount}/{totalEndings.length} Kết cục Lịch sử
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-stone-700 bg-stone-900 text-stone-400 hover:text-white hover:border-rose-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Visual Tree */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Root Scene Card */}
          <div className="bg-stone-900/90 border border-amber-500/60 rounded-xl p-4 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                Gốc Phân Nhánh • Điểm Khởi Đầu
              </span>
              <h3 className="text-base font-bold text-amber-100 font-serif-epic">
                {STORY_SCENES.scene_intro_crisis.title}
              </h3>
              <p className="text-xs text-stone-400">
                3 Đại Kế Sách: Bãi Cọc Thủy Triều • Hỏa Công Du Kích • Nghênh Chiến Trực Diện
              </p>
            </div>
            <button
              onClick={() => {
                onJumpToScene('scene_intro_crisis');
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-700/60 hover:bg-amber-600 border border-amber-500 text-amber-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Chơi Lại Gốc</span>
            </button>
          </div>

          {/* 3 Main Branches */}
          {branches.map((b, bIdx) => (
            <div key={bIdx} className={`rounded-xl border p-4.5 ${b.color}`}>
              <h3 className="text-sm md:text-base font-bold mb-3 font-serif-epic">
                {b.name}
              </h3>

              {/* Scenes Progression */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold uppercase text-stone-400 tracking-wider block mb-2">
                  Các Cảnh Diễn Trong Nhánh:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {b.scenes.map((sId) => {
                    const scene = STORY_SCENES[sId];
                    const isVisited = visitedScenes.includes(sId);
                    const isCurrent = currentSceneId === sId;

                    return (
                      <button
                        key={sId}
                        disabled={!isVisited}
                        onClick={() => {
                          if (isVisited) {
                            onJumpToScene(sId);
                            onClose();
                          }
                        }}
                        className={`p-2.5 rounded-lg border text-left text-xs transition ${
                          isCurrent
                            ? 'border-amber-400 bg-amber-950/80 text-amber-200 font-bold ring-2 ring-amber-500/40'
                            : isVisited
                            ? 'border-stone-700 bg-stone-900/90 text-stone-200 hover:border-amber-500 cursor-pointer'
                            : 'border-stone-800/80 bg-stone-950/60 text-stone-600 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold truncate">
                            {isVisited ? scene?.title : 'Cảnh Chưa Khám Phá'}
                          </span>
                          {!isVisited && <Lock className="w-3 h-3 text-stone-600 shrink-0" />}
                        </div>
                        <span className="text-[10px] text-stone-400 block truncate">
                          {isVisited ? scene?.timeOfDay : '???'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Endings */}
              <div>
                <span className="text-[11px] font-semibold uppercase text-stone-400 tracking-wider block mb-2">
                  Các Kết Cục Có Thể Đạt Được:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {b.endings.map((eId) => {
                    const ending = STORY_SCENES[eId];
                    const isUnlocked = unlockedEndings.includes(eId);

                    return (
                      <div
                        key={eId}
                        className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                          isUnlocked
                            ? 'border-amber-500/60 bg-stone-900/90 text-stone-100 shadow-md'
                            : 'border-stone-800 bg-stone-950/60 text-stone-600 opacity-60'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isUnlocked ? (
                            <Trophy className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Lock className="w-4 h-4 text-stone-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-bold text-xs truncate">
                              {isUnlocked ? ending?.endingTitle : 'Kết Cục Ẩn'}
                            </span>
                            {isUnlocked && ending?.endingRank && (
                              <span className="px-1.5 py-0.2 text-[10px] font-black rounded bg-amber-500 text-stone-950">
                                {ending.endingRank}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-400 line-clamp-2">
                            {isUnlocked ? ending?.endingBadge : 'Hãy đưa ra các lựa chọn khác để mở khóa.'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-amber-900/50 bg-stone-950/70 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Mẹo: Bạn có thể bấm vào bất kỳ cảnh nào đã mở khóa để chơi lại nhánh đó!</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold uppercase tracking-wider cursor-pointer transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
