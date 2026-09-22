import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { audioEngine } from '../../lib/audioSynth';

export const ALL_BRAZIL_STATES = [
  { id: 'AC', name: 'Acre', region: 'Norte' },
  { id: 'AL', name: 'Alagoas', region: 'Nordeste' },
  { id: 'AP', name: 'Amapá', region: 'Norte' },
  { id: 'AM', name: 'Amazonas', region: 'Norte' },
  { id: 'BA', name: 'Bahia', region: 'Nordeste' },
  { id: 'CE', name: 'Ceará', region: 'Nordeste' },
  { id: 'DF', name: 'Distrito Federal', region: 'Centro-Oeste' },
  { id: 'ES', name: 'Espírito Santo', region: 'Sudeste' },
  { id: 'GO', name: 'Goiás', region: 'Centro-Oeste' },
  { id: 'MA', name: 'Maranhão', region: 'Nordeste' },
  { id: 'MT', name: 'Mato Grosso', region: 'Centro-Oeste' },
  { id: 'MS', name: 'Mato Grosso do Sul', region: 'Centro-Oeste' },
  { id: 'MG', name: 'Minas Gerais', region: 'Sudeste' },
  { id: 'PA', name: 'Pará', region: 'Norte' },
  { id: 'PB', name: 'Paraíba', region: 'Nordeste' },
  { id: 'PR', name: 'Paraná', region: 'Sul' },
  { id: 'PE', name: 'Pernambuco', region: 'Nordeste' },
  { id: 'PI', name: 'Piauí', region: 'Nordeste' },
  { id: 'RJ', name: 'Rio de Janeiro', region: 'Sudeste' },
  { id: 'RN', name: 'Rio Grande do Norte', region: 'Nordeste' },
  { id: 'RS', name: 'Rio Grande do Sul', region: 'Sul' },
  { id: 'RO', name: 'Rondônia', region: 'Norte' },
  { id: 'RR', name: 'Roraima', region: 'Norte' },
  { id: 'SC', name: 'Santa Catarina', region: 'Sul' },
  { id: 'SP', name: 'São Paulo', region: 'Sudeste' },
  { id: 'SE', name: 'Sergipe', region: 'Nordeste' },
  { id: 'TO', name: 'Tocantins', region: 'Norte' },
];

interface MusicStateQuickSwitcherProps {
  currentStateId: string;
  onSelectState: (stateId: string) => void;
}

export const MusicStateQuickSwitcher: React.FC<MusicStateQuickSwitcherProps> = ({
  currentStateId,
  onSelectState,
}) => {
  const currentIndex = ALL_BRAZIL_STATES.findIndex((s) => s.id === currentStateId);

  const handlePrev = () => {
    audioEngine.playSfx('click');
    const prevIdx = (currentIndex - 1 + ALL_BRAZIL_STATES.length) % ALL_BRAZIL_STATES.length;
    onSelectState(ALL_BRAZIL_STATES[prevIdx].id);
  };

  const handleNext = () => {
    audioEngine.playSfx('click');
    const nextIdx = (currentIndex + 1) % ALL_BRAZIL_STATES.length;
    onSelectState(ALL_BRAZIL_STATES[nextIdx].id);
  };

  const currentItem = ALL_BRAZIL_STATES[currentIndex] || ALL_BRAZIL_STATES[0];

  return (
    <div
      id="seletor-rapido-estados-musical"
      className="seletor-rapido-estados-musical px-3 py-2 bg-slate-950/90 border-b border-amber-500/30 flex items-center justify-between gap-2"
    >
      {/* Botão Anterior */}
      <button
        type="button"
        onClick={handlePrev}
        className="btn-estado-anterior p-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/60 hover:bg-slate-800 text-amber-400 transition cursor-pointer shrink-0"
        title="Estado Anterior"
        aria-label="Estado Anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Select Rápido Estilizado */}
      <div className="flex-1 min-w-0 relative">
        <select
          id="select-estado-musicalidades"
          value={currentStateId}
          onChange={(e) => {
            audioEngine.playSfx('click');
            onSelectState(e.target.value);
          }}
          className="w-full py-1 px-2.5 rounded-lg bg-slate-900/90 border border-amber-500/40 text-amber-200 text-xs font-mono font-bold appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400 truncate"
          aria-label="Mudar Estado Brasileiro Rapidamente"
        >
          {ALL_BRAZIL_STATES.map((st) => (
            <option key={st.id} value={st.id} className="bg-slate-950 text-slate-100 font-sans">
              {st.id} - {st.name} ({st.region})
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[9px] font-mono font-bold text-amber-400/80 uppercase">
          {currentItem.region}
        </div>
      </div>

      {/* Botão Próximo */}
      <button
        type="button"
        onClick={handleNext}
        className="btn-estado-proximo p-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/60 hover:bg-slate-800 text-amber-400 transition cursor-pointer shrink-0"
        title="Próximo Estado"
        aria-label="Próximo Estado"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
