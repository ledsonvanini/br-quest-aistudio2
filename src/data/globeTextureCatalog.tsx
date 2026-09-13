/**
 * Catálogo Centralizado de Mosaicos e Texturas Globais
 * Metadados científicos e cartográficos compartilhados entre menus e painéis de telemetria.
 */
import React from 'react';
import { GlobeTextureMode } from '../lib/globeEngine/types';
import {
  Globe,
  Sun,
  Moon,
  Waves,
  CloudRain,
  Flame,
  Layers,
} from 'lucide-react';

export interface TextureMetadata {
  id: GlobeTextureMode;
  title: string;
  badge: string;
  agency: string;
  icon: React.ReactNode;
  summary: string;
  phenomenon: string;
  brazilImpact: string;
  technicalSpecs: { label: string; value: string }[];
}

export const TEXTURE_INFO_CATALOG: Record<GlobeTextureMode, TextureMetadata> = {
  nasa_satellite: {
    id: 'nasa_satellite',
    title: 'NASA Blue Marble (Dia & Noite)',
    badge: 'Terminador Solar Dinâmico',
    agency: 'NASA MODIS / Suomi NPP VIIRS',
    icon: <Sun className="w-4 h-4 text-amber-400" />,
    summary:
      'Fusão foto-realista da iluminação solar orbital. O globo exibe metade em plena luz diurna e metade em sombra noturna com luzes de cidades, obedecendo ao ângulo solar astronômico real.',
    phenomenon:
      'Terminador Solar (Linha do Crepúsculo). A fronteira móvel entre o dia e a noite viaja pela Terra a ~1.670 km/h no Equador, modulando o ciclo circadiano e a fotossíntese global.',
    brazilImpact:
      'Visualiza o nascer e pôr do sol em tempo real sobre os 4 fusos horários brasileiros (de Fernando de Noronha UTC-2 ao Acre UTC-5).',
    technicalSpecs: [
      { label: 'Resolução Espacial', value: '500m / pixel' },
      { label: 'Espectro', value: 'RGB Visível + VIIRS DNB' },
      { label: 'Órbita', value: 'Heliosíncrona Polar (705 km)' },
    ],
  },
  nasa_full_day: {
    id: 'nasa_full_day',
    title: 'NASA Blue Marble (Diurna Global)',
    badge: '100% Iluminado / Sem Noite',
    agency: 'NASA Visible Earth Earth Observatory',
    icon: <Globe className="w-4 h-4 text-sky-400" />,
    summary:
      'Mosaico panorâmico contínuo totalmente iluminado. Elimina a sombra noturna para permitir inspeção clara e desimpedida de todos os continentes, relevos e bacias hidrográficas ao mesmo tempo.',
    phenomenon:
      'Composição georreferenciada livre de sombras equatoriais, revelando a cobertura vegetal real dos biomas da Terra (Amazônia, Saara, Taiga, Cerrado).',
    brazilImpact:
      'Permite comparar a vasta cobertura florestal da Amazônia com a transição do Cerrado, Caatinga e Mata Atlântica sem interferência de escuridão.',
    technicalSpecs: [
      { label: 'Composição', value: 'Mosaico Nadir Cloud-Free' },
      { label: 'Sensor', value: 'Terra & Aqua MODIS' },
      { label: 'Projeção', value: 'Equirretangular WGS84' },
    ],
  },
  natural_earth: {
    id: 'natural_earth',
    title: 'Natural Earth Cartográfica',
    badge: 'Cartografia Física & Relevo',
    agency: 'Natural Earth / Cartografia Internacional',
    icon: <Layers className="w-4 h-4 text-emerald-400" />,
    summary:
      'Renderização cartográfica física clássica com destaque para relevo sombreado, bacias hidrográficas e massas de terra continentais com clareza gráfica.',
    phenomenon:
      'Hipsometria e relevo sombreado analítico, permitindo discernir cadeias de montanhas, planaltos, depressões e planícies.',
    brazilImpact:
      'Destaque para o Planalto Central, a Serra do Mar, a Chapada Diamantina e a planície do Pantanal e da bacia Amazônica.',
    technicalSpecs: [
      { label: 'Tipo', value: 'Cartografia Vetorial / Raster Hipsométrico' },
      { label: 'Escala Base', value: '1:10 Milhões' },
      { label: 'Paleta', value: 'Cores Hipsométricas Naturais' },
    ],
  },
  night_lights: {
    id: 'night_lights',
    title: 'NASA Black Marble (Luzes Noturnas)',
    badge: 'Eletrificação & Malha Urbana',
    agency: 'NOAA / NASA Suomi-NPP VIIRS',
    icon: <Moon className="w-4 h-4 text-indigo-300" />,
    summary:
      'Mapeamento global da radiação luminosa emitida por cidades, rodovias, plataformas petrolíferas e atividades humanas na escuridão profunda.',
    phenomenon:
      'Densidade urbana e consumo energético captados pela banda Day/Night Band (DNB), sensível a até um único poste de iluminação pública ou queima de gás.',
    brazilImpact:
      'Destaque para o arco luminoso da Macrometrópole Paulista e Litoral do Sudeste, a foz do Rio Amazonas (Belém/Macapá) e os eixos da BR-101 e BR-116.',
    technicalSpecs: [
      { label: 'Banda Espectral', value: '500-900 nm (Pan-DNB)' },
      { label: 'Sensibilidade', value: '3 nW/cm²-sr' },
      { label: 'Filtro', value: 'Remoção de Auroras & Lua' },
    ],
  },
  specular_topo: {
    id: 'specular_topo',
    title: 'Topografia & Batimetria Especular',
    badge: 'Relevo Continental & Dorsais',
    agency: 'GEBCO / NASA SRTM 30m',
    icon: <Waves className="w-4 h-4 text-teal-400" />,
    summary:
      'Visualização aprimorada com reflexo oceânico especular da água e sombreamento de encostas que ressaltam fossas marinhas, cordilheiras e platôs.',
    phenomenon:
      'Reflectância especular de Fresnel nas massas líquidas combinada com modelos digitais de elevação altimétrica (DEM).',
    brazilImpact:
      'Evidencia a Serra do Mar, o Planalto Central, a Depressão Sertaneja e a plataforma continental da Amazônia Azul rica em bacias sedimentares.',
    technicalSpecs: [
      { label: 'Elevação Continental', value: 'Radar SRTM C-Band' },
      { label: 'Batimetria', value: 'Altimetria por Satélite AltiKa' },
      { label: 'Reflexo Especular', value: 'Fresnel Exponencial PBR' },
    ],
  },
  el_nino_sst: {
    id: 'el_nino_sst',
    title: 'Anomalias Térmicas & El Niño / La Niña',
    badge: 'Temperatura da Superfície do Mar (SST)',
    agency: 'NOAA Coral Reef Watch / ESA Sentinel-3',
    icon: <Flame className="w-4 h-4 text-orange-400" />,
    summary:
      'Gradiente térmico oceânico destacando a "Warm Pool" do Pacífico Equatorial e as correntes marítimas que governam o clima do planeta.',
    phenomenon:
      'Oscilação Sul (ENSO). Águas anômalamente quentes no Pacífico (>28°C) alteram as células de circulação atmosférica Walker e Hadley em escala global.',
    brazilImpact:
      'El Niño provoca secas severas na Amazônia e no Sertão Nordestino, intensificando fortes chuvas e inundações no Sul do Brasil.',
    technicalSpecs: [
      { label: 'Faixa Térmica', value: '0°C a 32°C' },
      { label: 'Sensor Térmico', value: 'SLSTR Infravermelho 10.8µm' },
      { label: 'Alerta Climático', value: 'Índice Niño 3.4 (INPE/CPTEC)' },
    ],
  },
  flood_hydrology: {
    id: 'flood_hydrology',
    title: 'Hidrologia & Recursos Hídricos Globais',
    badge: 'Bacias Hidrográficas & Aquíferos',
    agency: 'NASA GRACE / ANA Brasil',
    icon: <CloudRain className="w-4 h-4 text-blue-400" />,
    summary:
      'Mapeamento da hidrografia de superfície, volume de água acumulada em bacias fluviais, deltas e bacias sedimentares subterrâneas.',
    phenomenon:
      'Variação gravimétrica e espectro hídrico captados pelos satélites GRACE-FO para estimar a recarga de lençóis freáticos e o pulso de cheia dos rios.',
    brazilImpact:
      'Monitoramento crítico do Rio Amazonas (maior descarga fluvial do mundo), Rio São Francisco (transposição e energia) e Aquífero Guarani.',
    technicalSpecs: [
      { label: 'Gravimetria Hídrica', value: 'Micrômetros por segundo²' },
      { label: 'Resolução Temporal', value: 'Mensal Contínua' },
      { label: 'Sensibilidade de Aquífero', value: 'Variação de 1 cm d’água' },
    ],
  },
};
