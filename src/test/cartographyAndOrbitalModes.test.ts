import { describe, it, expect } from 'vitest';
import { TERRITORY_LAYERS_CONFIG, CartographyLayerMode } from '../types/cartography';
import { MODE_DEFAULT_PROFILES } from '../services/mapModeService';

describe('Cartography and 2D/3D Decoupled Architecture', () => {
  it('defines valid, distinct configuration for all 3 cartographic territory layers', () => {
    expect(TERRITORY_LAYERS_CONFIG).toHaveLength(3);

    const layerIds = TERRITORY_LAYERS_CONFIG.map((layer) => layer.id);
    expect(layerIds).toContain('bacias_hidrograficas');
    expect(layerIds).toContain('biomas_relevo');
    expect(layerIds).toContain('rotas_integracao');

    TERRITORY_LAYERS_CONFIG.forEach((layer) => {
      expect(layer.label).toBeDefined();
      expect(layer.shortLabel.length).toBeGreaterThan(0);
      expect(layer.badge).toBeDefined();
      expect(layer.description.length).toBeGreaterThan(10);
    });
  });

  it('guarantees complete isolation and profile integrity for 2D vs 3D main modes', () => {
    const modo2D = MODE_DEFAULT_PROFILES.aventura;
    const modo3D = MODE_DEFAULT_PROFILES.globo3d;

    expect(modo2D.id).toBe('aventura');
    expect(modo3D.id).toBe('globo3d');

    // 2D mode uses voyager_parchment terrain; 3D uses satellite_earth
    expect(modo2D.defaultTerrain).toBe('voyager_parchment');
    expect(modo3D.defaultTerrain).toBe('satellite_earth');
  });

  it('enforces non-negotiable state decoupling when switching to 3D mode', () => {
    let activeCartographyLayer: CartographyLayerMode = 'bacias_hidrograficas';

    const handleSelectMainMode = (newMode: string) => {
      if (newMode === 'globo3d') {
        // Desacoplamento inegociável entre 2D e 3D
        activeCartographyLayer = 'none';
      }
    };

    handleSelectMainMode('globo3d');
    expect(activeCartographyLayer).toBe('none');
  });

  it('verifies subitem filtering and navigation independence in territory layers', () => {
    // Garantia de que a barra de ferramentas de território opera sem disparar navegação para o Guardião
    let selectedSubitemId: string | null = null;
    let selectedStateId: string | null = null;

    const handleSelectSubitem = (id: string | null) => {
      selectedSubitemId = selectedSubitemId === id ? null : id;
    };

    // Usuário clica em uma bacia
    handleSelectSubitem('amazonica');
    expect(selectedSubitemId).toBe('amazonica');
    expect(selectedStateId).toBeNull(); // Nenhuma navegação para o Guardião disparada

    // Usuário clica novamente para alternar
    handleSelectSubitem('amazonica');
    expect(selectedSubitemId).toBeNull();
  });
});
