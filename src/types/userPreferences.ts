import { BrazilBiome } from '../types';

export interface UserFavorites {
  biomes: BrazilBiome[];
  speciesIds: string[];
  stateIds: string[];
}

export interface UserScoreHistoryItem {
  id: string;
  type: 'quiz_uf' | 'daily_tip' | 'duel' | 'campaign';
  title: string;
  points: number;
  timestamp: string;
  detail?: string;
}

export interface ExtendedUserPreferences {
  soundEnabled: boolean;
  defaultMapMode: '2d' | '2.5d' | 'globo3d';
  highContrast: boolean;
  autoRotateGlobe: boolean;
  theme: 'cartographic' | 'dark' | 'satellite';
  musicVolume?: number; // 0 to 100
  sfxVolume?: number; // 0 to 100
  favorites: UserFavorites;
}

export const DEFAULT_USER_FAVORITES: UserFavorites = {
  biomes: ['Amazônia', 'Mata Atlântica'],
  speciesIds: ['onca-pintada', 'mico-leao-dourado', 'pau-brasil'],
  stateIds: ['AM', 'RJ', 'BA'],
};

export const DEFAULT_EXTENDED_PREFERENCES: ExtendedUserPreferences = {
  soundEnabled: true,
  defaultMapMode: '2d',
  highContrast: false,
  autoRotateGlobe: true,
  theme: 'cartographic',
  musicVolume: 80,
  sfxVolume: 85,
  favorites: DEFAULT_USER_FAVORITES,
};
