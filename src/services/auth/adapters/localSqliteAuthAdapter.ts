import { AuthPreferences, AuthProgress, AuthUser, IAuthAdapter } from '../authTypes';

const AUTH_STORAGE_KEY = 'br_quest_auth_session';

export class LocalSqliteAuthAdapter implements IAuthAdapter {
  public readonly vendorName = 'sqlite-local';
  private currentUser: AuthUser | null = null;
  private listeners: Set<(user: AuthUser | null) => void> = new Set();

  public async init(): Promise<AuthUser | null> {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored) as AuthUser;
        // Valida no backend
        try {
          const res = await fetch(`/api/user/me?userId=${encodeURIComponent(user.id)}`, {
            signal: AbortSignal.timeout(3000),
          });
          if (res.ok) {
            const data = await res.json();
            this.currentUser = data.user;
            this.notifyListeners();
            return this.currentUser;
          }
        } catch {
          // Servidor offline, usa sessão local em cache
          this.currentUser = user;
          this.notifyListeners();
          return this.currentUser;
        }
      }
    } catch {
      // Ignora erro de parsing
    }

    // Se não há usuário, inicializa como convidado transparente
    return this.loginAsGuest();
  }

  public async login(usernameOrEmail: string, password?: string): Promise<AuthUser> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao autenticar usuário');
    }

    const data = await res.json();
    this.currentUser = data.user;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
    this.notifyListeners();
    return this.currentUser!;
  }

  public async register(username: string, displayName: string, email?: string, password?: string): Promise<AuthUser> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, displayName, email, password }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao registrar usuário');
    }

    const data = await res.json();
    this.currentUser = data.user;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
    this.notifyListeners();
    return this.currentUser!;
  }

  public async loginWithGoogle(googleData?: { email: string; displayName: string; avatarUrl?: string; googleId?: string }): Promise<AuthUser> {
    const payload = googleData || {
      email: 'explorador.google@gmail.com',
      displayName: 'Explorador Google',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
      googleId: 'g_' + Math.random().toString(36).slice(2, 8),
    };

    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao autenticar com a Conta Google');
    }

    const data = await res.json();
    this.currentUser = data.user;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
    this.notifyListeners();
    return this.currentUser!;
  }

  public async loginAsGuest(): Promise<AuthUser> {
    try {
      const res = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const data = await res.json();
        this.currentUser = data.user;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
        this.notifyListeners();
        return this.currentUser!;
      }
    } catch {
      // Fallback offline
    }

    const guestId = `guest_${Math.random().toString(36).slice(2, 8)}`;
    this.currentUser = {
      id: guestId,
      username: guestId,
      displayName: 'Explorador Convidado',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
    this.notifyListeners();
    return this.currentUser;
  }

  public async logout(): Promise<void> {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.currentUser = null;
    this.notifyListeners();
    // Re-inicia como convidado
    await this.loginAsGuest();
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public async getPreferences(): Promise<AuthPreferences | null> {
    if (!this.currentUser) return null;
    try {
      const res = await fetch(`/api/user/preferences?userId=${encodeURIComponent(this.currentUser.id)}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        const raw = data.preferences;
        if (!raw) return null;
        return {
          soundEnabled: raw.sound_enabled ?? raw.soundEnabled ?? true,
          defaultMapMode: raw.default_map_mode ?? raw.defaultMapMode ?? '2d',
          highContrast: Boolean(raw.high_contrast ?? raw.highContrast),
          autoRotateGlobe: Boolean(raw.auto_rotate_globe ?? raw.autoRotateGlobe ?? true),
          theme: raw.theme || 'cartographic',
          musicVolume: raw.music_volume ?? raw.musicVolume ?? 80,
          sfxVolume: raw.sfx_volume ?? raw.sfxVolume ?? 85,
          favorites: raw.favorites || {
            biomes: ['Amazônia', 'Mata Atlântica'],
            speciesIds: ['onca-pintada', 'mico-leao-dourado', 'pau-brasil'],
            stateIds: ['AM', 'RJ', 'BA'],
          },
        };
      }
    } catch {
      // Ignore
    }
    return null;
  }

  public async savePreferences(prefs: Partial<AuthPreferences>): Promise<AuthPreferences> {
    if (!this.currentUser) throw new Error('Usuário não autenticado');
    const res = await fetch('/api/user/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.currentUser.id,
        soundEnabled: prefs.soundEnabled,
        defaultMapMode: prefs.defaultMapMode,
        highContrast: prefs.highContrast,
        autoRotateGlobe: prefs.autoRotateGlobe,
        theme: prefs.theme,
        musicVolume: prefs.musicVolume,
        sfxVolume: prefs.sfxVolume,
        favorites: prefs.favorites,
      }),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      const raw = data.preferences;
      if (raw) {
        return {
          soundEnabled: raw.sound_enabled ?? raw.soundEnabled ?? true,
          defaultMapMode: raw.default_map_mode ?? raw.defaultMapMode ?? '2d',
          highContrast: Boolean(raw.high_contrast ?? raw.highContrast),
          autoRotateGlobe: Boolean(raw.auto_rotate_globe ?? raw.autoRotateGlobe ?? true),
          theme: raw.theme || 'cartographic',
          musicVolume: raw.music_volume ?? raw.musicVolume ?? 80,
          sfxVolume: raw.sfx_volume ?? raw.sfxVolume ?? 85,
          favorites: raw.favorites,
        };
      }
    }
    return prefs as AuthPreferences;
  }

  public async getProgress(): Promise<AuthProgress | null> {
    if (!this.currentUser) return null;
    try {
      const res = await fetch(`/api/user/progress?userId=${encodeURIComponent(this.currentUser.id)}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.progress;
      }
    } catch {
      // Ignore
    }
    return null;
  }

  public async saveProgress(progress: AuthProgress): Promise<void> {
    if (!this.currentUser) return;
    try {
      await fetch('/api/user/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: this.currentUser.id, progress }),
        signal: AbortSignal.timeout(3000),
      });
    } catch {
      // Ignore
    }
  }

  public onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.add(callback);
    callback(this.currentUser);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentUser));
  }
}
