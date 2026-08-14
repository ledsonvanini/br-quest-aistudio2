/**
 * Antique Cartographic themes, IBGE regions, Brazilian biomes,
 * and medieval RPG parchment watercolor scales.
 */

export type MapVisualStyle = 'tiles' | 'choropleth';
export type ChoroplethSubTheme = 'progress' | 'regions' | 'biomes';

export interface StateGeoInfo {
  id: string;
  name: string;
  region: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';
  biome: 'Amazônia' | 'Cerrado' | 'Caatinga' | 'Mata Atlântica' | 'Pampa' | 'Pantanal';
  elevationCategory: 'coastal' | 'plateau' | 'basin' | 'highland';
}

export const STATE_GEOGRAPHICAL_DATA: Record<string, StateGeoInfo> = {
  AC: { id: 'AC', name: 'Acre', region: 'Norte', biome: 'Amazônia', elevationCategory: 'basin' },
  AL: { id: 'AL', name: 'Alagoas', region: 'Nordeste', biome: 'Mata Atlântica', elevationCategory: 'coastal' },
  AP: { id: 'AP', name: 'Amapá', region: 'Norte', biome: 'Amazônia', elevationCategory: 'coastal' },
  AM: { id: 'AM', name: 'Amazonas', region: 'Norte', biome: 'Amazônia', elevationCategory: 'basin' },
  BA: { id: 'BA', name: 'Bahia', region: 'Nordeste', biome: 'Caatinga', elevationCategory: 'plateau' },
  CE: { id: 'CE', name: 'Ceará', region: 'Nordeste', biome: 'Caatinga', elevationCategory: 'coastal' },
  DF: { id: 'DF', name: 'Distrito Federal', region: 'Centro-Oeste', biome: 'Cerrado', elevationCategory: 'highland' },
  ES: { id: 'ES', name: 'Espírito Santo', region: 'Sudeste', biome: 'Mata Atlântica', elevationCategory: 'coastal' },
  GO: { id: 'GO', name: 'Goiás', region: 'Centro-Oeste', biome: 'Cerrado', elevationCategory: 'highland' },
  MA: { id: 'MA', name: 'Maranhão', region: 'Nordeste', biome: 'Cerrado', elevationCategory: 'coastal' },
  MT: { id: 'MT', name: 'Mato Grosso', region: 'Centro-Oeste', biome: 'Cerrado', elevationCategory: 'plateau' },
  MS: { id: 'MS', name: 'Mato Grosso do Sul', region: 'Centro-Oeste', biome: 'Pantanal', elevationCategory: 'basin' },
  MG: { id: 'MG', name: 'Minas Gerais', region: 'Sudeste', biome: 'Cerrado', elevationCategory: 'highland' },
  PA: { id: 'PA', name: 'Pará', region: 'Norte', biome: 'Amazônia', elevationCategory: 'basin' },
  PB: { id: 'PB', name: 'Paraíba', region: 'Nordeste', biome: 'Caatinga', elevationCategory: 'coastal' },
  PR: { id: 'PR', name: 'Paraná', region: 'Sul', biome: 'Mata Atlântica', elevationCategory: 'plateau' },
  PE: { id: 'PE', name: 'Pernambuco', region: 'Nordeste', biome: 'Caatinga', elevationCategory: 'coastal' },
  PI: { id: 'PI', name: 'Piauí', region: 'Nordeste', biome: 'Caatinga', elevationCategory: 'plateau' },
  RJ: { id: 'RJ', name: 'Rio de Janeiro', region: 'Sudeste', biome: 'Mata Atlântica', elevationCategory: 'coastal' },
  RN: { id: 'RN', name: 'Rio Grande do Norte', region: 'Nordeste', biome: 'Caatinga', elevationCategory: 'coastal' },
  RS: { id: 'RS', name: 'Rio Grande do Sul', region: 'Sul', biome: 'Pampa', elevationCategory: 'plateau' },
  RO: { id: 'RO', name: 'Rondônia', region: 'Norte', biome: 'Amazônia', elevationCategory: 'basin' },
  RR: { id: 'RR', name: 'Roraima', region: 'Norte', biome: 'Amazônia', elevationCategory: 'highland' },
  SC: { id: 'SC', name: 'Santa Catarina', region: 'Sul', biome: 'Mata Atlântica', elevationCategory: 'coastal' },
  SP: { id: 'SP', name: 'São Paulo', region: 'Sudeste', biome: 'Mata Atlântica', elevationCategory: 'plateau' },
  SE: { id: 'SE', name: 'Sergipe', region: 'Nordeste', biome: 'Mata Atlântica', elevationCategory: 'coastal' },
  TO: { id: 'TO', name: 'Tocantins', region: 'Norte', biome: 'Cerrado', elevationCategory: 'plateau' },
};

// Hand-tinted Watercolor IBGE Macro-region Palette (Vibrant and distinctive cartographic inks)
export const REGION_COLORS: Record<string, { fill: string; stroke: string; label: string; accent: string }> = {
  Norte: {
    fill: '#064e3b',
    stroke: '#10b981',
    label: 'Região Norte (Florestas & Rios)',
    accent: '#34d399',
  },
  Nordeste: {
    fill: '#7c2d12',
    stroke: '#f97316',
    label: 'Região Nordeste (Caatinga & Costa)',
    accent: '#fb923c',
  },
  'Centro-Oeste': {
    fill: '#713f12',
    stroke: '#eab308',
    label: 'Região Centro-Oeste (Cerrado & Pantanal)',
    accent: '#facc15',
  },
  Sudeste: {
    fill: '#1e3a8a',
    stroke: '#3b82f6',
    label: 'Região Sudeste (Mata Atlântica & Serras)',
    accent: '#60a5fa',
  },
  Sul: {
    fill: '#581c87',
    stroke: '#a855f7',
    label: 'Região Sul (Pampas & Pinhais)',
    accent: '#c084fc',
  },
};

// Hand-tinted Watercolor Brazilian Biomes Palette
export const BIOME_COLORS: Record<string, { fill: string; stroke: string; label: string; description: string }> = {
  Amazônia: {
    fill: '#064e3b',
    stroke: '#059669',
    label: 'Amazônia',
    description: 'Maior floresta tropical úmida e bacia hidrográfica do planeta',
  },
  Cerrado: {
    fill: '#78350f',
    stroke: '#d97706',
    label: 'Cerrado',
    description: 'Savana ancestral brasileira e berço das grandes bacias',
  },
  Caatinga: {
    fill: '#831843',
    stroke: '#db2777',
    label: 'Caatinga',
    description: 'Bioma semiárido exclusivo do Brasil com rica resiliência botânica',
  },
  'Mata Atlântica': {
    fill: '#14532d',
    stroke: '#16a34a',
    label: 'Mata Atlântica',
    description: 'Floresta tropical litorânea de extrema biodiversidade',
  },
  Pantanal: {
    fill: '#0e7490',
    stroke: '#06b6d4',
    label: 'Pantanal',
    description: 'A maior planície alagável contínua e santuário aquático da Terra',
  },
  Pampa: {
    fill: '#4c1d95',
    stroke: '#8b5cf6',
    label: 'Pampa',
    description: 'Campos sulinos com relevo suave e rica tradição pastoril',
  },
};

/**
 * Returns fill and stroke colors for a given state depending on active style, sub-theme and completion status.
 */
export function getStateColor(
  stateId: string,
  style: MapVisualStyle,
  subTheme: ChoroplethSubTheme,
  isCompleted: boolean,
  isHovered: boolean,
  isSelected: boolean
): { fill: string; stroke: string; opacity: number } {
  const geoInfo = STATE_GEOGRAPHICAL_DATA[stateId];

  // Base highlight styling
  if (isSelected) {
    return {
      fill: isCompleted ? '#065f46' : '#1e3a8a',
      stroke: '#fbbf24', // Imperial Gold active stroke
      opacity: 1.0,
    };
  }

  if (isHovered) {
    return {
      fill: isCompleted ? '#047857' : '#2b4c7e',
      stroke: '#fef08a',
      opacity: 0.95,
    };
  }

  // Tiles Mode: subtle tint overlay allowing physical relief terrain to shine through
  if (style === 'tiles') {
    return {
      fill: isCompleted ? '#065f46' : '#2d1b09',
      stroke: isCompleted ? '#34d399' : '#78350f',
      opacity: isCompleted ? 0.35 : 0.12,
    };
  }

  // Choropleth Mode
  if (subTheme === 'progress') {
    return {
      fill: isCompleted ? '#194d33' : '#261c14',
      stroke: isCompleted ? '#52b788' : '#6b543e',
      opacity: isCompleted ? 0.92 : 0.75,
    };
  }

  if (subTheme === 'regions') {
    const region = geoInfo ? REGION_COLORS[geoInfo.region] : null;
    return {
      fill: region ? region.fill : '#261c14',
      stroke: region ? region.stroke : '#785d42',
      opacity: 0.88,
    };
  }

  if (subTheme === 'biomes') {
    const biome = geoInfo ? BIOME_COLORS[geoInfo.biome] : null;
    return {
      fill: biome ? biome.fill : '#261c14',
      stroke: biome ? biome.stroke : '#785d42',
      opacity: 0.88,
    };
  }

  return {
    fill: '#261c14',
    stroke: '#6b543e',
    opacity: 0.85,
  };
}
