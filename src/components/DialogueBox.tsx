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
    soundEngine.speakText(dialogue.text, dialogue.speaker);

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
    }, 1800);

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
    soundEngine.speakText(dialogue.text, dialogue.speaker);
    if (dialogue.soundEffect) {
      soundEngine.playSFX(dialogue.soundEffect);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto z-20 select-none px-3 pb-4">
      {/* Dialogue Main Container - Carved Dark Wood & Bronze Rivet Frame */}
      <div
        onClick={handleClickBox}
        className="relative wood-panel rounded-2xl p-4 md:p-6 shadow-2xl cursor-pointer transition hover:border-[#8e7343] group"
      >
        {/* Antique Bronze Corner Rivets */}
        <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[#b8934a]" />
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#b8934a]" />
        <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[#b8934a]" />
        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#b8934a]" />

        {/* Speaker Name Tag & Audio Status */}
        <div className="flex items-center justify-between gap-3 mb-2.5 border-b border-[#3b2718] pb-2">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-md text-xs md:text-sm font-bold uppercase tracking-wider font-serif-epic text-[#f5ede3] shadow-md border border-[#4a3522]"
              style={{
                backgroundColor:
                  character.faction === 'viet'
                    ? '#422214'
                    : character.faction === 'han'
                    ? '#2d2417'
                    : '#1e1a16',
              }}
            >
              {character.name}
            </span>
            <span className="text-[11px] md:text-xs text-[#998574] font-medium hidden sm:inline">
              {character.title}
            </span>
          </div>

          {/* Quick controls & Voice Replay */}
          <div className="flex items-center gap-2 text-xs" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleReplayVoice}
              title="Phát Lại Giọng Đọc (Lồng Tiếng AI)"
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#24170e] border border-[#694c30] text-[#d4af37] hover:text-[#f7e9c8] hover:bg-[#382315] transition text-[11px] font-semibold cursor-pointer shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Đọc Thoại</span>
            </button>

            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-semibold transition cursor-pointer ${
                isAutoPlay
                  ? 'bg-[#3b2717] border-[#8e7343] text-[#d4af37]'
                  : 'bg-[#150f0b] border-[#382618] text-[#8c7867] hover:text-[#c4b3a3]'
              }`}
            >
              {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isAutoPlay ? 'Tự Động' : 'Thủ Công'}</span>
            </button>

            <button
              onClick={() => {
                setDisplayedText(dialogue.text);
                setIsTyping(false);
              }}
              title="Hiện Nhanh Lời Thoại"
              className="p-1 rounded-md bg-[#150f0b] border border-[#382618] text-[#8c7867] hover:text-[#d4af37] transition cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Text Area - Large, crisp & parchment aesthetic */}
        <div className="min-h-[55px] md:min-h-[65px] flex items-center">
          <p className="text-[#f0e7dd] text-base md:text-xl font-semibold leading-relaxed tracking-wide">
            {displayedText}
            {isTyping && <span className="inline-block w-2.5 h-5 ml-1 bg-[#c8963e] animate-pulse align-middle" />}
          </p>
        </div>

        {/* Advance Click Indicator */}
        <div className="flex justify-end items-center mt-2 pt-1">
          {(!isLastDialogue || !hasChoices) && (
            <div className="flex items-center gap-1 text-xs text-[#c8963e] font-bold uppercase tracking-wider animate-bounce">
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
