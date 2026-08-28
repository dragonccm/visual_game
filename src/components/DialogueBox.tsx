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

    // Play dialogue audio SFX
    if (dialogue.soundEffect) {
      soundEngine.playSFX(dialogue.soundEffect);
    }
    // Play BGM
    if (dialogue.bgm) {
      soundEngine.playBGM(dialogue.bgm);
    }
    // Trigger Speech synthesis
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
    if (isLastDialogue && hasChoices) return; // Wait for player choice

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
      {/* Dialogue Main Container */}
      <div
        onClick={handleClickBox}
        className="relative bg-gradient-to-b from-stone-950/95 via-stone-900/90 to-stone-950/95 border-2 border-amber-600/60 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-xl cursor-pointer transition hover:border-amber-400 group"
      >
        {/* Glow corner decorations */}
        <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
        <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
        <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

        {/* Speaker Name Tag & Audio Status */}
        <div className="flex items-center justify-between gap-3 mb-2.5 border-b border-amber-900/40 pb-2">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-md text-xs md:text-sm font-bold uppercase tracking-wider font-serif-epic text-amber-100 shadow-md flex items-center gap-1.5"
              style={{ backgroundColor: character.themeColor }}
            >
              <span>{character.name}</span>
            </span>
            <span className="text-[11px] md:text-xs text-stone-400 font-medium hidden sm:inline">
              {character.title}
            </span>
          </div>

          {/* Quick controls & Voice Replay */}
          <div className="flex items-center gap-2 text-xs" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleReplayVoice}
              title="Phát Lại Giọng Đọc (Lồng Tiếng AI)"
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-950/80 border border-amber-600/70 text-amber-300 hover:text-amber-100 hover:bg-amber-900 transition text-[11px] font-semibold cursor-pointer shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Đọc Thoại</span>
            </button>

            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-semibold transition cursor-pointer ${
                isAutoPlay
                  ? 'bg-amber-950 border-amber-500 text-amber-300'
                  : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-stone-200'
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
              className="p-1 rounded-md bg-stone-900 border border-stone-700 text-stone-400 hover:text-amber-300 transition cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Text Area - Concise, Large & Punchy */}
        <div className="min-h-[55px] md:min-h-[65px] flex items-center">
          <p className="text-stone-100 text-base md:text-xl font-bold leading-relaxed font-sans tracking-wide">
            {displayedText}
            {isTyping && <span className="inline-block w-2.5 h-5 ml-1 bg-amber-400 animate-pulse align-middle" />}
          </p>
        </div>

        {/* Advance Click Indicator */}
        <div className="flex justify-end items-center mt-2 pt-1">
          {(!isLastDialogue || !hasChoices) && (
            <div className="flex items-center gap-1 text-xs text-amber-400 font-bold uppercase tracking-wider animate-bounce">
              <span>{isTyping ? 'Nhấn để hiện hết' : 'Tiếp tục'}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
          {isLastDialogue && hasChoices && (
            <div className="text-xs text-amber-300 font-black uppercase tracking-widest animate-pulse flex items-center gap-1">
              <span>⚡ Đưa Ra Quyết Sách...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
