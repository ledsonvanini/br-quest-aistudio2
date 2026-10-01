/**
 * Servidor Principal da Aplicação BR Quest
 * Arquitetura Modular e Desacoplada: Roteadores express montados com Vite em Dev
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { climateRouter } from './src/server/routes/climateRoutes';
import { geoRouter } from './src/server/routes/geoRoutes';
import { statesRouter } from './src/server/routes/statesRoutes';
import { guardianRouter } from './src/server/routes/guardianRoutes';
import { authRouter } from './src/server/routes/authRoutes';

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // 1. Montagem dos Roteadores Modulares (Zero Hardcoding)
  app.use(climateRouter);
  app.use(geoRouter);
  app.use(statesRouter);
  app.use(guardianRouter);
  app.use(authRouter);

  // 2. Vite middleware em desenvolvimento vs bundle estático em produção
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BR-QUEST SERVER] Servidor Express ativo na porta ${PORT} com arquitetura modular desacoplada.`);
  });
}

startServer();
