import React from 'react';
import { NeighborCountryData } from '../../data/southAmericaNeighborsData';
import { X, Globe, MapPin, Flag, Shield, Landmark } from 'lucide-react';

interface NeighborCountryModalProps {
  country: NeighborCountryData | null;
  onClose: () => void;
}

export const NeighborCountryModal: React.FC<NeighborCountryModalProps> = ({ country, onClose }) => {
  if (!country) return null;

  return (
    <div
      id="modal-detalhes-pais-vizinho"
      className="modal-pais-vizinho fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="card-pais-vizinho relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.3)] p-6 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="btn-fechar-modal-pais"
          onClick={onClose}
          className="btn-fechar-painel absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-all border border-amber-500/30"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Flag & Country Name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-12 rounded-lg overflow-hidden border-2 border-amber-400 shadow-lg shadow-black/80 flex items-center justify-center bg-slate-800 shrink-0">
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
            <p className="text-xs text-amber-200/70 font-mono italic">
              {country.officialName}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Capital: {country.capital}</span>
          </div>

          <div className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 border ${
            country.isDirectNeighbor
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-sky-500/10 border-sky-500/40 text-sky-300'
          }`}>
            <Shield className="w-3.5 h-3.5" />
            <span>{country.isDirectNeighbor ? 'Fronteira Direta com o Brasil' : 'América do Sul (Sem Fronteira Direta)'}</span>
          </div>
        </div>

        {/* Bordering States with Brazil if applicable */}
        {country.borderingStatesBR && country.borderingStatesBR.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-slate-900/90 border border-amber-500/20">
            <div className="text-xs font-serif font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Estados Brasileiros na Linha de Fronteira:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {country.borderingStatesBR.map((uf) => (
                <span
                  key={uf}
                  className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 text-xs font-bold border border-amber-400/40"
                >
                  {uf}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-6 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
          {country.description}
        </p>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            id="btn-entendido-pais-vizinho"
            onClick={onClose}
            className="btn-acao-viajar-estado px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-serif font-bold text-sm shadow-lg shadow-amber-500/30 hover:scale-105 transition-all cursor-pointer"
          >
            Fechar Informações
          </button>
        </div>
      </div>
    </div>
  );
};
