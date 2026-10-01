import { BrazilBiome, BiodiversityKingdom } from '../../../types';
import { Trees, TreePine, Sun, Droplets, Compass, Waves, Sprout } from 'lucide-react';
import React from 'react';

export const BIOME_ICONS: Record<BrazilBiome, React.ComponentType<{ className?: string }>> = {
  'Amazônia': Trees,
  'Cerrado': Sprout,
  'Mata Atlântica': TreePine,
  'Caatinga': Sun,
  'Pantanal': Droplets,
  'Pampa': Compass,
  'Marinho Costeiro': Waves,
};

export const SPECIMEN_EMOJIS: Record<string, string> = {
  // Fauna
  'onca-pintada': '🐆',
  'mico-leao-dourado': '🐒',
  'arara-azul-grande': '🦜',
  'lobo-guara': '🐺',
  'boto-cor-de-rosa': '🐬',
  'peixe-boi-marinho': '🐋',
  'harpia-gaviao-real': '🦅',
  'tamandua-bandeira': '🐾',
  'tartaruga-de-couro': '🐢',
  'sabia-laranjeira': '🐦',
  'soldadinho-do-araripe': '🐦',
  'ararajuba': '🦜',
  'gralha-azul': '🐦',
  'galo-da-serra': '🦚',
  'arara-azul-de-lear': '🦜',
  'baleia-franca-austral': '🐋',
  'quero-quero': '🪶',
  'tartaruga-oliva': '🐢',
  'pato-mergulhao': '🦆',
  'golfinho-rotador': '🐬',
  'guara-vermelho': '🦩',
  'macaco-prego-da-capivara': '🐒',
  'moco-da-caatinga': '🐹',
  'atoba-mascarado': '🪶',
  'mico-leao-da-cara-preta': '🐒',
  'muriqui-do-norte': '🦧',
  'tatu-bola': '🛡️',
  // Flora
  'pau-brasil': '🌳',
  'castanheira-do-brasil': '🌰',
  'ipe-amarelo': '🌼',
  'araucaria-pinheiro-do-parana': '🌲',
  'vitoria-regia': '🪷',
  'mandacaru': '🌵',
  'pequi': '🥑',
  'carnauba': '🌴',
  'capim-dourado': '🌾',
  'bromelia': '🌺',
  // Funga & Micro
  'flor-de-coco-bioluminescente': '✨',
  'fungo-verde-amazonia': '🍄',
  'levedura-canastra': '🔬',
  'bacteria-fixadora-cerrado': '🦠',
  'orelha-de-pau-vermelha': '🍄',
};

export const KINGDOM_DEFAULT_EMOJIS: Record<BiodiversityKingdom, string> = {
  fauna: '🐾',
  flora: '🌿',
  fungi_micro: '🍄',
};

export interface BiomeVisualInfo {
  icon: string;
  name: BrazilBiome;
  tagline: string;
  accentColor: string;
  themeClass: string;
}

export const BIOME_VISUAL_REGISTRY: Record<BrazilBiome, BiomeVisualInfo> = {
  'Amazônia': {
    icon: '🌳',
    name: 'Amazônia',
    tagline: 'Maior floresta tropical e bacia fluvial do planeta',
    accentColor: '#10b981',
    themeClass: 'from-emerald-950/60 to-emerald-900/30 border-emerald-500/40 text-emerald-300',
  },
  'Cerrado': {
    icon: '🌾',
    name: 'Cerrado',
    tagline: 'Berço das águas e a savana mais biodiversa do mundo',
    accentColor: '#f59e0b',
    themeClass: 'from-amber-950/60 to-amber-900/30 border-amber-500/40 text-amber-300',
  },
  'Mata Atlântica': {
    icon: '🌿',
    name: 'Mata Atlântica',
    tagline: 'Floresta costeira de exuberância e altíssimo endemismo',
    accentColor: '#14b8a6',
    themeClass: 'from-teal-950/60 to-teal-900/30 border-teal-500/40 text-teal-300',
  },
  'Caatinga': {
    icon: '🌵',
    name: 'Caatinga',
    tagline: 'O único bioma 100% exclusivamente brasileiro',
    accentColor: '#ea580c',
    themeClass: 'from-orange-950/60 to-orange-900/30 border-orange-500/40 text-orange-300',
  },
  'Pantanal': {
    icon: '🐆',
    name: 'Pantanal',
    tagline: 'A maior planície de inundação contínua da Terra',
    accentColor: '#06b6d4',
    themeClass: 'from-cyan-950/60 to-cyan-900/30 border-cyan-500/40 text-cyan-300',
  },
  'Pampa': {
    icon: '🍃',
    name: 'Pampa',
    tagline: 'Campos sulinos, coxilhas e ricas gramíneas nativas',
    accentColor: '#84cc16',
    themeClass: 'from-lime-950/60 to-lime-900/30 border-lime-500/40 text-lime-300',
  },
  'Marinho Costeiro': {
    icon: '🌊',
    name: 'Marinho Costeiro',
    tagline: 'Amazônia Azul: recifes de coral, mangues e ilhas',
    accentColor: '#3b82f6',
    themeClass: 'from-blue-950/60 to-blue-900/30 border-blue-500/40 text-blue-300',
  },
};
