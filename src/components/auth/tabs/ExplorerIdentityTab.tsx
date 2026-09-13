import React, { useState } from 'react';
import { useAuth } from '../../../services/auth/AuthContext';
import { User, LogIn, LogOut, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ExplorerAuthForms } from './ExplorerAuthForms';

interface ExplorerIdentityTabProps {
  playerLevel: number;
  playerXp: number;
  unlockedInsigniaCount: number;
}

export const ExplorerIdentityTab: React.FC<ExplorerIdentityTabProps> = ({
  playerLevel,
  playerXp,
  unlockedInsigniaCount,
}) => {
  const { user, isGuest, login, register, loginWithGoogle, logout, vendorName } = useAuth();

  const [formMode, setFormMode] = useState<'view' | 'login' | 'register'>('view');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      setSuccessMsg('Autenticado com a Conta Google (Firebase) com sucesso!');
      setTimeout(() => {
        setSuccessMsg(null);
        setFormMode('view');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao autenticar com Google no Firebase');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
      setSuccessMsg('Conectado com sucesso!');
      setTimeout(() => {
        setSuccessMsg(null);
        setFormMode('view');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha no login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await register(username, displayName || username, email, password);
      setSuccessMsg('Conta criada e salva no Firebase Cloud!');
      setTimeout(() => {
        setSuccessMsg(null);
        setFormMode('view');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao registrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await logout();
      setSuccessMsg('Sessão desconectada. Modo visitante reativado.');
      setTimeout(() => setSuccessMsg(null), 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao desconectar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="painel-aba-identidade space-y-4 text-stone-200 text-sm">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {formMode === 'view' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName || 'Avatar'}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 shadow-sm"
                />
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-100">{user?.displayName || 'Explorador Convidado'}</span>
                  {isGuest ? (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-stone-700 text-stone-300 uppercase">
                      Convidado
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      Verificado
                    </span>
                  )}
                </div>
                <div className="text-xs text-stone-400 mt-0.5">@{user?.username || 'guest'}</div>
                <div className="text-[11px] text-amber-400 font-mono mt-1">
                  Nuvem: {vendorName === 'firebase-cloud' ? 'Google Firebase Cloud' : vendorName}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-bold text-amber-400">Nível {playerLevel}</div>
              <div className="text-xs text-stone-400">{playerXp.toLocaleString('pt-BR')} XP</div>
              <div className="text-[10px] text-stone-500 mt-1">{unlockedInsigniaCount} insígnias</div>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            {isGuest ? (
              <>
                {/* Botão de Login com Google Oficial/Direto */}
                <button
                  type="button"
                  id="btn-login-google"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="btn-login-google w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-stone-100 text-stone-900 font-semibold text-xs transition shadow-md border border-stone-300 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continuar com Google</span>
                </button>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-stone-800" />
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">ou</span>
                  <div className="flex-1 h-px bg-stone-800" />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormMode('login')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-semibold transition"
                  >
                    <LogIn className="w-4 h-4 text-amber-400" />
                    Entrar com Usuário
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormMode('register')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition shadow-md"
                  >
                    <UserPlus className="w-4 h-4" />
                    Criar Conta
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                id="btn-logout-conta"
                onClick={handleLogout}
                disabled={isSubmitting}
                className="btn-logout-conta w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-800/80 border border-stone-700 text-stone-300 hover:text-red-300 text-xs font-semibold transition disabled:opacity-50"
              >
                <LogOut className="w-4 h-4 text-stone-400" />
                {isSubmitting ? 'Desconectando...' : 'Desconectar da Conta'}
              </button>
            )}
          </div>
        </div>
      )}

      {formMode !== 'view' && (
        <ExplorerAuthForms
          formMode={formMode}
          username={username}
          setUsername={setUsername}
          displayName={displayName}
          setDisplayName={setDisplayName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isSubmitting={isSubmitting}
          onCancel={() => setFormMode('view')}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
};
