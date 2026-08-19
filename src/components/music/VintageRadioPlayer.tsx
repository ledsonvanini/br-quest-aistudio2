import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
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
  Info,
  Sliders,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  SongTrack,
  StateMusicalHeritage,
  NATIONAL_CIVIC_ANTHEMS,
  getStateMusicalHeritage,
} from '../../data/musicalHeritageData';
import {
  VINTAGE_RADIO_ERAS,
  RadioEraDevice,
  getSavedDefaultRadioEraId,
  saveDefaultRadioEraId,
  getStateHighlightsForEra,
} from '../../data/vintageRadioEras';
import { RadioCabinetIllustration } from './RadioCabinetIllustrations';
import { vintageRadioEngine } from '../../lib/vintageRadioEngine';
import { audioEngine } from '../../lib/audioSynth';
import { SpeechBubbleTooltip } from '../common/SpeechBubbleTooltip';

interface Props {
  selectedStateId: string | null;
  activeCategory?: 'state_anthems' | 'top5' | 'national';
  selectedRadioEraId?: string;
  onSelectRadioEra?: (eraId: string) => void;
  onSelectState?: (stateId: string) => void;
  onClose?: () => void;
}

type RadioSubTab = 'aparelho' | 'faixas' | 'hinos_gov' | 'historia';

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

  const [activeSubTab, setActiveSubTab] = useState<RadioSubTab>('aparelho');
  const [activeCategory, setActiveCategory] = useState<'state_anthems' | 'top5' | 'national'>(initialActiveCategory);
  const [currentEraId, setCurrentEraId] = useState<string>(() => selectedRadioEraId || getSavedDefaultRadioEraId());
  const [defaultEraId, setDefaultEraId] = useState<string>(() => getSavedDefaultRadioEraId());
  const [saveDefaultSuccess, setSaveDefaultSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (initialActiveCategory) {
      setActiveCategory(initialActiveCategory);
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

  // Update track when state changes
  useEffect(() => {
    const updated = getStateMusicalHeritage(activeStateId);
    setDialFrequency(updated.frequencyDialKHz);
    if (activeCategory === 'state_anthems') {
      setSelectedTrack(updated.stateAnthem);
    } else if (activeCategory === 'top5') {
      setSelectedTrack(updated.top5Tracks[0] || updated.stateAnthem);
    }
  }, [activeStateId, activeCategory]);

  const currentTrackIndex = currentCategoryTracks.findIndex((t) => t.id === selectedTrack.id);

  // Play / Pause toggle
  const handleTogglePlay = (track: SongTrack) => {
    if (selectedTrack.id === track.id && isPlaying) {
      vintageRadioEngine.stop();
      setIsPlaying(false);
    } else {
      setSelectedTrack(track);
      vintageRadioEngine.playTrack(track.frequenciesHz, track.tempoBpm);
      setIsPlaying(true);
    }
  };

  const handleTrackSelect = (track: SongTrack) => {
    audioEngine.playSfx('click');
    vintageRadioEngine.playTuningDialSfx();
    setSelectedTrack(track);
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
    vintageRadioEngine.setRadioEra(eraId);
    onSelectRadioEra?.(eraId);
  };

  const handleSaveAsDefaultEra = () => {
    audioEngine.playSfx('badge');
    saveDefaultRadioEraId(currentEraId);
    setDefaultEraId(currentEraId);
    setSaveDefaultSuccess(true);
    setTimeout(() => setSaveDefaultSuccess(false), 2500);
  };

  const isCurrentEraDefault = currentEraId === defaultEraId;

  return (
    <div
      id="painel-radio-vintage-player"
      className="painel-radio-vintage-player w-full h-full flex flex-col bg-slate-950/98 border-l border-amber-500/40 text-white overflow-hidden select-none"
    >
      {/* 1. TOPO: TÍTULO DO ESTADO & SINTONIA + SUB-ABAS */}
      <div className="p-3 border-b border-amber-900/60 bg-gradient-to-r from-[#1c0f07] via-[#2a170a] to-[#120803] flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <div>
              <h2 className="text-xs font-serif font-black tracking-wide text-amber-200 uppercase">
                {stateData.stateName} ({activeStateId}) • {dialFrequency} kHz
              </h2>
              <p className="text-[10px] text-amber-400/80 font-mono">
                {stateData.famousBroadcastingStation}
              </p>
            </div>
          </div>

          {/* Botão de Salvar como Rádio Padrão */}
          <button
            onClick={handleSaveAsDefaultEra}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer shadow-sm ${
              isCurrentEraDefault
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/60'
                : 'bg-slate-900 hover:bg-amber-950/80 text-slate-300 hover:text-amber-300 border-slate-700 hover:border-amber-500/60'
            }`}
            title="Definir este aparelho como seu rádio padrão nas próximas visitas"
          >
            {saveDefaultSuccess ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">Padrão Salvo!</span>
              </>
            ) : isCurrentEraDefault ? (
              <>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Rádio Padrão</span>
              </>
            ) : (
              <>
                <Star className="w-3 h-3 text-slate-400" />
                <span>Definir Padrão</span>
              </>
            )}
          </button>
        </div>

        {/* Sub-Abas do Rádio */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-[10px] font-mono font-bold">
          <button
            onClick={() => setActiveSubTab('aparelho')}
            className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeSubTab === 'aparelho'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3 h-3 shrink-0" />
            <span className="truncate">Aparelho</span>
          </button>

          <button
            onClick={() => setActiveSubTab('faixas')}
            className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeSubTab === 'faixas'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Music className="w-3 h-3 shrink-0" />
            <span className="truncate">Faixas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('hinos_gov')}
            className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeSubTab === 'hinos_gov'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3 h-3 shrink-0" />
            <span className="truncate">Símbolos .GOV</span>
          </button>

          <button
            onClick={() => setActiveSubTab('historia')}
            className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeSubTab === 'historia'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3 h-3 shrink-0" />
            <span className="truncate">História</span>
          </button>
        </div>
      </div>

      {/* 2. PLAYER DE CONTROLE CENTRAL (SEMPRE VISÍVEL COM BOTÕES ANTERIOR / PLAY / PRÓXIMO) */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 space-y-2 shrink-0">
        <div className="flex items-center justify-between gap-2">
          {/* Botões de Navegação de Faixa */}
          <div className="flex items-center gap-1.5">
            {/* Faixa Anterior */}
            <button
              onClick={handlePrevTrack}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 flex items-center justify-center transition cursor-pointer border border-slate-700"
              title="Faixa Anterior (⏮)"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play / Pause Principal */}
            <button
              onClick={() => handleTogglePlay(selectedTrack)}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer font-black"
              title={isPlaying ? 'Pausar Áudio' : 'Tocar Música'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-slate-950" />
              ) : (
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
              )}
            </button>

            {/* Próxima Faixa */}
            <button
              onClick={handleNextTrack}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 flex items-center justify-center transition cursor-pointer border border-slate-700"
              title="Próxima Faixa (⏭)"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Info da Faixa Ativa */}
          <div className="flex-1 min-w-0 px-2">
            <div className="text-xs font-serif font-black text-amber-200 truncate">
              {selectedTrack.title}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {selectedTrack.artist} {selectedTrack.genre ? `• ${selectedTrack.genre}` : ''}
            </div>
          </div>

          {/* Botões Válvula e Letra */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleToggleTubeFilter}
              className={`px-2 py-1 rounded-lg text-[9px] font-mono font-bold border transition-all cursor-pointer ${
                isTubeMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
              title="Emulação de Filtro Valvulado Vintage"
            >
              {isTubeMode ? 'VÁLVULA' : 'HI-FI'}
            </button>

            <button
              onClick={() => setShowLyricsModal(true)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-all cursor-pointer"
              title="Ver Letra Completa"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Volume & Indicador VU */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
          <button
            onClick={handleToggleMute}
            className="text-slate-400 hover:text-amber-300 transition cursor-pointer shrink-0"
            title={isMuted ? 'Desmutar' : 'Mutar'}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
          />
          <span className="text-[10px] font-mono text-slate-400 w-8 text-right font-bold shrink-0">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* 3. CONTEÚDO PRINCIPAL BASEADO NA SUB-ABA SELECIONADA */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        
        {/* SUB-ABA 1: APARELHO & ERAS DO RÁDIO */}
        {activeSubTab === 'aparelho' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Seletor de Eras */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold text-amber-400 flex items-center justify-between">
                <span>SELECIONE A ERA DO APARELHO DE RÁDIO</span>
                <span className="text-slate-400">Total: {VINTAGE_RADIO_ERAS.length} Eras</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {VINTAGE_RADIO_ERAS.map((era) => {
                  const isSelected = era.id === currentEraId;
                  const isEraDefault = era.id === defaultEraId;
                  return (
                    <button
                      key={era.id}
                      onClick={() => handleChangeEra(era.id)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 border-yellow-200 shadow-md font-bold'
                          : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-amber-600/60 hover:text-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-black">{era.decade}</span>
                        {isEraDefault && (
                          <Star className={`w-2.5 h-2.5 ${isSelected ? 'text-slate-950 fill-slate-950' : 'text-amber-400 fill-amber-400'}`} />
                        )}
                      </div>
                      <div className={`text-[9px] font-serif truncate ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                        {era.shortName}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ilustração do Gabinete */}
            <div className="relative flex flex-col items-center">
              <RadioCabinetIllustration
                eraId={currentEraId}
                isPlaying={isPlaying}
                frequencyKhz={dialFrequency}
                stationName={`${stateData.famousBroadcastingStation} (${activeStateId})`}
                vuLevel={vuMeterLevel}
                isTubeWarm={isTubeMode}
              />
            </div>

            {/* Destaque Cultural da Era */}
            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-600/40 space-y-1.5 shadow-md">
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

              <div className="text-[11px] text-slate-300 font-sans leading-relaxed">
                <strong className="text-amber-300 font-semibold">Artistas:</strong> {stateEraHighlights.keyArtists}
              </div>

              <div className="text-[10px] text-slate-400 font-sans italic border-t border-amber-900/60 pt-1">
                "{stateEraHighlights.historicalFact}"
              </div>
            </div>
          </div>
        )}

        {/* SUB-ABA 2: PLAYLIST & FAIXAS */}
        {activeSubTab === 'faixas' && (
          <div className="space-y-3 animate-in fade-in duration-200">
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
                <span>Hinos do Estado</span>
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
                <span>Top 5 Regionais</span>
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
                <span>Hinos Nacionais</span>
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
                    <div className="flex items-center gap-2.5 truncate">
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

                      <div className="truncate">
                        <div className={`text-xs font-serif font-bold truncate ${isCurrent ? 'text-amber-200' : 'text-slate-200'}`}>
                          {track.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans truncate">
                          {track.artist} {track.year ? `(${track.year})` : ''} • {track.genre}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePlay(track);
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                        isCurrent && isPlaying
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:text-amber-300'
                      }`}
                    >
                      {isCurrent && isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB-ABA 3: HINOS NACIONAIS & SÍMBOLOS .GOV */}
        {activeSubTab === 'hinos_gov' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-600/40 text-xs text-slate-300 space-y-1">
              <div className="font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-yellow-400" />
                Acervo dos Símbolos Nacionais do Brasil (.GOV)
              </div>
              <p className="text-[11px] text-slate-400">
                Documentação oficial da Biblioteca da Presidência da República com a história dos 4 grandes hinos da soberania brasileira.
              </p>
            </div>

            <div className="space-y-2">
              {GOV_NATIONAL_SYMBOLS.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-xs text-amber-200">
                        {item.title}
                      </h4>
                      <span className="text-[9px] font-mono text-slate-400">{item.year}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans">
                      {item.description}
                    </p>

                    <div className="text-[10px] text-slate-400">
                      <strong>Autoria:</strong> {item.authors}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          const matchingTrack = NATIONAL_CIVIC_ANTHEMS.find((t) => t.id === item.id);
                          if (matchingTrack) {
                            handleTrackSelect(matchingTrack);
                          }
                        }}
                        className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-bold text-[10px] flex items-center gap-1 cursor-pointer transition"
                      >
                        <Play className="w-3 h-3" />
                        <span>Ouvir no Rádio</span>
                      </button>

                      <a
                        href={item.govUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-amber-400/90 hover:text-amber-200 flex items-center gap-1 font-mono"
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

        {/* SUB-ABA 4: HISTÓRIA & LETRA */}
        {activeSubTab === 'historia' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-xs font-serif font-black text-amber-300">
                {selectedTrack.title}
              </div>
              <div className="text-[10px] text-slate-400">
                {selectedTrack.artist} • {selectedTrack.genre}
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                <div className="text-[9px] font-mono font-bold text-amber-400 mb-1">CURIOSIDADE DO ACERVO HISTÓRICO</div>
                {selectedTrack.historicalCuriosityPt}
              </div>
            </div>

            {selectedTrack.fullLyricsPt && (
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold text-slate-400">LETRA COMPLETA OFICIAL</div>
                <pre className="p-3 rounded-2xl bg-slate-950 font-serif text-slate-200 text-xs leading-relaxed whitespace-pre-wrap border border-slate-800">
                  {selectedTrack.fullLyricsPt}
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
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-500/60 rounded-2xl shadow-2xl p-5 space-y-4 max-h-[85vh] flex flex-col text-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-serif font-black text-amber-300">{selectedTrack.title}</h3>
                <p className="text-xs text-slate-400">{selectedTrack.artist} • {selectedTrack.genre}</p>
              </div>
              <button
                onClick={() => setShowLyricsModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] font-mono font-bold text-amber-400 mb-1">CURIOSIDADE DO ACERVO HISTÓRICO</div>
                <p className="text-slate-300 leading-relaxed font-sans">{selectedTrack.historicalCuriosityPt}</p>
              </div>

              {selectedTrack.fullLyricsPt && (
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">LETRA COMPLETA OFICIAL</div>
                  <pre className="p-4 rounded-xl bg-slate-950 font-serif text-slate-200 text-xs leading-relaxed whitespace-pre-wrap border border-slate-800">
                    {selectedTrack.fullLyricsPt}
                  </pre>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowLyricsModal(false)}
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-black text-xs cursor-pointer shadow-md"
            >
              Fechar Letra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
