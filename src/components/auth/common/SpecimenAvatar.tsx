import React, { useState } from 'react';
import { BiodiversityKingdom } from '../../../types';
import { PawPrint, TreePine, Sparkles } from 'lucide-react';

interface SpecimenAvatarProps {
  specimenId: string;
  namePt: string;
  kingdom: BiodiversityKingdom;
  imageUrl?: string;
  thumbnailUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SpecimenAvatar: React.FC<SpecimenAvatarProps> = ({
  namePt,
  kingdom,
  imageUrl,
  thumbnailUrl,
  size = 'md',
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const candidateUrl = thumbnailUrl || imageUrl;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }[size];

  const kingdomBg = {
    fauna: 'bg-amber-950/40 border-amber-500/30 text-amber-300',
    flora: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300',
    fungi_micro: 'bg-purple-950/40 border-purple-500/30 text-purple-300',
  }[kingdom];

  const KingdomIcon = {
    fauna: PawPrint,
    flora: TreePine,
    fungi_micro: Sparkles,
  }[kingdom] || TreePine;

  if (!candidateUrl || hasError) {
    return (
      <div
        className={`avatar-especie-biodiversidade flex items-center justify-center flex-shrink-0 border select-none transition shadow-inner ${sizeClasses} ${kingdomBg}`}
        title={namePt}
      >
        <KingdomIcon className={iconSizes} />
      </div>
    );
  }

  return (
    <div
      className={`avatar-especie-biodiversidade relative flex-shrink-0 overflow-hidden border border-slate-700/80 shadow-sm ${sizeClasses} bg-slate-900`}
    >
      <img
        src={candidateUrl}
        alt={namePt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
    </div>
  );
};
