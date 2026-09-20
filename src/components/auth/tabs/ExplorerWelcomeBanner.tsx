import React, { useMemo } from 'react';
import { User, Sparkles, Flame, Shield, ShieldCheck, Award, Compass } from 'lucide-react';
import { AuthUser } from '../../../services/auth/authTypes';

interface ExplorerWelcomeBannerProps {
  user: AuthUser | null;
  isGuest: boolean;
  playerLevel: number;
  playerXp: number;
  unlockedInsigniaCount: number;
  completedStatesCount: number;
  dailyStreak: number;
  vendorName: string;
}

export const ExplorerWelcomeBanner: React.FC<ExplorerWelcomeBannerProps> = ({
  user,
  isGuest,
  playerLevel,
  playerXp,
  unlockedInsigniaCount,
  completedStatesCount,
  dailyStreak,
  vendorName,
}) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  const explorerRank = useMemo(() => {
    if (playerLevel <= 2) return '🧭 Aprendiz das Rotas Nacionais';
    if (playerLevel <= 5) return '🌿 Rastreador dos Biomas';
    if (playerLevel <= 9) return '🐆 Guardião da Biodiversidade';
    if (playerLevel <= 14) return '🦅 Navegador dos Sertões e Bacias';
    return '👑 Mestre Cartógrafo do Brasil';
  }, [playerLevel]);

  // XP progress calculation
  const xpCurrentLevelBase = (playerLevel - 1) * 300;
  const xpNextLevelBase = playerLevel * 300;
  const levelProgressPercent = Math.min(
    100,
    Math.max(5, Math.round(((playerXp - xpCurrentLevelBase) / (xpNextLevelBase - xpCurrentLevelBase)) * 100))
  );

  const territorialPercent = Math.min(100, Math.round((completedStatesCount / 27) * 100));

  return (
    <div className="banner-boas-vindas-explorador relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-850 to-slate-900 border border-amber-500/30 p-4 sm:p-5 shadow-lg mb-4 text-slate-100 flex-shrink-0">
      {/* Luz ambiente dourada de fundo */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Lado Esquerdo: Avatar, Boas-Vindas e Patente */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex-shrink-0">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-md border border-amber-300">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-7 h-7" />}
              </div>
            )}
            <span
              className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black border border-slate-900 shadow-xs"
              title={`Nível ${playerLevel}`}
            >
              Nv.{playerLevel}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-amber-200">
                {greeting}, {user?.displayName || 'Explorador(a)'}!
              </span>
              {isGuest ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800/80 text-slate-300 font-medium border border-slate-700">
                  Modo Convidado
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/90 text-emerald-300 font-medium border border-emerald-500/40 flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" /> Verificado
                </span>
              )}
            </div>

            <div className="text-xs text-amber-300/90 font-medium mt-0.5 flex items-center gap-1.5">
              <span>{explorerRank}</span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {vendorName === 'firebase-cloud' ? 'Google Firebase Ativo' : 'Cache Local'}
              </span>
            </div>

            {/* Barra de XP */}
            <div className="mt-2 flex items-center gap-2 w-full max-w-xs">
              <div className="flex-1 h-2 bg-slate-950/90 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 rounded-full"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-300 font-semibold flex-shrink-0">
                {playerXp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Cards de Pílula com Estatísticas Táteis */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 self-stretch md:self-auto flex-shrink-0 text-center">
          {/* Insígnias */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/20 flex flex-col items-center justify-center shadow-inner">
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Insígnias</span>
            </div>
            <span className="text-base sm:text-lg font-black text-slate-100 leading-tight mt-0.5">
              {unlockedInsigniaCount} <span className="text-xs text-slate-400 font-normal">/ 27</span>
            </span>
          </div>

          {/* Domínio Territorial */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/20 flex flex-col items-center justify-center shadow-inner">
            <div className="flex items-center gap-1 text-[11px] text-sky-400 font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Domínio</span>
            </div>
            <span className="text-base sm:text-lg font-black text-slate-100 leading-tight mt-0.5">
              {territorialPercent}%
            </span>
          </div>

          {/* Ofensiva */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/20 flex flex-col items-center justify-center shadow-inner">
            <div className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>Ofensiva</span>
            </div>
            <span className="text-base sm:text-lg font-black text-slate-100 leading-tight mt-0.5">
              {dailyStreak} <span className="text-[10px] text-slate-400 font-normal">dias</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
