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
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-2xl wood-panel rounded-2xl p-5 md:p-6 shadow-2xl border-2 border-[#7a5832]">
        {/* Header */}
        <div className="text-center mb-5 border-b border-[#3b2718] pb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#21140c] border border-[#5a3e26] text-[#c49a62] text-xs font-bold uppercase tracking-widest mb-1.5">
            <ShieldAlert className="w-4 h-4 text-[#c49a62]" />
            Thời Khắc Quyết Sách Chiến Cục
          </div>
          <h3 className="text-lg md:text-2xl font-black metallic-gold-text font-serif-epic">
            Chọn Hướng Xuất Kích
          </h3>
        </div>

        {/* Choice Buttons */}
        <div className="flex flex-col gap-3">
          {choices.map((choice, index) => {
            const isHighlight = studyMode && choice.isOptimal;

            return (
              <button
                key={choice.id}
                onClick={() => handleSelect(choice)}
                className={`group relative flex flex-col p-3.5 md:p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer shadow-lg active:scale-98 ${
                  isHighlight
                    ? 'border-[#c8963e] bg-gradient-to-r from-[#2e1d11] via-[#3d2717] to-[#2e1d11] shadow-black/80 ring-1 ring-[#c8963e]/60'
                    : 'border-[#382618] bg-[#140e0a] hover:bg-[#21160f] hover:border-[#694c30]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                      isHighlight
                        ? 'bg-[#8e6c38] text-[#140d07] border-[#d4af37] font-black'
                        : 'bg-[#1f1610] text-[#9c8978] border-[#382618] group-hover:bg-[#4a3422] group-hover:text-[#f0e4d6]'
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm md:text-base font-bold text-[#ede3d8] group-hover:text-[#f5ebd9] font-serif-epic">
                        {choice.text}
                      </h4>
                      {choice.tag && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            choice.isOptimal
                              ? 'bg-[#8e6c38] text-[#140d07] border border-[#d4af37]'
                              : 'bg-[#1a120c] text-[#8c7867] border border-[#382618]'
                          }`}
                        >
                          {choice.tag}
                        </span>
                      )}
                    </div>

                    {choice.description && (
                      <p className="text-xs text-[#b8a798] leading-snug">
                        {choice.description}
                      </p>
                    )}

                    {/* Historical reason for learners */}
                    {studyMode && choice.historicalReason && (
                      <div className="mt-2 text-[11px] text-[#d4af37] bg-[#1a110b] p-2 rounded-md border border-[#4a3421] flex items-start gap-1.5 leading-relaxed">
                        <BookOpen className="w-3.5 h-3.5 text-[#c8963e] shrink-0 mt-0.5" />
                        <span>
                          <strong>Lý do quân sự:</strong> {choice.historicalReason}
                        </span>
                      </div>
                    )}
                  </div>

                  <Swords className="w-5 h-5 text-[#8e6c38] group-hover:text-[#d4af37] transition shrink-0 opacity-0 group-hover:opacity-100" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Study Mode Indicator Note */}
        {studyMode && (
          <div className="mt-3.5 text-center text-xs text-[#a68652] font-medium flex items-center justify-center gap-1.5">
            <span>⚔️ Chế độ Học Tập: Huy hiệu đồng sáng biểu trưng cho quyết sách chuẩn xác của Ngô Quyền!</span>
          </div>
        )}
      </div>
    </div>
  );
};
