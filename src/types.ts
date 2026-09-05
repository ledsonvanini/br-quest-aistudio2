export type RegionId = 'norte' | 'nordeste' | 'centro_oeste' | 'sudeste' | 'sul';

export type AppMainMode = 'clima' | 'biodiversidade' | 'geopolitica' | 'globo3d' | 'aventura' | 'musicalidades';

export type GuardianPosture = 'idle' | 'guard' | 'presentation' | 'reading' | 'unlocked';

export interface Question {
  id: string;
  questionPt: string;
  questionEn: string;
  optionsPt: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationPt: string;
  explanationEn: string;
}

export interface LiteraryPergament {
  title: string;
  author: string;
  excerpt: string;
  contextPt: string;
  contextEn: string;
}

export interface GuardianData {
  id: string; // e.g., 'AM', 'SP', 'RJ', 'PE', 'RS', 'BA', 'DF', etc. (27 states)
  stateNamePt: string;
  stateNameEn: string;
  capitalPt: string;
  capitalEn: string;
  regionId: RegionId;
  guardianName: string;
  guardianTitlePt: string;
  guardianTitleEn: string;
  avatarUrl: string; // NPC character portrait image
  garbDescriptionPt: string;
  garbDescriptionEn: string;
  loreStoryPt: string;
  loreStoryEn: string;
  // SVG Map relative coordinates (1000x1000 viewBox)
  centerX: number;
  centerY: number;
  pathData: string; // Accurate SVG polygon path for state border
  themeColor: string; // Hex color for state aura and badge
  flagSymbol: string; // SVG / Emoji / Icon reference
  anthemTitle: string;
  anthemLyricsPt: string;
  anthemLyricsEn: string;
  hymnFrequencies: number[]; // Frequencies in Hz for procedural synth
  faunaPt: string;
  faunaEn: string;
  floraPt: string;
  floraEn: string;
  typicalDishPt: string;
  typicalDishEn: string;
  musicAndCulturePt: string;
  musicAndCultureEn: string;
  famousIcons: string[];
  literaryPergament: LiteraryPergament;
  questions: Question[];
  insigniaNamePt: string;
  insigniaNameEn: string;
  insigniaDescPt: string;
  insigniaDescEn: string;
  insigniaIcon: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  completedStateIds: string[];
  unlockedInsigniaIds: string[];
  readPergamentIds: string[];
  exploredDialogueIds?: string[];
  unlockedCodexIds: string[];
  dailyStreak: number;
  lastDailyDate: string | null;
  totalCorrectAnswers: number;
  totalQuestsPlayed: number;
  soundEnabled: boolean;
  stateScores?: Record<string, number>;
  campaignsCompleted?: Record<string, boolean>;
  quickDuelsWon?: Record<string, number>;
}

export type Language = 'pt' | 'en';

export type MapVisualStyle = 'tiles' | 'choropleth';
export type ChoroplethSubTheme = 'progress' | 'regions' | 'biomes';
export type TerrainTileProvider =
  | 'shaded_relief'
  | 'physical_atlas'
  | 'satellite_earth'
  | 'voyager_parchment'
  | 'muted_gray'
  | 'natural_earth';

export type BiodiversityKingdom = 'fauna' | 'flora' | 'fungi_micro';

export type ConservationStatus = 'CR' | 'EN' | 'VU' | 'NT' | 'LC' | 'DD';

export type BrazilBiome =
  | 'Amazônia'
  | 'Cerrado'
  | 'Mata Atlântica'
  | 'Caatinga'
  | 'Pantanal'
  | 'Pampa'
  | 'Marinho Costeiro';

export interface TaxonomicClassification {
  reino: string;
  filoOuDivisao: string;
  classe: string;
  ordem: string;
  familia: string;
  genero: string;
  especie: string;
}

export interface BiodiversitySpecimen {
  id: string;
  namePt: string;
  nameEn: string;
  scientificName: string;
  kingdom: BiodiversityKingdom;
  subcategoryPt: string; // e.g. "Mamífero", "Ave", "Árvore Emblemática", "Fungo Bioluminescente", "Orquídea"
  taxonomicRank: TaxonomicClassification;
  iucnStatus: ConservationStatus;
  icmbioStatus: ConservationStatus;
  citesAppendix?: 'I' | 'II' | 'III' | 'Não listada';
  isEndemicBrazil: boolean;
  isEndemicState: boolean;
  biomes: BrazilBiome[];
  states: string[];
  imageUrl: string;
  thumbnailUrl?: string;
  ecologicalRolePt: string;
  habitatPt: string;
  curiositiesPt: string[];
  medicinalOrEconomicUsePt?: string;
  threatsPt?: string[];
  ibamaSisCitesInfo?: {
    monitoringCategory: string;
    legalFramework: string;
    exportRegulation?: string;
  };
}

export interface StateBiodiversityProfile {
  stateId: string;
  stateName: string;
  region: string;
  predominantBiomes: BrazilBiome[];
  biodiversitySummaryPt: string;
  totalKnownSpeciesEst: number;
  threatenedSpeciesCount: number;
  endemicSpeciesCount: number;
  flagshipFauna: string; // Nome popular
  flagshipFlora: string; // Nome popular
  flagshipFungusOrMicro: string;
  protectedAreasCount: number;
  specimens: BiodiversitySpecimen[];
}

