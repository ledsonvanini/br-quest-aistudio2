import React from 'react';
import { CulturalItem } from '../../data/culturalInventoryData';
import {
  Coffee,
  Flame,
  Soup,
  Feather,
  Swords,
  Sword,
  Shield,
  Crown,
  Trees,
  Landmark,
  Grape,
  Utensils,
  BookOpen,
  Leaf,
  Users,
  Compass,
  Award,
  Package,
} from 'lucide-react';

export const CompassBadgeIcon: React.FC<{
  icon: React.ElementType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}> = ({ icon: Icon, className = '', size = 'md', active = false }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`relative rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
        sizeClasses[size]
      } ${
        active
          ? 'bg-amber-500 border-2 border-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-105'
          : 'bg-slate-900 border border-amber-500/40 group-hover:border-amber-400'
      } ${className}`}
    >
      <Icon
        className={`${iconSizes[size]} ${
          active ? 'text-slate-950' : 'text-amber-300 group-hover:text-amber-200'
        } transition-colors`}
      />
    </div>
  );
};

export const ItemVectorIcon: React.FC<{
  itemId: string;
  category: string;
  className?: string;
}> = ({ itemId, category, className = 'w-6 h-6' }) => {
  switch (itemId) {
    case 'rs_chimarrao':
      return <Coffee className={`${className} text-emerald-400`} />;
    case 'rs_churrasco_fogo_chao':
      return <Flame className={`${className} text-orange-400`} />;
    case 'rs_arroz_carreteiro':
      return <Soup className={`${className} text-amber-300`} />;
    case 'rs_lenco_farroupilha':
      return <Feather className={`${className} text-rose-400`} />;
    case 'rs_lanca_farrapa':
      return <Swords className={`${className} text-amber-400`} />;
    case 'rs_anita_garibaldi':
      return <Sword className={`${className} text-yellow-300`} />;
    case 'rs_sepe_tiaraju':
      return <Shield className={`${className} text-cyan-400`} />;
    case 'rs_quero_quero':
      return <Feather className={`${className} text-sky-300`} />;
    case 'rs_cavalo_crioulo':
      return <Crown className={`${className} text-amber-400`} />;
    case 'rs_araucaria':
      return <Trees className={`${className} text-emerald-400`} />;
    case 'rs_bombacha_poncho':
      return <Compass className={`${className} text-amber-300`} />;
    case 'rs_gaita_acordeom':
      return <MusicIcon className={`${className} text-yellow-400`} />;
    case 'rs_missoes_jesuiticas':
      return <Landmark className={`${className} text-amber-300`} />;
    case 'rs_serra_gaucha_vinhedos':
      return <Grape className={`${className} text-purple-400`} />;
    default:
      if (category === 'culinaria') return <Utensils className={`${className} text-orange-300`} />;
      if (category === 'historia') return <BookOpen className={`${className} text-amber-300`} />;
      if (category === 'fauna_flora') return <Leaf className={`${className} text-emerald-300`} />;
      if (category === 'tradicoes') return <Users className={`${className} text-yellow-300`} />;
      if (category === 'geografia') return <Compass className={`${className} text-cyan-300`} />;
      if (category === 'personagens') return <Award className={`${className} text-yellow-400`} />;
      return <Package className={`${className} text-amber-400`} />;
  }
};

const MusicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);
