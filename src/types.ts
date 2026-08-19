export type RegionId = 'norte' | 'nordeste' | 'centro_oeste' | 'sudeste' | 'sul';

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
  unlockedCodexIds: string[];
  dailyStreak: number;
  lastDailyDate: string | null;
  totalCorrectAnswers: number;
  totalQuestsPlayed: number;
  soundEnabled: boolean;
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

