import { AppMainMode } from '../../types';

export interface OceanThemePalette {
  deepWater: string;
  shallowWater: string;
  swellBody: string;
  foamCrest: string;
  bubbleColor: string;
  bubbleHighlight: string;
  specular: string;
}

/**
 * Paleta de cores da água adaptativa ao tema ativo
 */
export function getOceanThemePalette(mode: AppMainMode): OceanThemePalette {
  switch (mode) {
    case 'aventura':
      return {
        deepWater: 'rgba(14, 76, 128, 0.85)',
        shallowWater: 'rgba(34, 150, 195, 0.75)',
        swellBody: 'rgba(14, 85, 142, 0.65)',
        foamCrest: 'rgba(254, 243, 199, 0.85)',
        bubbleColor: 'rgba(254, 243, 199, 0.6)',
        bubbleHighlight: 'rgba(255, 255, 255, 0.9)',
        specular: 'rgba(253, 230, 138, 0.6)',
      };
    case 'biodiversidade':
      return {
        deepWater: 'rgba(8, 59, 56, 0.90)',
        shallowWater: 'rgba(20, 184, 166, 0.80)',
        swellBody: 'rgba(13, 74, 70, 0.70)',
        foamCrest: 'rgba(204, 251, 241, 0.90)',
        bubbleColor: 'rgba(153, 246, 228, 0.7)',
        bubbleHighlight: 'rgba(240, 253, 250, 0.95)',
        specular: 'rgba(94, 234, 212, 0.65)',
      };
    case 'musicalidades':
      return {
        deepWater: 'rgba(10, 26, 46, 0.92)',
        shallowWater: 'rgba(14, 116, 144, 0.75)',
        swellBody: 'rgba(14, 40, 70, 0.70)',
        foamCrest: 'rgba(254, 243, 199, 0.85)',
        bubbleColor: 'rgba(251, 191, 36, 0.6)',
        bubbleHighlight: 'rgba(255, 255, 255, 0.95)',
        specular: 'rgba(245, 158, 11, 0.55)',
      };
    case 'clima':
    case 'geopolitica':
    default:
      return {
        deepWater: 'rgba(10, 61, 104, 0.88)',
        shallowWater: 'rgba(34, 211, 238, 0.80)',
        swellBody: 'rgba(14, 86, 142, 0.65)',
        foamCrest: 'rgba(255, 255, 255, 0.92)',
        bubbleColor: 'rgba(224, 242, 254, 0.65)',
        bubbleHighlight: 'rgba(255, 255, 255, 0.95)',
        specular: 'rgba(224, 242, 254, 0.70)',
      };
  }
}
