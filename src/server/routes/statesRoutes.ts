/**
 * Rotas de Dados Estruturados dos Estados Brasileiros
 * Projeto: BR Quest
 */

import { Router } from 'express';
import path from 'path';
import fs from 'fs';

export const statesRouter = Router();

statesRouter.get(['/api/states', '/data/states', '/data/states/all.json'], (_req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'states', 'all_states.json');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/json');
      return res.sendFile(filePath);
    }
    res.status(404).json({ error: 'Arquivo all_states.json não encontrado' });
  } catch (e: any) {
    res.status(500).json({ error: 'Erro ao carregar dados dos estados', message: e?.message });
  }
});

statesRouter.get(['/api/states/:uf', '/data/states/:uf'], (req, res) => {
  try {
    const rawUf = Array.isArray(req.params.uf) ? req.params.uf[0] : req.params.uf;
    const uf = (rawUf || '').toLowerCase();
    const filePath = path.join(process.cwd(), 'public', 'states', 'all_states.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const all = JSON.parse(raw);
      const stateData = all[uf.toUpperCase()];
      if (stateData) {
        res.setHeader('Content-Type', 'application/json');
        return res.json(stateData);
      }
    }
    res.status(404).json({ error: `Estado ${uf.toUpperCase()} não encontrado` });
  } catch (e: any) {
    res.status(500).json({ error: 'Erro ao carregar estado', message: e?.message });
  }
});
