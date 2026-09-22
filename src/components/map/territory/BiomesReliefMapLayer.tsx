// src/components/map/territory/BiomesReliefMapLayer.tsx
// Camada Cartográfica de Biomas e Relevo com Beacons e Picos Integrados ao Tooltip de Tela

import React from 'react';
import { BRAZIL_OFFICIAL_BIOMES, BiomeGeoFeature } from '../../../data/cartography/biomesData';
import {
  BRAZIL_MAJOR_PEAKS,
  BRAZIL_NOTABLE_CHAPADAS,
  MOUNTAIN_RIDGES,
  ReliefPeak,
  ReliefChapada,
} from '../../../data/cartography/reliefPeaksData';
import { STATE_PRIMARY_BIOME } from '../../../data/cartography/territoryAnchors';
import { BiomePulsingBeacon } from './BiomePulsingBeacon';
import { useBeaconHover } from '../../../context/BeaconHoverContext';
import { Mountain, MapPin, Award, Compass } from 'lucide-react';

interface BiomesReliefMapLayerProps {
  selectedBiomeId?: string | null;
  hoveredBiomeId?: string | null;
  selectedStateId?: string | null;
  onSelectBiome?: (biome: BiomeGeoFeature) => void;
  onHoverBiome?: (biomeId: string | null) => void;
  onSelectPeak?: (peak: ReliefPeak) => void;
  onSelectChapada?: (chapada: ReliefChapada) => void;
  onSelectState?: (stateId: string) => void;
}

const BIOME_PRIMARY_STATE: Record<string, string> = {
  amazonia: 'AM',
  cerrado: 'GO',
  caatinga: 'BA',
  mata_atlantica: 'RJ',
  pantanal: 'MS',
  pampa: 'RS',
};

export const BiomesReliefMapLayer: React.FC<BiomesReliefMapLayerProps> = ({
  selectedBiomeId,
  hoveredBiomeId,
  selectedStateId,
  onSelectBiome,
  onHoverBiome,
  onSelectPeak,
  onSelectChapada,
  onSelectState,
}) => {
  const { showBeaconTooltip, updateBeaconPos, hideBeaconTooltip } = useBeaconHover();

  const handleBiomeInteraction = (biome: BiomeGeoFeature) => {
    onSelectBiome?.(biome);
    const targetState = BIOME_PRIMARY_STATE[biome.id];
    if (targetState && onSelectState) {
      onSelectState(targetState);
    }
  };

  return (
    <g id="camada-biomas-relevo" className="camada-biomas-relevo pointer-events-auto">
      {/* 1. BEACONS DOS 6 GRANDES BIOMAS NACIONAIS (IBGE) */}
      <g id="grupo-beacons-biomas" className="grupo-beacons-biomas pointer-events-auto select-none">
        {BRAZIL_OFFICIAL_BIOMES.map((biome) => {
          const activeBiomeId = selectedBiomeId || (selectedStateId ? STATE_PRIMARY_BIOME[selectedStateId] : null);
          if (activeBiomeId && biome.id !== activeBiomeId) return null;

          const isSelected = selectedBiomeId === biome.id;
          const isHovered = hoveredBiomeId === biome.id;
          const hasAnySelection = Boolean(selectedBiomeId);
          const isDimmed = hasAnySelection && !isSelected;

          return (
            <BiomePulsingBeacon
              key={`biome-beacon-${biome.id}`}
              biome={biome}
              isSelected={isSelected}
              isHovered={isHovered}
              isDimmed={isDimmed}
              onSelect={handleBiomeInteraction}
              onHover={(id) => onHoverBiome?.(id)}
            />
          );
        })}
      </g>

      {/* 2. CORDILHEIRAS E SERRAS ESTRUTURAIS */}
      {!selectedBiomeId && (
        <g id="grupo-serras-estruturais" className="grupo-serras-estruturais pointer-events-none">
          {MOUNTAIN_RIDGES.map((ridge) => (
            <g key={ridge.id}>
              <path
                d={ridge.d}
                fill="none"
                stroke="#d97706"
                strokeWidth="2.8"
                strokeOpacity="0.80"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>
      )}

      {/* 3. GRANDES CHAPADAS BRASILEIRAS COM TOOLTIP UNIFICADO */}
      <g id="grupo-chapadas-brasileiras" className="grupo-chapadas-brasileiras pointer-events-auto select-none">
        {BRAZIL_NOTABLE_CHAPADAS.map((chapada) => {
          if (selectedStateId && chapada.state !== selectedStateId) return null;
          const badgeWidth = chapada.name.length * 10.5 + 85;

          const chapadaPayload = {
            tag: 'CHAPADA & PLANALTO',
            tagColor: '#f59e0b',
            tagBg: 'rgba(245, 158, 11, 0.25)',
            title: chapada.name,
            borderColor: '#f59e0b',
            subtitle: `Altitude ${chapada.altitudeMeters}m • Estado ${chapada.state}`,
            topBadge: {
              label: `${chapada.altitudeMeters}m`,
              icon: <Mountain className="w-3.5 h-3.5 text-amber-400" />,
            },
            metrics: [
              {
                label: 'Cota Altimétrica',
                value: `${chapada.altitudeMeters} metros`,
                icon: <Mountain className="w-4 h-4 text-amber-400 shrink-0" />,
                colorClass: 'text-amber-400',
              },
              {
                label: 'Estado / UF',
                value: `Estado ${chapada.state}`,
                icon: <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />,
                colorClass: 'text-emerald-400',
              },
              {
                label: 'Morfologia',
                value: 'Planalto Sedimentar',
                icon: <Compass className="w-4 h-4 text-cyan-400 shrink-0" />,
                colorClass: 'text-cyan-400',
              },
              {
                label: 'Geomorfologia',
                value: 'Bacia Hidrográfica',
                icon: <Award className="w-4 h-4 text-teal-400 shrink-0" />,
                colorClass: 'text-teal-400',
              },
            ],
            lines: [chapada.description || 'Importante formação de relevo tabular do território brasileiro.'],
            footerSource: 'IBGE • CPRM • Serviço Geológico',
          };

          return (
            <g
              key={chapada.id}
              transform={`translate(${chapada.x}, ${chapada.y})`}
              className="cursor-pointer group pointer-events-auto"
              onClick={() => onSelectChapada?.(chapada)}
              onMouseEnter={(e) => showBeaconTooltip(chapadaPayload, e)}
              onMouseMove={(e) => updateBeaconPos(e)}
              onMouseLeave={hideBeaconTooltip}
            >
              {/* Hitbox Generosa e Centralizada (Raio 48, Diâmetro 96) */}
              <circle r="48" fill="transparent" className="cursor-pointer pointer-events-auto" />

              <polygon
                points="-22,8 -14,-10 14,-10 22,8"
                fill="#b45309"
                stroke="#fde047"
                strokeWidth="2.8"
                filter="drop-shadow(0 2px 10px rgba(0,0,0,0.85))"
                className="group-hover:scale-120 transition-transform origin-center"
              />
              <g transform="translate(0, 24)" className="transition-transform group-hover:scale-105 pointer-events-auto cursor-pointer">
                <rect
                  x={-(badgeWidth / 2)}
                  y="-16"
                  width={badgeWidth}
                  height="34"
                  rx="7"
                  fill="#020617"
                  fillOpacity="0.96"
                  stroke="#f59e0b"
                  strokeWidth="1.6"
                  style={{ filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.92))' }}
                />
                <text
                  y="6"
                  textAnchor="middle"
                  fill="#fef08a"
                  fontSize="16"
                  fontFamily="system-ui, sans-serif"
                  fontWeight="bold"
                >
                  {chapada.name} ({chapada.altitudeMeters}m)
                </text>
              </g>
            </g>
          );
        })}
      </g>

      {/* 4. PICOS CULMINANTES COM COTAS ALTIMÉTRICAS E TOOLTIP UNIFICADO */}
      <g id="grupo-picos-culminantes-brasil" className="grupo-picos-culminantes-brasil pointer-events-auto">
        {BRAZIL_MAJOR_PEAKS.map((peak) => {
          if (selectedStateId && peak.state !== selectedStateId) return null;
          const badgeWidth = peak.name.length * 10.5 + 105;

          const peakPayload = {
            tag: `PICO CULMINANTE #${peak.rankBr}`,
            tagColor: peak.rankBr === 1 ? '#ef4444' : '#f59e0b',
            tagBg: peak.rankBr === 1 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)',
            title: peak.name,
            borderColor: peak.rankBr === 1 ? '#ef4444' : '#f59e0b',
            subtitle: `${peak.altitudeMeters}m de Altitude • ${peak.mountainRange}`,
            topBadge: {
              label: `${peak.altitudeMeters}m`,
              icon: <Mountain className="w-3.5 h-3.5 text-amber-400" />,
            },
            metrics: [
              {
                label: 'Cota Altimétrica',
                value: `${peak.altitudeMeters}m (#${peak.rankBr} BR)`,
                icon: <Mountain className="w-4 h-4 text-rose-400 shrink-0" />,
                colorClass: 'text-rose-400',
              },
              {
                label: 'Cordilheira / Serra',
                value: peak.mountainRange,
                icon: <Compass className="w-4 h-4 text-amber-400 shrink-0" />,
                colorClass: 'text-amber-400',
              },
              {
                label: 'Localização / UF',
                value: `Estado ${peak.state}`,
                icon: <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />,
                colorClass: 'text-emerald-400',
              },
              {
                label: 'Origem Geológica',
                value: peak.geologicalEra ? 'Pré-Cambriano' : 'Cráton Antigo',
                icon: <Award className="w-4 h-4 text-cyan-400 shrink-0" />,
                colorClass: 'text-cyan-400',
              },
            ],
            lines: [peak.notableFeatures || 'Ponto culminante de extrema relevância cartográfica e orográfica do Brasil.'],
            footerSource: 'IBGE • Diretoria de Geociências • CPRM',
          };

          return (
            <g
              key={peak.id}
              transform={`translate(${peak.x}, ${peak.y})`}
              className="cursor-pointer group pointer-events-auto"
              onClick={() => onSelectPeak?.(peak)}
              onMouseEnter={(e) => showBeaconTooltip(peakPayload, e)}
              onMouseMove={(e) => updateBeaconPos(e)}
              onMouseLeave={hideBeaconTooltip}
            >
              {/* Hitbox Generosa e Centralizada (Raio 48, Diâmetro 96) */}
              <circle r="48" fill="transparent" className="cursor-pointer pointer-events-auto" />

              {peak.rankBr === 1 && (
                <circle r="26" fill="#ef4444" fillOpacity="0.30" stroke="#f87171" strokeWidth="2.2" className="animate-ping pointer-events-none" />
              )}
              <polygon
                points="0,-22 -14,8 14,8"
                fill={peak.rankBr <= 3 ? '#ef4444' : '#f59e0b'}
                stroke="#ffffff"
                strokeWidth="2.8"
                filter="drop-shadow(0 2px 10px rgba(0,0,0,0.85))"
                className="group-hover:scale-125 transition-transform origin-center"
              />
              <g transform="translate(20, -4)" className="select-none pointer-events-auto cursor-pointer transition-transform group-hover:scale-105">
                <rect
                  x="-2"
                  y="-16"
                  width={badgeWidth}
                  height="34"
                  rx="7"
                  fill="#020617"
                  fillOpacity="0.96"
                  stroke={peak.rankBr === 1 ? '#ef4444' : '#38bdf8'}
                  strokeWidth="1.6"
                  style={{ filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.92))' }}
                />
                <text x="12" y="6" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif">
                  ▲ {peak.name} <tspan fill="#38bdf8" fontWeight="800">{peak.altitudeMeters}m</tspan>
                </text>
              </g>
            </g>
          );
        })}
      </g>
    </g>
  );
};
