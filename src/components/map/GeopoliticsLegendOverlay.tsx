import React from 'react';
import { GeopoliticaMetricKey } from '../../types/geopolitica';
import {
  Building2,
  Users,
  Percent,
  HeartPulse,
  GraduationCap,
  Baby,
  Vote,
} from 'lucide-react';

interface GeopoliticsLegendOverlayProps {
  activeMetric: GeopoliticaMetricKey;
  className?: string;
}

export const GeopoliticsLegendOverlay: React.FC<GeopoliticsLegendOverlayProps> = ({
  activeMetric,
  className = '',
}) => {
  const getLegendData = () => {
    switch (activeMetric) {
      case 'densidade':
        return {
          title: 'Densidade Demográfica (IBGE 2022)',
          icon: <Building2 className="w-3.5 h-3.5 text-sky-400" />,
          items: [
            { label: '< 5 hab/km²', color: '#0284c7' },
            { label: '5 – 15', color: '#0d9488' },
            { label: '15 – 30', color: '#d97706' },
            { label: '30 – 70', color: '#ea580c' },
            { label: '70 – 150', color: '#e11d48' },
            { label: '> 150 hab/km²', color: '#9f1239' },
          ],
        };

      case 'partidos':
        return {
          title: 'Partido Político do Governador',
          icon: <Vote className="w-3.5 h-3.5 text-purple-400" />,
          items: [
            { label: 'PT', color: '#dc2626' },
            { label: 'UNIÃO', color: '#1e40af' },
            { label: 'PSD', color: '#2563eb' },
            { label: 'MDB', color: '#15803d' },
            { label: 'PSB', color: '#ea580c' },
            { label: 'PL', color: '#1e3a8a' },
            { label: 'REP / NOVO / PSDB', color: '#0d9488' },
          ],
        };

      case 'miscigenacao':
        return {
          title: 'Predominância Étnica (Censo 2022)',
          icon: <Users className="w-3.5 h-3.5 text-amber-400" />,
          items: [
            { label: 'Pardo (Maioria)', color: '#b45309' },
            { label: 'Branco (Maioria)', color: '#0284c7' },
            { label: 'Preto (>20%)', color: '#7e22ce' },
            { label: 'Indígena (Destaque)', color: '#059669' },
          ],
        };

      case 'genero':
        return {
          title: 'Proporção Feminina (% Mulheres)',
          icon: <Percent className="w-3.5 h-3.5 text-pink-400" />,
          items: [
            { label: '< 50.5%', color: '#0284c7' },
            { label: '50.5% – 51.5%', color: '#4f46e5' },
            { label: '51.5% – 52.2%', color: '#7c3aed' },
            { label: '> 52.2% ♀', color: '#be185d' },
          ],
        };

      case 'mortalidade':
        return {
          title: 'Expectativa de Vida ao Nascer',
          icon: <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />,
          items: [
            { label: '< 73 anos', color: '#e11d48' },
            { label: '73 – 76 anos', color: '#d97706' },
            { label: '76 – 78.5 anos', color: '#0284c7' },
            { label: '> 78.5 anos', color: '#059669' },
          ],
        };

      case 'analfabetismo':
        return {
          title: 'Taxa de Alfabetização (15+ anos)',
          icon: <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />,
          items: [
            { label: '< 86%', color: '#ea580c' },
            { label: '86% – 92%', color: '#d97706' },
            { label: '92% – 96%', color: '#0284c7' },
            { label: '> 96%', color: '#059669' },
          ],
        };

      case 'natalidade':
        return {
          title: 'Taxa de Natalidade (por 1.000 hab)',
          icon: <Baby className="w-3.5 h-3.5 text-cyan-400" />,
          items: [
            { label: '< 10 ‰', color: '#7c3aed' },
            { label: '10 – 13 ‰', color: '#4f46e5' },
            { label: '13 – 16.5 ‰', color: '#0284c7' },
            { label: '> 16.5 ‰', color: '#06b6d4' },
          ],
        };
    }
  };

  const legend = getLegendData();

  return (
    <div
      id="painel-legenda-geopolitica"
      className={`painel-legenda-coropletica pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-slate-700/60 rounded-xl px-3.5 py-2.5 shadow-2xl flex flex-col gap-1.5 text-xs select-none ${className}`}
    >
      <div className="flex items-center gap-1.5 text-slate-200 font-bold text-[11px] tracking-wide">
        {legend.icon}
        <span>{legend.title}</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        {legend.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-[10px] text-slate-300">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm border border-black/30"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-medium whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
