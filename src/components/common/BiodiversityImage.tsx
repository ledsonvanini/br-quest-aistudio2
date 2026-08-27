import React, { useState, useEffect, useRef } from 'react';
import { Bird, Trees, Leaf } from 'lucide-react';
import { BiodiversityKingdom } from '../../types';
import {
  getOptimizedBiodiversityImageUrl,
  getScientificImageSync,
  getScientificImage,
  ScientificImageResult,
} from '../../services/biodiversityImageService';

interface BiodiversityImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  scientificName?: string;
  kingdom?: BiodiversityKingdom | 'all';
  fallbackSrc?: string;
  size?: 'thumb' | 'card' | 'full';
  isCircularMask?: boolean;
  containerClassName?: string;
  onScientificMetadataLoaded?: (meta: ScientificImageResult) => void;
}

const KINGDOM_FALLBACK_IMAGES: Record<string, string> = {
  fauna: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Rufous-bellied_thrush_%28Turdus_rufiventris%29.JPG/320px-Rufous-bellied_thrush_%28Turdus_rufiventris%29.JPG',
  flora: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Tabebuia_serratifolia_in_Bras%C3%ADlia.jpg/320px-Tabebuia_serratifolia_in_Bras%C3%ADlia.jpg',
  fungi_micro: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Pycnoporus_sanguineus_101037.jpg/320px-Pycnoporus_sanguineus_101037.jpg',
  all: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Parque_Nacional_do_Monte_Roraima_-_RR.jpg/320px-Parque_Nacional_do_Monte_Roraima_-_RR.jpg',
};

export const BiodiversityImage: React.FC<BiodiversityImageProps> = ({
  src,
  alt,
  scientificName,
  kingdom = 'all',
  fallbackSrc,
  size = 'card',
  isCircularMask = false,
  containerClassName = '',
  className = '',
  style,
  onScientificMetadataLoaded,
  ...rest
}) => {
  // 1. Resolução Síncrona Inicial (Cache Nível 1 / Nível 2 / Base Curada)
  const getInitialUrl = (): string => {
    if (scientificName) {
      const syncMatch = getScientificImageSync(scientificName, src);
      if (syncMatch) {
        return getOptimizedBiodiversityImageUrl(
          size === 'full' ? syncMatch.imageUrl : size === 'card' ? syncMatch.cardUrl : syncMatch.thumbnailUrl,
          size
        );
      }
    }
    const raw = src || fallbackSrc || KINGDOM_FALLBACK_IMAGES[kingdom] || KINGDOM_FALLBACK_IMAGES.all;
    return getOptimizedBiodiversityImageUrl(raw, size);
  };

  const [currentSrc, setCurrentSrc] = useState<string>(getInitialUrl);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const attemptedFallbacksRef = useRef<Set<string>>(new Set());

  // 2. Efeito para sincronização e enriquecimento científico assíncrono controlado
  useEffect(() => {
    let isMounted = true;
    const initial = getInitialUrl();
    setCurrentSrc(initial);
    setHasError(false);
    setIsLoaded(false);
    attemptedFallbacksRef.current.clear();

    // Se temos nome científico, consultar o pipeline com fila e cache
    if (scientificName) {
      getScientificImage(scientificName, src).then((result) => {
        if (!isMounted || !result) return;
        onScientificMetadataLoaded?.(result);

        const targetUrl = getOptimizedBiodiversityImageUrl(
          size === 'full' ? result.imageUrl : size === 'card' ? result.cardUrl : result.thumbnailUrl,
          size
        );

        if (targetUrl && targetUrl !== currentSrc && !attemptedFallbacksRef.current.has(targetUrl)) {
          setCurrentSrc(targetUrl);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [src, scientificName, fallbackSrc, kingdom, size]);

  const handleError = () => {
    if (!currentSrc) {
      setHasError(true);
      return;
    }

    attemptedFallbacksRef.current.add(currentSrc);

    // Tentativa 1: Fallback explícito
    if (fallbackSrc) {
      const optFallback = getOptimizedBiodiversityImageUrl(fallbackSrc, size);
      if (optFallback && !attemptedFallbacksRef.current.has(optFallback)) {
        setCurrentSrc(optFallback);
        return;
      }
    }

    // Tentativa 2: Fallback padrão do Reino biológico
    const kingdomFallback = KINGDOM_FALLBACK_IMAGES[kingdom] || KINGDOM_FALLBACK_IMAGES.all;
    if (kingdomFallback && !attemptedFallbacksRef.current.has(kingdomFallback)) {
      setCurrentSrc(kingdomFallback);
      return;
    }

    // Tentativa 3: Renderização vetorial temática
    setHasError(true);
  };

  const getKingdomIcon = () => {
    switch (kingdom) {
      case 'fauna':
        return <Bird className={size === 'thumb' ? 'w-5 h-5 text-amber-400' : 'w-6 h-6 text-amber-400'} />;
      case 'flora':
        return <Trees className={size === 'thumb' ? 'w-5 h-5 text-emerald-400' : 'w-6 h-6 text-emerald-400'} />;
      case 'fungi_micro':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={size === 'thumb' ? 'w-5 h-5 text-cyan-400' : 'w-6 h-6 text-cyan-400'}>
            <path d="M3 13c0-4.97 4.03-9 9-9s9 4.03 9 9H3z" />
            <path d="M10 13v6a2 2 0 0 0 4 0v-6" />
            <circle cx="8" cy="8.5" r="1" fill="currentColor" />
            <circle cx="15.5" cy="9" r="0.8" fill="currentColor" />
            <circle cx="12" cy="6.5" r="0.8" fill="currentColor" />
          </svg>
        );
      default:
        return <Leaf className={size === 'thumb' ? 'w-5 h-5 text-emerald-400' : 'w-6 h-6 text-emerald-400'} />;
    }
  };

  const maskStyles: React.CSSProperties = isCircularMask
    ? {
        clipPath: 'circle(50% at 50% 50%)',
        WebkitClipPath: 'circle(50% at 50% 50%)',
        borderRadius: '9999px',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
      }
    : {};

  return (
    <div
      className={`relative overflow-hidden bg-slate-950 flex items-center justify-center select-none ${
        isCircularMask ? 'rounded-full aspect-square' : ''
      } ${containerClassName}`}
      style={{ ...maskStyles, ...style }}
    >
      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-400 border border-slate-800/80">
          {getKingdomIcon()}
          {size !== 'thumb' && (
            <span className="text-[9px] font-mono text-slate-400 text-center mt-1 truncate max-w-full px-1">
              {alt}
            </span>
          )}
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          decoding="async"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-cover object-center max-w-full max-h-full block transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-85'
          } ${className}`}
          style={isCircularMask ? { aspectRatio: '1 / 1', objectFit: 'cover' } : undefined}
          {...rest}
        />
      )}
    </div>
  );
};
