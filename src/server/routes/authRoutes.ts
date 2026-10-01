/**
 * Rotas de Autenticação, Usuário e Preferências Desacopladas (SQLite)
 * Projeto: BR Quest
 */

import { Router } from 'express';
import { userRepository } from '../db/userRepository';

export const authRouter = Router();

authRouter.post('/api/auth/register', (req, res) => {
  try {
    const { username, displayName, email, password } = req.body || {};
    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Nome de usuário é obrigatório.' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const existing = userRepository.findByUsername(cleanUsername);
    if (existing) {
      return res.status(409).json({ error: 'Nome de usuário já está em uso.' });
    }

    const newUser = userRepository.create({
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      username: cleanUsername,
      display_name: displayName?.trim() || cleanUsername,
      email: email?.trim() || null,
      password_hash: password ? `hash_${password}` : null,
      avatar_id: 'recruta',
      is_guest: 0,
    });

    res.status(201).json({
      user: {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.display_name,
        email: newUser.email,
        avatarId: newUser.avatar_id,
        isGuest: false,
        createdAt: newUser.created_at,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao criar conta', message: err?.message });
  }
});

authRouter.post('/api/auth/login', (req, res) => {
  try {
    const { usernameOrEmail } = req.body || {};
    if (!usernameOrEmail || !usernameOrEmail.trim()) {
      return res.status(400).json({ error: 'Identificador de usuário obrigatório.' });
    }

    const user = userRepository.findByUsername(usernameOrEmail.trim().toLowerCase()) 
      || userRepository.findByEmail(usernameOrEmail.trim().toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    userRepository.updateLastLogin(user.id);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        email: user.email,
        avatarId: user.avatar_id,
        isGuest: Boolean(user.is_guest),
        createdAt: user.created_at,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao autenticar', message: err?.message });
  }
});

authRouter.post('/api/auth/google', (req, res) => {
  try {
    const { email, displayName, avatarUrl, googleId } = req.body || {};
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'E-mail obrigatório para Login com Google.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = userRepository.findByEmail(cleanEmail);

    if (!user) {
      const generatedUsername = cleanEmail.split('@')[0] || `google_${Math.random().toString(36).slice(2, 6)}`;
      let uniqueUsername = generatedUsername;
      if (userRepository.findByUsername(uniqueUsername)) {
        uniqueUsername = `${generatedUsername}_${Math.random().toString(36).slice(2, 5)}`;
      }

      user = userRepository.create({
        id: `goog_${googleId || Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        username: uniqueUsername,
        display_name: displayName?.trim() || uniqueUsername,
        email: cleanEmail,
        password_hash: null,
        avatar_id: avatarUrl || 'recruta',
        is_guest: 0,
      });
    } else {
      userRepository.updateLastLogin(user.id);
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        email: user.email,
        avatarId: user.avatar_id,
        isGuest: Boolean(user.is_guest),
        createdAt: user.created_at,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao autenticar via Google', message: err?.message });
  }
});

authRouter.post('/api/auth/guest', (_req, res) => {
  try {
    const guestId = `guest_${Math.random().toString(36).slice(2, 8)}`;
    const guest = userRepository.create({
      id: guestId,
      username: guestId,
      display_name: 'Explorador Convidado',
      email: null,
      password_hash: null,
      avatar_id: 'recruta',
      is_guest: 1,
    });

    res.json({
      user: {
        id: guest.id,
        username: guest.username,
        displayName: guest.display_name,
        isGuest: true,
        createdAt: guest.created_at,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao gerar sessão de convidado', message: err?.message });
  }
});

authRouter.get('/api/user/me', (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'userId obrigatório' });

    const user = userRepository.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        email: user.email,
        avatarId: user.avatar_id,
        isGuest: Boolean(user.is_guest),
        createdAt: user.created_at,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar dados do usuário', message: err?.message });
  }
});

authRouter.get('/api/user/preferences', (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'userId obrigatório' });

    const prefs = userRepository.getPreferences(userId);
    res.json({ preferences: prefs });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar preferências', message: err?.message });
  }
});

authRouter.put('/api/user/preferences', (req, res) => {
  try {
    const { userId, ...rest } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'userId obrigatório' });

    userRepository.savePreferences({
      user_id: userId,
      sound_enabled: rest.soundEnabled ?? true,
      default_map_mode: rest.defaultMapMode || '2d',
      high_contrast: rest.highContrast ?? false,
      auto_rotate_globe: rest.autoRotateGlobe ?? true,
      theme: rest.theme || 'cartographic',
      music_volume: rest.musicVolume ?? 80,
      sfx_volume: rest.sfxVolume ?? 85,
      favorites: rest.favorites,
      updated_at: new Date().toISOString(),
    });

    const updated = userRepository.getPreferences(userId);
    res.json({ preferences: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao salvar preferências', message: err?.message });
  }
});

authRouter.get('/api/user/progress', (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'userId obrigatório' });

    const progress = userRepository.getProgress(userId);
    res.json({ progress });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar progresso', message: err?.message });
  }
});

authRouter.put('/api/user/progress', (req, res) => {
  try {
    const { userId, progress } = req.body || {};
    if (!userId || !progress) return res.status(400).json({ error: 'userId e progress obrigatórios' });

    userRepository.saveProgress({
      user_id: userId,
      xp: progress.xp || 0,
      level: progress.level || 1,
      daily_streak: progress.dailyStreak || 1,
      unlocked_insignias: progress.unlockedInsignias || [],
      completed_states: progress.completedStates || [],
      read_pergaments: progress.readPergaments || [],
      explored_dialogues: progress.exploredDialogues || [],
      score_history: progress.scoreHistory || [],
      updated_at: new Date().toISOString(),
    });

    res.json({ status: 'ok' });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao salvar progresso', message: err?.message });
  }
});
