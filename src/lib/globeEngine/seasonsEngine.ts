/**
 * Seasons & Axial Tilt Engine for Brazil's 3D Globe
 * Simulates Earth's 23.44° obliquity of the ecliptic, solstices, and equinoxes,
 * demonstrating real seasonal insolation changes across Brazilian biomes.
 */
import { GlobeSeason } from './types';
import { AXIAL_TILT_DEG } from './celestialMath';

export interface SeasonDescriptor {
  season: GlobeSeason;
  ptName: string;
  astronomicalDate: string;
  subSolarLat: number;
  hemisphereStatus: string;
  brazilImpact: string;
}

export const SEASONS_CATALOG: Record<GlobeSeason, SeasonDescriptor> = {
  realtime: {
    season: 'realtime',
    ptName: 'Tempo Real (Agora)',
    astronomicalDate: 'Data Atual',
    subSolarLat: 0,
    hemisphereStatus: 'Iluminação baseada na data e hora oficial de Brasília (UTC-3)',
    brazilImpact: 'Posição precisa do Sol calculada em tempo real sobre o território nacional.',
  },
  summer_solstice: {
    season: 'summer_solstice',
    ptName: 'Solstício de Verão (Hemisfério Sul)',
    astronomicalDate: '21 a 22 de Dezembro',
    subSolarLat: -AXIAL_TILT_DEG,
    hemisphereStatus: 'Sol no Zênite sobre o Trópico de Capricórnio (SP, PR, MS)',
    brazilImpact: 'Dia mais longo do ano no Sul e Sudeste. Máxima insolação e chuvas convectivas de verão.',
  },
  autumn_equinox: {
    season: 'autumn_equinox',
    ptName: 'Equinócio de Outono (Hemisfério Sul)',
    astronomicalDate: '20 a 21 de Março',
    subSolarLat: 0,
    hemisphereStatus: 'Sol no Zênite sobre a Linha do Equador (AP, PA, AM, RR)',
    brazilImpact: 'Dias e noites com durações exatamente iguais (12 horas). Transição para temperaturas mais amenas.',
  },
  winter_solstice: {
    season: 'winter_solstice',
    ptName: 'Solstício de Inverno (Hemisfério Sul)',
    astronomicalDate: '20 a 21 de Junho',
    subSolarLat: AXIAL_TILT_DEG,
    hemisphereStatus: 'Sol no Zênite sobre o Trópico de Câncer (Hemisfério Norte)',
    brazilImpact: 'Noite mais longa do ano no Brasil. Insolação oblíqua, estiagem no Centro-Oeste e frio no Sul.',
  },
  spring_equinox: {
    season: 'spring_equinox',
    ptName: 'Equinócio de Primavera (Hemisfério Sul)',
    astronomicalDate: '22 a 23 de Setembro',
    subSolarLat: 0,
    hemisphereStatus: 'Sol no Zênite sobre a Linha do Equador',
    brazilImpact: 'Retorno das chuvas aos biomes Cerrado e Pantanal e floradas exuberantes de ipês por todo o país.',
  },
};
