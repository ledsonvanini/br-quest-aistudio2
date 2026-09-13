import { useState, useEffect, useCallback, useMemo } from 'react';
import { DailyTipItem, getDailyTipsForDate } from '../data/dailyTipsData';
import { audioEngine } from '../lib/audioSynth';

const STORAGE_KEY = 'brquest_daily_tips_v1';
const BONUS_XP_ALL_TIPS = 50;

interface StoredDailyProgress {
  date: string;
  readTipIds: string[];
  claimedBonus: boolean;
}

export function useDailyTips(onGainXp?: (xp: number, label: string) => void) {
  const todayKey = useMemo(() => {
    return new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  }, []);

  const todayTips = useMemo(() => {
    return getDailyTipsForDate(todayKey);
  }, [todayKey]);

  const [readTipIds, setReadTipIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredDailyProgress = JSON.parse(raw);
        if (parsed.date === todayKey && Array.isArray(parsed.readTipIds)) {
          return parsed.readTipIds;
        }
      }
    } catch {
      // Ignore
    }
    return [];
  });

  const [claimedBonus, setClaimedBonus] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredDailyProgress = JSON.parse(raw);
        if (parsed.date === todayKey) {
          return !!parsed.claimedBonus;
        }
      }
    } catch {
      // Ignore
    }
    return false;
  });

  const [activeTipIndex, setActiveTipIndex] = useState<number>(0);

  // Sincroniza persistência local sempre que há alteração de leitura ou bônus
  useEffect(() => {
    try {
      const payload: StoredDailyProgress = {
        date: todayKey,
        readTipIds,
        claimedBonus,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore
    }
  }, [todayKey, readTipIds, claimedBonus]);

  const markTipAsRead = useCallback(
    (tipId: string) => {
      setReadTipIds((prev) => {
        if (prev.includes(tipId)) return prev;
        const next = [...prev, tipId];

        const tip = todayTips.find((t) => t.id === tipId);
        const xp = tip?.xpReward || 15;
        if (onGainXp) {
          onGainXp(xp, `Dica do Dia: ${tip?.title || 'Curiosidade'}`);
        }
        audioEngine.playSfx('click');

        return next;
      });
    },
    [todayTips, onGainXp]
  );

  const claimDailyBonus = useCallback(() => {
    if (claimedBonus) return;
    if (readTipIds.length < todayTips.length) return;

    setClaimedBonus(true);
    audioEngine.playSfx('fanfare');
    if (onGainXp) {
      onGainXp(BONUS_XP_ALL_TIPS, 'Bônus 5 Dicas do Dia Concluídas!');
    }
  }, [claimedBonus, readTipIds.length, todayTips.length, onGainXp]);

  const allTipsRead = readTipIds.length >= todayTips.length && todayTips.length > 0;
  const unreadCount = Math.max(0, todayTips.length - readTipIds.length);

  const currentTip = todayTips[activeTipIndex] || todayTips[0];

  const nextTip = useCallback(() => {
    setActiveTipIndex((prev) => (prev + 1) % todayTips.length);
    audioEngine.playSfx('click');
  }, [todayTips.length]);

  const prevTip = useCallback(() => {
    setActiveTipIndex((prev) => (prev - 1 + todayTips.length) % todayTips.length);
    audioEngine.playSfx('click');
  }, [todayTips.length]);

  return {
    todayKey,
    todayTips,
    activeTipIndex,
    setActiveTipIndex,
    currentTip,
    readTipIds,
    markTipAsRead,
    isTipRead: (tipId: string) => readTipIds.includes(tipId),
    allTipsRead,
    unreadCount,
    claimedBonus,
    claimDailyBonus,
    nextTip,
    prevTip,
    bonusXpAmount: BONUS_XP_ALL_TIPS,
  };
}
