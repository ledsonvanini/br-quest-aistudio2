import React from 'react';
import { ENRICHED_INTEGRATION_ROUTES, BRAZIL_KEY_PORTS, IntegrationRouteDetail, PortCabotagePoint } from '../../../data/cartographyBasinsData';
import { LogisticCorridorBeacon } from './LogisticCorridorBeacon';

interface LogisticCorridorsMapLayerProps {
  selectedSubitemId?: string | null;
  selectedStateId?: string | null;
  onSelectRoute: (routeId: string) => void;
  onSelectPort: (porto: PortCabotagePoint) => void;
}

const ROUTE_PRIMARY_STATE: Record<string, string> = {
  br_101: 'RJ',
  br_116: 'SP',
  br_364: 'RO',
  hidrovia_tiete_parana: 'SP',
  hidrovia_madeira_amazonas: 'AM',
  ferrovia_norte_sul: 'GO',
  ferrovia_carajas: 'PA',
};

export const LogisticCorridorsMapLayer: React.FC<LogisticCorridorsMapLayerProps> = ({
  selectedSubitemId,
  selectedStateId,
  onSelectRoute,
  onSelectPort,
}) => {
  return (
    <g id="camada-rotas-logistica-viva" className="camada-rotas-logistica-viva pointer-events-auto">
      {/* 1. Traçados dos Corredores Multimodais */}
      {ENRICHED_INTEGRATION_ROUTES.map((route) => {
        if (selectedStateId && ROUTE_PRIMARY_STATE[route.id] !== selectedStateId && selectedSubitemId !== route.id) {
          return null;
        }

        const isSelected =
          selectedSubitemId === route.id ||
          (selectedSubitemId === 'rodovias' && (route.type === 'rodoviaria' || route.type === 'historica')) ||
          (selectedSubitemId === 'hidrovias' && route.type === 'fluvial_cabotagem') ||
          (selectedSubitemId === 'ferrovias' && route.type === 'ferroviaria');
        const isDimmed = Boolean(selectedSubitemId && !isSelected);

        return (
          <g
            key={route.id}
            className={`grupo-rota-integracao cursor-pointer group transition-opacity duration-300 ${
              isDimmed ? 'opacity-20 hover:opacity-80' : 'opacity-100'
            }`}
            onClick={() => onSelectRoute(route.id)}
          >
            {/* Leito Cartográfico Base Escuro Sombreado */}
            <path
              d={route.path}
              fill="none"
              stroke="#020617"
              strokeWidth={isSelected ? 10 : 7}
              strokeLinecap="round"
              strokeOpacity={0.9}
            />

            {/* Trilha Colorida do Modal */}
            <path
              d={route.path}
              fill="none"
              stroke={route.color}
              strokeWidth={isSelected ? 6 : route.type === 'fluvial_cabotagem' ? 5 : 3.5}
              strokeLinecap="round"
              strokeOpacity={isSelected ? 1.0 : 0.75}
              filter={isSelected ? 'url(#routeGlow)' : undefined}
            />

            {/* Linha de Trânsito Dinâmica / Dormentes ou Fluxo */}
            <path
              d={route.path}
              fill="none"
              stroke={route.type === 'ferroviaria' ? '#fbbf24' : '#ffffff'}
              strokeWidth={route.type === 'ferroviaria' ? 2.5 : 1.8}
              strokeLinecap="round"
              className="linha-transito-logistico"
              strokeDasharray={route.type === 'ferroviaria' ? '4 8' : '8 6'}
            />
          </g>
        );
      })}

      {/* 2. Beacons Pulsantes OnHover para Cidades e Nós Multimodais (Deduplicados) */}
      {(() => {
        const renderedKeys = new Set<string>();
        return ENRICHED_INTEGRATION_ROUTES.flatMap((route) => {
          if (selectedStateId && ROUTE_PRIMARY_STATE[route.id] !== selectedStateId && selectedSubitemId !== route.id) {
            return [];
          }

          return route.cities
            .filter((city) => {
              const key = `${Math.round(city.x / 10)}_${Math.round(city.y / 10)}_${city.name}`;
              if (renderedKeys.has(key)) return false;
              renderedKeys.add(key);
              return true;
            })
            .map((city, idx) => (
              <LogisticCorridorBeacon
                key={`route-node-${route.id}-${city.name}-${idx}`}
                routeNode={{ ...city, route }}
                onSelect={() => onSelectRoute(route.id)}
              />
            ));
        });
      })()}

      {/* 3. Beacons Pulsantes OnHover para Portos de Cabotagem */}
      {BRAZIL_KEY_PORTS.map((porto) => {
        if (selectedStateId && porto.state !== selectedStateId) return null;

        return (
          <LogisticCorridorBeacon
            key={`port-beacon-${porto.id}`}
            porto={porto}
            onSelect={() => onSelectPort(porto)}
          />
        );
      })}
    </g>
  );
};
