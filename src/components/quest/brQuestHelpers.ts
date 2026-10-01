import React from 'react';
import {
  Compass,
  Zap,
  Trophy,
  Thermometer,
  Trees,
  Users,
  Building2,
  Map,
  Radio,
  MapPin,
  Shield,
  Layers,
} from 'lucide-react';
import { QuestThemePillar } from '../../data/brQuestQuestionsData';
import { QuestCategory } from './BrQuestSidebar';

export interface SubTabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const getBrQuestSubTabs = (activeCategory: QuestCategory): SubTabItem[] => {
  switch (activeCategory) {
    case 'nacional':
      return [
        { id: 'all', label: 'Visão Geral da Prova', icon: Compass },
        { id: 'simulado', label: 'Simulado Rápido (3 Qs)', icon: Zap },
        { id: 'completo', label: 'Grande Prova (6 Qs)', icon: Trophy },
      ];
    case 'pilares':
      return [
        { id: 'all', label: 'Todos os 6 Pilares', icon: Layers },
        { id: 'clima', label: 'Clima', icon: Thermometer },
        { id: 'biodiversidade', label: 'Biomas', icon: Trees },
        { id: 'demografia', label: 'Demografia', icon: Users },
        { id: 'geopolitica', label: 'Geopolítica', icon: Building2 },
        { id: 'geografia', label: 'Relevo & Águas', icon: Map },
        { id: 'cultura_musica', label: 'Cultura', icon: Radio },
      ];
    case 'trilhas':
      return [
        { id: 'all', label: 'Todas as 5 Regiões', icon: Compass },
        { id: 'norte', label: 'Norte (7 UFs)', icon: MapPin },
        { id: 'nordeste', label: 'Nordeste (9 UFs)', icon: MapPin },
        { id: 'centro_oeste', label: 'Centro-Oeste (4 UFs)', icon: MapPin },
        { id: 'sudeste', label: 'Sudeste (4 UFs)', icon: MapPin },
        { id: 'sul', label: 'Sul (3 UFs)', icon: MapPin },
      ];
    case 'guardioes':
      return [
        { id: 'all', label: 'Todas as 27 UFs', icon: Shield },
        { id: 'norte', label: 'Norte', icon: MapPin },
        { id: 'nordeste', label: 'Nordeste', icon: MapPin },
        { id: 'centro_oeste', label: 'Centro-Oeste', icon: MapPin },
        { id: 'sudeste', label: 'Sudeste', icon: MapPin },
        { id: 'sul', label: 'Sul', icon: MapPin },
      ];
    default:
      return [{ id: 'all', label: 'Todos', icon: Compass }];
  }
};

export const getBrQuestPillarBadge = (pillar: QuestThemePillar) => {
  switch (pillar) {
    case 'clima':
      return {
        label: 'Clima & Atmosfera',
        icon: Thermometer,
        color: 'text-sky-300 border-sky-500/40 bg-sky-950/60',
      };
    case 'biodiversidade':
      return {
        label: 'Biomas & Biodiversidade',
        icon: Trees,
        color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/60',
      };
    case 'demografia':
      return {
        label: 'Demografia Censo',
        icon: Users,
        color: 'text-purple-300 border-purple-500/40 bg-purple-950/60',
      };
    case 'geopolitica':
      return {
        label: 'Geopolítica & Fronteiras',
        icon: Building2,
        color: 'text-indigo-300 border-indigo-500/40 bg-indigo-950/60',
      };
    case 'geografia':
      return {
        label: 'Geografia & Relevo',
        icon: Map,
        color: 'text-amber-300 border-amber-500/40 bg-amber-950/60',
      };
    case 'cultura_musica':
      return {
        label: 'Cultura & Ritmos',
        icon: Radio,
        color: 'text-rose-300 border-rose-500/40 bg-rose-950/60',
      };
    default:
      return {
        label: 'Multidisciplinar',
        icon: Trophy,
        color: 'text-amber-300 border-amber-500/40 bg-amber-950/60',
      };
  }
};

export const getRankTitle = (lvl: number): string => {
  if (lvl >= 30) return 'Doutor em Geografia do Brasil';
  if (lvl >= 20) return 'Mestre dos Biomas & Clima';
  if (lvl >= 10) return 'Cartógrafo Especialista';
  if (lvl >= 5) return 'Explorador dos Sertões & Matas';
  return 'Aprendiz de Navegação';
};

