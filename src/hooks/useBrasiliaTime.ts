/**
 * useBrasiliaTime - Hook para sincronização precisa de Horário Oficial de Brasília (UTC-3)
 * Centraliza o relógio atômico de simulação solar e astrometria, evitando temporizadores duplicados.
 */
import { useState, useEffect } from 'react';

export interface BrasiliaTimeData {
  formattedTime: string;
  formattedFull: string;
  hours: number;
  minutes: number;
  seconds: number;
  floatHours: number;
  periodName: string;
}

function calculateBrasiliaTime(now: Date): BrasiliaTimeData {
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();

  // Horário Oficial de Brasília: UTC - 3h
  const brasiliaHours = (utcHours - 3 + 24) % 24;
  const floatHours = brasiliaHours + utcMinutes / 60 + utcSeconds / 3600;

  const hh = String(brasiliaHours).padStart(2, '0');
  const mm = String(utcMinutes).padStart(2, '0');
  const ss = String(utcSeconds).padStart(2, '0');

  let periodName = 'Madrugada';
  if (brasiliaHours >= 6 && brasiliaHours < 12) periodName = 'Manhã';
  else if (brasiliaHours >= 12 && brasiliaHours < 18) periodName = 'Tarde';
  else if (brasiliaHours >= 18 && brasiliaHours < 24) periodName = 'Noite';

  return {
    formattedTime: `${hh}:${mm}`,
    formattedFull: `${hh}:${mm}:${ss} (UTC-3)`,
    hours: brasiliaHours,
    minutes: utcMinutes,
    seconds: utcSeconds,
    floatHours,
    periodName,
  };
}

export function useBrasiliaTime(): BrasiliaTimeData {
  const [brasiliaTime, setBrasiliaTime] = useState<BrasiliaTimeData>(() =>
    calculateBrasiliaTime(new Date())
  );

  useEffect(() => {
    const update = () => {
      setBrasiliaTime(calculateBrasiliaTime(new Date()));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return brasiliaTime;
}
