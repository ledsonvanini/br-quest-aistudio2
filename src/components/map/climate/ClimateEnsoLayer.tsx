// src/components/map/climate/ClimateEnsoLayer.tsx
// Camada Cartográfica e Científica do Fenômeno ENSO (El Niño / La Niña)
// Referências: NASA Earth Science, NOAA Climate, INMET e SIMEPAR

import React from 'react';
import { ElNinoIndexData } from '../../../services/climateService';
import { InteractivePulsingBeacon } from '../markers/InteractivePulsingBeacon';

interface ClimateEnsoLayerProps {
  elNinoData?: ElNinoIndexData | null;
}

export const ClimateEnsoLayer: React.FC<ClimateEnsoLayerProps> = ({ elNinoData }) => {
  const phase = elNinoData?.phase || 'El Niño';
  const isLaNina = phase === 'La Niña';

  return (
    <g className="camada-cientifica-enso pointer-events-auto animate-in fade-in duration-300">
      {/* 1. Brilho Térmico Oceânico no Pacífico Equatorial */}
      <circle
        cx="240"
        cy="480"
        r="140"
        fill={isLaNina ? 'url(#ensoCoolGrad)' : 'url(#ensoDroughtGrad)'}
        className="animate-pulse pointer-events-none"
      />

      {/* 2. Ponto de Pulso Interativo: Anomalia no Oceano Pacífico (Niño 3.4) */}
      <InteractivePulsingBeacon
        x={280}
        y={480}
        color={isLaNina ? '#38bdf8' : '#f59e0b'}
        pulseColor={isLaNina ? 'rgba(56, 189, 248, 0.45)' : 'rgba(245, 158, 11, 0.45)'}
        badgeLabel={isLaNina ? 'TSM -1.2°C' : 'TSM +2.3°C'}
        tag="ENSO • NASA Earth Science & NOAA Climate"
        tagColor={isLaNina ? '#38bdf8' : '#f59e0b'}
        tagBg={isLaNina ? 'rgba(56, 189, 248, 0.20)' : 'rgba(245, 158, 11, 0.20)'}
        title={isLaNina ? '❄️ Resfriamento TSM (Niño 3.4)' : '🌊 Aquecimento Anômalo TSM (Niño 3.4)'}
        titleColor={isLaNina ? '#7dd3fc' : '#fde047'}
        borderColor={isLaNina ? '#0284c7' : '#d97706'}
        lines={
          isLaNina
            ? [
                'Alísios intensos empurram águas quentes para a Ásia, gerando',
                'ressurgência fria no Pacífico Equatorial (-0.8°C a -1.5°C).',
                'A Célula de Walker é hiperativada, mudando o clima global.',
              ]
            : [
                'Enfraquecimento dos ventos alísios no Pacífico aquece as águas',
                'superficiais (+2.3°C), desarticulando a Célula de Walker',
                'e alterando profundamente o padrão pluviométrico global.',
              ]
        }
        telemetry={
          isLaNina
            ? 'Anomalia TSM: -0.8°C a -1.2°C • Fase Atual: La Niña Ativa'
            : 'Anomalia TSM: +2.3°C • Fase Atual: Super El Niño Ativo'
        }
        telemetryColor={isLaNina ? '#bae6fd' : '#fef08a'}
      />

      {/* 3. Ponto de Pulso Interativo: Impacto Norte e Nordeste (NASA & INMET) */}
      <InteractivePulsingBeacon
        x={1260}
        y={410}
        color={isLaNina ? '#10b981' : '#ef4444'}
        pulseColor={isLaNina ? 'rgba(16, 185, 129, 0.45)' : 'rgba(239, 68, 68, 0.45)'}
        badgeLabel={isLaNina ? 'ZCIT Ativa' : 'Bloqueio Seco'}
        tag={isLaNina ? 'Convergência Tropical & ZCIT Ativa' : 'Bloqueio & Subsidência Atmosférica'}
        tagColor={isLaNina ? '#10b981' : '#ef4444'}
        tagBg={isLaNina ? 'rgba(16, 185, 129, 0.20)' : 'rgba(239, 68, 68, 0.20)'}
        title={isLaNina ? '🌧️ Chuvas Fartas & Alívio Hídrico' : '🔥 Seca Severa & Bloqueio Atmosférico'}
        titleColor={isLaNina ? '#6ee7b7' : '#fca5a5'}
        borderColor={isLaNina ? '#059669' : '#dc2626'}
        lines={
          isLaNina
            ? [
                'ZCIT deslocada ao sul injeta umidade abundante no semiárido',
                'e leste da Amazônia. Gera excelente recarga de açudes,',
                'inverno nordestino vigoroso e níveis altos nos rios amazônicos.',
              ]
            : [
                'Ar descendente seco inibe nuvens convectivas de chuva',
                'sobre o semiárido nordestino e leste da Amazônia. Provoca',
                'estiagens prolongadas, quebra de safras e alto risco de fogo.',
              ]
        }
        telemetry={
          isLaNina
            ? 'Excedente Pluviométrico: +35% a +60% • Risco Seca: Baixo'
            : 'Déficit Pluviométrico: -45% • Risco de Incêndio: Crítico'
        }
        telemetryColor={isLaNina ? '#a7f3d0' : '#fecaca'}
      />

      {/* 4. Ponto de Pulso Interativo: Região Sul (INMET & SIMEPAR) */}
      <InteractivePulsingBeacon
        x={900}
        y={980}
        color={isLaNina ? '#f59e0b' : '#06b6d4'}
        pulseColor={isLaNina ? 'rgba(245, 158, 11, 0.45)' : 'rgba(6, 182, 212, 0.45)'}
        badgeLabel={isLaNina ? 'Alerta SIMEPAR' : 'Jato Subtropical'}
        tag={isLaNina ? 'Bloqueio Seco • Alerta SIMEPAR / INMET' : 'Aceleração do Jato Subtropical'}
        tagColor={isLaNina ? '#f59e0b' : '#06b6d4'}
        tagBg={isLaNina ? 'rgba(245, 158, 11, 0.20)' : 'rgba(6, 182, 212, 0.20)'}
        title={isLaNina ? '☀️ Estiagem Subtropical & Déficit Hídrico' : '🌊 Enchentes & Intensificação do Jato'}
        titleColor={isLaNina ? '#fcd34d' : '#67e8f9'}
        borderColor={isLaNina ? '#d97706' : '#0891b2'}
        lines={
          isLaNina
            ? [
                'Frentes frias são desviadas para o oceano antes de cruzar o RS/PR.',
                'Provoca veranicos prolongados, estiagens severas em lavouras',
                'de grãos e redução de vazão em bacias hidroelétricas do Sul.',
              ]
            : [
                'O El Niño retém sistemas frontais sobre a Região Sul,',
                'represando frentes frias contra massas de ar quente e gerando',
                'sucessivas semanas de temporais e inundações históricas.',
              ]
        }
        telemetry={
          isLaNina
            ? 'Déficit no Sul: -30% a -55% • Risco de Estiagem Agrícola: Alto'
            : 'Excedente de Chuva: +90% a +150% • Risco Cheias: Alto'
        }
        telemetryColor={isLaNina ? '#fde68a' : '#a5f3fc'}
      />
    </g>
  );
};
