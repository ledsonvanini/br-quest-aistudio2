import React, { useState, useEffect } from 'react';
import { audioEngine } from '../lib/audioSynth';
import {
  X,
  Volume2,
  VolumeX,
  Music,
  Sliders,
  RotateCcw,
  Sparkles,
  Info,
  Radio,
  Check,
  Activity,
  Gauge,
  BarChart3,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { apiTracker } from '../services/apiTracker';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onResetCamera?: () => void;
  onOpenApiStatus?: () => void;
  showFps?: boolean;
  onToggleFps?: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onResetCamera,
  onOpenApiStatus,
  showFps = false,
  onToggleFps,
}) => {
  const [bgmOn, setBgmOn] = useState<boolean>(audioEngine.isBgmOn());
  const [bgmVol, setBgmVol] = useState<number>(Math.round(audioEngine.getBgmVolume() * 100));
  const [sfxOn, setSfxOn] = useState<boolean>(audioEngine.isEnabled());
  const [apiCallsToday, setApiCallsToday] = useState<number>(() => apiTracker.getTotalCallsToday());
  const [apiSavingsToday, setApiSavingsToday] = useState<number>(() => apiTracker.getTotalCachedToday());

  useEffect(() => {
    if (!isOpen) return;
    const update = () => {
      setApiCallsToday(apiTracker.getTotalCallsToday());
      setApiSavingsToday(apiTracker.getTotalCachedToday());
    };
    update();
    const unsubscribe = apiTracker.subscribe(update);
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleBgm = () => {
    const nextState = audioEngine.toggleBgm();
    setBgmOn(nextState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setBgmVol(val);
    audioEngine.setBgmVolume(val / 100);
    if (!bgmOn && val > 0) {
      audioEngine.toggleBgm(true);
      setBgmOn(true);
    }
  };

  const handleToggleSfx = () => {
    const nextState = !sfxOn;
    audioEngine.setSoundEnabled(nextState);
    setSfxOn(nextState);
    if (nextState) {
      audioEngine.playSfx('click');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="modal-configuracoes relative w-full max-w-2xl max-h-[85vh] sm:max-h-[500px] flex flex-col bg-slate-950/95 border-2 border-amber-500/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-[0_20px_60px_rgba(0,0,0,0.95)] text-slate-100 font-sans my-auto">
        
        {/* Header Compacto */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 shrink-0">
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="font-serif font-black text-base sm:text-lg text-amber-400 leading-tight">
                Configurações Gerais
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-serif">Áudio, Som, Interface e Diagnóstico</p>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.playSfx('click');
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-900 border border-transparent hover:border-amber-500/30 transition cursor-pointer"
            aria-label="Fechar Configurações"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body - Grade Responsiva de 2 Colunas */}
        <div className="overflow-y-auto pr-1 sm:pr-2 space-y-3 sm:space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
            {/* ======================================================= */}
            {/* COLUNA 1: ÁUDIO, SOM & CÂMERA                           */}
            {/* ======================================================= */}
            <div className="space-y-3">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold px-1 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" />
                <span>Áudio & Trilha Sonora</span>
              </div>

              {/* Background Music Toggle & Volume */}
              <div className="card-config-musica bg-slate-900/90 rounded-2xl p-3 sm:p-3.5 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${bgmOn ? 'bg-amber-500/20 text-amber-400 border border-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                      <Music className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-slate-200">
                        Música Ambiente
                      </div>
                      <div className="text-[10px] text-slate-400">Trilha épica orquestral</div>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleBgm}
                    className={`px-3 py-1 rounded-xl text-xs font-bold font-serif transition flex items-center gap-1 border cursor-pointer ${
                      bgmOn
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {bgmOn ? <Check className="w-3 h-3" /> : null}
                    <span>{bgmOn ? 'Ligada' : 'Desligada'}</span>
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-300">
                    <span className="flex items-center gap-1">
                      <Radio className="w-3 h-3 text-amber-400" /> Volume
                    </span>
                    <span className="text-amber-400 font-bold">{bgmVol}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bgmVol}
                    onChange={handleVolumeChange}
                    style={{
                      background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${bgmVol}%, #1e293b ${bgmVol}%, #1e293b 100%)`,
                    }}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>
              </div>

              {/* Sound Effects Toggle */}
              <div className="card-config-sfx bg-slate-900/90 rounded-2xl p-3 sm:p-3.5 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${sfxOn ? 'bg-amber-500/20 text-amber-400 border border-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                    {sfxOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="text-xs font-serif font-bold text-slate-200">
                      Efeitos Sonoros (SFX)
                    </div>
                    <div className="text-[10px] text-slate-400">Cliques e passos</div>
                  </div>
                </div>

                <button
                  onClick={handleToggleSfx}
                  className={`px-3 py-1 rounded-xl text-xs font-bold font-serif transition flex items-center gap-1 border cursor-pointer ${
                    sfxOn
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {sfxOn ? <Check className="w-3 h-3" /> : null}
                  <span>{sfxOn ? 'Ativado' : 'Silenciado'}</span>
                </button>
              </div>

              {/* Camera / View Action */}
              {onResetCamera && (
                <div className="card-config-camera bg-slate-900/90 rounded-2xl p-3 sm:p-3.5 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center border border-slate-700 shrink-0">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-slate-200">
                        Posição da Câmera
                      </div>
                      <div className="text-[10px] text-slate-400">Recentralizar mapa do Brasil</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onResetCamera();
                      onClose();
                    }}
                    className="px-3 py-1 rounded-xl bg-slate-800 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 text-xs font-bold font-serif transition cursor-pointer"
                  >
                    Resetar
                  </button>
                </div>
              )}
            </div>

            {/* ======================================================= */}
            {/* COLUNA 2: PERFORMANCE, APIS & DIAGNÓSTICO               */}
            {/* ======================================================= */}
            <div className="space-y-3">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold px-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Performance & APIs</span>
                </span>
                <span className="text-[9px] text-emerald-400 font-mono">100% OPERACIONAL</span>
              </div>

              {/* FPS Toggle */}
              {onToggleFps && (
                <div className="card-config-fps bg-slate-900/90 rounded-2xl p-3 sm:p-3.5 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${showFps ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      <Gauge className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-slate-200">
                        Medidor de Taxa (FPS)
                      </div>
                      <div className="text-[10px] text-slate-400">Telemetria de quadros em tempo real</div>
                    </div>
                  </div>

                  <button
                    id="btn-toggle-fps-config"
                    onClick={() => {
                      audioEngine.playSfx('click');
                      onToggleFps();
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold font-serif transition flex items-center gap-1 border cursor-pointer ${
                      showFps
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {showFps ? <Check className="w-3 h-3" /> : null}
                    <span>{showFps ? 'Visível' : 'Oculto'}</span>
                  </button>
                </div>
              )}

              {/* API Status, Cotas e Estatísticas Semanais */}
              {onOpenApiStatus && (
                <div className="card-config-apis-resumo bg-slate-900/90 rounded-2xl p-3 sm:p-3.5 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/40 shrink-0">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-serif font-bold text-slate-200 flex items-center gap-1">
                          <span>APIs & Cotas</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <div className="text-[10px] text-slate-400">Open-Meteo, IBGE & CartoDB</div>
                      </div>
                    </div>

                    <button
                      id="btn-status-api-config"
                      onClick={() => {
                        audioEngine.playSfx('click');
                        onOpenApiStatus();
                        onClose();
                      }}
                      className="btn-abrir-painel-apis px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/40 text-xs font-bold font-serif transition cursor-pointer flex items-center gap-1"
                    >
                      <BarChart3 className="w-3 h-3" />
                      <span>Estatísticas</span>
                    </button>
                  </div>

                  {/* Resumo de Feitas / Disponíveis */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-slate-800 text-[10px] font-mono">
                    <div className="p-1 rounded-lg bg-slate-950/80 border border-slate-800/80 text-center">
                      <span className="text-[8px] text-slate-400 block">Feitas Hoje</span>
                      <span className="text-amber-300 font-bold">{apiCallsToday}</span>
                    </div>
                    <div className="p-1 rounded-lg bg-slate-950/80 border border-slate-800/80 text-center">
                      <span className="text-[8px] text-slate-400 block">Cota Diária</span>
                      <span className="text-slate-300 font-bold">10.000</span>
                    </div>
                    <div className="p-1 rounded-lg bg-slate-950/80 border border-slate-800/80 text-center">
                      <span className="text-[8px] text-slate-400 block">Em Cache</span>
                      <span className="text-cyan-300 font-bold">{apiSavingsToday}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Dica de Navegação */}
          <div className="bg-amber-950/25 rounded-2xl p-2.5 sm:p-3 border border-amber-500/20 text-[10px] sm:text-[11px] text-amber-200/90 flex items-center gap-2 font-serif italic">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Dica: No Mapa do Brasil, aproxime a câmera para apreciar o relevo sombreado, marolas cartográficas e brasões estaduais interativos.
            </span>
          </div>
        </div>

        {/* Footer Compacto */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 text-center shrink-0">
          <button
            onClick={() => {
              audioEngine.playSfx('click');
              onClose();
            }}
            className="w-full py-2 rounded-xl bg-amber-500 text-slate-950 font-serif font-black text-xs uppercase tracking-wider hover:bg-amber-400 transition shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Concluir e Salvar
          </button>
        </div>

      </div>
    </div>
  );
};
