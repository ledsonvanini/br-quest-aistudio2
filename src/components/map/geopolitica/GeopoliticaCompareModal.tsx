import React, { useState } from 'react';
import { X, Scale, ArrowRightLeft, TrendingUp, Users, Building2, HeartPulse, GraduationCap, Vote } from 'lucide-react';
import { BRAZIL_STATES_GEOPOLITICS } from '../../../data/geopoliticaData';
import { StateGeopoliticsProfile } from '../../../types/geopolitica';
import { audioEngine } from '../../../lib/audioSynth';

interface GeopoliticaCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStateA?: string | null;
  initialStateB?: string | null;
}

export const GeopoliticaCompareModal: React.FC<GeopoliticaCompareModalProps> = ({
  isOpen,
  onClose,
  initialStateA = 'SP',
  initialStateB = 'BA',
}) => {
  const allStates = Object.values(BRAZIL_STATES_GEOPOLITICS);
  const [stateAId, setStateAId] = useState<string>(initialStateA || 'SP');
  const [stateBId, setStateBId] = useState<string>(initialStateB || 'BA');

  if (!isOpen) return null;

  const stateA: StateGeopoliticsProfile = BRAZIL_STATES_GEOPOLITICS[stateAId] || allStates[0];
  const stateB: StateGeopoliticsProfile = BRAZIL_STATES_GEOPOLITICS[stateBId] || allStates[1];

  const handleSwap = () => {
    audioEngine.playSfx('click');
    const temp = stateAId;
    setStateAId(stateBId);
    setStateBId(temp);
  };

  const metrics = [
    {
      label: 'População Total',
      icon: <Users className="w-3.5 h-3.5 text-cyan-400" />,
      valA: stateA.demografia.populacaoTotal.toLocaleString('pt-BR'),
      valB: stateB.demografia.populacaoTotal.toLocaleString('pt-BR'),
      unit: 'hab.',
    },
    {
      label: 'Densidade Demográfica',
      icon: <Building2 className="w-3.5 h-3.5 text-sky-400" />,
      valA: `${stateA.demografia.densidadeHabKm2.toFixed(1)}`,
      valB: `${stateB.demografia.densidadeHabKm2.toFixed(1)}`,
      unit: 'hab/km²',
    },
    {
      label: 'Alfabetização (15+)',
      icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />,
      valA: `${stateA.educacao.taxaAlfabetizacao.toFixed(1)}%`,
      valB: `${stateB.educacao.taxaAlfabetizacao.toFixed(1)}%`,
      unit: '',
    },
    {
      label: 'Expectativa de Vida',
      icon: <HeartPulse className="w-3.5 h-3.5 text-rose-400" />,
      valA: `${stateA.vitais.expectativaVidaAnos.toFixed(1)}`,
      valB: `${stateB.vitais.expectativaVidaAnos.toFixed(1)}`,
      unit: 'anos',
    },
    {
      label: 'Taxa de Fecundidade',
      icon: <TrendingUp className="w-3.5 h-3.5 text-amber-400" />,
      valA: `${stateA.vitais.taxaFecundidade.toFixed(2)}`,
      valB: `${stateB.vitais.taxaFecundidade.toFixed(2)}`,
      unit: 'filhos/mulher',
    },
    {
      label: 'Governo Atual',
      icon: <Vote className="w-3.5 h-3.5 text-purple-400" />,
      valA: `${stateA.politica.siglaPartido}`,
      valB: `${stateB.politica.siglaPartido}`,
      unit: '',
    },
  ];

  return (
    <div
      id="modal-comparador-geopolitica"
      className="modal-comparador-geopolitica fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="card-comparador-estados w-full max-w-lg bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col gap-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-black text-sm text-white">Comparador Interestadual</h3>
              <p className="text-[11px] text-cyan-300/80">Contraste de indicadores oficiais IBGE Censo 2022</p>
            </div>
          </div>
          <button
            id="btn-fechar-comparador"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Fechar comparador"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Seletores de Estado */}
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <select
            id="select-estado-a"
            value={stateAId}
            onChange={(e) => {
              audioEngine.playSfx('click');
              setStateAId(e.target.value);
            }}
            className="w-full bg-slate-800 border border-cyan-500/40 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {allStates.map((st) => (
              <option key={st.stateId} value={st.stateId}>
                {st.stateId} - {st.stateName}
              </option>
            ))}
          </select>

          <button
            id="btn-inverter-estados-comparador"
            onClick={handleSwap}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-200 transition cursor-pointer"
            title="Inverter estados"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>

          <select
            id="select-estado-b"
            value={stateBId}
            onChange={(e) => {
              audioEngine.playSfx('click');
              setStateBId(e.target.value);
            }}
            className="w-full bg-slate-800 border border-cyan-500/40 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {allStates.map((st) => (
              <option key={st.stateId} value={st.stateId}>
                {st.stateId} - {st.stateName}
              </option>
            ))}
          </select>
        </div>

        {/* Tabela Comparativa de Métricas */}
        <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 px-2.5 py-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs"
            >
              <div className="font-mono font-bold text-cyan-200 truncate">
                {m.valA} <span className="text-[10px] text-slate-400 font-normal">{m.unit}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium px-2 py-0.5 rounded bg-slate-950/70 border border-slate-800 shrink-0">
                {m.icon}
                <span>{m.label}</span>
              </div>

              <div className="font-mono font-bold text-cyan-200 text-right truncate">
                {m.valB} <span className="text-[10px] text-slate-400 font-normal">{m.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
