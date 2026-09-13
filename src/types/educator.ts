import { BrazilBiome } from '../types';

export interface BNCCSkill {
  code: string; // Ex: 'EF07GE01', 'EM13CHS103'
  gradeLevel: 'Ensino Fundamental II' | 'Ensino Médio';
  description: string;
  theme: string;
}

export interface EducationalTrack {
  id: string;
  title: string;
  biome: BrazilBiome;
  targetGrade: '7º Ano (EF)' | '9º Ano (EF)' | '1º ao 3º Ano (EM)';
  durationMinutes: number;
  bnccSkills: BNCCSkill[];
  overview: string;
  learningGoals: string[];
  recommendedStates: string[];
  enemFocusTheme: string;
  examQuestionSample: {
    origin: string; // Ex: 'ENEM 2022', 'FUVEST 2023'
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
  accessCode: string;
  studentCount: number;
  averageScorePercent: number;
  activeTrackId: string;
  statesMasteredCount: number;
}
