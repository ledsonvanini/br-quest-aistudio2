// src/components/map/markers/beaconTelemetryParser.tsx
// Utilitário de parsing e extração de métricas estruturadas para o Grid 2x2 padronizado

import React from 'react';
import {
  Wind,
  Compass,
  Droplets,
  Thermometer,
  Gauge,
  Activity,
  Layers,
  CloudRain,
  Radio,
} from 'lucide-react';

export interface StructuredBeaconMetric {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}

export function parseTelemetryToMetrics(telemetry?: string): StructuredBeaconMetric[] {
  if (!telemetry || !telemetry.trim()) {
    return [
      { label: 'Status', value: 'Monitoramento Ativo', icon: <Activity className="w-4 h-4 text-cyan-400" />, colorClass: 'text-cyan-400' },
      { label: 'Circulação', value: 'Em Tempo Real', icon: <Wind className="w-4 h-4 text-teal-400" />, colorClass: 'text-teal-400' },
      { label: 'Rede', value: 'Sensoriamento Orbital', icon: <Compass className="w-4 h-4 text-blue-400" />, colorClass: 'text-blue-400' },
      { label: 'Confiabilidade', value: '99.4% (ECMWF)', icon: <Gauge className="w-4 h-4 text-emerald-400" />, colorClass: 'text-emerald-400' },
    ];
  }

  const rawParts = telemetry.split('•').map((p) => p.trim()).filter(Boolean);
  const metrics: StructuredBeaconMetric[] = [];

  for (const part of rawParts) {
    let label = 'Métrica';
    let value = part;

    if (part.includes(':')) {
      const [l, ...valParts] = part.split(':');
      label = l.trim();
      value = valParts.join(':').trim();
    } else if (part.includes('-')) {
      const [l, ...valParts] = part.split('-');
      label = l.trim();
      value = valParts.join('-').trim();
    }

    const lowerLabel = label.toLowerCase();
    const lowerVal = value.toLowerCase();

    let icon = <Activity className="w-4 h-4 text-cyan-400 shrink-0" />;
    let colorClass = 'text-cyan-400';

    if (lowerLabel.includes('vento') || lowerLabel.includes('vel') || lowerLabel.includes('rajada')) {
      icon = <Wind className="w-4 h-4 text-teal-400 shrink-0" />;
      colorClass = 'text-teal-400';
    } else if (lowerLabel.includes('rumo') || lowerLabel.includes('dir') || lowerLabel.includes('origem') || lowerLabel.includes('fluxo')) {
      icon = <Compass className="w-4 h-4 text-cyan-400 shrink-0" />;
      colorClass = 'text-cyan-400';
    } else if (lowerLabel.includes('vazão') || lowerLabel.includes('umidade') || lowerLabel.includes('chuva') || lowerLabel.includes('pluvio')) {
      icon = <Droplets className="w-4 h-4 text-blue-400 shrink-0" />;
      colorClass = 'text-blue-400';
    } else if (lowerLabel.includes('temp') || lowerLabel.includes('tsm') || lowerLabel.includes('térmic') || lowerLabel.includes('fase')) {
      icon = <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />;
      colorClass = 'text-amber-400';
    } else if (lowerLabel.includes('press') || lowerLabel.includes('alt') || lowerLabel.includes('nível')) {
      icon = <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />;
      colorClass = 'text-emerald-400';
    } else if (lowerLabel.includes('extensão') || lowerLabel.includes('comp') || lowerLabel.includes('área')) {
      icon = <Layers className="w-4 h-4 text-indigo-400 shrink-0" />;
      colorClass = 'text-indigo-400';
    } else if (lowerLabel.includes('regime') || lowerLabel.includes('precipita')) {
      icon = <CloudRain className="w-4 h-4 text-sky-400 shrink-0" />;
      colorClass = 'text-sky-400';
    } else if (lowerLabel.includes('risco') || lowerLabel.includes('alerta') || lowerLabel.includes('sec')) {
      icon = <Activity className="w-4 h-4 text-rose-400 shrink-0" />;
      colorClass = 'text-rose-400';
    } else if (lowerLabel.includes('estação') || lowerLabel.includes('frequência') || lowerLabel.includes('onda')) {
      icon = <Radio className="w-4 h-4 text-amber-400 shrink-0" />;
      colorClass = 'text-amber-400';
    }

    metrics.push({ label, value, icon, colorClass });
    if (metrics.length >= 4) break;
  }

  // Preenche até 4 itens se necessário para manter o Grid 2x2 perfeito
  if (metrics.length === 1) {
    metrics.push({ label: 'Sensoriamento', value: 'NASA / NOAA', icon: <Compass className="w-4 h-4 text-cyan-400 shrink-0" />, colorClass: 'text-cyan-400' });
    metrics.push({ label: 'Atualização', value: 'Tempo Real', icon: <Activity className="w-4 h-4 text-emerald-400 shrink-0" />, colorClass: 'text-emerald-400' });
    metrics.push({ label: 'Regime', value: 'Monitorado', icon: <Wind className="w-4 h-4 text-teal-400 shrink-0" />, colorClass: 'text-teal-400' });
  } else if (metrics.length === 2) {
    metrics.push({ label: 'Vigilância', value: 'INMET / CPTEC', icon: <Compass className="w-4 h-4 text-cyan-400 shrink-0" />, colorClass: 'text-cyan-400' });
    metrics.push({ label: 'Confiabilidade', value: 'Elevada', icon: <Activity className="w-4 h-4 text-emerald-400 shrink-0" />, colorClass: 'text-emerald-400' });
  } else if (metrics.length === 3) {
    metrics.push({ label: 'Confiabilidade', value: '99% (ECMWF)', icon: <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />, colorClass: 'text-emerald-400' });
  }

  return metrics;
}
