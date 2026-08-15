import { UserProgress } from '../types';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'simbolos_br_progress_rpg_v2';

export const INITIAL_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  completedStateIds: [],
  unlockedInsigniaIds: [],
  readPergamentIds: [],
  unlockedCodexIds: ['saci', 'curupira', 'feijoada', 'pao_de_queijo', 'samba', 'amazonia'],
  dailyStreak: 1,
  lastDailyDate: null,
  totalCorrectAnswers: 0,
  totalQuestsPlayed: 0,
  soundEnabled: true,
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PROGRESS, ...parsed };
  } catch (e) {
    console.error('Error loading progress:', e);
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}

export function calculateLevel(xp: number): { level: number; currentXpInLevel: number; xpForNextLevel: number; titlePt: string; titleEn: string } {
  // Level curve: Level 1 = 0-150 XP, Level 2 = 150-350 XP, Level 3 = 350-700 XP, etc.
  let level = 1;
  let xpNeeded = 150;
  let totalAccumulated = 0;

  while (xp >= totalAccumulated + xpNeeded) {
    totalAccumulated += xpNeeded;
    level++;
    xpNeeded = Math.round(xpNeeded * 1.35);
  }

  const currentXpInLevel = xp - totalAccumulated;

  let titlePt = 'Recruta da Pátria';
  let titleEn = 'Homeland Recruit';

  if (level >= 10) {
    titlePt = 'Supremo Protetor do Brasil';
    titleEn = 'Supreme Protector of Brazil';
  } else if (level >= 8) {
    titlePt = 'Protetor dos Biomas Nacionais';
    titleEn = 'Protector of National Biomes';
  } else if (level >= 7) {
    titlePt = 'Mestre dos Símbolos Sacros';
    titleEn = 'Master of Sacred Symbols';
  } else if (level >= 6) {
    titlePt = 'Cavaleiro Farroupilha';
    titleEn = 'Farroupilha Knight';
  } else if (level >= 5) {
    titlePt = 'Guardião do Conhecimento';
    titleEn = 'Guardian of Knowledge';
  } else if (level >= 4) {
    titlePt = 'Sentinela dos Pampas';
    titleEn = 'Sentinel of the Pampas';
  } else if (level >= 3) {
    titlePt = 'Explorador das Fronteiras';
    titleEn = 'Frontier Explorer';
  } else if (level >= 2) {
    titlePt = 'Desbravador';
    titleEn = 'Pathfinder';
  }

  return { level, currentXpInLevel, xpForNextLevel: xpNeeded, titlePt, titleEn };
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#059669', '#f59e0b', '#2563eb', '#ffffff', '#dc2626'],
    });
  } catch (e) {
    // confetti fallback
  }
}
