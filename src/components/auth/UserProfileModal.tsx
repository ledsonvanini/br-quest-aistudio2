import React, { useState } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import { User, Shield, Volume2, VolumeX, Sparkles, LogIn, LogOut, UserPlus, CheckCircle2, AlertCircle, X, Layers, Globe } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerLevel: number;
  playerXp: number;
  unlockedInsigniaCount: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  playerLevel,
  playerXp,
  unlockedInsigniaCount,
}) => {
  const { user, isGuest, preferences, login, register, logout, updatePreferences, vendorName } = useAuth();

  const [mode, setMode] = useState<'profile' | 'login' | 'register'>(isGuest ? 'profile' : 'profile');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
      setSuccessMsg('Conectado com sucesso!');
      setTimeout(() => {
        setSuccessMsg(null);
        setMode('profile');
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
      setSuccessMsg('Conta criada com sucesso no SQLite!');
      setTimeout(() => {
        setSuccessMsg(null);
        setMode('profile');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao registrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleSound = async () => {
    const current = preferences?.soundEnabled ?? true;
    await updatePreferences({ soundEnabled: !current });
  };

  const handleToggleMapMode = async (modeVal: '2d' | '2.5d' | 'globo3d') => {
    await updatePreferences({ defaultMapMode: modeVal });
  };

  return (
    <div
      id="modal-auth-backdrop"
      className="modal-auth-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        id="modal-auth-container"
        className="modal-auth-container relative w-full max-w-md bg-stone-900/95 border border-amber-500/30 rounded-2xl shadow-2xl p-6 text-stone-100 font-sans"
      >
        {/* Botão Fechar */}
        <button
          id="btn-fechar-modal-auth"
          onClick={onClose}
          className="btn-fechar-modal-auth absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1 rounded-lg hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-5 border-b border-stone-800 pb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-wide text-amber-300">
              {mode === 'login' ? 'Entrar na Conta' : mode === 'register' ? 'Criar Identidade' : 'Perfil & Preferências'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>Provedor Ativo:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono">
                {vendorName}
              </span>
            </div>
          </div>
        </div>

        {/* Mensagens de Feedback */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modo Perfil & Preferências */}
        {mode === 'profile' && (
          <div className="space-y-5">
            {/* Cartão do Usuário */}
            <div className="card-perfil-usuario p-4 rounded-xl bg-stone-800/70 border border-stone-700/60">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-100">{user?.displayName || 'Explorador Convidado'}</span>
                    {isGuest ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-stone-700 text-stone-300 uppercase tracking-wider">
                        Convidado
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                        Verificado
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">@{user?.username || 'guest'}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-amber-400">Nível {playerLevel}</div>
                  <div className="text-xs text-stone-400">{playerXp.toLocaleString('pt-BR')} XP</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-stone-700/60 flex justify-between text-xs text-stone-400">
                <span>Insígnias Coletadas:</span>
                <span className="font-semibold text-amber-300">{unlockedInsigniaCount} / 27 UFs</span>
              </div>
            </div>

            {/* Preferências do Usuário (Persistidas no SQLite) */}
            <div className="painel-preferencias-sqlite space-y-3">
              <div className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Preferências do Explorador (Salvas no SQLite)
              </div>

              {/* Toggle de Áudio */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-800/40 border border-stone-700/40 text-sm">
                <div className="flex items-center gap-2.5">
                  {preferences?.soundEnabled ?? true ? (
                    <Volume2 className="w-4 h-4 text-amber-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-stone-500" />
                  )}
                  <span>Efeitos Sonoros & Hinos</span>
                </div>
                <button
                  id="btn-toggle-audio-pref"
                  onClick={handleToggleSound}
                  className={`btn-toggle-audio-pref px-3 py-1 rounded-lg text-xs font-medium transition ${
                    preferences?.soundEnabled ?? true
                      ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                      : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                  }`}
                >
                  {preferences?.soundEnabled ?? true ? 'Ativado' : 'Mudo'}
                </button>
              </div>

              {/* Modo de Mapa Padrão */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-800/40 border border-stone-700/40 text-sm">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Modo Inicial do Mapa</span>
                </div>
                <div className="flex items-center gap-1 bg-stone-900/60 p-1 rounded-lg border border-stone-700/60 text-xs">
                  <button
                    onClick={() => handleToggleMapMode('2d')}
                    className={`px-2 py-0.5 rounded transition ${
                      (preferences?.defaultMapMode || '2d') === '2d'
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    2D
                  </button>
                  <button
                    onClick={() => handleToggleMapMode('globo3d')}
                    className={`px-2 py-0.5 rounded transition ${
                      preferences?.defaultMapMode === 'globo3d'
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    3D
                  </button>
                </div>
              </div>
            </div>

            {/* Ações de Conta */}
            <div className="pt-2 flex flex-col gap-2">
              {isGuest ? (
                <div className="flex gap-2">
                  <button
                    id="btn-abrir-login"
                    onClick={() => setMode('login')}
                    className="btn-abrir-login flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-semibold transition"
                  >
                    <LogIn className="w-4 h-4 text-amber-400" />
                    Entrar
                  </button>
                  <button
                    id="btn-abrir-registro"
                    onClick={() => setMode('register')}
                    className="btn-abrir-registro flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition shadow-md"
                  >
                    <UserPlus className="w-4 h-4" />
                    Criar Conta
                  </button>
                </div>
              ) : (
                <button
                  id="btn-desconectar-auth"
                  onClick={logout}
                  className="btn-desconectar-auth flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-red-300 text-xs font-semibold transition"
                >
                  <LogOut className="w-4 h-4 text-stone-400" />
                  Sair da Conta
                </button>
              )}
            </div>
          </div>
        )}

        {/* Formulário de Login */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Nome de Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                placeholder="ex: explorador_br"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Senha (Opcional no modo local)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                placeholder="••••••••"
              />
            </div>
            <button
              id="btn-submit-login"
              type="submit"
              disabled={isSubmitting}
              className="btn-submit-login w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-semibold transition shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Verificando...' : 'Acessar Conta'}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-amber-400 hover:underline"
              >
                Não tem conta? Crie uma agora
              </button>
            </div>
          </form>
        )}

        {/* Formulário de Registro */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Nome de Usuário (único)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                placeholder="ex: viajante_pantaneiro"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Nome de Exibição</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                placeholder="ex: Carlos Silva"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">E-mail (Opcional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                placeholder="••••••••"
              />
            </div>
            <button
              id="btn-submit-registro"
              type="submit"
              disabled={isSubmitting}
              className="btn-submit-registro w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-semibold transition shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Gravando no SQLite...' : 'Criar e Salvar Perfil'}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-amber-400 hover:underline"
              >
                Já possui conta? Faça login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
