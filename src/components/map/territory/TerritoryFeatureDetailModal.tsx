import React from 'react';
import { X, Mountain, Waves, Zap, Compass, Anchor } from 'lucide-react';
import { ReliefPeak, ReliefChapada } from '../../../data/cartography/reliefPeaksData';
import { HydroFeaturePin } from '../../../data/cartography/hydroRiverNetworkData';
import { HydroRegionInfo } from '../../../data/cartography/hydroRegionsData';
import { BiomeGeoFeature } from '../../../data/cartography/biomesData';
import { BRAZIL_KEY_PORTS } from '../../../data/cartographyBasinsData';

export type TerritoryFeatureData =
  | { type: 'peak'; data: ReliefPeak }
  | { type: 'chapada'; data: ReliefChapada }
  | { type: 'hydroPin'; data: HydroFeaturePin }
  | { type: 'hydroRegion'; data: HydroRegionInfo }
  | { type: 'biome'; data: BiomeGeoFeature }
  | { type: 'porto'; data: (typeof BRAZIL_KEY_PORTS)[0] };

interface TerritoryFeatureDetailModalProps {
  feature: TerritoryFeatureData | null;
  onClose: () => void;
}

export const TerritoryFeatureDetailModal: React.FC<TerritoryFeatureDetailModalProps> = ({ feature, onClose }) => {
  if (!feature) return null;

  return (
    <div
      id="modal-detalhe-feicao-territorio"
      className="modal-detalhe-feicao-territorio fixed bottom-6 right-6 z-40 max-w-sm w-96 bg-slate-950/95 backdrop-blur-lg border border-slate-700/80 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-slate-100 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-auto"
      role="dialog"
      aria-label="Detalhes Geográficos"
    >
      {/* Botão Fechar */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* CASO 1: PICO CULMINANTE */}
      {feature.type === 'peak' && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-xs uppercase tracking-wider">
            <Mountain className="w-4 h-4 text-amber-400" />
            <span>Ponto Culminante #{feature.data.rankBr} do Brasil</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-white leading-tight">
            {feature.data.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono font-bold">
              {feature.data.altitudeMeters.toLocaleString('pt-BR')} metros
            </span>
            <span className="text-xs text-slate-300">
              {feature.data.mountainRange} ({feature.data.state})
            </span>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <p className="font-semibold text-slate-200 mb-1">Geologia: {feature.data.geologicalEra}</p>
            <p className="text-slate-400">{feature.data.notableFeatures}</p>
          </div>
        </div>
      )}

      {/* CASO 2: CHAPADA BRASILEIRA */}
      {feature.type === 'chapada' && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Formação Geológica • Chapada</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-white leading-tight">
            {feature.data.name}
          </h3>
          <div className="text-xs text-amber-300 font-mono">
            <span>{feature.data.state}</span> • Altitude {feature.data.altitudeMeters.toLocaleString('pt-BR')}m
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            {feature.data.description}
          </p>
        </div>
      )}

      {/* CASO 3: PONTO HIDROGRÁFICO NOTÁVEL */}
      {feature.type === 'hydroPin' && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-cyan-300 font-serif font-bold text-xs uppercase tracking-wider">
            {feature.data.type === 'dam' ? <Zap className="w-4 h-4 text-cyan-400" /> : <Waves className="w-4 h-4 text-cyan-400" />}
            <span>
              {feature.data.type === 'dam'
                ? 'Usina Hidrelétrica Estratégica'
                : feature.data.type === 'waterfall'
                ? 'Cataratas & Monumento Hídrico'
                : 'Ponto Hidrográfico Notável'}
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-white leading-tight">
            {feature.data.name}
          </h3>
          <div className="text-xs text-cyan-300 font-mono">
            <span>Rio {feature.data.river}</span>
            {feature.data.capacity && ` • ${feature.data.capacity}`}
          </div>
          {feature.data.curiosity && (
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <p className="text-slate-400">{feature.data.curiosity}</p>
            </div>
          )}
        </div>
      )}

      {/* CASO 4: REGIÃO HIDROGRÁFICA (ANA) */}
      {feature.type === 'hydroRegion' && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-sky-400 font-serif font-bold text-xs uppercase tracking-wider">
            <Waves className="w-4 h-4 text-sky-400" />
            <span>Região Hidrográfica Nacional (ANA)</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-white leading-tight">
            {feature.data.name}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Área de Drenagem</span>
              <span className="font-bold text-sky-300 font-mono">
                {(feature.data.areaKm2 / 1000).toFixed(0)} mil km²
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Vazão Média</span>
              <span className="font-bold text-sky-300 font-mono">
                {feature.data.dischargeM3s.toLocaleString()} m³/s
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">Rios Mestres:</span>
            <p className="text-slate-400 text-[11px]">{feature.data.mainRivers.join(', ')}</p>
          </div>
        </div>
      )}

      {/* CASO 5: BIOMA */}
      {feature.type === 'biome' && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold text-xs uppercase tracking-wider">
            <Mountain className="w-4 h-4" />
            <span>Bioma Brasileiro (IBGE)</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-white leading-tight">
            {feature.data.name}
          </h3>
          <div className="text-xs text-slate-300 font-medium">{feature.data.vegetationType}</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Área Territorial</span>
              <span className="font-bold text-emerald-300 font-mono">
                {(feature.data.areaKm2 / 1000).toFixed(0)} mil km²
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Proporção Nacional</span>
              <span className="font-bold text-emerald-300 font-mono">{feature.data.percentageBr}%</span>
            </div>
          </div>
          <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">Flora Símbolo:</span>
            <p className="text-slate-400 text-[11px]">{feature.data.floraHighlights.join(' • ')}</p>
            <span className="font-semibold text-slate-200 block mt-2 mb-1">Fauna Emblemática:</span>
            <p className="text-slate-400 text-[11px]">{feature.data.faunaHighlights.join(' • ')}</p>
          </div>
        </div>
      )}

      {/* CASO 6: PORTO ESTRATÉGICO */}
      {feature.type === 'porto' && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-sky-400 font-serif font-bold text-xs uppercase tracking-wider">
            <Anchor className="w-4 h-4" />
            <span>{feature.data.type === 'porto_fluvial' ? 'Porto Fluvial Hidroviário' : 'Porto Marítimo de Cabotagem'}</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-white leading-tight">
            {feature.data.name}
          </h3>
          <div className="text-xs text-slate-300 font-medium">
            Estado de {feature.data.state}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] mb-1">Função Estratégica</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {feature.data.type === 'porto_fluvial'
                ? 'Terminal hidroviário vital para o escoamento de safras e navegação fluvial pelo interior do país.'
                : 'Polo logístico marítimo nacional conectado a corredores rodoviários e ferroviários de exportação.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
