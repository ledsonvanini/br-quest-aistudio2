import React, { useState } from 'react';
import { getStateHeraldicInfo } from '../../data/coatOfArms';
import { Shield, Sparkles } from 'lucide-react';

interface StateHeraldicShieldProps {
  stateId: string;
  isCompleted?: boolean;
  isSelected?: boolean;
  isHovered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const StateHeraldicShield: React.FC<StateHeraldicShieldProps> = ({
  stateId,
  isCompleted = false,
  isSelected = false,
  isHovered = false,
  size = 'md',
  showLabel = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const heraldic = getStateHeraldicInfo(stateId);

  const sizeClasses = {
    sm: 'w-7 h-9 text-[9px]',
    md: 'w-9 h-11 text-[11px]',
    lg: 'w-13 h-16 text-[13px]',
  }[size];

  return (
    <div
      className={`moldura-heraldica-brasao pin-brasao-estado relative ${sizeClasses} rounded-b-xl rounded-t-sm flex flex-col items-center justify-center p-1 shadow-2xl transition-all duration-200 z-10 select-none ${
        isCompleted
          ? 'border-2 border-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.8)] ring-1 ring-yellow-200/50'
          : isSelected || isHovered
          ? 'border-2 border-yellow-300 shadow-[0_0_20px_rgba(251,191,36,0.9)] scale-110 ring-1 ring-amber-300/60'
          : 'border-1.5 border-amber-400/90 shadow-[0_4px_14px_rgba(0,0,0,0.8),0_0_8px_rgba(245,158,11,0.35)]'
      }`}
      style={{
        // 40% black translucent background with gold borders and official coat of arms
        backgroundColor: 'rgba(0, 0, 0, 0.40)',
        backdropFilter: 'blur(6px)',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)',
      }}
    >
      {/* Subtle Inner Gold Vignette / Gloss */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-400/10 via-transparent to-black/60 pointer-events-none rounded-b-xl" />

      {/* Official State Coat of Arms (Brasão Oficial) */}
      {heraldic?.coatUrl && !imgError && (
        <img
          src={heraldic.coatUrl}
          alt={`Brasão ${stateId}`}
          className={`w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-opacity duration-300 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            if (heraldic.fallbackUrl && heraldic.coatUrl !== heraldic.fallbackUrl) {
              const img = new Image();
              img.src = heraldic.fallbackUrl;
              img.onload = () => {
                setImgLoaded(true);
              };
              img.onerror = () => {
                setImgError(true);
              };
            } else {
              setImgError(true);
            }
          }}
        />
      )}

      {/* High-Contrast Heraldic Fallback Emblem when image is loading or fails */}
      {(!heraldic?.coatUrl || imgError || !imgLoaded) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-center">
          <Shield className="w-5 h-5 text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" />
          <span
            className="font-serif font-black text-amber-200 text-xs drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] tracking-wider mt-0.5"
            style={{ textShadow: '0 0 4px #000, 0 1px 2px #000' }}
          >
            {stateId}
          </span>
        </div>
      )}

      {/* Sparkle badge for completed or active states */}
      {(isHovered || isSelected || isCompleted) && (
        <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-yellow-300 animate-pulse drop-shadow" />
      )}
    </div>
  );
};
