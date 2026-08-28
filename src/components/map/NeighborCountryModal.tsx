import React from 'react';
import { NeighborCountryData } from '../../data/southAmericaNeighborsData';
import { X, Users, Compass, Coins, Languages, Shield, MapPin, Landmark, Sparkles } from 'lucide-react';

interface NeighborCountryModalProps {
  country: NeighborCountryData | null;
  onClose: () => void;
}

export const NeighborCountryModal: React.FC<NeighborCountryModalProps> = ({ country, onClose }) => {
  if (!country) return null;

  return (
    <div
      id="modal-detalhes-pais-vizinho"
      className="modal-pais-vizinho fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="card-pais-vizinho container-balao-pais-vizinho relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-500/70 shadow-[0_0_50px_rgba(245,158,11,0.35)] p-6 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 shadow-[0_0_12px_#f59e0b]" />

        {/* Close Button */}
        <button
          id="btn-fechar-modal-pais"
          onClick={onClose}
          className="btn-fechar-painel absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-all border border-amber-500/30 cursor-pointer shadow-md"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Flag & Country Name */}
        <div className="flex items-center gap-4 mb-4 pr-10">
          <div className="w-16 h-12 rounded-lg overflow-hidden border-2 border-amber-400 shadow-xl shadow-black/80 flex items-center justify-center bg-slate-800 shrink-0">
            <img
              src={country.flagUrl}
              alt={country.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{country.flagEmoji}</span>
              <h2 className="text-2xl font-serif font-black text-amber-300 tracking-wide">
                {country.name}
              </h2>
            </div>
            <p className="text-xs text-amber-200/80 font-mono italic">
              {country.officialName}
            </p>
          </div>
        </div>

        {/* Informações Principais em Grid (Capital, População, Território, Moeda, Idioma) */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {/* Capital */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Landmark className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-amber-400/80 tracking-wider">Capital</div>
              <div className="text-xs font-serif font-bold text-slate-100 truncate">{country.capital}</div>
            </div>
          </div>

          {/* População */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-emerald-400/80 tracking-wider">População</div>
              <div className="text-xs font-serif font-bold text-slate-100 truncate">{country.population}</div>
            </div>
          </div>

          {/* Território / Área */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 text-sky-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-sky-400/80 tracking-wider">Território</div>
              <div className="text-xs font-serif font-bold text-slate-100 truncate">{country.area}</div>
            </div>
          </div>

          {/* Moeda */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center shrink-0">
              <Coins className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-yellow-400/80 tracking-wider">Moeda</div>
              <div className="text-xs font-serif font-bold text-slate-100 truncate">{country.currency}</div>
            </div>
          </div>

          {/* Idioma */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Languages className="w-4 h-4 text-purple-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-purple-400/80 tracking-wider">Idioma Oficial</div>
              <div className="text-xs font-serif font-bold text-slate-100 truncate">{country.language}</div>
            </div>
          </div>

          {/* Extensão de Fronteira */}
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-rose-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-rose-400/80 tracking-wider">Fronteira com BR</div>
              <div className="text-xs font-serif font-bold text-slate-100 truncate">{country.borderLength || 'Sem fronteira direta'}</div>
            </div>
          </div>
        </div>

        {/* Estados Brasileiros Limítrofes */}
        {country.borderingStatesBR && country.borderingStatesBR.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-slate-900/90 border border-amber-500/30">
            <div className="text-xs font-serif font-bold text-amber-300 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Estados Brasileiros na Faixa de Fronteira:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {country.borderingStatesBR.map((uf) => (
                <span
                  key={uf}
                  className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-200 text-xs font-bold border border-amber-400/40 shadow-sm"
                >
                  {uf}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Descrição e Relação Geopolítica */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-5">
          <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Relação Geopolítica e Territorial</span>
          </div>
          {country.description}
        </div>

        {/* Botão de Fechar */}
        <div className="flex justify-end">
          <button
            id="btn-entendido-pais-vizinho"
            onClick={onClose}
            className="btn-fechar-modal-pais px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-serif font-bold text-xs shadow-lg shadow-amber-500/30 hover:scale-105 transition-all cursor-pointer"
          >
            Fechar Informações
          </button>
        </div>
      </div>
    </div>
  );
};
