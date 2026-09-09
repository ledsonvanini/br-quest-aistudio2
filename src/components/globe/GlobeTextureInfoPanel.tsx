/**
 * GlobeTextureInfoPanel - Painel Discreto de Inteligência Cartográfica & Mosaicos da Terra
 * Explains environmental sensor data, daylight illumination, SST (El Niño), hydrology, and city lights.
 */
import React, { useState } from 'react';
import { GlobeTextureMode } from '../../lib/globeEngine/types';
import {
  Globe,
  Sun,
  Moon,
  Waves,
  CloudRain,
  Flame,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Satellite,
  Compass,
  Layers,
} from 'lucide-react';

interface GlobeTextureInfoPanelProps {
  textureMode: GlobeTextureMode;
  onChangeTextureMode: (mode: GlobeTextureMode) => void;
  onClose?: () => void;
}

interface TextureMetadata {
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

const TEXTURE_INFO_CATALOG: Record<GlobeTextureMode, TextureMetadata> = {
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
    title: 'Hidrologia & Sensoriamento de Inundações',
    badge: 'Índice de Água NDWI & Umidade do Solo',
    agency: 'Copernicus Sentinel-2 & 1 SAR / INPE',
    icon: <CloudRain className="w-4 h-4 text-cyan-400" />,
    summary:
      'Sensoriamento multiespectral de reflectância hídrica. Realça bacias fluviais, áreas alagáveis, vazão amazônica e dinâmica sazonal de cheias.',
    phenomenon:
      'Assinatura espectral da água na absorção de infravermelho de ondas curtas (SWIR), diferenciando solos saturados de vegetação seca.',
    brazilImpact:
      'Monitorea o pulso anual de cheias da Bacia Amazônica, o ciclo hídrico do Pantanal Mato-Grossense e a recarga do Aquífero Guarani.',
    technicalSpecs: [
      { label: 'Índice', value: 'NDWI (Green - NIR) / (Green + NIR)' },
      { label: 'Radar Complementar', value: 'Sentinel-1 C-SAR' },
      { label: 'Cobertura', value: 'Rede Hidrometeorológica ANA' },
    ],
  },
};

export const GlobeTextureInfoPanel: React.FC<GlobeTextureInfoPanelProps> = ({
  textureMode,
  onChangeTextureMode,
  onClose,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const info = TEXTURE_INFO_CATALOG[textureMode] || TEXTURE_INFO_CATALOG.nasa_satellite;

  return (
    <div
      id="painel-info-texturas-globo"
      className="painel-info-texturas-globo absolute top-20 right-4 z-30 w-80 max-w-[calc(100vw-32px)] rounded-2xl bg-slate-950/92 border border-sky-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-300 text-slate-200 select-none pointer-events-auto"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800/80 bg-slate-900/60 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-500/30 text-sky-300">
            {info.icon}
          </div>
          <div>
            <div className="text-xs font-bold text-sky-200 tracking-wide flex items-center gap-1.5">
              <span>Mosaicos da Terra</span>
              <span className="text-[9px] font-mono text-amber-400 bg-amber-950/70 px-1 py-0.2 rounded border border-amber-800/60">
                NASA/ESA
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium truncate max-w-[170px]">
              {info.agency}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            title={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Fechar painel explicativo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Mode Carousel Selector */}
      <div className="p-2 border-b border-slate-800/60 bg-slate-950/60 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {(Object.keys(TEXTURE_INFO_CATALOG) as GlobeTextureMode[]).map((modeKey) => {
          const item = TEXTURE_INFO_CATALOG[modeKey];
          const isActive = textureMode === modeKey;
          return (
            <button
              key={modeKey}
              type="button"
              onClick={() => onChangeTextureMode(modeKey)}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 border shrink-0 ${
                isActive
                  ? 'bg-sky-500/25 text-sky-200 border-sky-400/60 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.title.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Body Content */}
      {isExpanded && (
        <div className="p-3 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 text-xs">
          {/* Active Mode Highlight Banner */}
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-sky-950/60 via-slate-900/80 to-slate-900/60 border border-sky-500/30">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-bold text-sky-100 text-[12px]">{info.title}</span>
            </div>
            <span className="inline-block px-1.5 py-0.5 rounded text-[9.5px] font-mono font-semibold bg-sky-900/80 text-sky-300 border border-sky-700/60">
              {info.badge}
            </span>
            <p className="mt-1.5 text-[11px] text-slate-300 leading-relaxed">{info.summary}</p>
          </div>

          {/* Scientific Phenomenon */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-400 uppercase tracking-wider">
              <Satellite className="w-3.5 h-3.5" />
              <span>Fenômeno Físico & Detecção</span>
            </div>
            <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 leading-snug">
              {info.phenomenon}
            </p>
          </div>

          {/* Impact on Brazil */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-400 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Impacto no Território Brasileiro</span>
            </div>
            <p className="text-[11px] text-slate-300 bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/40 leading-snug">
              {info.brazilImpact}
            </p>
          </div>

          {/* Technical Specs Mini-Grid */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800/60">
            {info.technicalSpecs.map((spec, i) => (
              <div key={i} className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center">
                <div className="text-[9px] text-slate-400 uppercase font-mono">{spec.label}</div>
                <div className="text-[10px] text-sky-300 font-semibold truncate mt-0.5" title={spec.value}>
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Insight */}
      <div className="px-3 py-1.5 bg-slate-900/90 rounded-b-2xl border-t border-slate-800/60 text-[9.5px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-sky-400" />
          <span>Dados de Sensoriamento Orbital</span>
        </span>
        <span className="text-sky-400 font-mono">WGS84</span>
      </div>
    </div>
  );
};
