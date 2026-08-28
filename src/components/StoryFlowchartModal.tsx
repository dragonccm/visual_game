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
      color: 'border-[#5a3f25] bg-[#1a120b] text-[#d4af37]',
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
      color: 'border-[#694223] bg-[#1d1109] text-[#c48e52]',
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
      color: 'border-[#3f4a59] bg-[#111720] text-[#9bb0c9]',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] wood-panel rounded-2xl flex flex-col shadow-2xl border-2 border-[#7a5832] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#3b2718] flex items-center justify-between bg-[#120c08]/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#24170e] border border-[#7a5832] flex items-center justify-center text-[#d4af37]">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold metallic-gold-text font-serif-epic">
                CÂY NHÁNH KỊCH BẢN & KẾT CỤC
              </h2>
              <p className="text-xs text-[#998370]">
                Đã khám phá {discoveredCount}/{totalEndings.length} Kết cục Lịch sử
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md border border-[#3b2718] bg-[#1a110a] text-[#8c7867] hover:text-[#f0e4d6] hover:border-[#7a5832] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Visual Tree */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Root Scene Card */}
          <div className="bg-[#170f0a] border border-[#5c4028] rounded-xl p-4 flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#c8963e] tracking-wider">
                Gốc Phân Nhánh • Điểm Khởi Đầu
              </span>
              <h3 className="text-base font-bold text-[#ede3d8] font-serif-epic">
                {STORY_SCENES.scene_intro_crisis.title}
              </h3>
              <p className="text-xs text-[#998370]">
                3 Đại Kế Sách: Bãi Cọc Thủy Triều • Hỏa Công Du Kích • Nghênh Chiến Trực Diện
              </p>
            </div>
            <button
              onClick={() => {
                onJumpToScene('scene_intro_crisis');
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#3b2718] hover:bg-[#523722] border border-[#7a5832] text-[#f2e7dc] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-md"
            >
              <Play className="w-3.5 h-3.5 text-[#d4af37]" />
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
                <span className="text-[11px] font-semibold uppercase text-[#8c7867] tracking-wider block mb-2">
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
                            ? 'border-[#d4af37] bg-[#2e1f14] text-[#f5ebd9] font-bold ring-1 ring-[#d4af37]/60'
                            : isVisited
                            ? 'border-[#3d2919] bg-[#140e0a] text-[#d6c7ba] hover:border-[#7a5832] cursor-pointer'
                            : 'border-[#26190f] bg-[#0c0805] text-[#544337] cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold truncate">
                            {isVisited ? scene?.title : 'Cảnh Chưa Khám Phá'}
                          </span>
                          {!isVisited && <Lock className="w-3 h-3 text-[#544337] shrink-0" />}
                        </div>
                        <span className="text-[10px] text-[#7d6858] block truncate">
                          {isVisited ? scene?.timeOfDay : '???'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Endings */}
              <div>
                <span className="text-[11px] font-semibold uppercase text-[#8c7867] tracking-wider block mb-2">
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
                            ? 'border-[#7a5832] bg-[#170f0a] text-[#ede3d8] shadow-md'
                            : 'border-[#24170e] bg-[#0c0805] text-[#544337] opacity-60'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isUnlocked ? (
                            <Trophy className="w-4 h-4 text-[#d4af37]" />
                          ) : (
                            <Lock className="w-4 h-4 text-[#544337]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-bold text-xs truncate">
                              {isUnlocked ? ending?.endingTitle : 'Kết Cục Ẩn'}
                            </span>
                            {isUnlocked && ending?.endingRank && (
                              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-[#8e6c38] text-[#140d07] border border-[#d4af37]">
                                {ending.endingRank}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#8c7867] line-clamp-2">
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
        <div className="px-6 py-3.5 border-t border-[#3b2718] bg-[#120c08]/90 flex items-center justify-between text-xs text-[#8c7867]">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#c8963e]" />
            <span>Mẹo: Bạn có thể bấm vào bất kỳ cảnh nào đã mở khóa để chơi lại nhánh đó!</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#5a3e26] hover:bg-[#7d5632] border border-[#8e6c38] text-[#f5ebd9] font-bold uppercase tracking-wider cursor-pointer transition shadow-md"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
