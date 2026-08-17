import React, { useState, useEffect } from 'react';
import {
  Sun,
  Sunset,
  Moon,
  CloudSun,
  Compass,
  Thermometer,
  Wind,
  Sparkles,
  Leaf,
  Flower2,
  Clock,
  MapPin,
  Layers,
  X,
  Droplets,
} from 'lucide-react';
import { EnvironmentMode, ParticleMode } from './RPGEnvironmentCanvas';
import {
  STATE_CAPITAL_GEO_DATA,
  getSouthernHemisphereSeason,
} from '../../data/stateCapitalGeoData';

interface Props {
  stateId: string;
  stateName: string;
  capitalName: string;
  environmentMode: EnvironmentMode;
  onSelectEnvironmentMode: (mode: EnvironmentMode) => void;
  particleMode: ParticleMode;
  onSelectParticleMode: (mode: ParticleMode) => void;
}

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  isLive: boolean;
}

type ActivePanel = 'ambiente' | 'clima' | 'geografia' | 'particulas' | null;

export const RPGEnvironmentGadgetHUD: React.FC<Props> = ({
  stateId,
  stateName,
  capitalName,
  environmentMode,
  onSelectEnvironmentMode,
  particleMode,
  onSelectParticleMode,
}) => {
  // Painel ativo aberto ao clicar nos ícones (ou null se fechado)
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [weather, setWeather] = useState<WeatherData>({
    temp: 24,
    condition: 'Ensolarado c/ Nuvens',
    humidity: 65,
    windSpeed: 14,
    isLive: false,
  });

  const geoInfo = STATE_CAPITAL_GEO_DATA[stateId] || STATE_CAPITAL_GEO_DATA['RS'];
  const season = getSouthernHemisphereSeason();

  // Fetch free live weather from Open-Meteo API
  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${geoInfo.lat}&longitude=${geoInfo.lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('API offline');
        const data = await res.json();
        if (isMounted && data.current) {
          const temp = Math.round(data.current.temperature_2m);
          const humidity = Math.round(data.current.relative_humidity_2m);
          const windSpeed = Math.round(data.current.wind_speed_10m);
          const code = data.current.weather_code;

          let condition = 'Céu Limpo';
          if (code === 1 || code === 2 || code === 3) condition = 'Parcialmente Nublado';
          else if (code >= 45 && code <= 48) condition = 'Nevoeiro / Névoa';
          else if (code >= 51 && code <= 67) condition = 'Chuva Suave';
          else if (code >= 71 && code <= 86) condition = 'Chuva / Aguaceiro';
          else if (code >= 95) condition = 'Tempestade com Trovões';

          setWeather({
            temp,
            condition,
            humidity,
            windSpeed,
            isLive: true,
          });
        }
      } catch {
        if (isMounted) {
          setWeather({
            temp: 23,
            condition: geoInfo.defaultClimate,
            humidity: 68,
            windSpeed: 12,
            isLive: false,
          });
        }
      }
    };

    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [geoInfo]);

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <div
      id="gadget-hud-ambiente-toolbar"
      className="gadget-hud-ambiente-toolbar absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-start gap-2.5 select-none"
    >
      {/* ────────────────────────────────────────────────────────── */}
      {/* PAINEL FLUTUANTE EXPANDIDO (50% OPACIDADE / BACKDROP BLUR) */}
      {/* Aparece à esquerda da coluna vertical de ícones            */}
      {/* ────────────────────────────────────────────────────────── */}
      {activePanel && (
        <div
          id="painel-gadget-funcao"
          className="painel-gadget-funcao w-[270px] sm:w-[290px] bg-slate-950/50 border border-amber-500/50 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.6)] p-3 flex flex-col gap-2 backdrop-blur-md animate-in fade-in slide-in-from-right-2 duration-200"
        >
          {/* Cabeçalho do Painel Ativo */}
          <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/20">
            <div className="flex items-center gap-1.5">
              {activePanel === 'ambiente' && <Sun className="w-4 h-4 text-amber-400" />}
              {activePanel === 'clima' && <CloudSun className="w-4 h-4 text-amber-400" />}
              {activePanel === 'geografia' && <Compass className="w-4 h-4 text-amber-400" />}
              {activePanel === 'particulas' && <Sparkles className="w-4 h-4 text-amber-400" />}
              <span className="text-xs font-serif font-black text-amber-200 uppercase tracking-wider">
                {activePanel === 'ambiente' && 'Modo de Ambiente'}
                {activePanel === 'clima' && 'Clima da Capital'}
                {activePanel === 'geografia' && 'Geografia & Fuso'}
                {activePanel === 'particulas' && 'Partículas do Ar'}
              </span>
            </div>
            <button
              onClick={() => setActivePanel(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-300 transition cursor-pointer"
              title="Fechar painel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1. PAINEL: AMBIENTE (DIA / PÔR DO SOL / NOITE) */}
          {activePanel === 'ambiente' && (
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[10px] text-slate-300 font-mono">
                Selecione a iluminação e atmosfera do cenário:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => onSelectEnvironmentMode('dia')}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 border transition cursor-pointer ${
                    environmentMode === 'dia'
                      ? 'bg-amber-500/80 text-slate-950 border-amber-300 font-bold shadow-md scale-[1.02]'
                      : 'bg-slate-900/50 text-slate-300 border-white/10 hover:border-amber-500/40 hover:text-amber-200 hover:bg-slate-900/80'
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-300" />
                  <span className="text-[10px] font-serif font-bold">Dia</span>
                </button>

                <button
                  onClick={() => onSelectEnvironmentMode('por_do_sol')}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 border transition cursor-pointer ${
                    environmentMode === 'por_do_sol'
                      ? 'bg-gradient-to-b from-orange-500/80 to-pink-500/80 text-slate-950 border-orange-300 font-bold shadow-md scale-[1.02]'
                      : 'bg-slate-900/50 text-slate-300 border-white/10 hover:border-orange-500/40 hover:text-orange-200 hover:bg-slate-900/80'
                  }`}
                >
                  <Sunset className="w-5 h-5 text-orange-300" />
                  <span className="text-[10px] font-serif font-bold whitespace-nowrap">Pôr do Sol</span>
                </button>

                <button
                  onClick={() => onSelectEnvironmentMode('noite')}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 border transition cursor-pointer ${
                    environmentMode === 'noite'
                      ? 'bg-indigo-600/80 text-amber-200 border-indigo-400 font-bold shadow-md scale-[1.02]'
                      : 'bg-slate-900/50 text-slate-300 border-white/10 hover:border-indigo-500/40 hover:text-indigo-200 hover:bg-slate-900/80'
                  }`}
                >
                  <Moon className="w-5 h-5 text-indigo-300" />
                  <span className="text-[10px] font-serif font-bold">Noite</span>
                </button>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/40 border border-white/10 text-[9px] text-slate-300 flex items-center justify-between">
                <span>Efeito ativo:</span>
                <span className="font-mono text-amber-300 font-bold uppercase">
                  {environmentMode === 'dia' && 'Luz Solar Suave'}
                  {environmentMode === 'por_do_sol' && 'Crepúsculo & Lens Flare'}
                  {environmentMode === 'noite' && 'Céu Estrelado & Lua'}
                </span>
              </div>
            </div>
          )}

          {/* 2. PAINEL: CLIMA EM TEMPO REAL & ESTAÇÃO */}
          {activePanel === 'clima' && (
            <div className="flex flex-col gap-2 pt-1">
              <div className="grid grid-cols-2 gap-1.5">
                <div className="p-2 rounded-xl bg-slate-900/50 border border-white/10 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                    <CloudSun className="w-3 h-3 text-amber-400" />
                    Condição
                  </span>
                  <span className="text-xs font-serif font-bold text-amber-200 mt-1 truncate">
                    {weather.condition}
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    {weather.isLive ? 'Satélite Ao Vivo' : 'Estimativa Local'}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/50 border border-white/10 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-rose-400" />
                    Temp. & Vento
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base font-mono font-black text-amber-300">
                      {weather.temp}°C
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      • {weather.humidity}%
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-300 flex items-center gap-1 mt-0.5">
                    <Wind className="w-2.5 h-2.5 text-sky-400" />
                    {weather.windSpeed} km/h
                  </span>
                </div>
              </div>

              {/* Estação do Ano */}
              <div className="p-2 rounded-xl bg-slate-900/50 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{season.icon}</span>
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">
                      Estação (Hemisfério Sul)
                    </span>
                    <span className="text-xs font-serif font-bold" style={{ color: season.color }}>
                      {season.namePt}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">
                    Umidade Relativa
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-300 flex items-center justify-end gap-0.5">
                    <Droplets className="w-3 h-3 text-sky-400" />
                    {weather.humidity}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. PAINEL: GEOGRAFIA & CARTOGRAFIA DA CAPITAL */}
          {activePanel === 'geografia' && (
            <div className="flex flex-col gap-2 pt-1">
              <div className="p-2 rounded-xl bg-slate-900/50 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    Capital Oficial:
                  </span>
                  <span className="font-serif text-amber-200 font-bold">
                    {capitalName} ({stateId})
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-amber-400" />
                    Coordenadas GPS:
                  </span>
                  <span className="font-mono text-amber-300 font-bold">
                    {geoInfo.lat.toFixed(4)}°, {geoInfo.lng.toFixed(4)}°
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-400" />
                    Fuso Horário:
                  </span>
                  <span className="font-mono text-slate-200">
                    {geoInfo.timezone}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-emerald-400" />
                    Clima Regional:
                  </span>
                  <span className="font-serif text-amber-200 text-right font-bold truncate max-w-[130px]">
                    {geoInfo.defaultClimate}
                  </span>
                </div>
              </div>

              <div className="text-[9px] text-slate-400 text-center font-mono italic">
                {stateName} • República Federativa do Brasil
              </div>
            </div>
          )}

          {/* 4. PAINEL: PARTÍCULAS & FLORA DO ESTADO */}
          {activePanel === 'particulas' && (
            <div className="flex flex-col gap-2 pt-1">
              <div className="p-2 rounded-xl bg-slate-900/50 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono block">
                    Flora / Símbolo Regional
                  </span>
                  <span className="text-xs font-serif font-bold text-amber-200">
                    {geoInfo.typicalFlower.name}
                  </span>
                </div>
                <span className="text-lg">{geoInfo.typicalFlower.icon}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-400 block">
                  Escolha as partículas em suspensão:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onSelectParticleMode('auto')}
                    className={`p-2 rounded-xl text-[10px] font-serif font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                      particleMode === 'auto'
                        ? 'bg-amber-500/80 text-slate-950 border-amber-300 font-black shadow-md'
                        : 'bg-slate-900/50 text-slate-300 border-white/10 hover:text-amber-200 hover:bg-slate-900/80'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Auto ({geoInfo.typicalFlower.name.split(' ')[0]})
                  </button>

                  <button
                    onClick={() => onSelectParticleMode('flores')}
                    className={`p-2 rounded-xl text-[10px] font-serif font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                      particleMode === 'flores'
                        ? 'bg-rose-500/80 text-slate-950 border-rose-300 font-black shadow-md'
                        : 'bg-slate-900/50 text-slate-300 border-white/10 hover:text-rose-200 hover:bg-slate-900/80'
                    }`}
                  >
                    <Flower2 className="w-3.5 h-3.5 text-rose-400" />
                    Pétalas
                  </button>

                  <button
                    onClick={() => onSelectParticleMode('folhas')}
                    className={`p-2 rounded-xl text-[10px] font-serif font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                      particleMode === 'folhas'
                        ? 'bg-emerald-500/80 text-slate-950 border-emerald-300 font-black shadow-md'
                        : 'bg-slate-900/50 text-slate-300 border-white/10 hover:text-emerald-200 hover:bg-slate-900/80'
                    }`}
                  >
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    Folhas
                  </button>

                  <button
                    onClick={() => onSelectParticleMode('estrelas')}
                    className={`p-2 rounded-xl text-[10px] font-serif font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                      particleMode === 'estrelas'
                        ? 'bg-indigo-500/80 text-slate-950 border-indigo-300 font-black shadow-md'
                        : 'bg-slate-900/50 text-slate-300 border-white/10 hover:text-indigo-200 hover:bg-slate-900/80'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Estrelas
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* TOOLBAR VERTICAL DO GADGET (BG 50% OPACIDADE / ARREDONDADA) */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-1.5 bg-slate-950/50 border border-amber-500/50 hover:border-amber-400/80 rounded-2xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300">
        {/* GRUPO 1: SEMPRE VISÍVEL ("x°C Cidade") */}
        <div
          onClick={() => togglePanel('clima')}
          className="grupo-1-temperatura-cidade flex flex-col items-center justify-center px-2 py-1.5 rounded-xl bg-slate-900/50 border border-white/10 hover:border-amber-500/50 hover:bg-slate-900/80 cursor-pointer text-amber-300 transition-all group"
          title={`Capital: ${capitalName} • ${weather.temp}°C • Clique para ver clima`}
        >
          <div className="flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-mono font-black tracking-tight">{weather.temp}°C</span>
          </div>
          <span className="text-[9px] text-slate-300 font-serif leading-none mt-0.5 max-w-[55px] truncate text-center">
            {capitalName.split(' ')[0]}
          </span>
        </div>

        {/* Separador Sutil */}
        <div className="w-6 h-[1px] bg-amber-500/30 my-0.5" />

        {/* GRUPO 2: ÍCONES EMPILHADOS NA VERTICAL (ATIVA PAINÉIS DE 50% OPACIDADE) */}
        <div className="grupo-2-icones-verticais flex flex-col items-center gap-1">
          {/* 1. Botão Ambiente (Dia / Pôr do Sol / Noite) */}
          <button
            onClick={() => togglePanel('ambiente')}
            className={`p-2 rounded-xl transition-all cursor-pointer relative group ${
              activePanel === 'ambiente'
                ? 'bg-amber-500 text-slate-950 shadow-md scale-105 font-bold'
                : 'text-slate-300 hover:text-amber-300 hover:bg-white/10'
            }`}
            title="Ambiente: Dia, Pôr do Sol e Noite"
          >
            {environmentMode === 'dia' && <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />}
            {environmentMode === 'por_do_sol' && <Sunset className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />}
            {environmentMode === 'noite' && <Moon className="w-4 h-4 text-indigo-300 group-hover:-rotate-12 transition-transform" />}
          </button>

          {/* 2. Botão Clima */}
          <button
            onClick={() => togglePanel('clima')}
            className={`p-2 rounded-xl transition-all cursor-pointer relative group ${
              activePanel === 'clima'
                ? 'bg-amber-500 text-slate-950 shadow-md scale-105 font-bold'
                : 'text-slate-300 hover:text-amber-300 hover:bg-white/10'
            }`}
            title="Clima da Capital & Estação"
          >
            <CloudSun className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
          </button>

          {/* 3. Botão Geografia & Coordenadas GPS */}
          <button
            onClick={() => togglePanel('geografia')}
            className={`p-2 rounded-xl transition-all cursor-pointer relative group ${
              activePanel === 'geografia'
                ? 'bg-amber-500 text-slate-950 shadow-md scale-105 font-bold'
                : 'text-slate-300 hover:text-amber-300 hover:bg-white/10'
            }`}
            title="Geografia, GPS & Fuso Horário"
          >
            <Compass className="w-4 h-4 text-sky-400 group-hover:rotate-45 transition-transform" />
          </button>

          {/* 4. Botão Partículas */}
          <button
            onClick={() => togglePanel('particulas')}
            className={`p-2 rounded-xl transition-all cursor-pointer relative group ${
              activePanel === 'particulas'
                ? 'bg-amber-500 text-slate-950 shadow-md scale-105 font-bold'
                : 'text-slate-300 hover:text-amber-300 hover:bg-white/10'
            }`}
            title="Partículas e Flora Regional"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
