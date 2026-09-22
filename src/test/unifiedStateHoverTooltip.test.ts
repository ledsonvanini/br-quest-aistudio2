import { describe, it, expect } from 'vitest';
import React from 'react';
import { UnifiedStateHoverTooltip } from '../components/map/UnifiedStateHoverTooltip';

describe('UnifiedStateHoverTooltip Component', () => {
  it('is a valid React functional component', () => {
    expect(typeof UnifiedStateHoverTooltip).toBe('function');
  });

  it('renders null when no state is hovered or shouldHide is active', () => {
    const element = React.createElement(UnifiedStateHoverTooltip as any, {
      hoveredStateId: null,
      centroids: {},
      mainMode: 'exploracao',
      isClimateActive: false,
      climateMode: 'temperatura',
      stateWeather: {},
      geopoliticaMetric: 'pib',
      biodiversityKingdom: 'all',
      pan: { x: 0, y: 0 },
      zoom: 1,
    } as any);

    expect(element).toBeDefined();
    // In pure functional execution:
    const result = (UnifiedStateHoverTooltip as any)({
      hoveredStateId: null,
      centroids: {},
      mainMode: 'exploracao',
      isClimateActive: false,
      climateMode: 'temperatura',
      stateWeather: {},
      geopoliticaMetric: 'pib',
      biodiversityKingdom: 'all',
      pan: { x: 0, y: 0 },
      zoom: 1,
    });
    expect(result).toBeNull();
  });

  it('renders a tooltip when a valid state is hovered with centroids', () => {
    const result = (UnifiedStateHoverTooltip as any)({
      hoveredStateId: 'SP',
      centroids: { SP: [1300, 750] },
      mainMode: 'exploracao',
      isClimateActive: false,
      climateMode: 'temperatura',
      stateWeather: {},
      geopoliticaMetric: 'pib',
      biodiversityKingdom: 'all',
      pan: { x: 0, y: 0 },
      zoom: 1,
      mousePos: { x: 300, y: 400 },
    });

    expect(result).not.toBeNull();
    expect(result.props.id).toBe('balao-universal-estado-hover');
  });
});
