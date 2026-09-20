import React from 'react';
import { User, Settings } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';

export interface SidebarUserAndConfigsGroupProps {
  playerLevel?: number;
  onOpenUserProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenAboutInfo?: () => void;
  onOpenSearchSelector?: () => void;
  onToggleFps?: () => void;
  showFps?: boolean;
  onOpenApiStatus?: () => void;
  apiCallsCount?: number;
  setHoveredMenuTooltip: (val: null) => void;
  setOpenFlyoutMode: (val: null) => void;
  bindTooltip: (config: {
    title: string;
    badge?: string;
    badgeColor?: string;
    description: string;
  }) => Record<string, unknown>;
}

/**
 * SidebarUserAndConfigsGroup
 * Grupo fixo inferior compacto da barra lateral de navegação:
 * Ordem: 1. Saiba Mais ('Saiba+') | 2. Usuário (Perfil) | 3. Configurações Gerais
 */
export const SidebarUserAndConfigsGroup: React.FC<SidebarUserAndConfigsGroupProps> = ({
  playerLevel,
  onOpenUserProfile,
  onOpenSettings,
  onOpenAboutInfo,
  setHoveredMenuTooltip,
  setOpenFlyoutMode,
  bindTooltip,
}) => {
  return (
    <div
      id="container-grupo-usuario-configs"
      className="container-grupo-usuario-configs flex flex-col items-center gap-1 p-1 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-lg shrink-0 mt-0.5"
    >
      {/* 1. SAIBA MAIS & CRÉDITOS ('Saiba+') */}
      {onOpenAboutInfo && (
        <button
          id="btn-sidebar-saiba-mais"
          type="button"
          onClick={() => {
            audioEngine.playSfx('click');
            setHoveredMenuTooltip(null);
            setOpenFlyoutMode(null);
            onOpenAboutInfo();
          }}
          {...bindTooltip({
            title: 'Saiba Mais & Créditos',
            badge: 'Informações',
            badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
            description:
              'Filosofia pedagógica do projeto, fontes oficiais de dados (IBGE, Open-Meteo, CartoDB) e direitos autorais.',
          })}
          className="btn-sidebar-saiba-mais relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-amber-500/40 hover:border-amber-400 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 transition-all cursor-pointer flex items-center justify-center shadow-sm"
          aria-label="Saiba Mais"
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-mono font-black text-[11px] sm:text-xs">
            !
          </div>
        </button>
      )}

      {/* 2. USUÁRIO / PERFIL DO EXPLORADOR */}
      {onOpenUserProfile && (
        <button
          id="btn-perfil-usuario-sidebar"
          type="button"
          onClick={() => {
            audioEngine.playSfx('click');
            setHoveredMenuTooltip(null);
            setOpenFlyoutMode(null);
            onOpenUserProfile();
          }}
          {...bindTooltip({
            title: 'Perfil & Jornada do Explorador',
            badge: `Nível ${playerLevel || 1}`,
            badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
            description:
              'Acesse seu perfil do explorador, insígnias de conquistas, progresso e dados sincronizados.',
          })}
          className="btn-perfil-usuario-sidebar relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400 text-slate-300 hover:text-amber-300 flex items-center justify-center transition-all cursor-pointer shadow-md group"
          aria-label="Perfil do Explorador"
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400/90 group-hover:text-amber-300 transition-colors" />
        </button>
      )}

      {/* 3. CONFIGURAÇÕES GERAIS */}
      {onOpenSettings && (
        <button
          id="btn-configuracoes-sidebar"
          type="button"
          onClick={() => {
            audioEngine.playSfx('click');
            setHoveredMenuTooltip(null);
            setOpenFlyoutMode(null);
            onOpenSettings();
          }}
          {...bindTooltip({
            title: 'Configurações Gerais',
            badge: 'Sistema',
            badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
            description:
              'Ajuste volume da trilha sonora (BGM), efeitos sonoros (SFX), reset de câmera, Dicas do Dia, Medidor de FPS e monitor de APIs.',
          })}
          className="btn-configuracoes-sidebar relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400 text-slate-300 hover:text-amber-300 flex items-center justify-center transition-all cursor-pointer shadow-md group"
          aria-label="Configurações Gerais"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-amber-300 group-hover:rotate-45 transition-transform" />
        </button>
      )}
    </div>
  );
};


