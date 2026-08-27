import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Award,
  BookOpen,
  Sparkles,
  Flame,
  FileText,
  Radio,
  Star,
  Check,
  Disc,
  Music,
  ExternalLink,
  SlidersHorizontal,
  Antenna,
  Gauge,
  Tv,
  Minus,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import {
  SongTrack,
  StateMusicalHeritage,
  NATIONAL_CIVIC_ANTHEMS,
  getStateMusicalHeritage,
} from '../../data/musicalHeritageData';
import {
  VINTAGE_RADIO_ERAS,
  getSavedDefaultRadioEraId,
  saveDefaultRadioEraId,
  getStateHighlightsForEra,
} from '../../data/vintageRadioEras';
import { RadioCabinetIllustration } from './RadioCabinetIllustrations';
import { vintageRadioEngine } from '../../lib/vintageRadioEngine';
import { audioEngine } from '../../lib/audioSynth';
import { SpeechBubbleTooltip } from '../common/SpeechBubbleTooltip';
import { GUARDIANS_DATA } from '../../data/guardiansData';

interface Props {
  selectedStateId: string | null;
  activeCategory?: 'state_anthems' | 'top5' | 'national';
  selectedRadioEraId?: string;
  onSelectRadioEra?: (eraId: string) => void;
  onSelectState?: (stateId: string) => void;
  onClose?: () => void;
}

type RadioSubTab = 'aparelho' | 'faixas' | 'hinos_gov' | 'historia';
export type RadioViewMode = 'normal' | 'expanded' | 'minimized';

// Hinos Nacionais Oficiais com links do portal da Presidência da República (.gov.br) e Wikimedia
export const GOV_NATIONAL_SYMBOLS = [
  {
    id: 'BR_HINO_NACIONAL',
    title: 'Hino Nacional Brasileiro',
    authors: 'Francisco Manuel da Silva & Joaquim Osório Duque-Estrada',
    year: '1831 / 1909 (Oficializado em 1922)',
    description: 'Símbolo supremo da soberania nacional brasileira.',
    govUrl: 'https://www.gov.br/planalto/pt-br/conheca-a-presidencia/biblioteca-da-pr/simbolos-nacionais/hinos',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Hino-Nacional-Brasil-instrumental-1968.ogg',
  },
  {
    id: 'BR_HINO_BANDEIRA',
    title: 'Hino à Bandeira Nacional',
    authors: 'Francisco Braga & Olavo Bilac',
    year: '1906',
    description: 'Exaltação cívica do Pavilhão Nacional e da esperança soberana.',
    govUrl: 'https://www.gov.br/planalto/pt-br/conheca-a-presidencia/biblioteca-da-pr/simbolos-nacionais/hinos',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Hino_%C3%A0_Bandeira_Nacional_%28instrumental%29.ogg',
  },
  {
    id: 'BR_HINO_INDEPENDENCIA',
    title: 'Hino da Independência do Brasil',
    authors: 'D. Pedro I & Evaristo da Veiga',
    year: '1822',
    description: 'Composto pelo próprio Imperador D. Pedro I após o Grito do Ipiranga.',
    govUrl: 'https://www.gov.br/planalto/pt-br/conheca-a-presidencia/biblioteca-da-pr/simbolos-nacionais/hinos',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Hino_da_Independ%C3%AAncia_%28instrumental%29.ogg',
  },
  {
    id: 'BR_HINO_REPUBLICA',
    title: 'Hino da Proclamação da República',
    authors: 'Leopoldo Miguez & Medeiros e Albuquerque',
    year: '1890',
    description: 'Composição vencedora do concurso nacional promovido pelo Marechal Deodoro da Fonseca.',
    govUrl: 'https://www.gov.br/planalto/pt-br/conheca-a-presidencia/biblioteca-da-pr/simbolos-nacionais/hinos',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Hino_da_Proclama%C3%A7%C3%A3o_da_Rep%C3%BAblica_%28instrumental%29.ogg',
  },
];

export const VintageRadioPlayer: React.FC<Props> = ({
  selectedStateId,
  activeCategory: initialActiveCategory = 'state_anthems',
  selectedRadioEraId = 'catedral_1930_1940',
  onSelectRadioEra,
  onSelectState,
  onClose,
}) => {
  const activeStateId = selectedStateId || 'RJ';
  const stateData: StateMusicalHeritage = getStateMusicalHeritage(activeStateId);
  const guardian = GUARDIANS_DATA.find((g) => g.id === activeStateId);

  const [viewMode, setViewMode] = useState<RadioViewMode>('expanded');
  const [activeSubTab, setActiveSubTab] = useState<RadioSubTab>('aparelho');
  const [activeCategory, setActiveCategory] = useState<'state_anthems' | 'top5' | 'national'>(initialActiveCategory);
  const [currentEraId, setCurrentEraId] = useState<string>(() => selectedRadioEraId || getSavedDefaultRadioEraId());
  const [defaultEraId, setDefaultEraId] = useState<string>(() => getSavedDefaultRadioEraId());
  const [saveDefaultSuccess, setSaveDefaultSuccess] = useState<boolean>(false);

  // When initialActiveCategory changes (e.g. from top menu buttons), switch to curated playlist tab!
  useEffect(() => {
    if (initialActiveCategory) {
      setActiveCategory(initialActiveCategory);
      setActiveSubTab('faixas');
    }
  }, [initialActiveCategory]);

  useEffect(() => {
    if (selectedRadioEraId) {
      setCurrentEraId(selectedRadioEraId);
    }
  }, [selectedRadioEraId]);

  const currentEra = VINTAGE_RADIO_ERAS.find((e) => e.id === currentEraId) || VINTAGE_RADIO_ERAS[0];
  const stateEraHighlights = getStateHighlightsForEra(activeStateId, currentEraId);

  const currentCategoryTracks: SongTrack[] = useMemo(() => {
    if (activeCategory === 'state_anthems') {
      return [stateData.stateAnthem, stateData.capitalAnthem];
    }
    if (activeCategory === 'top5') {
      return stateData.top5Tracks;
    }
    return NATIONAL_CIVIC_ANTHEMS;
  }, [activeCategory, stateData]);

  const [selectedTrack, setSelectedTrack] = useState<SongTrack>(stateData.stateAnthem);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isTubeMode, setIsTubeMode] = useState<boolean>(true);
  const [showLyricsModal, setShowLyricsModal] = useState<boolean>(false);
  const [dialFrequency, setDialFrequency] = useState<number>(stateData.frequencyDialKHz);
  const [vuMeterLevel, setVuMeterLevel] = useState<number>(0.5);

  // VU Meter animation
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setVuMeterLevel(Math.random() * 0.7 + 0.3);
      }, 120);
    } else {
      setVuMeterLevel(0.05);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Subscribe to vintageRadioEngine global updates
  useEffect(() => {
    const unsub = vintageRadioEngine.subscribe((engineState) => {
      setIsPlaying(engineState.isPlaying);
      setVolume(engineState.volume);
      setIsMuted(engineState.isMuted);
      setIsTubeMode(engineState.isTubeMode);
    });
    return () => unsub();
  }, []);

  // Update track and frequency when state changes
  useEffect(() => {
    const updated = getStateMusicalHeritage(activeStateId);
    setDialFrequency(updated.frequencyDialKHz);
    let trackToSelect = updated.stateAnthem;
    if (activeCategory === 'state_anthems') {
      trackToSelect = updated.stateAnthem;
    } else if (activeCategory === 'top5') {
      trackToSelect = updated.top5Tracks[0] || updated.stateAnthem;
    }
    setSelectedTrack(trackToSelect);

    vintageRadioEngine.updateMetadata({
      activeStateId,
      currentTrackTitle: trackToSelect.title,
      currentStationName: `${activeStateId} • ${updated.famousBroadcastingStation} (${updated.frequencyDialKHz} kHz)`,
      activeEraId: currentEraId,
      activeEraName: currentEra.name,
      frequencyDialKHz: updated.frequencyDialKHz,
    });
  }, [activeStateId, activeCategory, currentEraId, currentEra.name]);

  const currentTrackIndex = currentCategoryTracks.findIndex((t) => t.id === selectedTrack.id);

  // Play / Pause toggle
  const handleTogglePlay = (track: SongTrack) => {
    if (selectedTrack.id === track.id && isPlaying) {
      vintageRadioEngine.stop();
      setIsPlaying(false);
    } else {
      setSelectedTrack(track);
      vintageRadioEngine.updateMetadata({
        activeStateId,
        currentTrackTitle: track.title,
        currentStationName: `${activeStateId} • ${stateData.famousBroadcastingStation} (${stateData.frequencyDialKHz} kHz)`,
      });
      vintageRadioEngine.playTrack(track.frequenciesHz, track.tempoBpm);
      setIsPlaying(true);
    }
  };

  const handleTrackSelect = (track: SongTrack) => {
    audioEngine.playSfx('click');
    vintageRadioEngine.playTuningDialSfx();
    setSelectedTrack(track);
    vintageRadioEngine.updateMetadata({
      activeStateId,
      currentTrackTitle: track.title,
      currentStationName: `${activeStateId} • ${stateData.famousBroadcastingStation} (${stateData.frequencyDialKHz} kHz)`,
    });
    vintageRadioEngine.playTrack(track.frequenciesHz, track.tempoBpm);
    setIsPlaying(true);
  };

  // Faixa Anterior
  const handlePrevTrack = () => {
    if (currentCategoryTracks.length === 0) return;
    audioEngine.playSfx('click');
    vintageRadioEngine.playTuningDialSfx();
    const prevIdx = currentTrackIndex > 0 ? currentTrackIndex - 1 : currentCategoryTracks.length - 1;
    const prevTrack = currentCategoryTracks[prevIdx];
    setSelectedTrack(prevTrack);
    vintageRadioEngine.updateMetadata({
      activeStateId,
      currentTrackTitle: prevTrack.title,
      currentStationName: `${activeStateId} • ${stateData.famousBroadcastingStation} (${stateData.frequencyDialKHz} kHz)`,
    });
    vintageRadioEngine.playTrack(prevTrack.frequenciesHz, prevTrack.tempoBpm);
    setIsPlaying(true);
  };

  // Próxima Faixa
  const handleNextTrack = () => {
    if (currentCategoryTracks.length === 0) return;
    audioEngine.playSfx('click');
    vintageRadioEngine.playTuningDialSfx();
    const nextIdx = currentTrackIndex < currentCategoryTracks.length - 1 ? currentTrackIndex + 1 : 0;
    const nextTrack = currentCategoryTracks[nextIdx];
    setSelectedTrack(nextTrack);
    vintageRadioEngine.updateMetadata({
      activeStateId,
      currentTrackTitle: nextTrack.title,
      currentStationName: `${activeStateId} • ${stateData.famousBroadcastingStation} (${stateData.frequencyDialKHz} kHz)`,
    });
    vintageRadioEngine.playTrack(nextTrack.frequenciesHz, nextTrack.tempoBpm);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    vintageRadioEngine.setVolume(val);
    if (isMuted && val > 0) {
      setIsMuted(false);
      vintageRadioEngine.setMute(false);
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    vintageRadioEngine.setMute(nextMute);
  };

  const handleToggleTubeFilter = () => {
    audioEngine.playSfx('click');
    const state = vintageRadioEngine.toggleVintageFilter();
    setIsTubeMode(state);
  };

  const handleChangeEra = (eraId: string) => {
    audioEngine.playSfx('click');
    setCurrentEraId(eraId);
    const selectedEraObj = VINTAGE_RADIO_ERAS.find((e) => e.id === eraId);
    vintageRadioEngine.setRadioEra(eraId, selectedEraObj?.name);
    onSelectRadioEra?.(eraId);
  };

  const handleSaveAsDefaultEra = () => {
    audioEngine.playSfx('badge');
    saveDefaultRadioEraId(currentEraId);
    setDefaultEraId(currentEraId);
    setSaveDefaultSuccess(true);
    setTimeout(() => setSaveDefaultSuccess(false), 2500);
  };

  // Slider de Sintonia do Dial
  const handleDialFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFreq = parseInt(e.target.value, 10);
    setDialFrequency(newFreq);
    vintageRadioEngine.playTuningDialSfx();
  };

  const handleNudgeFrequency = (delta: number) => {
    audioEngine.playSfx('click');
    vintageRadioEngine.playTuningDialSfx();
    setDialFrequency((prev) => Math.max(540, Math.min(1600, prev + delta)));
  };

  const isCurrentEraDefault = currentEraId === defaultEraId;

  // =========================================================================
  // MODO 1: MINIMIZADO (BARRA FLUTUANTE COMPACTA)
  // =========================================================================
  if (viewMode === 'minimized') {
    return (
      <div
        id="painel-radio-vintage-minimizado"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="painel-radio-vintage-minimizado flex items-center gap-2.5 p-2 sm:p-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-amber-500/70 shadow-2xl shadow-black/90 text-white select-none animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Ícone e Nome da Estação */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300">
            <Radio className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-amber-400' : ''}`} />
          </div>
          <div className="text-left">
            <div className="text-xs font-serif font-black text-amber-200 truncate max-w-[130px] sm:max-w-[180px]">
              {stateData.stateName} • {stateData.famousBroadcastingStation}
            </div>
            <div className="text-[10px] font-mono text-slate-400 truncate max-w-[130px] sm:max-w-[180px]">
              {selectedTrack.title}
            </div>
          </div>
        </div>

        {/* Botões de Reprodução Mini */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handlePrevTrack}
            className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 transition cursor-pointer"
            title="Faixa Anterior"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleTogglePlay(selectedTrack)}
            className="p-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-black shadow-md transition cursor-pointer"
            title={isPlaying ? 'Pausar' : 'Tocar'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
          </button>

          <button
            onClick={handleNextTrack}
            className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 transition cursor-pointer"
            title="Próxima Faixa"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Botão Mute */}
        <button
          onClick={handleToggleMute}
          className="p-1 text-slate-400 hover:text-amber-300 transition cursor-pointer hidden sm:block shrink-0"
          title={isMuted ? 'Desmutar' : 'Mutar'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Botão Restaurar / Expandir */}
        <button
          id="btn-restaurar-radio"
          onClick={() => {
            audioEngine.playSfx('click');
            setViewMode('normal');
          }}
          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 hover:text-amber-200 transition cursor-pointer shrink-0"
          title="Restaurar Gabinete do Rádio"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Botão Fechar */}
        {onClose && (
          <button
            id="btn-fechar-radio-mini"
            onClick={() => {
              audioEngine.playSfx('click');
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-500/60 text-slate-400 hover:text-rose-300 transition cursor-pointer shrink-0"
            title="Fechar Rádio"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  // =========================================================================
  // MODO 2 & 3: NORMAL OU EXPANDIDO (50% DA TELA)
  // =========================================================================
  const isExpanded = viewMode === 'expanded';

  return (
    <div
      id="painel-radio-vintage-player"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className={`painel-radio-vintage-player painel-app-radio-vintage h-full flex flex-col bg-slate-950/70 backdrop-blur-xl border border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/90 text-white overflow-hidden select-none font-sans transition-all duration-300 ${
        isExpanded
          ? 'w-[calc(100vw-16px)] sm:w-[calc(50vw-16px)] lg:w-[calc(50vw-20px)] xl:w-[calc(50vw-24px)]'
          : 'w-[calc(100vw-24px)] sm:w-[480px] md:w-[500px]'
      }`}
    >
      {/* 1. CABEÇALHO DO APP DO RÁDIO (IDENTIDADE + CONTROLES DE JANELA) */}
      <div className="p-2.5 sm:p-3 border-b border-amber-500/30 bg-gradient-to-r from-[#1c0f07]/80 via-[#2a170a]/80 to-[#120803]/80 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between gap-2">
          {/* Avatar / Brasão + Nome do Estado */}
          <div className="flex items-center gap-2 min-w-0">
            {guardian?.avatarUrl ? (
              <img
                src={guardian.avatarUrl}
                alt={stateData.stateName}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-lg object-cover border border-amber-400/60 shadow shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center font-mono font-bold text-xs text-amber-300 shrink-0">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-serif font-black tracking-wide text-amber-200 uppercase truncate">
                  {stateData.stateName} ({activeStateId})
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 shrink-0 font-bold">
                  {dialFrequency} kHz
                </span>
              </div>
              <p className="text-[10px] text-amber-400/80 font-mono truncate">
                {stateData.famousBroadcastingStation} • {stateData.capitalName}
              </p>
            </div>
          </div>

          {/* CONTROLES DE JANELA: Salvar Favorito | Minimizar | Expandir/Restaurar | Fechar */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Botão Favoritar Era */}
            <div className="relative group hover:z-[300]">
              <button
                id="btn-salvar-radio-padrao"
                onClick={handleSaveAsDefaultEra}
                className={`btn-salvar-radio-padrao flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer shadow-sm ${
                  isCurrentEraDefault
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/70 shadow-amber-500/10'
                    : 'bg-slate-900/90 hover:bg-amber-950/80 text-slate-300 hover:text-amber-300 border-slate-700 hover:border-amber-500/60'
                }`}
                aria-label="Salvar Era como Rádio Padrão"
              >
                {saveDefaultSuccess ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : isCurrentEraDefault ? (
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                ) : (
                  <Star className="w-3 h-3 text-slate-400" />
                )}
              </button>

              <SpeechBubbleTooltip
                title="Aparelho Padrão"
                badge={isCurrentEraDefault ? 'Salvo' : 'Clique p/ Salvar'}
                badgeColor="bg-amber-500/20 text-amber-300 border-amber-400/40"
                description="Salva a Era deste aparelho como seu rádio favorito nas próximas sessões."
                align="right"
              />
            </div>

            {/* Botão Minimizar */}
            <button
              id="btn-minimizar-radio"
              onClick={() => {
                audioEngine.playSfx('click');
                setViewMode('minimized');
              }}
              className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/60 text-slate-300 hover:text-amber-300 transition cursor-pointer"
              title="Minimizar Rádio"
              aria-label="Minimizar Rádio"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Botão Expandir / Restaurar */}
            <button
              id="btn-expandir-radio"
              onClick={() => {
                audioEngine.playSfx('click');
                setViewMode((prev) => (prev === 'expanded' ? 'normal' : 'expanded'));
              }}
              className={`p-1.5 rounded-xl border transition cursor-pointer ${
                isExpanded
                  ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 hover:border-amber-400/60 text-slate-300 hover:text-amber-300'
              }`}
              title={isExpanded ? 'Restaurar Tamanho Padrão' : 'Expandir Rádio (50% da Tela)'}
              aria-label="Expandir ou Restaurar Rádio"
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Botão Fechar */}
            {onClose && (
              <button
                id="btn-fechar-radio"
                onClick={() => {
                  audioEngine.playSfx('click');
                  onClose();
                }}
                className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-500/60 text-slate-400 hover:text-rose-300 transition cursor-pointer"
                title="Fechar Rádio"
                aria-label="Fechar Rádio"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-Abas do Rádio (Pílulas no Padrão da Aplicação) */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-[10px] font-mono font-bold">
          <button
            onClick={() => {
              audioEngine.playSfx('click');
              setActiveSubTab('aparelho');
            }}
            className={`py-1 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeSubTab === 'aparelho'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <Radio className="w-3 h-3 shrink-0" />
            <span className="truncate">Aparelho</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playSfx('click');
              setActiveSubTab('faixas');
            }}
            className={`py-1 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeSubTab === 'faixas'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <Music className="w-3 h-3 shrink-0" />
            <span className="truncate">Faixas</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playSfx('click');
              setActiveSubTab('hinos_gov');
            }}
            className={`py-1 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeSubTab === 'hinos_gov'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <Award className="w-3 h-3 shrink-0" />
            <span className="truncate">Hinos .GOV</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playSfx('click');
              setActiveSubTab('historia');
            }}
            className={`py-1 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeSubTab === 'historia'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <FileText className="w-3 h-3 shrink-0" />
            <span className="truncate">História</span>
          </button>
        </div>
      </div>

      {/* 2. CONSOLE DE CONTROLE COM SÍMBOLOS & SLIDERS FUNCIONAIS */}
      <div className="p-2.5 sm:p-3 bg-slate-900/90 border-b border-slate-800/80 space-y-2.5 shrink-0">
        
        {/* Linha de Reprodução e Faixa Ativa */}
        <div className="flex items-center justify-between gap-2">
          {/* Botões de Reprodução (Símbolos ⏮ ▶ ⏭) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="btn-radio-faixa-anterior"
              onClick={handlePrevTrack}
              className="btn-radio-faixa-anterior w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-amber-300 flex items-center justify-center transition cursor-pointer border border-slate-700"
              title="Faixa Anterior (⏮)"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              id="btn-radio-play-pause"
              onClick={() => handleTogglePlay(selectedTrack)}
              className="btn-radio-play-pause w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer font-black"
              title={isPlaying ? 'Pausar Áudio' : 'Tocar Música'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-slate-950" />
              ) : (
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
              )}
            </button>

            <button
              id="btn-radio-proxima-faixa"
              onClick={handleNextTrack}
              className="btn-radio-proxima-faixa w-8 h-8 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-amber-300 flex items-center justify-center transition cursor-pointer border border-slate-700"
              title="Próxima Faixa (⏭)"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Info da Faixa Ativa */}
          <div className="flex-1 min-w-0 px-1">
            <div className="text-xs font-serif font-black text-amber-200 truncate">
              {selectedTrack.title}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {selectedTrack.artist} {selectedTrack.genre ? `• ${selectedTrack.genre}` : ''}
            </div>
          </div>

          {/* Botões Valvulado & Letra */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="btn-toggle-filtro-valvula"
              onClick={handleToggleTubeFilter}
              className={`btn-toggle-filtro-valvula px-2 py-1 rounded-lg text-[9px] font-mono font-bold border transition-all cursor-pointer ${
                isTubeMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-sm'
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title="Alternar Emulação de Filtro Valvulado Vintage"
            >
              {isTubeMode ? 'VÁLVULA' : 'HI-FI'}
            </button>

            <button
              id="btn-ver-letra-musica"
              onClick={() => setShowLyricsModal(true)}
              className="btn-ver-letra-musica p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-all cursor-pointer"
              title="Ver Letra Completa da Canção"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SLIDER 1: VOLUME PRINCIPAL FUNCIONAL */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
          <button
            id="btn-toggle-mute-radio"
            onClick={handleToggleMute}
            className="btn-toggle-mute-radio text-slate-400 hover:text-amber-300 transition cursor-pointer shrink-0"
            title={isMuted ? 'Desmutar' : 'Mutar'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          <input
            id="slider-volume-radio"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            style={{
              background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${isMuted ? 0 : Math.round(volume * 100)}%, #1e293b ${isMuted ? 0 : Math.round(volume * 100)}%, #1e293b 100%)`,
            }}
            className="slider-volume-radio w-full accent-amber-400 cursor-pointer h-2 rounded-lg border border-slate-700/80"
            title="Ajustar Volume do Rádio"
          />

          <span className="text-[10px] font-mono text-amber-400 w-8 text-right font-bold shrink-0">
            {isMuted ? 0 : Math.round(volume * 100)}%
          </span>
        </div>

        {/* SLIDER 2: SINTONIA DO DIAL (DIAL FREQUENCY SCRUBBER) */}
        <div className="p-2 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-amber-400/90 font-bold flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-amber-400" />
              Sintonia AM ({dialFrequency} kHz)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleNudgeFrequency(-10)}
                className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[9px] hover:text-amber-300 cursor-pointer"
                title="Ajuste fino -10 kHz"
              >
                -10
              </button>
              <button
                onClick={() => handleNudgeFrequency(10)}
                className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[9px] hover:text-amber-300 cursor-pointer"
                title="Ajuste fino +10 kHz"
              >
                +10
              </button>
              <button
                onClick={() => {
                  setDialFrequency(stateData.frequencyDialKHz);
                  vintageRadioEngine.playTuningDialSfx();
                }}
                className="px-1.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[9px] cursor-pointer"
                title="Sintonizar Frequência Exata deste Estado"
              >
                Auto
              </button>
            </div>
          </div>

          <input
            id="slider-frequencia-dial"
            type="range"
            min="540"
            max="1600"
            step="10"
            value={dialFrequency}
            onChange={handleDialFrequencyChange}
            style={{
              background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${Math.max(0, Math.min(100, Math.round(((dialFrequency - 540) / (1600 - 540)) * 100)))}%, #1e293b ${Math.max(0, Math.min(100, Math.round(((dialFrequency - 540) / (1600 - 540)) * 100)))}%, #1e293b 100%)`,
            }}
            className="slider-frequencia-dial w-full accent-amber-400 cursor-pointer h-2 rounded-lg border border-slate-700/80"
          />

          <div className="flex justify-between text-[8px] font-mono text-slate-500">
            <span>540 AM</span>
            <span>860 AM</span>
            <span>1060 AM</span>
            <span>1600 AM</span>
          </div>
        </div>
      </div>

      {/* 3. CONTEÚDO PRINCIPAL (BASEADO NA SUB-ABA ATIVA OU LAYOUT EXPANDIDO) */}
      <div
        onWheel={(e) => e.stopPropagation()}
        className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-3 custom-scrollbar min-h-0 overscroll-contain"
      >
        
        {/* SUB-ABA 1: APARELHO & BOTÕES DE ERAS */}
        {activeSubTab === 'aparelho' && (
          <div className={`animate-in fade-in duration-200 ${isExpanded ? 'grid grid-cols-1 md:grid-cols-2 gap-4 items-start' : 'space-y-3'}`}>
            
            {/* LADO ESQUERDO / PRINCIPAL: BOTÕES DE ERA + ILUSTRAÇÃO */}
            <div className="space-y-3">
              {/* SELEÇÃO DE ERAS DO RÁDIO */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-amber-400 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    ERA DO RÁDIO
                  </span>
                  <span className="text-slate-400 text-[9px] font-mono">{currentEra.yearRange}</span>
                </div>

                {/* Grid de 5 Botões de Era */}
                <div className="grid grid-cols-5 gap-1">
                  {VINTAGE_RADIO_ERAS.map((era) => {
                    const isSelected = era.id === currentEraId;
                    const isEraDefault = era.id === defaultEraId;
                    const tooltipAlign =
                      era.id === 'galena_1920'
                        ? 'left'
                        : era.id === 'digital_1990_2000'
                        ? 'right'
                        : 'center';

                    return (
                      <div key={era.id} className="relative group hover:z-[300]">
                        <button
                          id={`btn-era-${era.id}`}
                          onClick={() => handleChangeEra(era.id)}
                          className={`btn-era-radio w-full py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-gradient-to-b from-amber-400 to-yellow-500 text-slate-950 border-amber-200 shadow-md font-black scale-[1.02]'
                              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-500/60 hover:text-amber-200'
                          }`}
                          aria-label={`Era ${era.shortName}`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {era.id === 'galena_1920' && <Antenna className="w-3 h-3" />}
                            {era.id === 'catedral_1930_1940' && <Radio className="w-3 h-3" />}
                            {era.id === 'modernista_1950_1960' && <Gauge className="w-3 h-3" />}
                            {era.id === 'boombox_1970_1980' && <Disc className="w-3 h-3" />}
                            {era.id === 'digital_1990_2000' && <Tv className="w-3 h-3" />}
                            {isEraDefault && (
                              <Star className={`w-2.5 h-2.5 ${isSelected ? 'text-slate-950 fill-slate-950' : 'text-amber-400 fill-amber-400'}`} />
                            )}
                          </div>
                          <span className="text-[10px] font-mono font-bold leading-tight">
                            {era.decade.replace('–', '/')}
                          </span>
                        </button>

                        <SpeechBubbleTooltip
                          title={era.name}
                          badge={era.yearRange}
                          badgeColor={isSelected ? 'bg-amber-500/20 text-amber-300 border-amber-400/40' : undefined}
                          description={`${era.historicalContext} ${era.curiosity}`}
                          align={tooltipAlign}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ilustração Interativa do Gabinete de Rádio */}
              <div className="relative flex flex-col items-center py-1">
                <RadioCabinetIllustration
                  eraId={currentEraId}
                  isPlaying={isPlaying}
                  frequencyKhz={dialFrequency}
                  stationName={`${stateData.famousBroadcastingStation} (${activeStateId})`}
                  vuLevel={vuMeterLevel}
                  isTubeWarm={isTubeMode}
                />
              </div>
            </div>

            {/* LADO DIREITO (OU ABAIXO): DESTAQUE HISTÓRICO E CULTURAL */}
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-950/25 border border-amber-500/30 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    {stateData.stateName} nos anos {currentEra.decade}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">{currentEra.yearRange}</span>
                </div>

                <div className="text-xs font-serif font-black text-amber-200">
                  {stateEraHighlights.movementName}
                </div>

                <div className="text-[11px] text-slate-300 font-sans leading-snug">
                  <strong className="text-amber-300 font-semibold">Artistas:</strong> {stateEraHighlights.keyArtists}
                </div>

                <div className="text-[10px] text-slate-400 font-sans italic border-t border-amber-900/40 pt-1.5">
                  "{stateEraHighlights.historicalFact}"
                </div>
              </div>

              {/* Dica de Ação Rápida para Ouvir Faixas */}
              <button
                onClick={() => {
                  audioEngine.playSfx('click');
                  setActiveSubTab('faixas');
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 hover:text-white text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>Explorar Lista de Músicas e Hinos de {activeStateId}</span>
              </button>
            </div>

          </div>
        )}

        {/* SUB-ABA 2: PLAYLIST & FAIXAS */}
        {activeSubTab === 'faixas' && (
          <div className={`animate-in fade-in duration-200 ${isExpanded ? 'grid grid-cols-1 md:grid-cols-2 gap-4 items-start' : 'space-y-3'}`}>
            {/* LADO ESQUERDO / OU INLINE EM EXPANDIDO: FAIXA ATIVA EM DESTAQUE */}
            {isExpanded && (
              <div className="p-3 rounded-2xl bg-amber-950/25 border border-amber-500/40 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-amber-400" />
                    FAIXA EM REPRODUÇÃO
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold">
                    {selectedTrack.year || 'Acervo Histórico'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-serif font-black text-amber-200 leading-tight">
                    {selectedTrack.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedTrack.artist}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700 font-bold">
                      {selectedTrack.genre}
                    </span>
                    {selectedTrack.tempoBpm && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {selectedTrack.tempoBpm} BPM
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed font-sans">
                  <div className="text-[9px] font-mono font-bold text-amber-400 mb-1">CURIOSIDADE CULTURAL</div>
                  {selectedTrack.historicalCuriosityPt}
                </div>

                {(selectedTrack.fullLyricsPt || selectedTrack.lyricsExcerptPt) && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono font-bold text-slate-400 flex items-center justify-between">
                      <span>LETRA</span>
                      <button
                        onClick={() => setShowLyricsModal(true)}
                        className="text-amber-400 hover:text-amber-200 underline cursor-pointer text-[10px]"
                      >
                        Ver em Modal
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-950 font-serif text-slate-200 text-xs leading-relaxed whitespace-pre-wrap border border-slate-800 max-h-48 overflow-y-auto custom-scrollbar">
                      {selectedTrack.fullLyricsPt || selectedTrack.lyricsExcerptPt}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* LISTA DE FAIXAS & SELETOR DE CATEGORIA */}
            <div className="space-y-2.5">
              {/* Seletor de Categoria */}
              <div className="flex border-b border-slate-800 bg-slate-900/60 rounded-xl p-1 gap-1 text-[10px] font-serif font-bold">
                <button
                  onClick={() => {
                    audioEngine.playSfx('click');
                    setActiveCategory('state_anthems');
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeCategory === 'state_anthems'
                      ? 'bg-amber-500 text-slate-950 shadow font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span className="truncate">Hinos do Estado</span>
                </button>
                <button
                  onClick={() => {
                    audioEngine.playSfx('click');
                    setActiveCategory('top5');
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeCategory === 'top5'
                      ? 'bg-amber-500 text-slate-950 shadow font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Flame className="w-3 h-3" />
                  <span className="truncate">Top 5 Clássicos</span>
                </button>
                <button
                  onClick={() => {
                    audioEngine.playSfx('click');
                    setActiveCategory('national');
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeCategory === 'national'
                      ? 'bg-amber-500 text-slate-950 shadow font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Award className="w-3 h-3" />
                  <span className="truncate">Hinos Nacionais</span>
                </button>
              </div>

              {/* Lista de Faixas */}
              <div className="space-y-1.5">
                {currentCategoryTracks.map((track, idx) => {
                  const isCurrent = selectedTrack.id === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleTrackSelect(track)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isCurrent
                          ? 'bg-amber-950/40 border-amber-500/80 shadow-md'
                          : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-black shrink-0 ${
                            isCurrent
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400 group-hover:text-amber-300'
                          }`}
                        >
                          {isCurrent && isPlaying ? (
                            <Disc className="w-3.5 h-3.5 animate-spin text-slate-950" />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className={`text-xs font-serif font-bold truncate ${isCurrent ? 'text-amber-200' : 'text-slate-200'}`}>
                            {track.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans truncate">
                            {track.artist} {track.year ? `(${track.year})` : ''} • {track.genre}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTrack(track);
                            setShowLyricsModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-300 transition cursor-pointer"
                          title="Ver Letra Completa"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePlay(track);
                          }}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                            isCurrent && isPlaying
                              ? 'bg-amber-500 text-slate-950 shadow'
                              : 'bg-slate-800 text-slate-300 hover:text-amber-300'
                          }`}
                          title={isCurrent && isPlaying ? 'Pausar' : 'Tocar'}
                        >
                          {isCurrent && isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUB-ABA 3: HINOS NACIONAIS & SÍMBOLOS .GOV */}
        {activeSubTab === 'hinos_gov' && (
          <div className={`animate-in fade-in duration-200 ${isExpanded ? 'space-y-3' : 'space-y-3'}`}>
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-600/40 text-xs text-slate-300 space-y-1">
              <div className="font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-yellow-400" />
                Acervo dos Símbolos Nacionais do Brasil (.GOV)
              </div>
              <p className="text-[11px] text-slate-400">
                Documentação oficial da Biblioteca da Presidência da República com a história e partituras dos 4 grandes hinos da soberania brasileira (Lei Federal nº 5.700/1971).
              </p>
            </div>

            <div className={`grid gap-2.5 ${isExpanded ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {GOV_NATIONAL_SYMBOLS.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-xs text-amber-200">
                          {item.title}
                        </h4>
                        <span className="text-[9px] font-mono text-slate-400">{item.year}</span>
                      </div>

                      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                        {item.description}
                      </p>

                      <div className="text-[10px] text-slate-400 font-sans">
                        <strong className="text-amber-300 font-semibold">Autoria:</strong> {item.authors}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-1">
                      <button
                        onClick={() => {
                          const matchingTrack = NATIONAL_CIVIC_ANTHEMS.find((t) => t.id === item.id);
                          if (matchingTrack) {
                            handleTrackSelect(matchingTrack);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-bold text-[10px] flex items-center gap-1.5 cursor-pointer transition shadow"
                      >
                        <Play className="w-3 h-3 fill-slate-950" />
                        <span>Ouvir no Rádio</span>
                      </button>

                      <a
                        href={item.govUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-amber-400/90 hover:text-amber-200 flex items-center gap-1 font-mono hover:underline"
                      >
                        <span>Fonte Oficial .GOV</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB-ABA 4: HISTÓRIA & FICHA TÉCNICA */}
        {activeSubTab === 'historia' && (
          <div className={`animate-in fade-in duration-200 ${isExpanded ? 'grid grid-cols-1 md:grid-cols-2 gap-4 items-start' : 'space-y-3'}`}>
            {/* FICHA TÉCNICA E CURIOSIDADE HISTÓRICA */}
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="text-xs font-serif font-black text-amber-300">
                  {selectedTrack.title}
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedTrack.artist} • {selectedTrack.genre} {selectedTrack.year ? `(${selectedTrack.year})` : ''}
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed font-sans">
                  <div className="text-[9px] font-mono font-bold text-amber-400 mb-1">CURIOSIDADE DO ACERVO HISTÓRICO</div>
                  {selectedTrack.historicalCuriosityPt}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5 text-[11px] text-slate-300">
                <div className="font-serif font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Ficha Técnica da Canção
                </div>
                <div><strong className="text-amber-200 font-medium">Compositor / Letrista:</strong> {selectedTrack.artist}</div>
                <div><strong className="text-amber-200 font-medium">Gênero Musical:</strong> {selectedTrack.genre}</div>
                {selectedTrack.year && <div><strong className="text-amber-200 font-medium">Ano / Período:</strong> {selectedTrack.year}</div>}
                {selectedTrack.tempoBpm && <div><strong className="text-amber-200 font-medium">Andamento:</strong> {selectedTrack.tempoBpm} BPM</div>}
              </div>
            </div>

            {/* LETRA COMPLETA OFICIAL */}
            {(selectedTrack.fullLyricsPt || selectedTrack.lyricsExcerptPt) && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-slate-400 flex items-center justify-between">
                  <span>{selectedTrack.fullLyricsPt ? 'LETRA COMPLETA OFICIAL' : 'TRECHO DA LETRA'}</span>
                  <button
                    onClick={() => setShowLyricsModal(true)}
                    className="text-amber-400 hover:text-amber-200 underline cursor-pointer text-[10px]"
                  >
                    Expandir
                  </button>
                </div>
                <pre className="p-3.5 rounded-2xl bg-slate-950 font-serif text-slate-200 text-xs leading-relaxed whitespace-pre-wrap border border-slate-800 max-h-96 overflow-y-auto custom-scrollbar font-medium">
                  {selectedTrack.fullLyricsPt || selectedTrack.lyricsExcerptPt}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL DE LETRA COMPLETA */}
      {showLyricsModal && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[500] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-500/80 rounded-2xl shadow-2xl p-5 space-y-4 max-h-[85vh] flex flex-col text-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-serif font-black text-amber-300">{selectedTrack.title}</h3>
                <p className="text-xs text-slate-400">{selectedTrack.artist} • {selectedTrack.genre}</p>
              </div>
              <button
                onClick={() => setShowLyricsModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar text-xs overscroll-contain">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] font-mono font-bold text-amber-400 mb-1">CURIOSIDADE DO ACERVO HISTÓRICO</div>
                <p className="text-slate-300 leading-relaxed font-sans">{selectedTrack.historicalCuriosityPt}</p>
              </div>

              {(selectedTrack.fullLyricsPt || selectedTrack.lyricsExcerptPt) && (
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">
                    {selectedTrack.fullLyricsPt ? 'LETRA COMPLETA OFICIAL' : 'TRECHO DA LETRA'}
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 font-serif text-slate-200 text-xs leading-relaxed whitespace-pre-wrap border border-slate-800 font-medium">
                    {selectedTrack.fullLyricsPt || selectedTrack.lyricsExcerptPt}
                  </pre>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowLyricsModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-serif font-black text-xs cursor-pointer shadow-md"
            >
              Fechar Letra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
