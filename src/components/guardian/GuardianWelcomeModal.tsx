import React, { useState } from 'react';
import { GuardianData } from '../../types';
import { getCoatOfArmsUrl } from '../../data/coatOfArms';
import { getStateFlagUrl } from '../../data/brazilStatesRegistry';
import { STATE_CAPITAL_GEO_DATA } from '../../data/stateCapitalGeoData';
import { getGuardianSpeech } from '../../data/guardianPhrases';
import { audioEngine } from '../../lib/audioSynth';
import {
  Swords,
  Compass,
  BookOpen,
  Landmark,
  TreePine,
  Sparkles,
  Award,
  ChevronRight,
  Shield,
  Clock,
  CloudSun,
  MapPin,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';

interface GuardianWelcomeModalProps {
  guardian: GuardianData;
  onChooseChallenge: () => void;
  onChooseExploreLand: () => void;
  onCloseWelcome?: () => void;
}

export const GuardianWelcomeModal: React.FC<GuardianWelcomeModalProps> = ({
  guardian,
  onChooseChallenge,
  onChooseExploreLand,
  onCloseWelcome,
}) => {
  const [selectedTab, setSelectedTab] = useState<'geral' | 'historia' | 'cultura' | 'natureza'>('geral');
  const speech = getGuardianSpeech(guardian.id);
  const coatUrl = getCoatOfArmsUrl(guardian.id);
  const flagUrl = getStateFlagUrl(guardian.id);
  const capitalData = STATE_CAPITAL_GEO_DATA[guardian.id];

  // Local Time
  const localTimeString = React.useMemo(() => {
    const now = new Date();
    let offsetHours = -3;
    if (guardian.id === 'AC') offsetHours = -5;
    else if (['AM', 'RR', 'RO', 'MT', 'MS'].includes(guardian.id)) offsetHours = -4;
    else if (guardian.id === 'FN') offsetHours = -2;

    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const targetDate = new Date(utcTime + 3600000 * offsetHours);
    return targetDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }, [guardian.id]);

  const handleChallenge = () => {
    audioEngine.playSfx('travel');
    onChooseChallenge();
  };

  const handleExplore = () => {
    audioEngine.playSfx('click');
    onChooseExploreLand();
  };

  return (
    <div
      id="modal-boas-vindas-guardiao"
      className="modal-boas-vindas-guardiao fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="card-boas-vindas-conteudo relative w-full max-w-2xl bg-slate-950/95 border-2 border-amber-400 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.98),0_0_35px_rgba(245,158,11,0.35)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header with State Identification and Close Option */}
        <div className="cabecalho-boas-vindas relative p-4 sm:p-5 border-b border-amber-500/30 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
          <div className="flex items-center gap-3 min-w-0">
            {/* Coat of arms frame */}
            <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-slate-900 border-2 border-amber-400/80 p-1 flex items-center justify-center shadow-lg shrink-0">
              <img
                src={coatUrl || flagUrl}
                alt={`Brasão de ${guardian.stateNamePt}`}
                className="w-full h-full object-contain filter drop-shadow"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/50">
                  {guardian.id}
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1 font-serif">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  Região {guardian.regionId.toUpperCase()} • Cap. {guardian.capitalPt}
                </span>
              </div>
              <h2 className="font-serif font-black text-lg sm:text-2xl text-amber-200 truncate">
                {guardian.stateNamePt}
              </h2>
              <p className="font-serif text-xs sm:text-sm text-amber-400/90 font-medium truncate flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                {guardian.guardianTitlePt}
              </p>
            </div>
          </div>

          {onCloseWelcome && (
            <button
              onClick={onCloseWelcome}
              className="btn-fechar-boas-vindas p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-400 transition cursor-pointer shrink-0"
              title="Entrar diretamente"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Tabs (Geral, História, Cultura, Natureza) */}
        <div className="seletor-abas-boas-vindas flex items-center gap-1.5 px-4 pt-3 pb-1 border-b border-slate-800/80 overflow-x-auto custom-scrollbar bg-slate-900/40">
          <button
            onClick={() => setSelectedTab('geral')}
            className={`px-3 py-1.5 rounded-xl font-serif text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              selectedTab === 'geral'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-amber-300 bg-slate-900 border border-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Boas-Vindas</span>
          </button>
          <button
            onClick={() => setSelectedTab('historia')}
            className={`px-3 py-1.5 rounded-xl font-serif text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              selectedTab === 'historia'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-amber-300 bg-slate-900 border border-slate-800'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>História & Heróis</span>
          </button>
          <button
            onClick={() => setSelectedTab('cultura')}
            className={`px-3 py-1.5 rounded-xl font-serif text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              selectedTab === 'cultura'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-amber-300 bg-slate-900 border border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cultura & Sabores</span>
          </button>
          <button
            onClick={() => setSelectedTab('natureza')}
            className={`px-3 py-1.5 rounded-xl font-serif text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              selectedTab === 'natureza'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-amber-300 bg-slate-900 border border-slate-800'
            }`}
          >
            <TreePine className="w-3.5 h-3.5" />
            <span>Natureza & Bioma</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="corpo-boas-vindas flex-1 p-4 sm:p-5 overflow-y-auto custom-scrollbar-gold space-y-4">
          {selectedTab === 'geral' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              {/* Guardian Greeting Callout */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200">
                <p className="text-sm sm:text-base font-serif font-bold text-amber-300 leading-snug">
                  {speech.greeting}
                </p>
                <p className="text-xs sm:text-sm text-slate-200 font-serif leading-relaxed mt-1.5">
                  {speech.welcomeIntro}
                </p>
                <p className="text-xs text-amber-400 font-serif italic mt-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {speech.regionalCalling}
                </p>
              </div>

              {/* 3 Highlights Quick Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    Horário Local
                  </span>
                  <span className="font-mono font-bold text-amber-300 text-sm mt-1">{localTimeString}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <CloudSun className="w-3 h-3 text-sky-400" />
                    Clima
                  </span>
                  <span className="font-bold text-slate-100 text-xs sm:text-sm truncate mt-1">
                    {capitalData?.defaultClimate || 'Tropical'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Flor Símbolo
                  </span>
                  <span className="font-bold text-slate-100 text-xs sm:text-sm truncate mt-1">
                    {capitalData?.typicalFlower ? `${capitalData.typicalFlower.icon} ${capitalData.typicalFlower.name}` : guardian.floraPt}
                  </span>
                </div>
              </div>

              {/* State Lore Summary */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-serif font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  Tradições & Identidade do Estado
                </h4>
                <p className="text-xs text-slate-300 font-serif leading-relaxed">
                  {guardian.loreStoryPt || guardian.garbDescriptionPt}
                </p>
              </div>
            </div>
          )}

          {selectedTab === 'historia' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  {speech.welcomeDetails.historyTitle}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-serif leading-relaxed">
                  {speech.welcomeDetails.historyText}
                </p>
              </div>

              {guardian.famousIcons && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 font-serif block mb-1.5">
                    Personalidades & Heróis Ilustres:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {guardian.famousIcons.map((iconName, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-amber-200 font-serif text-xs font-medium"
                      >
                        {iconName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'cultura' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  {speech.welcomeDetails.cultureTitle}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-serif leading-relaxed">
                  {speech.welcomeDetails.cultureText}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-amber-400 font-bold block mb-0.5">Prato Típico:</span>
                  <span className="text-slate-200 font-serif">{guardian.typicalDishPt}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-amber-400 font-bold block mb-0.5">Música & Folclore:</span>
                  <span className="text-slate-200 font-serif">{guardian.musicAndCulturePt}</span>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'natureza' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm">
                  <TreePine className="w-4 h-4 text-amber-400" />
                  {speech.welcomeDetails.natureTitle}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-serif leading-relaxed">
                  {speech.welcomeDetails.natureText}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-emerald-400 font-bold block mb-0.5">Fauna Nativa:</span>
                  <span className="text-slate-200 font-serif">{guardian.faunaPt}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-emerald-400 font-bold block mb-0.5">Flora Típica:</span>
                  <span className="text-slate-200 font-serif">{guardian.floraPt}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom User Action Buttons: "Desafiar" vs "Conheça Minha Terra" */}
        <div className="rodape-acoes-boas-vindas p-4 sm:p-5 border-t border-amber-500/30 bg-slate-950 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Opção 1: Conheça Minha Terra */}
          <button
            id="btn-escolha-conheca-terra"
            onClick={handleExplore}
            className="btn-conheca-minha-terra group w-full py-3 px-4 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 border-2 border-amber-500/50 hover:border-amber-400 font-serif font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Compass className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
            <span>Conheça Minha Terra (Explorar)</span>
          </button>

          {/* Opção 2: Desafiar (Quiz de Honra) */}
          <button
            id="btn-escolha-desafiar-guardiao"
            onClick={handleChallenge}
            className="btn-desafiar-guardiao group w-full py-3 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-serif font-black text-sm shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Swords className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>Desafiar (+300 XP & Insígnia)</span>
            <ChevronRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
