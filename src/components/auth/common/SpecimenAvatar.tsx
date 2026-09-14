import React, { useState } from 'react';
import { BiodiversityKingdom } from '../../../types';
import { SPECIMEN_EMOJIS, KINGDOM_DEFAULT_EMOJIS } from './specimenVisualMap';

interface SpecimenAvatarProps {
  specimenId: string;
  namePt: string;
  kingdom: BiodiversityKingdom;
  imageUrl?: string;
  thumbnailUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SpecimenAvatar: React.FC<SpecimenAvatarProps> = ({
  specimenId,
  namePt,
  kingdom,
  imageUrl,
  thumbnailUrl,
  size = 'md',
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const candidateUrl = thumbnailUrl || imageUrl;

  const fallbackEmoji = SPECIMEN_EMOJIS[specimenId] || KINGDOM_DEFAULT_EMOJIS[kingdom] || '🌿';

  const sizeClasses = {
    sm: 'w-8 h-8 text-base rounded-lg',
    md: 'w-11 h-11 text-xl rounded-xl',
    lg: 'w-14 h-14 text-2xl rounded-2xl',
  }[size];

  const kingdomBg = {
    fauna: 'bg-amber-950/40 border-amber-500/30 text-amber-300',
    flora: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300',
    fungi_micro: 'bg-purple-950/40 border-purple-500/30 text-purple-300',
  }[kingdom];

  if (!candidateUrl || hasError) {
    return (
      <div
        className={`avatar-especie-biodiversidade flex items-center justify-center flex-shrink-0 border select-none transition shadow-inner ${sizeClasses} ${kingdomBg}`}
        title={namePt}
      >
        <span>{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <div
      className={`avatar-especie-biodiversidade relative flex-shrink-0 overflow-hidden border border-stone-700/60 shadow-sm ${sizeClasses} bg-stone-800`}
    >
      <img
        src={candidateUrl}
        alt={namePt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
      <span className="absolute bottom-0.5 right-0.5 text-[10px] leading-none opacity-80 drop-shadow">
        {fallbackEmoji}
      </span>
    </div>
  );
};
