import React from 'react';
import { Volume2, VolumeX, Eye, Layers, Sliders, Globe, Shield } from 'lucide-react';
import { AuthPreferences } from '../../../services/auth/authTypes';

interface ExplorerPreferencesTabProps {
  preferences: AuthPreferences | null;
  onUpdatePreferences: (prefs: Partial<AuthPreferences>) => Promise<AuthPreferences>;
}

export const ExplorerPreferencesTab: React.FC<ExplorerPreferencesTabProps> = ({
  preferences,
  onUpdatePreferences,
}) => {
  const soundEnabled = preferences?.soundEnabled ?? true;
  const defaultMapMode = preferences?.defaultMapMode || '2d';
  const highContrast = preferences?.highContrast ?? false;
  const autoRotateGlobe = preferences?.autoRotateGlobe ?? true;
  const musicVolume = preferences?.musicVolume ?? 80;
  const sfxVolume = preferences?.sfxVolume ?? 85;

  return (
    <div className="painel-aba-preferencias space-y-4 text-stone-200 text-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Áudio & Hinos */}
        <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-500" />
              )}
              <span className="font-semibold text-xs text-stone-200 uppercase tracking-wider">
                Áudio dos Guardiões & Hinos
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdatePreferences({ soundEnabled: !soundEnabled })}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                soundEnabled
                  ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}
            >
              {soundEnabled ? 'Ativado' : 'Mudo'}
            </button>
          </div>

          {soundEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-stone-700/40 text-xs">
              <div>
                <div className="flex justify-between text-stone-400 mb-1.5">
                  <span>Hinos Estaduais</span>
                  <span className="font-mono text-amber-300 font-bold">{musicVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={(e) => onUpdatePreferences({ musicVolume: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
                />
              </div>
              <div>
                <div className="flex justify-between text-stone-400 mb-1.5">
                  <span>Efeitos & Marolas</span>
                  <span className="font-mono text-amber-300 font-bold">{sfxVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVolume}
                  onChange={(e) => onUpdatePreferences({ sfxVolume: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Visualização & Câmera */}
        <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50 space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Modo Inicial do Cartógrafo</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => onUpdatePreferences({ defaultMapMode: '2d' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold transition ${
                defaultMapMode === '2d'
                  ? 'bg-sky-950/60 border-sky-500 text-sky-200 shadow-sm'
                  : 'bg-stone-800/60 border-stone-700/60 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Mapa D3 2D</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdatePreferences({ defaultMapMode: 'globo3d' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold transition ${
                defaultMapMode === 'globo3d'
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-sm'
                  : 'bg-stone-800/60 border-stone-700/60 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Globo 3D Espacial</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-700/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-stone-400" />
              <span>Rotação Automática do Globo</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdatePreferences({ autoRotateGlobe: !autoRotateGlobe })}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                autoRotateGlobe
                  ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                  : 'bg-stone-700 text-stone-400'
              }`}
            >
              {autoRotateGlobe ? 'Sim' : 'Não'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Acessibilidade & Contraste */}
      <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <Eye className="w-4 h-4 text-amber-400" />
          <div>
            <div className="font-semibold text-stone-200">Alto Contraste Cartográfico</div>
            <div className="text-[11px] text-stone-400">Linhas de fronteiras e textos reforçados para máxima visibilidade (WCAG AA)</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onUpdatePreferences({ highContrast: !highContrast })}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition ${
            highContrast
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'bg-stone-700 text-stone-400'
          }`}
        >
          {highContrast ? 'Ativo' : 'Padrão'}
        </button>
      </div>
    </div>
  );
};
