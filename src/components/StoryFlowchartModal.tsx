import React from 'react';
import { X, GitBranch, Trophy, Play } from 'lucide-react';
import { SceneData } from '../types/game';
import { STORY_SCENES } from '../data/storyData';

interface StoryFlowchartModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitedScenes: string[];
  unlockedEndings: string[];
  currentSceneId: string;
  onJumpToScene: (sceneId: string) => void;
  scenes?: Record<string, SceneData>;
}

export const StoryFlowchartModal: React.FC<StoryFlowchartModalProps> = ({
  isOpen,
  onClose,
  visitedScenes,
  unlockedEndings: _unlockedEndings,
  currentSceneId,
  onJumpToScene,
  scenes = STORY_SCENES,
}) => {
  if (!isOpen) return null;

  const allScenes = Object.values(scenes);
  const totalEndings = allScenes.filter((s) => s.isEnding);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] wood-panel-solid rounded-2xl flex flex-col shadow-2xl overflow-hidden border-2 border-[#5a3d28]">
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
                Tổng cộng {allScenes.length} phân cảnh • {totalEndings.length} Kết cục Lịch sử
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

        {/* Body: Dynamic Scenes Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allScenes.map((sc, idx) => {
              const isVisited = visitedScenes.includes(sc.id);
              const isCurrent = currentSceneId === sc.id;

              return (
                <div
                  key={sc.id}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#2b1c12] border-amber-500 ring-2 ring-amber-500/50 shadow-lg'
                      : isVisited
                      ? 'card-solid-dark border-[#5c4028]'
                      : 'bg-[#100b08]/80 border-[#2a1a10] opacity-75'
                  }`}
                >
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        {sc.chapter || `Cảnh #${idx + 1}`}
                      </span>
                      {sc.isEnding ? (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          <span>KẾT CỤC ({sc.endingRank || 'S'})</span>
                        </span>
                      ) : (
                        <span className="text-[9px] text-stone-400">
                          {sc.dialogues.length} câu thoại
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-stone-100 line-clamp-1">
                      {sc.title}
                    </h4>

                    {sc.branchTag && (
                      <span className="inline-block text-[10px] px-2 py-0.5 bg-[#1f150e] text-amber-300 rounded border border-[#4a3525]">
                        {sc.branchTag}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#3d2a1c]">
                    <span className="text-[11px] text-stone-400">
                      {isCurrent ? '⚡ Đang diễn ra' : isVisited ? '✓ Đã khám phá' : '🔒 Chưa mở'}
                    </span>

                    {(isVisited || isCurrent) && (
                      <button
                        onClick={() => {
                          onJumpToScene(sc.id);
                          onClose();
                        }}
                        className="btn-material-bronze text-xs px-3 py-1 rounded flex items-center gap-1 text-amber-100 font-bold cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Chuyển Cảnh</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
