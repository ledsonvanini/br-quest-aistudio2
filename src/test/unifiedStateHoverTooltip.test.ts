import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { UnifiedStateHoverTooltip } from '../components/map/UnifiedStateHoverTooltip';

describe('UnifiedStateHoverTooltip Component', () => {
  it('is a valid React functional component', () => {
    expect(typeof UnifiedStateHoverTooltip).toBe('function');
  });

  it('renders null when no state is hovered or shouldHide is active', () => {
    const { container } = render(
      React.createElement(UnifiedStateHoverTooltip as any, {
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
      })
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders a tooltip when a valid state is hovered with centroids', () => {
    const { container } = render(
      React.createElement(UnifiedStateHoverTooltip as any, {
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
      })
    );

    expect(container.firstChild).not.toBeNull();
    const tooltipEl = container.querySelector('#balao-universal-estado-hover');
    expect(tooltipEl).not.toBeNull();
  });
});
