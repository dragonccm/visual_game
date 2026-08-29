import React from 'react';
import { CharacterId, CharacterInfo } from '../types/game';
import { CHARACTERS } from '../data/characters';

interface CharacterSpriteDisplayProps {
  currentSpeaker: CharacterId;
  emotion?: 'normal' | 'intense' | 'confident' | 'angry' | 'triumphant';
  characters?: Record<string, CharacterInfo>;
}

export const CharacterSpriteDisplay: React.FC<CharacterSpriteDisplayProps> = ({
  currentSpeaker,
  emotion,
  characters = CHARACTERS,
}) => {
  if (currentSpeaker === 'narrator') return null;

  const character = characters[currentSpeaker] || CHARACTERS[currentSpeaker];
  if (!character || !character.fullImage) return null;

  const isLeft = character.faction === 'viet';

  return (
    <div
      className={`absolute bottom-28 md:bottom-24 z-10 pointer-events-none transition-all duration-500 transform ${
        isLeft
          ? 'left-4 md:left-16 animate-slide-in-left'
          : 'right-4 md:right-16 animate-slide-in-right'
      } ${emotion === 'angry' || emotion === 'intense' ? 'scale-105 filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]' : 'drop-shadow-[0_8px_25px_rgba(0,0,0,0.85)]'}`}
    >
      <div className="relative w-48 h-64 sm:w-60 sm:h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden border-2 border-[#7a5832] shadow-2xl bg-[#120c08]/60 backdrop-blur-sm">
        <img
          src={character.fullImage}
          alt={character.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0805] via-transparent to-transparent opacity-85" />
      </div>
    </div>
  );
};
