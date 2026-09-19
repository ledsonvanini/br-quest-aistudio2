import { describe, it, expect } from 'vitest';
import { MODE_DEFAULT_PROFILES, centralizarZoomMapa } from '../services/mapModeService';
import { DEFAULT_BRAZIL_ZOOM } from '../lib/mapProjections';

describe('Sidebar Accordion & Strict Mode Isolation', () => {
  it('garante que todos os perfis de modo começam com painel lateral fechado por padrão (Cena Limpa)', () => {
    expect(MODE_DEFAULT_PROFILES.clima.defaultPanelOpen).toBe(false);
    expect(MODE_DEFAULT_PROFILES.biodiversidade.defaultPanelOpen).toBe(false);
    expect(MODE_DEFAULT_PROFILES.geopolitica.defaultPanelOpen).toBe(false);
    expect(MODE_DEFAULT_PROFILES.musicalidades.defaultPanelOpen).toBe(false);
    expect(MODE_DEFAULT_PROFILES.aventura.defaultPanelOpen).toBe(false);
    expect(MODE_DEFAULT_PROFILES.globo3d.defaultPanelOpen).toBe(false);
  });

  it('garante que Geopolítica centraliza o Brasil no centro da tela e não herda offset de painel aberto', () => {
    const normalCenter = centralizarZoomMapa('geopolitica', {
      containerWidth: 1920,
      containerHeight: 1080,
      isPanelOpen: false,
    });
    const panelOpenCenter = centralizarZoomMapa('geopolitica', {
      containerWidth: 1920,
      containerHeight: 1080,
      isPanelOpen: true,
    });

    // O modo começa limpo e centralizado sem o offset lateral do painel aberto
    expect(normalCenter.targetPan.x).not.toBe(panelOpenCenter.targetPan.x);
    expect(normalCenter.targetZoom).toBe(DEFAULT_BRAZIL_ZOOM);
  });

  it('garante que os modos principais executam centralização limpa uniforme quando o painel está fechado', () => {
    const modes = ['clima', 'biodiversidade', 'geopolitica', 'musicalidades', 'aventura'] as const;
    const basePan = centralizarZoomMapa('clima', {
      containerWidth: 1920,
      containerHeight: 1080,
      isPanelOpen: false,
    }).targetPan;

    modes.forEach((mode) => {
      const result = centralizarZoomMapa(mode, {
        containerWidth: 1920,
        containerHeight: 1080,
        isPanelOpen: false,
      });
      expect(result.targetPan).toEqual(basePan);
      expect(result.targetZoom).toBe(DEFAULT_BRAZIL_ZOOM);
    });
  });
});


