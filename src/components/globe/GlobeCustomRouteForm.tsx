/**
 * GlobeCustomRouteForm - Formulário de Cálculo e Seleção de Rotas entre Cidades Brasileiras
 */
import React, { useState, useMemo } from 'react';
import { MapPin, Plane, ArrowRight, Sparkles } from 'lucide-react';
import { calculateCityRouteDistance } from '../../data/brazilCitiesGeo';

interface GlobeCustomRouteFormProps {
  defaultOrigin: string;
  onCustomCityRoute?: (originCity: string, destCity: string) => void;
  formatKm: (km: number) => string;
  formatFlightTime: (hours: number) => string;
}

const POPULAR_DESTINATION_CITIES = [
  'São Paulo',
  'Rio de Janeiro',
  'Campinas',
  'Foz do Iguaçu',
  'Manaus',
  'Brasília',
  'Santos',
  'Salvador',
];

export const GlobeCustomRouteForm: React.FC<GlobeCustomRouteFormProps> = ({
  defaultOrigin,
  onCustomCityRoute,
  formatKm,
  formatFlightTime,
}) => {
  const [customOrigin, setCustomOrigin] = useState(defaultOrigin || 'Brasília');
  const [customDest, setCustomDest] = useState('São Paulo');

  const customRouteCalc = useMemo(() => {
    if (!customOrigin.trim() || !customDest.trim()) return null;
    return calculateCityRouteDistance(customOrigin, customDest);
  }, [customOrigin, customDest]);

  const handleApplyCustomRoute = () => {
    if (!customRouteCalc || !onCustomCityRoute) return;
    onCustomCityRoute(customRouteCalc.origin.name, customRouteCalc.destination.name);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
          Cidade de Origem:
        </label>
        <div className="relative">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={customOrigin}
            onChange={(e) => setCustomOrigin(e.target.value)}
            placeholder="Ex: Curitiba, Campinas, Santos..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
          Cidade de Destino:
        </label>
        <div className="relative">
          <MapPin className="w-3.5 h-3.5 text-sky-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={customDest}
            onChange={(e) => setCustomDest(e.target.value)}
            placeholder="Ex: Manaus, Foz do Iguaçu, Juiz de Fora..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/60"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {POPULAR_DESTINATION_CITIES.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => setCustomDest(city)}
            className={`px-2 py-0.5 rounded text-[10.5px] transition-all cursor-pointer border ${
              customDest.toLowerCase() === city.toLowerCase()
                ? 'bg-sky-500/25 border-sky-400 text-sky-200 font-bold'
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {customRouteCalc && (
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-sky-500/30 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Distância Geodésica:</span>
            <span className="font-mono text-sky-300 font-bold text-sm">
              {formatKm(customRouteCalc.distanceKm)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Tempo de Voo Comercial:</span>
            <span className="font-mono text-amber-300 font-semibold flex items-center gap-1">
              <Plane className="w-3 h-3 text-amber-400" />
              {formatFlightTime(customRouteCalc.flightHours)}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800 flex justify-between">
            <span>{customRouteCalc.origin.name} ({customRouteCalc.origin.uf})</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span>{customRouteCalc.destination.name} ({customRouteCalc.destination.uf})</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleApplyCustomRoute}
        disabled={!customRouteCalc}
        className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
          customRouteCalc
            ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Traçar Rota no Globo 3D</span>
      </button>
    </div>
  );
};
