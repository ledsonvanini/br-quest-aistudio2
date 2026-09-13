import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthPreferences, AuthUser } from './authTypes';
import { activeAuthAdapter } from './authConfig';

interface AuthContextType {
  user: AuthUser | null;
  preferences: AuthPreferences | null;
  isGuest: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password?: string) => Promise<AuthUser>;
  register: (username: string, displayName: string, email?: string, password?: string) => Promise<AuthUser>;
  loginWithGoogle: (googleData?: { email: string; displayName: string; avatarUrl?: string; googleId?: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  updatePreferences: (prefs: Partial<AuthPreferences>) => Promise<AuthPreferences>;
  vendorName: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [preferences, setPreferences] = useState<AuthPreferences | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // Escuta mudanças de estado de autenticação
    const unsubscribe = activeAuthAdapter.onAuthStateChanged((currentUser) => {
      if (isMounted) {
        setUser(currentUser);
      }
    });

    // Inicializa o adaptador
    activeAuthAdapter
      .init()
      .then(async (currentUser) => {
        if (isMounted) {
          setUser(currentUser);
          if (currentUser) {
            const prefs = await activeAuthAdapter.getPreferences();
            if (isMounted) setPreferences(prefs);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('[AuthProvider] Erro ao inicializar auth:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (usernameOrEmail: string, password?: string) => {
    const loggedUser = await activeAuthAdapter.login(usernameOrEmail, password);
    const prefs = await activeAuthAdapter.getPreferences();
    setPreferences(prefs);
    return loggedUser;
  };

  const register = async (username: string, displayName: string, email?: string, password?: string) => {
    const regUser = await activeAuthAdapter.register(username, displayName, email, password);
    const prefs = await activeAuthAdapter.getPreferences();
    setPreferences(prefs);
    return regUser;
  };

  const loginWithGoogle = async (googleData?: { email: string; displayName: string; avatarUrl?: string; googleId?: string }) => {
    if (activeAuthAdapter.loginWithGoogle) {
      const loggedUser = await activeAuthAdapter.loginWithGoogle(googleData);
      const prefs = await activeAuthAdapter.getPreferences();
      setPreferences(prefs);
      return loggedUser;
    }
    throw new Error('Login com Google não suportado pelo adaptador atual.');
  };

  const logout = async () => {
    await activeAuthAdapter.logout();
    setPreferences(null);
  };

  const updatePreferences = async (prefs: Partial<AuthPreferences>) => {
    const updated = await activeAuthAdapter.savePreferences(prefs);
    setPreferences(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        preferences,
        isGuest: Boolean(user?.isGuest),
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        updatePreferences,
        vendorName: activeAuthAdapter.vendorName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
