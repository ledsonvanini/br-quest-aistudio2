import React, { useState, useEffect } from 'react';
import {
  X,
  Leaf,
  Bug,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  ExternalLink,
  BookOpen,
  Info,
  Trees,
  Award,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Dna,
  Share2,
} from 'lucide-react';
import { StateBiodiversityProfile, BiodiversitySpecimen, BiodiversityKingdom, BrazilBiome } from '../../types';
import { STATE_BIODIVERSITY_PROFILES, IUCN_STATUS_LABELS, BIOME_COLORS, getSpecimensByState } from '../../data/brazilBiodiversityData';
import { BRAZIL_STATES_REGISTRY } from '../../data/brazilStatesRegistry';
import { biodiversityService, GbifTaxonMatch, IbamaSisCitesPackage, WikipediaSummaryResponse } from '../../services/biodiversityService';
import { audioEngine } from '../../lib/audioSynth';
import { BiodiversityImage } from '../common/BiodiversityImage';

interface StateBiodiversityDialogProps {
  stateId: string | null;
  onClose: () => void;
  initialTab?: 'geral' | 'fauna' | 'flora' | 'fungos_micro' | 'ameacadas' | 'siscites';
  activeKingdomFilter?: BiodiversityKingdom | 'all';
  isThreatenedOnly?: boolean;
  onSelectSpecimenDetail?: (specimen: BiodiversitySpecimen) => void;
}

export const StateBiodiversityDialog: React.FC<StateBiodiversityDialogProps> = ({
  stateId,
  onClose,
  initialTab,
  activeKingdomFilter = 'all',
  isThreatenedOnly = false,
  onSelectSpecimenDetail,
}) => {
  const computeDefaultTab = () => {
    if (initialTab) return initialTab;
    if (activeKingdomFilter === 'fauna') return 'fauna';
    if (activeKingdomFilter === 'flora') return 'flora';
    if (activeKingdomFilter === 'fungi_micro') return 'fungos_micro';
    if (isThreatenedOnly) return 'ameacadas';
    return 'geral';
  };

  const [activeTab, setActiveTab] = useState<'geral' | 'fauna' | 'flora' | 'fungos_micro' | 'ameacadas' | 'siscites'>(computeDefaultTab);
  const [coatOfArmsError, setCoatOfArmsError] = useState<boolean>(false);
  const [selectedSpecimen, setSelectedSpecimen] = useState<BiodiversitySpecimen | null>(null);
  const [gbifData, setGbifData] = useState<GbifTaxonMatch | null>(null);
  const [wikiSummary, setWikiSummary] = useState<WikipediaSummaryResponse | null>(null);
  const [ibamaPkg, setIbamaPkg] = useState<IbamaSisCitesPackage | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

  const profile: StateBiodiversityProfile | undefined = stateId ? STATE_BIODIVERSITY_PROFILES[stateId] : undefined;
  const registryInfo = stateId ? BRAZIL_STATES_REGISTRY[stateId] : undefined;
  const stateSpecimens = stateId ? getSpecimensByState(stateId) : [];

  // Reset selected specimen & align tab with active filter when state opens
  useEffect(() => {
    setSelectedSpecimen(null);
    setGbifData(null);
    setWikiSummary(null);
    setCoatOfArmsError(false);
    setActiveTab(computeDefaultTab());
  }, [stateId, initialTab, activeKingdomFilter, isThreatenedOnly]);

  // Load IBAMA SisCITES metadata once
  useEffect(() => {
    biodiversityService.fetchIbamaSisCitesMetadata().then((res) => {
      if (res) setIbamaPkg(res);
    });
  }, []);

  // Fetch dynamic enrichment (GBIF + Wikipedia) when a specimen is inspected
  useEffect(() => {
    if (!selectedSpecimen) return;
    setIsLoadingDetails(true);

    Promise.allSettled([
      biodiversityService.matchGbifTaxon(selectedSpecimen.scientificName),
      biodiversityService.fetchWikipediaSummary(selectedSpecimen.namePt),
    ]).then(([gbifRes, wikiRes]) => {
      if (gbifRes.status === 'fulfilled' && gbifRes.value) {
        setGbifData(gbifRes.value);
      } else {
        setGbifData(null);
      }
      if (wikiRes.status === 'fulfilled' && wikiRes.value) {
        setWikiSummary(wikiRes.value);
      } else {
        setWikiSummary(null);
      }
      setIsLoadingDetails(false);
    });
  }, [selectedSpecimen]);

  if (!stateId || !profile) return null;

  const stateName = profile.stateName;

  // Filtragem por aba e busca
  const filterByTab = (specimens: BiodiversitySpecimen[]) => {
    let list = specimens;
    if (activeTab === 'fauna') list = list.filter((s) => s.kingdom === 'fauna');
    if (activeTab === 'flora') list = list.filter((s) => s.kingdom === 'flora');
    if (activeTab === 'fungos_micro') list = list.filter((s) => s.kingdom === 'fungi_micro');
    if (activeTab === 'ameacadas') list = list.filter((s) => ['CR', 'EN', 'VU'].includes(s.iucnStatus) || ['CR', 'EN', 'VU'].includes(s.icmbioStatus));

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.namePt.toLowerCase().includes(term) ||
          s.scientificName.toLowerCase().includes(term) ||
          s.subcategoryPt.toLowerCase().includes(term)
      );
    }
    return list;
  };

  const displayedSpecimens = filterByTab(stateSpecimens);

  return (
    <div
      id="dialog-biodiversidade-estado"
      data-scrollable="true"
      className="modal-dialog-biodiversidade-estado fixed top-[62px] sm:top-[66px] bottom-[58px] sm:bottom-[62px] left-2 sm:left-4 md:left-6 z-40 w-[calc(100vw-16px)] sm:w-[540px] md:w-[600px] max-w-[calc(100vw-16px)] bg-slate-950/98 sm:bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.9),0_0_24px_rgba(16,185,129,0.25)] flex flex-col text-slate-100 animate-in fade-in slide-in-from-left-4 duration-300 select-text overflow-hidden cursor-default pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* Puxador em telas móveis */}
      <div className="w-10 h-1 bg-slate-700/80 rounded-full mx-auto sm:hidden mt-2 -mb-1 shrink-0" />

      {/* 1. Header do Diálogo com Brasão e Identidade Ecológica */}
      <div className="flex items-center justify-between p-2.5 sm:p-3 md:p-3.5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/80 via-slate-900/95 to-slate-950 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {registryInfo?.coatOfArmsUrl && !coatOfArmsError ? (
            <img
              src={registryInfo.coatOfArmsUrl}
              alt={`Brasão ${stateName}`}
              referrerPolicy="no-referrer"
              onError={() => setCoatOfArmsError(true)}
              className="w-8 h-9 sm:w-9 sm:h-10 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] shrink-0"
            />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center font-black text-emerald-300 text-xs sm:text-sm shadow-inner shrink-0 font-mono">
              {stateId}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono text-[11px] font-black tracking-wider shrink-0">
                {stateId}
              </span>
              <h3 className="font-serif font-black text-sm sm:text-base md:text-lg text-white tracking-wide truncate">
                {stateName}
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium truncate mt-0.5">
              Biomas: <strong className="text-emerald-300">{profile.predominantBiomes.join(' • ')}</strong> • Região {profile.region}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <button
            id="btn-fechar-dialog-biodiversidade"
            type="button"
            onClick={onClose}
            className="btn-fechar-painel p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600/80 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 touch-manipulation min-w-[34px] min-h-[34px] flex items-center justify-center"
            title="Fechar foco e restaurar visão do mapa (Esc)"
          >
            <X className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      </div>

      {/* 2. Barra de Abas */}
      <div className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800/80 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => {
            audioEngine.playSfx('click');
            setActiveTab('geral');
            setSelectedSpecimen(null);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'geral'
              ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>Visão Geral</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playSfx('click');
            setActiveTab('fauna');
            setSelectedSpecimen(null);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'fauna'
              ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
          }`}
        >
          <Bug className="w-3.5 h-3.5" />
          <span>Fauna</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playSfx('click');
            setActiveTab('flora');
            setSelectedSpecimen(null);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'flora'
              ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
          }`}
        >
          <Trees className="w-3.5 h-3.5" />
          <span>Flora</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playSfx('click');
            setActiveTab('fungos_micro');
            setSelectedSpecimen(null);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'fungos_micro'
              ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fungos & Microrganismos</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playSfx('click');
            setActiveTab('ameacadas');
            setSelectedSpecimen(null);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'ameacadas'
              ? 'bg-rose-500 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Livro Vermelho</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playSfx('click');
            setActiveTab('siscites');
            setSelectedSpecimen(null);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'siscites'
              ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>IBAMA SisCITES</span>
        </button>
      </div>

      {/* 3. Conteúdo Rolável */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-4 custom-scrollbar">
        
        {/* ================================================================ */}
        {/* DETALHE EXPANDIDO DO ESPÉCIME SELECIONADO                         */}
        {/* ================================================================ */}
        {selectedSpecimen ? (
          <div className="card-especime-detalhe-completo bg-slate-900/90 border border-emerald-500/50 rounded-xl p-3.5 sm:p-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-black border ${IUCN_STATUS_LABELS[selectedSpecimen.iucnStatus].colorBg} ${IUCN_STATUS_LABELS[selectedSpecimen.iucnStatus].colorText} ${IUCN_STATUS_LABELS[selectedSpecimen.iucnStatus].colorBorder}`}>
                    IUCN: {IUCN_STATUS_LABELS[selectedSpecimen.iucnStatus].short}
                  </span>
                  {selectedSpecimen.isEndemicBrazil && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/50">
                      Endêmica do Brasil
                    </span>
                  )}
                  {selectedSpecimen.citesAppendix && selectedSpecimen.citesAppendix !== 'Não listada' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/50">
                      CITES Anexo {selectedSpecimen.citesAppendix}
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-black text-base sm:text-lg text-white mt-1">
                  {selectedSpecimen.namePt}
                </h4>
                <p className="text-xs text-emerald-300 font-mono italic">
                  {selectedSpecimen.scientificName}
                </p>
              </div>

              <button
                onClick={() => setSelectedSpecimen(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Voltar à lista"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Imagem em alta definição */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video sm:aspect-[21/9] max-h-56">
              <BiodiversityImage
                src={selectedSpecimen.imageUrl}
                alt={selectedSpecimen.namePt}
                kingdom={selectedSpecimen.kingdom}
                fallbackSrc={selectedSpecimen.thumbnailUrl}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-slate-300 pointer-events-none">
                <span>{selectedSpecimen.subcategoryPt}</span>
                <span className="bg-slate-950/80 px-2 py-0.5 rounded backdrop-blur">
                  Biomas: {selectedSpecimen.biomes.join(', ')}
                </span>
              </div>
            </div>

            {/* Taxonomia Científica */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-2">
                <Dna className="w-3.5 h-3.5" />
                <span>Classificação Taxonômica Oficial (SiBBr / GBIF)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Reino</span>
                  <span className="text-slate-200 font-semibold">{selectedSpecimen.taxonomicRank.reino}</span>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Filo/Divisão</span>
                  <span className="text-slate-200 font-semibold">{selectedSpecimen.taxonomicRank.filoOuDivisao}</span>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Classe</span>
                  <span className="text-slate-200 font-semibold">{selectedSpecimen.taxonomicRank.classe}</span>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Ordem</span>
                  <span className="text-slate-200 font-semibold">{selectedSpecimen.taxonomicRank.ordem}</span>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Família</span>
                  <span className="text-slate-200 font-semibold">{selectedSpecimen.taxonomicRank.familia}</span>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Gênero</span>
                  <span className="text-slate-200 font-semibold italic">{selectedSpecimen.taxonomicRank.genero}</span>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800 col-span-2">
                  <span className="text-slate-500 block text-[9px] uppercase">Espécie</span>
                  <span className="text-emerald-300 font-mono font-bold italic">{selectedSpecimen.taxonomicRank.especie}</span>
                </div>
              </div>
            </div>

            {/* Papel Ecológico & Habitat */}
            <div className="space-y-2 text-xs">
              <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-emerald-300 block mb-0.5">Papel Ecológico:</strong>
                <p className="text-slate-300 leading-relaxed">{selectedSpecimen.ecologicalRolePt}</p>
              </div>

              <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-amber-300 block mb-0.5">Habitat Natural:</strong>
                <p className="text-slate-300 leading-relaxed">{selectedSpecimen.habitatPt}</p>
              </div>
            </div>

            {/* Curiosidades */}
            {selectedSpecimen.curiositiesPt && selectedSpecimen.curiositiesPt.length > 0 && (
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curiosidades & Fatos Notáveis</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {selectedSpecimen.curiositiesPt.map((curiosity, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{curiosity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Regulamentação IBAMA SisCITES */}
            {selectedSpecimen.ibamaSisCitesInfo && (
              <div className="bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Controle Ambiental & SisCITES (IBAMA / MMA)</span>
                </div>
                <p className="text-xs text-slate-300">
                  {selectedSpecimen.ibamaSisCitesInfo.monitoringCategory}
                </p>
                <p className="text-[11px] text-cyan-400/80 font-mono">
                  Base Legal: {selectedSpecimen.ibamaSisCitesInfo.legalFramework}
                </p>
              </div>
            )}

            {/* Enriquecimento Wikipedia ao vivo se disponível */}
            {wikiSummary && (
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    Verbete Enciclopédico (Wikispecies / Commons)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {wikiSummary.extract}
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* ================================================================ */}
        {/* ABA: VISÃO GERAL                                                 */}
        {/* ================================================================ */}
        {activeTab === 'geral' && !selectedSpecimen && (
          <div className="space-y-4">
            {/* Resumo Biológico */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <Leaf className="w-4 h-4" />
                <span>Patrimônio Biológico de {stateName}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {profile.biodiversitySummaryPt}
              </p>
            </div>

            {/* Métricas Principais */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Espécies Catalogadas</span>
                <span className="text-base sm:text-lg font-black text-emerald-300 font-mono">
                  ~{profile.totalKnownSpeciesEst.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Espécies Ameaçadas</span>
                <span className="text-base sm:text-lg font-black text-rose-400 font-mono">
                  {profile.threatenedSpeciesCount}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Endemismos</span>
                <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
                  {profile.endemicSpeciesCount}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">UFs de Conservação</span>
                <span className="text-base sm:text-lg font-black text-cyan-300 font-mono">
                  {profile.protectedAreasCount} UCs
                </span>
              </div>
            </div>

            {/* Espécies Símbolo */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Espécies Símbolo do Estado</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Fauna Emblemática</span>
                  <span className="font-serif font-bold text-white block mt-0.5">{profile.flagshipFauna}</span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Flora Símbolo</span>
                  <span className="font-serif font-bold text-white block mt-0.5">{profile.flagshipFlora}</span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Fungos & Microbioma</span>
                  <span className="font-serif font-bold text-white block mt-0.5">{profile.flagshipFungusOrMicro}</span>
                </div>
              </div>
            </div>

            {/* Lista de Espécimes em Destaque */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Espécies Nativas Catalogadas ({stateSpecimens.length})</span>
                </h4>
                <span className="text-[11px] text-slate-400">Clique para inspecionar taxonomia</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stateSpecimens.map((specimen) => (
                  <div
                    key={specimen.id}
                    onClick={() => {
                      audioEngine.playSfx('click');
                      setSelectedSpecimen(specimen);
                    }}
                    className="card-especime-item flex items-center gap-3 p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-850 cursor-pointer transition group"
                  >
                    <BiodiversityImage
                      src={specimen.thumbnailUrl || specimen.imageUrl}
                      alt={specimen.namePt}
                      kingdom={specimen.kingdom}
                      fallbackSrc={specimen.imageUrl}
                      containerClassName="w-12 h-12 rounded-lg border border-slate-700 shrink-0"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-serif font-bold text-xs text-white truncate group-hover:text-emerald-300 transition-colors">
                          {specimen.namePt}
                        </h5>
                        <span className={`text-[9px] px-1 py-0.2 rounded border font-mono font-bold ${IUCN_STATUS_LABELS[specimen.iucnStatus].colorBg} ${IUCN_STATUS_LABELS[specimen.iucnStatus].colorText} ${IUCN_STATUS_LABELS[specimen.iucnStatus].colorBorder}`}>
                          {specimen.iucnStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic truncate font-mono">
                        {specimen.scientificName}
                      </p>
                      <span className="text-[10px] text-slate-500 truncate block">
                        {specimen.subcategoryPt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* ABAS ESPECÍFICAS (FAUNA, FLORA, FUNGOS, AMEAÇADAS)               */}
        {/* ================================================================ */}
        {activeTab !== 'geral' && activeTab !== 'siscites' && !selectedSpecimen && (
          <div className="space-y-3">
            {/* Campo de Busca Rápida */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome popular, científico ou classe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {displayedSpecimens.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                Nenhum espécime encontrado com os filtros atuais.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {displayedSpecimens.map((specimen) => (
                  <div
                    key={specimen.id}
                    onClick={() => {
                      audioEngine.playSfx('click');
                      setSelectedSpecimen(specimen);
                    }}
                    className="card-especime-detalhe-item p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-850 cursor-pointer transition space-y-2 group"
                  >
                    <div className="flex items-start gap-3">
                      <BiodiversityImage
                        src={specimen.thumbnailUrl || specimen.imageUrl}
                        alt={specimen.namePt}
                        kingdom={specimen.kingdom}
                        fallbackSrc={specimen.imageUrl}
                        containerClassName="w-16 h-16 rounded-xl border border-slate-700 shrink-0"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h5 className="font-serif font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                            {specimen.namePt}
                          </h5>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full border font-mono font-bold ${IUCN_STATUS_LABELS[specimen.iucnStatus].colorBg} ${IUCN_STATUS_LABELS[specimen.iucnStatus].colorText} ${IUCN_STATUS_LABELS[specimen.iucnStatus].colorBorder}`}>
                            {IUCN_STATUS_LABELS[specimen.iucnStatus].short}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-400 font-mono italic">
                          {specimen.scientificName}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {specimen.subcategoryPt} • Biomas: {specimen.biomes.join(', ')}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {specimen.ecologicalRolePt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* ABA: IBAMA SisCITES & DADOS ABERTOS                               */}
        {/* ================================================================ */}
        {activeTab === 'siscites' && !selectedSpecimen && (
          <div className="space-y-4 text-xs">
            <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-cyan-300 uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>Integração SisCITES • Dados Abertos IBAMA</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                O Sistema de Emissão de Licenças CITES (SisCITES) do Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis (IBAMA) controla a exportação, reexportação e importação de animais e plantas silvestres ameaçados de extinção no Brasil.
              </p>
            </div>

            {ibamaPkg && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Repositório Conectado</span>
                <h5 className="font-serif font-bold text-sm text-white">{ibamaPkg.title}</h5>
                <p className="text-slate-400 text-[11px]">{ibamaPkg.notes || 'Conjunto de dados governamentais abertos do MMA/IBAMA.'}</p>
                <div className="flex items-center justify-between text-[11px] text-cyan-300 pt-1 border-t border-slate-800">
                  <span>Licença: {ibamaPkg.licenseTitle}</span>
                  <a
                    href={ibamaPkg.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline text-cyan-400"
                  >
                    <span>Acessar portal IBAMA</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <h5 className="font-bold text-slate-300 uppercase tracking-wider">Categorias de Monitoramento CITES</h5>
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <strong className="text-rose-400">Anexo I:</strong> Espécies ameaçadas de extinção cujo comércio internacional só é autorizado em circunstâncias excepcionais (fins estritamente científicos).
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <strong className="text-amber-400">Anexo II:</strong> Espécies que, embora atualmente não estejam necessariamente sob perigo de extinção, podem vir a ficar se seu comércio não for estritamente controlado.
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <strong className="text-cyan-400">Anexo III:</strong> Espécies sujeitas à regulamentação em qualquer país que requeira a cooperação de outros membros da convenção.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Footer com Ações */}
      <div className="p-2.5 sm:p-3 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fontes: ICMBio • JBRJ • IBAMA SisCITES • GBIF</span>
        </span>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
