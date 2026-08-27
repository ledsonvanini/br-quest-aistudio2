import React from 'react';
import {
  HelpCircle,
  X,
  Compass,
  Shield,
  Music,
  CloudSun,
  Database,
  Award,
  Sparkles,
  BookOpen,
  Scale,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { audioEngine } from '../lib/audioSynth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutInfoModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-saiba-mais-brquest"
      className="modal-saiba-mais fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          audioEngine.playSfx('click');
          onClose();
        }
      }}
    >
      <div className="container-modal-conteudo relative w-full max-w-3xl max-h-[90vh] bg-slate-950/95 border-2 border-amber-500/70 rounded-3xl shadow-2xl text-slate-100 font-sans flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="cabecalho-modal-saiba-mais flex items-center justify-between border-b border-amber-500/30 p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shadow-md shadow-amber-500/10">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-serif font-black text-amber-300 tracking-wide">
                  BR Quest — Saiba Mais
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  v1.0 • Cultural & Educativo
                </span>
              </div>
              <p className="text-xs text-slate-400 font-serif">
                Os Guardiões da Cultura do Brasil • Filosofia, Fontes e Diretrizes
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.playSfx('click');
              onClose();
            }}
            className="btn-fechar-modal-saiba-mais p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-900 border border-transparent hover:border-amber-500/40 transition cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="corpo-modal-saiba-mais flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-gold-vertical text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          
          {/* 1. O que é o BR Quest */}
          <section className="secao-o-que-e bg-slate-900/80 rounded-2xl p-4 border border-amber-500/25 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm sm:text-base">
              <Compass className="w-4 h-4 text-amber-400" />
              <h3>1. O que é o BR Quest?</h3>
            </div>
            <p>
              O <strong className="text-amber-200">BR Quest</strong> é uma plataforma interativa de exploração cartográfica, pedagógica e cultural do território brasileiro. Unindo uma representação 3D isométrica ortogonal do relevo nacional com a mecânica de RPG dos <em>27 Guardiões Estaduais</em>, o projeto permite navegar, aprender e valorizar a herança histórica e geográfica de todas as 27 Unidades da Federação.
            </p>
          </section>

          {/* 2. Filosofia & Objetivos */}
          <section className="secao-filosofia bg-slate-900/80 rounded-2xl p-4 border border-amber-500/25 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm sm:text-base">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h3>2. Filosofia & Objetivos</h3>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300 marker:text-amber-400">
              <li>
                <strong className="text-slate-100">Valorização da Diversidade Regional:</strong> Celebrar as singularidades dos 6 biomas brasileiros (Amazônia, Caatinga, Cerrado, Mata Atlântica, Pampa e Pantanal) e das 5 macrorregiões.
              </li>
              <li>
                <strong className="text-slate-100">Educação Cívica e Histórica:</strong> Oferecer acesso intuitivo aos hinos estaduais oficiais, lendas folclóricas, heráldica cívica (brasões) e marcos geográficos.
              </li>
              <li>
                <strong className="text-slate-100">Gamificação e Engajamento:</strong> Estimular o aprendizado ativo por meio de quizzes temáticos, insígnias sagradas e progressão de nível de Guardião.
              </li>
            </ul>
          </section>

          {/* 3. Origem dos Dados & Fontes Cartográficas */}
          <section className="secao-fontes-dados bg-slate-900/80 rounded-2xl p-4 border border-cyan-500/30 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-serif font-bold text-sm sm:text-base">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3>3. De onde vêm os Dados?</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-slate-200 block mb-0.5">🗺️ Cartografia & Malhas Vetoriais</span>
                <p className="text-slate-400">IBGE (Instituto Brasileiro de Geografia e Estatística) e bases públicas OpenStreetMap.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-slate-200 block mb-0.5">🌦️ Telemetria & Clima</span>
                <p className="text-slate-400">INMET (Instituto Nacional de Meteorologia), INPE e reanálises meteorológicas ECMWF / Open-Meteo.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-slate-200 block mb-0.5">⛰️ Topografia & Relevo</span>
                <p className="text-slate-400">Modelos de Elevação Digital NASA SRTM e sombreamento cartográfico contínuo.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-slate-200 block mb-0.5">🌱 Biodiversidade & Espécies</span>
                <p className="text-slate-400">iNaturalist Research Grade BR, GBIF (Global Biodiversity Facility), JBRJ (Flora e Funga do Brasil / Reflora) e IBAMA (SisCITES / MMA).</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-slate-200 block mb-0.5">🛡️ Heráldica & Brasões Oficiais</span>
                <p className="text-slate-400">Símbolos cívicos oficiais das 27 Unidades Federativas sob regime de domínio público cívico.</p>
              </div>
            </div>
          </section>

          {/* 4. Capacidades do Sistema */}
          <section className="secao-capacidades bg-slate-900/80 rounded-2xl p-4 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-serif font-bold text-sm sm:text-base">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3>4. Principais Capacidades</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1">
                <span className="font-bold text-emerald-300">🎮 Modo Aventura</span>
                <span className="text-slate-400">Exploração ortogonal 3D, filtros de relevo sombreado, iluminação e quizzes cívicos.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1">
                <span className="font-bold text-cyan-300">🌡️ Modo Clima</span>
                <span className="text-slate-400">Ventos Alísios, Rios Voadores, ZCAS, frentes polares e efemérides solares em tempo real.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1">
                <span className="font-bold text-amber-300">📻 Musicalidades</span>
                <span className="text-slate-400">Rádio de época com hinos dos 27 estados, canções temáticas e sintetizador Web Audio.</span>
              </div>
            </div>
          </section>

          {/* 5. Limitações e Direitos Autorais */}
          <section className="secao-direitos-autorais bg-amber-950/25 rounded-2xl p-4 border border-amber-500/40 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm sm:text-base">
              <Scale className="w-4 h-4 text-amber-400" />
              <h3>5. Limitações, Uso Educativo & Direitos Autorais</h3>
            </div>
            <p className="text-slate-300 text-xs">
              Esta aplicação tem finalidade <strong className="text-amber-200">exclusivamente cultural, educativa, pedagógica e de preservação histórica</strong>, sem fins lucrativos ou comerciais, em conformidade com o <em>Artigo 46 da Lei de Direitos Autorais do Brasil (Lei nº 9.610/1998)</em>.
            </p>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 text-[11px] text-amber-200/90 space-y-1 font-serif">
              <p className="font-bold text-amber-300">📜 Citações e Atribuição de Obras:</p>
              <p>
                Os hinos oficiais dos 27 estados, símbolos cívicos e referências musicais pertencem aos seus respectivos autores, compositores, letristas e à memória pública de seus povos. Todos os créditos aos mestres da cultura popular brasileira, arranjadores e orquestras são formalmente reconhecidos e celebrados nesta obra.
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="rodape-modal-saiba-mais border-t border-slate-800 p-3 sm:p-4 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0">
          <span>🇧🇷 BR Quest • Brasil 2026</span>
          <button
            onClick={() => {
              audioEngine.playSfx('click');
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold font-serif hover:bg-amber-400 transition cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
