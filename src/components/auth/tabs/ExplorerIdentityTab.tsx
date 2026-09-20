import React, { useState } from 'react';
import { useAuth } from '../../../services/auth/AuthContext';
import { User, LogIn, LogOut, UserPlus, AlertCircle, CheckCircle2, Shield, Cloud, Key } from 'lucide-react';
import { ExplorerAuthForms } from './ExplorerAuthForms';

interface ExplorerIdentityTabProps {
  playerLevel: number;
  playerXp: number;
  unlockedInsigniaCount: number;
  activeSubSection?: 'all' | 'profile' | 'cloud' | 'auth';
}

export const ExplorerIdentityTab: React.FC<ExplorerIdentityTabProps> = ({
  playerLevel,
  playerXp,
  unlockedInsigniaCount,
  activeSubSection = 'all',
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
      await register(username, password, email || undefined, displayName || undefined);
      setSuccessMsg('Conta criada com sucesso!');
      setTimeout(() => {
        setSuccessMsg(null);
        setFormMode('view');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao registrar conta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setSuccessMsg('Sessão encerrada.');
    setTimeout(() => setSuccessMsg(null), 1500);
  };

  const showProfile = activeSubSection === 'all' || activeSubSection === 'profile';
  const showCloud = activeSubSection === 'all' || activeSubSection === 'cloud';
  const showAuth = activeSubSection === 'all' || activeSubSection === 'auth';

  return (
    <div className="painel-aba-identidade space-y-4 text-slate-200 text-sm">
      {/* Mensagens de Alerta / Sucesso */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* 1. Status da Conta Atual */}
        {showProfile && (
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Identidade do Explorador</span>
            </div>

            <div className="flex items-center gap-3">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-lg shadow-sm">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-100 text-sm truncate">{user?.displayName || 'Explorador'}</div>
                <div className="text-xs text-slate-400 font-mono truncate">{user?.email || `@${user?.username}`}</div>
                <div className="text-[10px] text-amber-300/80 font-mono mt-0.5">
                  Provedor: {user?.email?.includes('@') ? 'Conta Registrada' : 'Local / Convidado'} ({vendorName})
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Status de Conexão:</span>
              <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                isGuest ? 'bg-slate-800 text-slate-300' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              }`}>
                {isGuest ? 'Modo Convidado' : 'Conta Sincronizada'}
              </span>
            </div>

            {!isGuest && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 border border-slate-700 hover:border-rose-500/50 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Encerrar Sessão</span>
              </button>
            )}
          </div>
        )}

        {/* 2. Sincronia Nuvem Firebase */}
        {showCloud && (
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
              <Cloud className="w-4 h-4" />
              <span>Armazenamento & Nuvem</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                Seus dados de progresso (XP, insígnias, preferências sonoras e biomas favoritos) são salvos com segurança.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Banco de Dados:</span>
                  <span className="text-amber-300 font-bold">Google Cloud Firestore</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sincronização:</span>
                  <span className="text-emerald-300 font-bold">Tempo Real</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Persistência Local:</span>
                  <span className="text-sky-300 font-bold">Offline First</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Ações de Login / Cadastro se for Convidado */}
        {showAuth && isGuest && (
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Conectar ou Criar Conta na Nuvem</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFormMode('view')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    formMode === 'view' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Opções
                </button>
                <button
                  type="button"
                  onClick={() => setFormMode('login')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    formMode === 'login' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setFormMode('register')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    formMode === 'register' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Registrar
                </button>
              </div>
            </div>

            {formMode === 'view' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-500/40 text-slate-200 font-bold text-xs flex items-center justify-center gap-2.5 transition shadow-sm cursor-pointer"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                  <span>Entrar com Conta Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormMode('login')}
                  className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar com Usuário & Senha</span>
                </button>
              </div>
            )}

            {(formMode === 'login' || formMode === 'register') && (
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
                onLogin={handleLogin}
                onRegister={handleRegister}
                onCancel={() => setFormMode('view')}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
