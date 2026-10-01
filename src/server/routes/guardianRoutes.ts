/**
 * Rotas de Diálogo Inteligente com os 27 Guardiões Estaduais (Gemini API)
 * Projeto: BR Quest
 */

import { Router } from 'express';
import { processGuardianChat } from '../guardianChatService';

export const guardianRouter = Router();

guardianRouter.post('/api/guardian-chat', async (req, res) => {
  try {
    const { guardianId, message, history, context } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Mensagem obrigatória para dialogar com o Guardião.' });
    }

    const result = await processGuardianChat({
      guardianId: guardianId || 'AM',
      message: message.trim(),
      history,
      context,
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      error: 'Falha ao processar diálogo com o Guardião',
      message: err?.message,
    });
  }
});
