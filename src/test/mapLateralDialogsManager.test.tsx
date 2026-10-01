import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { MapLateralDialogsManager } from '../components/map/dialogs/MapLateralDialogsManager';

describe('MapLateralDialogsManager Component', () => {
  it('is a valid React functional component', () => {
    expect(typeof MapLateralDialogsManager).toBe('function');
  });

  it('renders null when showNeighbors is true or no mode condition is met', () => {
    const { container } = render(
      React.createElement(MapLateralDialogsManager, {
        showNeighbors: true,
        mainMode: 'clima',
        isClimateActive: true,
        selectedClimateStateId: 'SP',
        stateWeather: {},
        climateUpdatedAt: null,
        climateDateTimeFormatted: '',
        currentClimateMode: 'temperaturas_frentes',
        selectedBiodiversityStateId: null,
        biodiversityKingdom: 'all',
        isBiodiversityThreatenedOnly: false,
        selectedGeopoliticaStateId: null,
        geopoliticaMetric: 'miscigenacao',
        selectedTerritoryStateId: null,
        selectedStateId: null,
        hoveredStateId: null,
        completedSet: new Set<string>(),
        onCloseInspection: () => {},
        onStateClick: () => {},
        onSelectGuardian: () => {},
        onToggleExpand: () => {},
      })
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders IsolatedRightGuardianStandee in Aventura mode without opening left technical dock', () => {
    const { container } = render(
      React.createElement(MapLateralDialogsManager, {
        showNeighbors: false,
        mainMode: 'aventura',
        isClimateActive: false,
        selectedClimateStateId: null,
        stateWeather: {},
        climateUpdatedAt: null,
        climateDateTimeFormatted: '',
        currentClimateMode: 'temperaturas_frentes',
        selectedBiodiversityStateId: null,
        biodiversityKingdom: 'all',
        isBiodiversityThreatenedOnly: false,
        selectedGeopoliticaStateId: null,
        geopoliticaMetric: 'miscigenacao',
        selectedTerritoryStateId: null,
        selectedStateId: 'BA',
        hoveredStateId: null,
        completedSet: new Set<string>(),
        onCloseInspection: () => {},
        onStateClick: () => {},
        onSelectGuardian: () => {},
        onToggleExpand: () => {},
      })
    );

    expect(container.firstChild).not.toBeNull();
    const standeeEl = container.querySelector('#standee-guardiao-direita');
    expect(standeeEl).not.toBeNull();
    // Verifica que NÃO há painel técnico esquerdo aberto
    const climateDialog = container.querySelector('#dialog-applateral-clima');
    expect(climateDialog).toBeNull();
  });
});
