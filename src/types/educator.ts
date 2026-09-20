import { BrazilBiome } from '../types';

export type EducationTier = 'fundamental' | 'medio' | 'avancado';

export interface BNCCSkill {
  code: string; // Ex: 'EF07GE01', 'EM13CHS103', 'PC-GEO-2025'
  gradeLevel: 'Ensino Fundamental' | 'Ensino Médio' | 'Nível Pesquisador';
  tier: EducationTier;
  description: string;
  theme: string;
}

export interface EducationalTrack {
  id: string;
  title: string;
  biome: BrazilBiome;
  targetTier: EducationTier;
  targetGrade: string; // Ex: '6º ao 9º Ano (Fundamental)', '1º ao 3º Ano (Médio)', 'Nível Pesquisador / Superior'
  durationMinutes: number;
  bnccSkills: BNCCSkill[];
  overview: string;
  learningGoals: string[];
  recommendedStates: string[];
  enemFocusTheme: string;
  dataSourceRef: string; // Atualizado: 'IBGE Censo Demográfico & Estimativas 2024/2025', 'INPE / CPTEC 2025', 'MapBiomas Col. 9', etc.
  examQuestionSample: {
    origin: string; // Ex: 'ENEM 2024', 'FUVEST 2024', 'Olimpíada Brasileira de Geografia 2024'
    tier: EducationTier;
    points: number; // 100 para Fundamental, 200 para Médio, 350 para Avançado
    xp: number; // 50 para Fundamental, 100 para Médio, 200 para Avançado
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface ClassroomGroup {
  id: string;
  name: string; // Ex: '9º Ano B - Geografia'
  schoolName: string;
  grade: string;
  tier: EducationTier;
  accessCode: string;
  studentCount: number;
  averageScorePercent: number;
  activeTrackId: string;
  statesMasteredCount: number;
}

