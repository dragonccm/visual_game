import React from 'react';
import { X, History } from 'lucide-react';
import { DialogueItem } from '../types/game';
import { CHARACTERS } from '../data/characters';

interface DialogueHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: DialogueItem[];
}

export const DialogueHistoryModal: React.FC<DialogueHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-stone-950 border border-amber-800/60 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-800 flex items-center justify-between bg-stone-900/60">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-amber-200 font-serif-epic">
              Nhật Ký Đàm Thoại
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-stone-700 bg-stone-900 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {history.length === 0 ? (
            <p className="text-stone-500 text-center text-sm py-8">Chưa có nhật ký đối thoại.</p>
          ) : (
            history.map((item, idx) => {
              const char = CHARACTERS[item.speaker] || CHARACTERS.narrator;
              return (
                <div key={idx} className="bg-stone-900/60 rounded-xl p-3 border border-stone-800/80">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-bold text-white uppercase font-serif-epic"
                      style={{ backgroundColor: char.themeColor }}
                    >
                      {char.name}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-stone-200 leading-relaxed">{item.text}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
