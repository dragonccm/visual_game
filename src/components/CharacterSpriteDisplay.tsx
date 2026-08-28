import React from 'react';
import { CharacterId } from '../types/game';
import { CHARACTERS } from '../data/characters';

interface CharacterSpriteDisplayProps {
  currentSpeaker: CharacterId;
  emotion?: 'normal' | 'intense' | 'confident' | 'angry' | 'triumphant';
}

export const CharacterSpriteDisplay: React.FC<CharacterSpriteDisplayProps> = ({
  currentSpeaker,
  emotion,
}) => {
  if (currentSpeaker === 'narrator') return null;

  const character = CHARACTERS[currentSpeaker];
  if (!character || !character.fullImage) return null;

  const isLeft = character.faction === 'viet';

  return (
    <div
      className={`absolute bottom-28 md:bottom-24 z-10 pointer-events-none transition-all duration-500 transform ${
        isLeft
          ? 'left-4 md:left-16 animate-slide-in-left'
          : 'right-4 md:right-16 animate-slide-in-right'
      } ${emotion === 'angry' || emotion === 'intense' ? 'scale-105 filter drop-shadow-[0_0_25px_rgba(225,29,72,0.6)]' : 'drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]'}`}
    >
      <div className="relative w-48 h-64 sm:w-60 sm:h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden border-2 border-amber-600/40 shadow-2xl bg-stone-950/40 backdrop-blur-sm">
        <img
          src={character.fullImage}
          alt={character.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
      </div>
    </div>
  );
};
