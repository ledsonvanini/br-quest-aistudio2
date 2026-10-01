import React from 'react';
import { AppMainMode, GuardianData, BiodiversityKingdom } from '../../../types';
import { StateWeatherData } from '../../../services/climate/climateTypes';
import { CartographyLayerMode } from '../../../types/cartography';
import { ClimateMode } from '../ClimatePhenomenaLayer';
import { GeopoliticaMetricKey } from '../../../types/geopolitica';
import { StateClimateDialog } from '../StateClimateDialog';
import { StateBiodiversityDialog } from '../StateBiodiversityDialog';
import { StateGeopoliticsDialog } from '../StateGeopoliticsDialog';
import { StateTerritoryDialog } from '../territory/StateTerritoryDialog';
import { StateMusicDialog } from '../../music/StateMusicDialog';
import { IsolatedRightGuardianStandee } from '../IsolatedRightGuardianStandee';

export interface MapLateralDialogsManagerProps {
  showNeighbors: boolean;
  mainMode: AppMainMode;
  activeCartographyLayer?: CartographyLayerMode | null;

  // Clima
  isClimateActive: boolean;
  selectedClimateStateId: string | null;
  stateWeather: Record<string, StateWeatherData>;
  climateUpdatedAt: string | null;
  climateDateTimeFormatted: string;
  currentClimateMode: ClimateMode;

  // Biodiversidade
  selectedBiodiversityStateId: string | null;
  biodiversityKingdom: BiodiversityKingdom | 'all';
  isBiodiversityThreatenedOnly: boolean;

  // Geopolítica
  selectedGeopoliticaStateId: string | null;
  geopoliticaMetric: GeopoliticaMetricKey;

  // Território
  selectedTerritoryStateId: string | null;

  // Musicalidades
  selectedRadioEraId?: string;

  // Seleção e Interação Global
  selectedStateId: string | null;
  hoveredStateId: string | null;
  completedSet: Set<string>;

  // Callbacks
  onCloseInspection: () => void;
  onStateClick: (stateId: string) => void;
  onSelectGuardian: (guardian: GuardianData) => void;
  onToggleExpand: (mode: AppMainMode, expanded: boolean) => void;
}

/**
 * MapLateralDialogsManager
 * Orquestrador central dos diálogos de estado conforme a Regra Hermética dos 7 Modos.
 * - Modos 1 a 5 (Técnicos): Doca lateral à esquerda com split de 50%.
 * - Modo 6 (Aventura/Guardiões): Exibição heróica à direita sem split de 50%.
 */
export const MapLateralDialogsManager: React.FC<MapLateralDialogsManagerProps> = ({
  showNeighbors,
  mainMode,
  activeCartographyLayer,
  isClimateActive,
  selectedClimateStateId,
  stateWeather,
  climateUpdatedAt,
  climateDateTimeFormatted,
  currentClimateMode,
  selectedBiodiversityStateId,
  biodiversityKingdom,
  isBiodiversityThreatenedOnly,
  selectedGeopoliticaStateId,
  geopoliticaMetric,
  selectedTerritoryStateId,
  selectedRadioEraId,
  selectedStateId,
  hoveredStateId,
  completedSet,
  onCloseInspection,
  onStateClick,
  onSelectGuardian,
  onToggleExpand,
}) => {
  const isNoCartoLayer = !activeCartographyLayer || activeCartographyLayer === 'none';

  // 1. MODO CLIMA (Doca à Esquerda)
  if (!showNeighbors && isNoCartoLayer && isClimateActive && selectedClimateStateId) {
    return (
      <StateClimateDialog
        stateId={selectedClimateStateId}
        weatherData={stateWeather[selectedClimateStateId]}
        allStatesWeather={stateWeather}
        lastUpdated={climateUpdatedAt || climateDateTimeFormatted}
        climateMode={currentClimateMode}
        onClose={onCloseInspection}
        onToggleExpand={(expanded) => onToggleExpand('clima', expanded)}
      />
    );
  }

  // 2. MODO BIODIVERSIDADE (Doca à Esquerda)
  if (!showNeighbors && isNoCartoLayer && mainMode === 'biodiversidade' && selectedBiodiversityStateId) {
    return (
      <StateBiodiversityDialog
        stateId={selectedBiodiversityStateId}
        onClose={onCloseInspection}
        activeKingdomFilter={biodiversityKingdom}
        isThreatenedOnly={isBiodiversityThreatenedOnly}
        onToggleExpand={(expanded) => onToggleExpand('biodiversidade', expanded)}
      />
    );
  }

  // 3. MODO GEOPOLÍTICA (Doca à Esquerda)
  if (!showNeighbors && isNoCartoLayer && mainMode === 'geopolitica' && selectedGeopoliticaStateId) {
    return (
      <StateGeopoliticsDialog
        stateId={selectedGeopoliticaStateId}
        onClose={onCloseInspection}
        activeMetric={geopoliticaMetric}
        onToggleExpand={(expanded) => onToggleExpand('geopolitica', expanded)}
      />
    );
  }

  // 4. MODO TERRITÓRIO (Doca à Esquerda)
  const territoryStateId = selectedTerritoryStateId || selectedStateId;
  if (activeCartographyLayer && activeCartographyLayer !== 'none' && territoryStateId) {
    return (
      <StateTerritoryDialog
        stateId={territoryStateId}
        activeLayer={activeCartographyLayer}
        onClose={onCloseInspection}
        onToggleExpand={(expanded) => onToggleExpand('territorio', expanded)}
      />
    );
  }

  // 5. MODO MUSICALIDADES (Doca à Esquerda)
  if (!showNeighbors && isNoCartoLayer && mainMode === 'musicalidades' && selectedStateId) {
    return (
      <StateMusicDialog
        stateId={selectedStateId}
        selectedRadioEraId={selectedRadioEraId}
        onClose={onCloseInspection}
        onSelectState={onStateClick}
        onTuneState={onStateClick}
        onToggleExpand={(expanded) => onToggleExpand('musicalidades', expanded)}
      />
    );
  }

  // 6. MODO AVENTURA / GUARDIÕES (Exceção Estrutural: Doca à Direita sem Split)
  if (!showNeighbors && isNoCartoLayer && !isClimateActive && mainMode === 'aventura') {
    return (
      <IsolatedRightGuardianStandee
        activeStateId={selectedStateId || hoveredStateId || 'DF'}
        completedStateIds={completedSet}
        onSelectGuardian={onSelectGuardian}
        onClose={selectedStateId ? onCloseInspection : undefined}
      />
    );
  }

  return null;
};
