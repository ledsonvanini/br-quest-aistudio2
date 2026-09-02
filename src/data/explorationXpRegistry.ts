import { GuardianData } from '../types';
import { CulturalItem } from './culturalInventoryData';

export interface DialogueCuriosityTopic {
  id: string;
  tabKey: 'historia' | 'cultura' | 'natureza';
  title: string;
  shortLabel: string;
  category: string;
  classificationTier: 'sagrado' | 'epico' | 'raro' | 'comum';
  xpReward: number;
  desc: string;
  speechText: string;
  iconName: string;
}

/**
 * Retorna os tópicos e curiosidades de diálogo para um determinado guardião/estado.
 * Garante classificação e XP individualizado para TODOS os 27 estados do Brasil.
 */
export function getStateDialogueTopics(guardian: GuardianData): DialogueCuriosityTopic[] {
  const stateId = guardian.id;

  return [
    // 1. Manuscrito & Memória Histórica
    {
      id: `${stateId}_hist_doc`,
      tabKey: 'historia',
      title: `Manuscrito: "${guardian.literaryPergament?.title || 'Memória Cívica'}"`,
      shortLabel: 'Manuscrito Histórico',
      category: 'Memória Cívica',
      classificationTier: 'sagrado',
      xpReward: 45,
      desc: `Obra de ${guardian.literaryPergament?.author || 'autores célebres'} preservada no acervo`,
      speechText: `“${guardian.literaryPergament?.excerpt || guardian.loreStoryPt} — ${guardian.literaryPergament?.contextPt || ''}”`,
      iconName: 'BookOpen',
    },
    // 2. Heróis & Líderes Históricos
    {
      id: `${stateId}_hist_heroes`,
      tabKey: 'historia',
      title: `Grandes Heróis & Ícones de ${guardian.stateNamePt}`,
      shortLabel: 'Heróis da Pátria',
      category: 'Epopeia Histórica',
      classificationTier: 'epico',
      xpReward: 40,
      desc: `Legado de ${guardian.famousIcons?.slice(0, 2).join(' e ') || 'líderes históricos'}`,
      speechText: `“Em nosso solo floresceu o talento e a coragem de ${guardian.famousIcons?.join(', ')}. ${guardian.loreStoryPt}”`,
      iconName: 'Sword',
    },
    // 3. Trajes & Símbolos Sagrados do Guardião
    {
      id: `${stateId}_hist_garb`,
      tabKey: 'historia',
      title: `Símbolos e Indumentária do Guardião`,
      shortLabel: 'Indumentária Sagrada',
      category: 'Símbolos Cívicos',
      classificationTier: 'raro',
      xpReward: 30,
      desc: guardian.garbDescriptionPt,
      speechText: `“${guardian.garbDescriptionPt} Cada adorno representa um elo sagrado com nossa história!”`,
      iconName: 'Shield',
    },
    // 4. Gastronomia Tradicional & Sabores
    {
      id: `${stateId}_cult_prato`,
      tabKey: 'cultura',
      title: `Segredos da Culinária (${guardian.typicalDishPt})`,
      shortLabel: 'Culinária Ancestral',
      category: 'Saberes Culinários',
      classificationTier: 'epico',
      xpReward: 35,
      desc: 'Ingredientes nativos, técnicas ancestrais e sabor tradicional',
      speechText: `“Nossa mesa é consagrada por ${guardian.typicalDishPt}! Uma fusão inigualável de saberes dos povos originários e colonizadores!”`,
      iconName: 'Utensils',
    },
    // 5. Músicas, Ritmos & Festas
    {
      id: `${stateId}_cult_festa`,
      tabKey: 'cultura',
      title: `Celebração: ${guardian.musicAndCulturePt}`,
      shortLabel: 'Festa Popular',
      category: 'Patrimônio Imaterial',
      classificationTier: 'raro',
      xpReward: 30,
      desc: 'Ritmos, vestimentas, autos populares e patrimônio vivo',
      speechText: `“A celebração de ${guardian.musicAndCulturePt} é onde a alma de ${guardian.stateNamePt} pulsa com mais vigor e alegria!”`,
      iconName: 'Sparkles',
    },
    // 6. Versos do Hino Estadual
    {
      id: `${stateId}_cult_hino`,
      tabKey: 'cultura',
      title: `Versos Sagrados do Hino Estadual`,
      shortLabel: 'Lírica do Hino',
      category: 'Canto Cívico',
      classificationTier: 'epico',
      xpReward: 35,
      desc: guardian.anthemTitle,
      speechText: `“‘${guardian.anthemLyricsPt}’ — Cantamos com o peito aberto em reverência à nossa terra!”`,
      iconName: 'Feather',
    },
    // 7. Fauna Protetora dos Biomas
    {
      id: `${stateId}_nat_fauna`,
      tabKey: 'natureza',
      title: `Fauna Emblemática (${guardian.faunaPt})`,
      shortLabel: 'Fauna Emblemática',
      category: 'Fauna Protetora',
      classificationTier: 'raro',
      xpReward: 30,
      desc: 'Mamíferos e aves sagradas sob a guarda dos biomas',
      speechText: `“Em nossas matas e rios vivem ${guardian.faunaPt}. São seres sagrados protegidos pela sabedoria dos guardiões!”`,
      iconName: 'Leaf',
    },
    // 8. Flora Sagrada & Botânica
    {
      id: `${stateId}_nat_flora`,
      tabKey: 'natureza',
      title: `Tesouros da Flora (${guardian.floraPt})`,
      shortLabel: 'Flora Nativa',
      category: 'Botânica Sagrada',
      classificationTier: 'comum',
      xpReward: 25,
      desc: 'Árvores monumentais e flores emblemáticas',
      speechText: `“Nossa flora é abençoada por ${guardian.floraPt}, moldando paisagens que encantam o mundo!”`,
      iconName: 'Leaf',
    },
    // 9. Geografia & Biomas
    {
      id: `${stateId}_nat_bioma`,
      tabKey: 'natureza',
      title: `Geografia & Biomas de ${guardian.stateNamePt}`,
      shortLabel: 'Biomas & Relevo',
      category: 'Território & Natureza',
      classificationTier: 'raro',
      xpReward: 30,
      desc: 'Relevo, clima e santuários ecológicos preservados',
      speechText: `“A terra de ${guardian.stateNamePt} guarda formações ecológicas e rios monumentais essenciais para o Brasil!”`,
      iconName: 'Compass',
    },
  ];
}

/**
 * Resumo de XP do diálogo com o Guardião do estado.
 */
export function getStateDialogueXpSummary(
  guardian: GuardianData,
  exploredDialogueIds: string[] = []
): {
  totalXp: number;
  earnedXp: number;
  exploredCount: number;
  totalTopics: number;
  percentage: number;
} {
  const topics = getStateDialogueTopics(guardian);
  const totalXp = topics.reduce((acc, topic) => acc + topic.xpReward, 0);

  const exploredTopics = topics.filter((t) => exploredDialogueIds.includes(t.id));
  const earnedXp = exploredTopics.reduce((acc, topic) => acc + topic.xpReward, 0);
  const exploredCount = exploredTopics.length;
  const totalTopics = topics.length;
  const percentage = totalXp > 0 ? Math.round((earnedXp / totalXp) * 100) : 0;

  return {
    totalXp,
    earnedXp,
    exploredCount,
    totalTopics,
    percentage,
  };
}

/**
 * Retorna o valor de XP de uma relíquia/item do Baú com base na sua raridade ou valor explícito.
 */
export function getItemXpReward(item: CulturalItem): number {
  if (typeof item.xpReward === 'number' && item.xpReward > 0) {
    return item.xpReward;
  }
  switch (item.rarity) {
    case 'sagrado':
      return 100;
    case 'epico':
      return 75;
    case 'raro':
      return 50;
    case 'comum':
    default:
      return 35;
  }
}

/**
 * Retorna o rótulo de classificação amigável do item do Baú.
 */
export function getItemClassificationLabel(item: CulturalItem): string {
  if (item.classificationLabel) {
    return item.classificationLabel;
  }
  switch (item.rarity) {
    case 'sagrado':
      return 'Relíquia Sagrada';
    case 'epico':
      return 'Patrimônio Épico';
    case 'raro':
      return 'Tesouro Regional Raro';
    case 'comum':
    default:
      return 'Costume Tradicional';
  }
}

/**
 * Resumo de XP dos itens do Baú de Relíquias de um estado.
 */
export function getStateChestXpSummary(
  items: CulturalItem[],
  readPergamentIds: string[] = []
): {
  totalXp: number;
  earnedXp: number;
  readCount: number;
  totalItems: number;
  percentage: number;
} {
  const totalXp = items.reduce((acc, item) => acc + getItemXpReward(item), 0);
  const readItems = items.filter((item) => readPergamentIds.includes(item.id));
  const earnedXp = readItems.reduce((acc, item) => acc + getItemXpReward(item), 0);
  const readCount = readItems.length;
  const totalItems = items.length;
  const percentage = totalXp > 0 ? Math.round((earnedXp / totalXp) * 100) : 0;

  return {
    totalXp,
    earnedXp,
    readCount,
    totalItems,
    percentage,
  };
}

/**
 * Resumo unificado de exploração do Estado (Curiosidades do Diálogo + Baú de Relíquias).
 */
export function getStateTotalExplorationSummary(
  guardian: GuardianData,
  items: CulturalItem[],
  exploredDialogueIds: string[] = [],
  readPergamentIds: string[] = []
): {
  dialogueEarned: number;
  dialogueTotal: number;
  chestEarned: number;
  chestTotal: number;
  totalEarned: number;
  totalAvailable: number;
  percentage: number;
  isAllCompleted: boolean;
} {
  const dialogue = getStateDialogueXpSummary(guardian, exploredDialogueIds);
  const chest = getStateChestXpSummary(items, readPergamentIds);

  const totalEarned = dialogue.earnedXp + chest.earnedXp;
  const totalAvailable = dialogue.totalXp + chest.totalXp;
  const percentage = totalAvailable > 0 ? Math.round((totalEarned / totalAvailable) * 100) : 0;
  const isAllCompleted = totalAvailable > 0 && totalEarned >= totalAvailable;

  return {
    dialogueEarned: dialogue.earnedXp,
    dialogueTotal: dialogue.totalXp,
    chestEarned: chest.earnedXp,
    chestTotal: chest.totalXp,
    totalEarned,
    totalAvailable,
    percentage,
    isAllCompleted,
  };
}
