import { describe, it, expect } from 'vitest';
import {
  MODE_DEFAULT_PROFILES,
  centralizarZoomMapa,
} from '../services/mapModeService';
import { DEFAULT_BRAZIL_ZOOM } from '../lib/mapProjections';

describe('MapModeService - Governance and Decoupling Engine', () => {
  it('defines default profiles for all 6 application modes', () => {
    const modes = [
      'clima',
      'biodiversidade',
      'geopolitica',
      'musicalidades',
      'globo3d',
      'aventura',
    ] as const;

    modes.forEach((mode) => {
      const profile = MODE_DEFAULT_PROFILES[mode];
      expect(profile).toBeDefined();
      expect(profile.id).toBe(mode);
      expect(profile.namePt.length).toBeGreaterThan(0);
      expect(profile.defaultTerrain).toBeDefined();
      expect(profile.defaultVisualStyle).toBeDefined();
    });
  });

  it('correctly provides default mode settings without leakage', () => {
    expect(MODE_DEFAULT_PROFILES.clima.defaultTerrain).toBe('muted_gray');
    expect(MODE_DEFAULT_PROFILES.biodiversidade.defaultTerrain).toBe('natural_earth');
    expect(MODE_DEFAULT_PROFILES.geopolitica.defaultTerrain).toBe('shaded_relief');
    expect(MODE_DEFAULT_PROFILES.geopolitica.defaultPanelOpen).toBe(true);
    expect(MODE_DEFAULT_PROFILES.musicalidades.defaultPanelOpen).toBe(false);
    expect(MODE_DEFAULT_PROFILES.aventura.defaultTerrain).toBe('voyager_parchment');
  });

  describe('centralizarZoomMapa - Parametrized Zoom and Pan', () => {
    it('returns default overview centering when no stateId is provided', () => {
      const overview = centralizarZoomMapa('clima', {
        containerWidth: 1920,
        containerHeight: 1080,
        is3D: false,
      });

      expect(overview.targetZoom).toBe(DEFAULT_BRAZIL_ZOOM);
      expect(overview.targetPan).toBeDefined();
      expect(overview.targetPan.x).toBeTypeOf('number');
      expect(overview.targetPan.y).toBeTypeOf('number');
    });

    it('calculates screen offset when panel is open in overview mode', () => {
      const normal = centralizarZoomMapa('geopolitica', {
        containerWidth: 1280,
        containerHeight: 900,
        isPanelOpen: false,
      });

      const withPanel = centralizarZoomMapa('geopolitica', {
        containerWidth: 1280,
        containerHeight: 900,
        isPanelOpen: true,
      });

      // Pan X should be adjusted to keep Brazil visible when sidebar panel is open
      expect(withPanel.targetPan.x).not.toBe(normal.targetPan.x);
    });

    it('calculates climate mode specific state focus for SP', () => {
      const spClimate = centralizarZoomMapa('clima', {
        stateId: 'SP',
        containerWidth: 1280,
        containerHeight: 900,
        is3D: false,
        isClimateActive: true,
      });

      expect(spClimate.targetZoom).toBeGreaterThan(1.0);
      expect(spClimate.targetPan.x).toBeTypeOf('number');
      expect(spClimate.targetPan.y).toBeTypeOf('number');
    });

    it('calculates biodiversity mode specific state focus for AM', () => {
      const amBio = centralizarZoomMapa('biodiversidade', {
        stateId: 'AM',
        containerWidth: 1280,
        containerHeight: 900,
        is3D: false,
      });

      expect(amBio.targetZoom).toBeGreaterThan(1.0);
      expect(amBio.targetPan).toBeDefined();
    });

    it('calculates musicalities mode specific state focus for BA', () => {
      const baMusical = centralizarZoomMapa('musicalidades', {
        stateId: 'BA',
        containerWidth: 1280,
        containerHeight: 900,
        is3D: false,
        isRadioOpen: true,
      });

      expect(baMusical.targetZoom).toBeGreaterThan(1.0);
      expect(baMusical.targetPan).toBeDefined();
    });

    it('calculates geopolitics and adventure state focus for small and large states', () => {
      const smallState = centralizarZoomMapa('geopolitica', {
        stateId: 'SE',
        containerWidth: 1280,
        containerHeight: 900,
        is3D: false,
      });

      const largeState = centralizarZoomMapa('geopolitica', {
        stateId: 'MT',
        containerWidth: 1280,
        containerHeight: 900,
        is3D: false,
      });

      // Small states should have higher zoom factor than large states
      expect(smallState.targetZoom).toBeGreaterThan(largeState.targetZoom);
    });
  });
});
