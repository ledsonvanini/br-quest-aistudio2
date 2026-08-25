import React, { useState, useEffect } from 'react';
import { Bug, Trees, Sparkles, Leaf } from 'lucide-react';
import { BiodiversityKingdom } from '../../types';

interface BiodiversityImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  kingdom?: BiodiversityKingdom | 'all';
  fallbackSrc?: string;
  containerClassName?: string;
}

const KINGDOM_FALLBACK_IMAGES: Record<string, string> = {
  fauna: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80',
  flora: 'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&w=800&q=80',
  fungi_micro: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  all: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
};

export const BiodiversityImage: React.FC<BiodiversityImageProps> = ({
  src,
  alt,
  kingdom = 'all',
  fallbackSrc,
  containerClassName = '',
  className = '',
  ...rest
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc || KINGDOM_FALLBACK_IMAGES[kingdom] || KINGDOM_FALLBACK_IMAGES.all);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc || KINGDOM_FALLBACK_IMAGES[kingdom] || KINGDOM_FALLBACK_IMAGES.all);
    setHasError(false);
    setIsLoading(true);
  }, [src, fallbackSrc, kingdom]);

  const handleError = () => {
    const defaultFallback = fallbackSrc || KINGDOM_FALLBACK_IMAGES[kingdom] || KINGDOM_FALLBACK_IMAGES.all;
    if (currentSrc !== defaultFallback) {
      setCurrentSrc(defaultFallback);
      setHasError(false);
    } else {
      setHasError(true);
    }
    setIsLoading(false);
  };

  const getKingdomIcon = () => {
    switch (kingdom) {
      case 'fauna':
        return <Bug className="w-6 h-6 text-amber-400" />;
      case 'flora':
        return <Trees className="w-6 h-6 text-emerald-400" />;
      case 'fungi_micro':
        return <Sparkles className="w-6 h-6 text-cyan-400" />;
      default:
        return <Leaf className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div className={`relative overflow-hidden bg-slate-900 flex items-center justify-center ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/80 animate-pulse flex items-center justify-center z-10">
          <div className="w-4 h-4 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 animate-spin" />
        </div>
      )}

      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-400 border border-slate-800">
          {getKingdomIcon()}
          <span className="text-[9px] font-mono text-slate-400 text-center mt-1 truncate max-w-full px-1">
            {alt}
          </span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={handleError}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
          {...rest}
        />
      )}
    </div>
  );
};
