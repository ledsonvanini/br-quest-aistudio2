import { UserFavorites, UserScoreHistoryItem } from '../../types/userPreferences';

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  email?: string | null;
  avatarId?: string;
  avatarUrl?: string;
  isGuest: boolean;
  createdAt: string;
}

export interface AuthPreferences {
  soundEnabled: boolean;
  defaultMapMode: '2d' | '2.5d' | 'globo3d';
  highContrast: boolean;
  autoRotateGlobe: boolean;
  theme: 'cartographic' | 'dark' | 'satellite';
  musicVolume?: number;
  sfxVolume?: number;
  favorites?: UserFavorites;
}

export interface AuthProgress {
  xp: number;
  level: number;
  dailyStreak: number;
  unlockedInsignias: string[];
  completedStates: string[];
  readPergaments: string[];
  exploredDialogues: string[];
  scoreHistory?: UserScoreHistoryItem[];
}

/**
 * Interface Universal e Desacoplada de Autenticação (Adapter Pattern).
 * Permite trocar o provedor (SQLite local, Firebase Auth, Supabase, OAuth)
 * sem alterar nenhum componente de interface do BR Quest.
 */
export interface IAuthAdapter {
  readonly vendorName: string;
  init(): Promise<AuthUser | null>;
  login(usernameOrEmail: string, password?: string): Promise<AuthUser>;
  register(username: string, displayName: string, email?: string, password?: string): Promise<AuthUser>;
  loginWithGoogle?(googleData?: { email: string; displayName: string; avatarUrl?: string; googleId?: string }): Promise<AuthUser>;
  loginAsGuest(): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): AuthUser | null;
  getPreferences(): Promise<AuthPreferences | null>;
  savePreferences(prefs: Partial<AuthPreferences>): Promise<AuthPreferences>;
  getProgress(): Promise<AuthProgress | null>;
  saveProgress(progress: AuthProgress): Promise<void>;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
}
