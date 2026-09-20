import React from 'react';
import { Volume2, VolumeX, Eye, Layers, Sliders, Globe, Shield } from 'lucide-react';
import { AuthPreferences } from '../../../services/auth/authTypes';

interface ExplorerPreferencesTabProps {
  preferences: AuthPreferences | null;
  onUpdatePreferences: (prefs: Partial<AuthPreferences>) => Promise<AuthPreferences>;
  activeSubSection?: 'all' | 'audio' | 'visual' | 'access';
}

export const ExplorerPreferencesTab: React.FC<ExplorerPreferencesTabProps> = ({
  preferences,
  onUpdatePreferences,
  activeSubSection = 'all',
}) => {
  const soundEnabled = preferences?.soundEnabled ?? true;
  const defaultMapMode = preferences?.defaultMapMode || '2d';
  const highContrast = preferences?.highContrast ?? false;
  const autoRotateGlobe = preferences?.autoRotateGlobe ?? true;
  const musicVolume = preferences?.musicVolume ?? 80;
  const sfxVolume = preferences?.sfxVolume ?? 85;

  const showAudio = activeSubSection === 'all' || activeSubSection === 'audio';
  const showVisual = activeSubSection === 'all' || activeSubSection === 'visual';
  const showAccess = activeSubSection === 'all' || activeSubSection === 'access';

  return (
    <div className="painel-aba-preferencias space-y-3.5 text-slate-200 text-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* 1. Áudio & Hinos */}
        {showAudio && (
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-amber-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <span className="font-semibold text-xs text-slate-200 uppercase tracking-wider">
                  Áudio dos Guardiões & Hinos
                </span>
              </div>
              <button
                type="button"
                onClick={() => onUpdatePreferences({ soundEnabled: !soundEnabled })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  soundEnabled
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {soundEnabled ? 'Ativado' : 'Mudo'}
              </button>
            </div>

            {soundEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Hinos Estaduais</span>
                    <span className="font-mono text-amber-300 font-bold">{musicVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={musicVolume}
                    onChange={(e) => onUpdatePreferences({ musicVolume: Number(e.target.value) })}
                    className="w-full accent-amber-500 bg-slate-950 rounded-lg h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Efeitos Sonoros (SFX)</span>
                    <span className="font-mono text-sky-300 font-bold">{sfxVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sfxVolume}
                    onChange={(e) => onUpdatePreferences({ sfxVolume: Number(e.target.value) })}
                    className="w-full accent-sky-500 bg-slate-950 rounded-lg h-2"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Visual & Modo Padrão do Mapa */}
        {showVisual && (
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>Modo Cartográfico Padrão</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onUpdatePreferences({ defaultMapMode: '2d' })}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                  defaultMapMode === '2d'
                    ? 'bg-sky-950/80 border-sky-500/80 text-sky-200 shadow-sm ring-1 ring-sky-500/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <Layers className="w-4 h-4 text-sky-400" />
                <span className="font-bold">Mapa 2D Fiel</span>
                <span className="text-[10px] text-slate-400">IBGE & Relevo SVG</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdatePreferences({ defaultMapMode: 'globo3d' })}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                  defaultMapMode === 'globo3d'
                    ? 'bg-indigo-950/80 border-indigo-500/80 text-indigo-200 shadow-sm ring-1 ring-indigo-500/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <Globe className="w-4 h-4 text-indigo-400" />
                <span className="font-bold">Globo 3D Orbital</span>
                <span className="text-[10px] text-slate-400">Tridimensional</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Acessibilidade & Opções Adicionais */}
        {showAccess && (
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>Acessibilidade & Fluidez</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-200">Alto Contraste</div>
                  <div className="text-[10px] text-slate-400">Destaca bordas e tipografia</div>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => onUpdatePreferences({ highContrast: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-200">Rotação Automática do Globo</div>
                  <div className="text-[10px] text-slate-400">Giro suave quando inativo</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoRotateGlobe}
                  onChange={(e) => onUpdatePreferences({ autoRotateGlobe: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
