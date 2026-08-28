import React from 'react';
import { ChoiceOption } from '../types/game';
import { soundEngine } from '../utils/soundEngine';
import { Swords, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

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
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-amber-500/80 rounded-2xl p-5 md:p-6 shadow-2xl glow-gold">
        {/* Header */}
        <div className="text-center mb-5 border-b border-amber-900/50 pb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-600/60 text-rose-300 text-xs font-bold uppercase tracking-widest mb-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Thời Khắc Quyết Sách Chiến Cục
          </div>
          <h3 className="text-lg md:text-2xl font-black text-amber-200 font-serif-epic">
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
                className={`group relative flex flex-col p-3.5 md:p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer shadow-lg active:scale-98 ${
                  isHighlight
                    ? 'border-amber-400 bg-gradient-to-r from-amber-950/90 via-amber-900/40 to-stone-900 ring-2 ring-amber-400/50 shadow-amber-950/80'
                    : 'border-stone-800 bg-stone-900/80 hover:bg-stone-800/90 hover:border-amber-500/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                      isHighlight
                        ? 'bg-amber-500 text-stone-950 border-amber-300 font-black'
                        : 'bg-stone-800 text-stone-300 border-stone-600 group-hover:bg-amber-600 group-hover:text-white'
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm md:text-base font-bold text-stone-100 group-hover:text-amber-200 font-serif-epic">
                        {choice.text}
                      </h4>
                      {choice.tag && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            choice.isOptimal
                              ? 'bg-amber-500 text-stone-950 shadow-sm'
                              : 'bg-stone-800 text-stone-400 border border-stone-700'
                          }`}
                        >
                          {choice.tag}
                        </span>
                      )}
                    </div>

                    {choice.description && (
                      <p className="text-xs text-stone-300 leading-snug">
                        {choice.description}
                      </p>
                    )}

                    {/* Historical reason for learners */}
                    {studyMode && choice.historicalReason && (
                      <div className="mt-2 text-[11px] text-amber-300/90 bg-amber-950/60 p-2 rounded-lg border border-amber-800/50 flex items-start gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Lý do quân sự:</strong> {choice.historicalReason}
                        </span>
                      </div>
                    )}
                  </div>

                  <Swords className="w-5 h-5 text-amber-500 group-hover:text-amber-300 transition shrink-0 opacity-0 group-hover:opacity-100" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Study Mode Indicator Note */}
        {studyMode && (
          <div className="mt-3.5 text-center text-xs text-amber-400 font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chế độ Học Tập đang bật: Nhãn vàng kim là quyết sách chuẩn xác của Ngô Quyền!</span>
          </div>
        )}
      </div>
    </div>
  );
};
