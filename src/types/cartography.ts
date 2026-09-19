/**
 * Cartography Layer Types & Territory Configurations
 * Sistema BR Quest - Tipos e Enums para a Gaveta de Território & Camadas
 */

export type CartographyLayerMode =
  | 'none'
  | 'bacias_hidrograficas'
  | 'biomas_relevo'
  | 'rotas_integracao';

export interface HydrologicalBasin {
  id: string;
  name: string;
  areaKm2: number;
  dischargeM3s?: number;
  color: string;
  description: string;
  mainRivers: string[];
  keyStates: string[];
}

export interface TerritoryLayerOption {
  id: CartographyLayerMode;
  label: string;
  shortLabel: string;
  badge: string;
  badgeColor: string;
  iconName: 'waves' | 'trees' | 'compass';
  description: string;
}

export const TERRITORY_LAYERS_CONFIG: TerritoryLayerOption[] = [
  {
    id: 'bacias_hidrograficas',
    label: 'Bacias Hidrográficas',
    shortLabel: 'Rios Vivos',
    badge: 'Hidrografia',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    iconName: 'waves',
    description: 'Bacias fluviais brasileiras: Amazônica, Tocantins-Araguaia, São Francisco e Prata com fluxo dinâmico.',
  },
  {
    id: 'biomas_relevo',
    label: 'Biomas & Relevo',
    shortLabel: 'Biomas',
    badge: 'Mosaico Vivo',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    iconName: 'trees',
    description: 'Mosaico dos 6 biomas continentais: Amazônia, Cerrado, Mata Atlântica, Caatinga, Pampa e Pantanal.',
  },
  {
    id: 'rotas_integracao',
    label: 'Rotas & Conectividade',
    shortLabel: 'Rotas',
    badge: 'Integração',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    iconName: 'compass',
    description: 'Ferrovias históricas, principais rodovias federais de integração e rotas mercantis de cabotagem.',
  },
];
