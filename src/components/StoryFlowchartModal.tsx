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
      color: 'card-solid-dark border-[#5a3f25]',
      badgeColor: 'btn-material-bronze',
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
      color: 'card-solid-dark border-[#694223]',
      badgeColor: 'btn-material-wood',
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
      color: 'card-solid-dark border-[#3f4a59]',
      badgeColor: 'btn-material-iron',
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
      <div className="relative w-full max-w-4xl max-h-[90vh] wood-panel-solid rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-[#3b2718] flex items-center justify-between bg-[#120c08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg btn-material-bronze flex items-center justify-center text-[#faebd7]">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black metallic-gold-title">
                CÂY NHÁNH KỊCH BẢN & KẾT CỤC
              </h2>
              <p className="text-xs text-[#b89f88] font-bold">
                Đã khám phá {discoveredCount}/{totalEndings.length} Kết cục Lịch sử
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-material-iron p-2 rounded-lg text-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Visual Tree */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Root Scene Card */}
          <div className="card-solid-dark rounded-xl p-4 flex items-center justify-between shadow-lg border-2 border-[#735032]">
            <div>
              <span className="text-[10px] font-black uppercase text-[#d4af37] tracking-wider">
                Gốc Phân Nhánh • Điểm Khởi Đầu
              </span>
              <h3 className="text-base font-black text-[#faebd7]">
                {STORY_SCENES.scene_intro_crisis.title}
              </h3>
              <p className="text-xs text-[#b09e8f] font-medium">
                3 Đại Kế Sách: Bãi Cọc Thủy Triều • Hỏa Công Du Kích • Nghênh Chiến Trực Diện
              </p>
            </div>
            <button
              onClick={() => {
                onJumpToScene('scene_intro_crisis');
                onClose();
              }}
              className="btn-material-bronze px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Chơi Lại Gốc</span>
            </button>
          </div>

          {/* 3 Main Branches */}
          {branches.map((b, bIdx) => (
            <div key={bIdx} className={`rounded-xl border-2 p-5 ${b.color}`}>
              <h3 className="text-sm md:text-base font-black text-[#faebd7] mb-3">
                {b.name}
              </h3>

              {/* Scenes Progression */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase text-[#d4af37] tracking-wider block mb-2">
                  Các Cảnh Diễn Trong Nhánh:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                        className={`p-3 rounded-lg border-2 text-left text-xs transition ${
                          isCurrent
                            ? 'btn-material-bronze ring-2 ring-[#d4af37]'
                            : isVisited
                            ? 'btn-material-wood text-[#faebd7] cursor-pointer'
                            : 'card-solid-dark text-[#544337] cursor-not-allowed opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold truncate">
                            {isVisited ? scene?.title : 'Cảnh Chưa Mở'}
                          </span>
                          {!isVisited && <Lock className="w-3 h-3 text-[#544337] shrink-0" />}
                        </div>
                        <span className="text-[10px] text-[#b09e8f] block truncate font-medium">
                          {isVisited ? scene?.timeOfDay : '???'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Endings */}
              <div>
                <span className="text-[11px] font-bold uppercase text-[#d4af37] tracking-wider block mb-2">
                  Các Kết Cục Có Thể Đạt Được:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {b.endings.map((eId) => {
                    const ending = STORY_SCENES[eId];
                    const isUnlocked = unlockedEndings.includes(eId);

                    return (
                      <div
                        key={eId}
                        className={`p-3.5 rounded-xl border-2 flex items-start gap-3 ${
                          isUnlocked
                            ? 'card-solid-dark border-[#8e7343] text-[#faebd7] shadow-md'
                            : 'card-solid-dark border-[#24170e] text-[#544337] opacity-60'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isUnlocked ? (
                            <Trophy className="w-5 h-5 text-[#d4af37]" />
                          ) : (
                            <Lock className="w-5 h-5 text-[#544337]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-black text-xs truncate">
                              {isUnlocked ? ending?.endingTitle : 'Kết Cục Ẩn'}
                            </span>
                            {isUnlocked && ending?.endingRank && (
                              <span className="px-2 py-0.2 text-[10px] font-black rounded btn-material-bronze">
                                {ending.endingRank}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#b09e8f] line-clamp-2 font-medium">
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
        <div className="px-6 py-3.5 border-t-2 border-[#3b2718] bg-[#120c08] flex items-center justify-between text-xs text-[#d6c7ba]">
          <div className="flex items-center gap-2 font-bold">
            <Award className="w-4 h-4 text-[#d4af37]" />
            <span>Mẹo: Bạn có thể bấm vào bất kỳ cảnh nào đã mở khóa để chơi lại nhánh đó!</span>
          </div>
          <button
            onClick={onClose}
            className="btn-material-bronze px-5 py-2 rounded-lg font-black uppercase tracking-wider cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
