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
  characters?: Record<string, CharacterInfo>;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialogue,
  onNext,
  isLastDialogue,
  hasChoices,
  characters = CHARACTERS,
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);

  const character: CharacterInfo = characters[dialogue.speaker] ||
    CHARACTERS[dialogue.speaker] || {
      id: dialogue.speaker,
      name: dialogue.speakerName || dialogue.speaker,
      title: 'Nhân vật',
      faction: 'viet',
      avatar: '/assets/images/characters/ngo_quyen.jpg',
      fullImage: '/assets/images/characters/ngo_quyen.jpg',
      themeColor: '#e11d48',
    };

  // Typewriter effect & Audio speech trigger
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);

    if (dialogue.soundEffect) {
      soundEngine.playSFX(dialogue.soundEffect, dialogue.soundEffectCustomUrl);
    }
    if (dialogue.bgm) {
      soundEngine.playBGM(dialogue.bgm, dialogue.bgmCustomUrl);
    }

    // Play local high-definition Vietnamese voice audio or custom uploaded voice
    soundEngine.speakDialogue(dialogue.id, dialogue.customVoiceUrl);

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
    }, 10);

    return () => clearInterval(timer);
  }, [dialogue]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlay || isTyping) return;
    if (isLastDialogue && hasChoices) return;

    const autoTimer = setTimeout(() => {
      onNext();
    }, 1200);

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
    soundEngine.unlockAudio();
    soundEngine.speakDialogue(dialogue.id, dialogue.customVoiceUrl);
  };

  return (
    <div className="absolute bottom-4 left-0 right-0 z-20 px-3 md:px-8 max-w-5xl mx-auto select-none">
      <div
        onClick={handleClickBox}
        className="wood-panel-solid rounded-2xl p-4 md:p-6 cursor-pointer shadow-2xl relative transition-all duration-200 hover:border-[#8f6842]"
      >
        {/* Speaker Badge & Controls */}
        <div className="flex items-center justify-between mb-2 md:mb-3 pb-2 border-b-2 border-[#3b2718]">
          <div className="flex items-center gap-3">
            {/* Character Avatar */}
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border-2 border-[#5a3d28] bg-[#0c0805] shadow-md shrink-0">
              <img
                src={character.avatar}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name & Title */}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: character.themeColor }}
                />
                <h3 className="text-sm md:text-base font-black tracking-wide text-[#faebd7]">
                  {character.name}
                </h3>
              </div>
              <span className="text-[10px] md:text-xs font-bold text-[#b89f88] block">
                {character.title}
              </span>
            </div>
          </div>

          {/* Audio & Auto-play Controls */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={handleReplayVoice}
              title="Nghe lại giọng đọc"
              className="btn-material-bronze px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 text-[#faebd7] cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-[#ffd700]" />
              <span className="hidden sm:inline">Đọc Thoại</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAutoPlay(!isAutoPlay);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                isAutoPlay ? 'btn-material-bronze text-[#faebd7]' : 'btn-material-iron text-[#b89f88]'
              }`}
            >
              {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlay ? 'Tự Động: BẬT' : 'Tự Động'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setDisplayedText(dialogue.text);
                setIsTyping(false);
                onNext();
              }}
              title="Bỏ qua"
              className="btn-material-iron p-1.5 md:p-2 rounded-lg text-xs cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#b89f88]" />
            </button>
          </div>
        </div>

        {/* Dialogue Text Area */}
        <div className="min-h-[60px] md:min-h-[72px] flex items-center">
          <p className="text-sm md:text-base text-[#faebd7] font-medium leading-relaxed font-sans tracking-wide">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-[#d4af37] animate-pulse" />
            )}
          </p>
        </div>

        {/* Next Indicator */}
        {!isTyping && !isLastDialogue && (
          <div className="absolute right-4 bottom-3 flex items-center gap-1 text-[11px] font-bold text-[#d4af37] animate-bounce">
            <span>Nhấn tiếp tục</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};
