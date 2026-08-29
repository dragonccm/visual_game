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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[80vh] wood-panel rounded-2xl flex flex-col shadow-2xl border-2 border-[#7a5832] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#3b2718] flex items-center justify-between bg-[#120c08]/90">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#d4af37]" />
            <h3 className="text-base font-bold metallic-gold-text">
              Nhật Ký Đàm Thoại
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md border border-[#3b2718] bg-[#1a110a] text-[#8c7867] hover:text-[#f0e4d6] hover:border-[#7a5832] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {history.length === 0 ? (
            <p className="text-[#736050] text-center text-sm py-8">Chưa có nhật ký đối thoại.</p>
          ) : (
            history.map((item, idx) => {
              const char = CHARACTERS[item.speaker] || CHARACTERS.narrator;
              return (
                <div key={idx} className="bg-[#170f0a] rounded-xl p-3 border border-[#382618]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold text-[#f2e7dc] uppercase bg-[#362215] border border-[#5a3f28]">
                      {char.name}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-[#d6c8bc] leading-relaxed">{item.text}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
