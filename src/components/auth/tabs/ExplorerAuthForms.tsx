import React from 'react';

interface AuthFormsProps {
  formMode: 'login' | 'register';
  username: string;
  setUsername: (v: string) => void;
  displayName: string;
  setDisplayName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  onLogin: (e: React.FormEvent) => void;
  onRegister: (e: React.FormEvent) => void;
}

export const ExplorerAuthForms: React.FC<AuthFormsProps> = ({
  formMode,
  username,
  setUsername,
  displayName,
  setDisplayName,
  email,
  setEmail,
  password,
  setPassword,
  isSubmitting,
  onCancel,
  onLogin,
  onRegister,
}) => {
  if (formMode === 'login') {
    return (
      <form onSubmit={onLogin} className="form-auth-login space-y-3">
        <div>
          <label className="block text-xs text-stone-400 mb-1">E-mail ou Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
            placeholder="ex: explorador@email.com"
          />
        </div>
        <div>
          <label className="block text-xs text-stone-400 mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
            placeholder="••••••••"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 text-xs font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition disabled:opacity-50"
          >
            {isSubmitting ? 'Verificando...' : 'Acessar Conta'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={onRegister} className="form-auth-register space-y-3">
      <div>
        <label className="block text-xs text-stone-400 mb-1">Nome de Usuário</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
          placeholder="ex: desbravador_cerrado"
        />
      </div>
      <div>
        <label className="block text-xs text-stone-400 mb-1">Nome de Exibição</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
          placeholder="ex: Maria Silva"
        />
      </div>
      <div>
        <label className="block text-xs text-stone-400 mb-1">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
          placeholder="ex: maria@email.com"
        />
      </div>
      <div>
        <label className="block text-xs text-stone-400 mb-1">Senha (Mínimo 6 caracteres)</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
          placeholder="••••••••"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 text-xs font-semibold"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Criar e Salvar'}
        </button>
      </div>
    </form>
  );
};
