import React from 'react';
import { ChoiceOption } from '../types/game';
import { soundEngine } from '../utils/soundEngine';
import { Swords, ShieldAlert, BookOpen } from 'lucide-react';

interface ChoiceModalProps {
  choices: ChoiceOption[];
  studyMode: boolean;
  onSelectChoice: (choice: ChoiceOption) => void;
}

export const ChoiceModal: React.FC<ChoiceModalProps> = ({
  choices,
  studyMode,
  onSelectChoice,
}) => {
  const handleSelect = (choice: ChoiceOption) => {
    soundEngine.playSFX('drum');
    onSelectChoice(choice);
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-2xl wood-panel-solid rounded-2xl p-5 md:p-6 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-5 border-b-2 border-[#3b2718] pb-3">
          <div className="btn-material-bronze inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4 text-[#faebd7]" />
            Thời Khắc Quyết Sách Chiến Cục
          </div>
          <h3 className="text-lg md:text-2xl font-black metallic-gold-title">
            CHỌN HƯỚNG XUẤT KÍCH
          </h3>
        </div>

        {/* Choice Buttons - Solid Material Cards */}
        <div className="flex flex-col gap-3">
          {choices.map((choice, index) => {
            const isHighlight = studyMode && choice.isOptimal;

            return (
              <button
                key={choice.id}
                onClick={() => handleSelect(choice)}
                className={`group relative flex flex-col p-4 rounded-xl transition-all duration-200 text-left cursor-pointer shadow-xl active:scale-98 ${
                  isHighlight
                    ? 'btn-material-bronze ring-2 ring-[#d4af37]'
                    : 'card-solid-dark hover:border-[#8e7343] hover:bg-[#1a110a]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-black shrink-0 mt-0.5 border-2 ${
                      isHighlight
                        ? 'bg-[#faebd7] text-[#24170e] border-[#d4af37]'
                        : 'btn-material-iron text-[#e5edf7]'
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm md:text-base font-black text-[#faebd7]">
                        {choice.text}
                      </h4>
                      {choice.tag && (
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            choice.isOptimal
                              ? 'bg-[#faebd7] text-[#140d07] border border-[#d4af37]'
                              : 'btn-material-wood text-[#d4af37]'
                          }`}
                        >
                          {choice.tag}
                        </span>
                      )}
                    </div>

                    {choice.description && (
                      <p className="text-xs text-[#c4b3a3] font-medium leading-snug">
                        {choice.description}
                      </p>
                    )}

                    {/* Historical reason for learners */}
                    {studyMode && choice.historicalReason && (
                      <div className="mt-2 text-[11px] text-[#faebd7] bg-[#120b07] p-2.5 rounded-lg border-2 border-[#5a3d28] flex items-start gap-2 leading-relaxed font-semibold">
                        <BookOpen className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#d4af37]">Lý do quân sự:</strong> {choice.historicalReason}
                        </span>
                      </div>
                    )}
                  </div>

                  <Swords className="w-5 h-5 text-[#d4af37] shrink-0 opacity-0 group-hover:opacity-100 transition" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Study Mode Indicator Note */}
        {studyMode && (
          <div className="mt-4 text-center text-xs text-[#d4af37] font-bold flex items-center justify-center gap-1.5">
            <span>⚔️ Chế độ Học Tập: Thẻ đồng vàng biểu trưng cho kế sách chuẩn xác của Ngô Quyền!</span>
          </div>
        )}
      </div>
    </div>
  );
};
