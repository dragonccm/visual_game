import React, { useState, useEffect } from 'react';
import { DialogueItem, CharacterInfo } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { soundEngine } from '../utils/soundEngine';
import { ChevronRight, Play, Pause, FastForward, Volume2 } from 'lucide-react';

interface DialogueBoxProps {
  dialogue: DialogueItem;
  onNext: () => void;
  isLastDialogue: boolean;
  hasChoices: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialogue,
  onNext,
  isLastDialogue,
  hasChoices,
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);

  const character: CharacterInfo = CHARACTERS[dialogue.speaker] || CHARACTERS.narrator;

  // Typewriter effect & Audio speech trigger
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);

    if (dialogue.soundEffect) {
      soundEngine.playSFX(dialogue.soundEffect);
    }
    if (dialogue.bgm) {
      soundEngine.playBGM(dialogue.bgm);
    }

    // Play local high-definition Vietnamese voice audio
    soundEngine.speakDialogue(dialogue.id, dialogue.text, dialogue.speaker);

    let currentIdx = 0;
    const fullText = dialogue.text;
    const timer = setInterval(() => {
      if (currentIdx < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIdx + 1));
        currentIdx++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [dialogue]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlay || isTyping) return;
    if (isLastDialogue && hasChoices) return;

    const autoTimer = setTimeout(() => {
      onNext();
    }, 1900);

    return () => clearTimeout(autoTimer);
  }, [isAutoPlay, isTyping, isLastDialogue, hasChoices, onNext]);

  const handleClickBox = () => {
    if (isTyping) {
      setDisplayedText(dialogue.text);
      setIsTyping(false);
    } else {
      onNext();
    }
  };

  const handleReplayVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.speakDialogue(dialogue.id, dialogue.text, dialogue.speaker);
    if (dialogue.soundEffect) {
      soundEngine.playSFX(dialogue.soundEffect);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto z-20 select-none px-3 pb-4">
      {/* Dialogue Main Container - Solid Carved Wood Panel & Bronze Corner Plates */}
      <div
        onClick={handleClickBox}
        className="relative wood-panel rounded-2xl p-4 md:p-6 shadow-2xl cursor-pointer transition hover:border-[#8e7343] group"
      >
        {/* Antique Bronze Corner Plates */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]" />

        {/* Speaker Name Tag & Solid Material Control Buttons */}
        <div className="flex items-center justify-between gap-3 mb-2.5 border-b border-[#3b2718] pb-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-md text-xs md:text-sm font-bold uppercase tracking-wider font-serif-epic text-[#faebd7] shadow-md btn-material-wood">
              {character.name}
            </span>
            <span className="text-[11px] md:text-xs text-[#a69483] font-medium hidden sm:inline">
              {character.title}
            </span>
          </div>

          {/* Solid Material Action Buttons (Đồng Thau & Sắt Thép Rèn Đặc) */}
          <div className="flex items-center gap-2 text-xs" onClick={(e) => e.stopPropagation()}>
            {/* Solid Forged Bronze Button */}
            <button
              onClick={handleReplayVoice}
              title="Phát Lại Giọng Đọc (Lồng Tiếng Chuẩn)"
              className="btn-material-bronze flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-[#faebd7]" />
              <span>Đọc Thoại</span>
            </button>

            {/* Solid Iron Button */}
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${
                isAutoPlay ? 'btn-material-bronze' : 'btn-material-iron'
              }`}
            >
              {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlay ? 'Tự Động' : 'Thủ Công'}</span>
            </button>

            {/* Solid Fast Forward Button */}
            <button
              onClick={() => {
                setDisplayedText(dialogue.text);
                setIsTyping(false);
              }}
              title="Hiện Nhanh Lời Thoại"
              className="btn-material-iron p-1.5 rounded-lg text-xs cursor-pointer"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="min-h-[55px] md:min-h-[65px] flex items-center">
          <p className="text-[#f5ede3] text-base md:text-xl font-bold leading-relaxed tracking-wide">
            {displayedText}
            {isTyping && <span className="inline-block w-2.5 h-5 ml-1 bg-[#d4af37] animate-pulse align-middle" />}
          </p>
        </div>

        {/* Advance Click Indicator */}
        <div className="flex justify-end items-center mt-2 pt-1">
          {(!isLastDialogue || !hasChoices) && (
            <div className="flex items-center gap-1 text-xs text-[#d4af37] font-bold uppercase tracking-wider animate-bounce">
              <span>{isTyping ? 'Nhấn để hiện hết' : 'Tiếp tục'}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
          {isLastDialogue && hasChoices && (
            <div className="text-xs text-[#d4af37] font-bold uppercase tracking-widest animate-pulse flex items-center gap-1">
              <span>⚔️ Đưa Ra Quyết Sách...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
