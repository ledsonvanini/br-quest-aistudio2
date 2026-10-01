# Plano Consolidado de Refatoração Arquitetural: O Caminho para a Versão Beta
**BR Quest — O Super App da Geografia Viva, Clima e Identidade Nacional**  
*Documento Estratégico & Engenharia:* `/plan/2026-09-30_plano_consolidado_refatoracao_caminho_beta.md`  
*Data:* 30 de Setembro de 2026 | *Versão:* 3.0.0 (Beta Milestone)  
*Status:* Pronto para Execução  

---

## 1. Contexto e Justificativa de Negócio & Filosofia

Conforme estabelecido em `me_convenca.md` e `plano_de_negocio.md`, o BR Quest ancora sua tese no **"Cavalo de Troia da Curiosidade"**:
- O usuário é atraído pelo hábito cotidiano de consultar o clima em tempo real no Globo 3D e descobrir as "5 Dicas do Dia", assimilando o conhecimento do território de forma natural e sem fricção.
- O modelo de negócios Freemium prevê margens de **85% a 90%**, viabilizadas pelo processamento gráfico client-side (WebGL2/Three.js/Canvas).

Para que o produto alcance a **Versão Beta**, a arquitetura de software precisa refletir a mesma excelência do design visual:
1. **Zero Monólitos**: Código com alta coesão e baixo acoplamento, respeitando o limite de 250 a 270 linhas por arquivo.
2. **Zero Hardcoded ou Mocks Espalhados**: Todo dado deve emanar de catálogos formais (`/src/data/`) ou endpoints tipados.
3. **Isolamento Hermético dos 7 Modos**: Cada modo atua como uma lente científica autônoma sem interferência.
4. **Definição de Done (DoD) de 5 Portas**: Todo avanço deve passar por testes 100% verdes, lint estrito, verificação de não-regressão e validação modular.

---

## 2. Diagnóstico dos Três Grandes Gargalos da Codebase

### Gargalo 1: `server.ts` Monolítico (844 linhas) e Dados Hardcoded
- **Problema**: O arquivo do servidor acumula rotas HTTP, constantes de coordenadas de 27 estados, dicionário de geolocalização reversa, mocks climáticos do El Niño e geradores sintéticos de previsão.
- **Risco**: Viola a regra de separação de responsabilidades e introduz duplicação de dados já presentes em `/src/data/`.
- **Solução**:
  - Extrair rotas para `/src/server/routes/` (`climateRoutes.ts`, `geoRoutes.ts`, `authRoutes.ts`, `guardianRoutes.ts`).
  - Extrair mapeamento reverso de estados para `/src/server/geo/stateReverseLookup.ts`.
  - Reutilizar dados meteorológicos padronizados de `/src/services/climate/climateOfflineFallback.ts`.
  - Reduzir `server.ts` para um orchestrator de inicialização Express/Vite enxuto ($\le 90$ linhas).

### Gargalo 2: `App.tsx` Sobrecarregado (1.055 linhas)
- **Problema**: O componente raiz gerencia inline dezenas de `useState` para modais, telemetria, atalhos de teclado, áudio e handlers de navegação.
- **Risco**: Dificuldade de rastreamento de estado global e alto acoplamento visual.
- **Solução**:
  - Criar `useAppModals.ts` (coordenação atômica de abertura/fechamento dos 7 modais do sistema).
  - Criar `useAppKeyboardShortcuts.ts` (captura global de `Ctrl+K`, `Esc` e teclas de navegação).
  - Criar `useAppTelemetrySync.ts` (assinatura de telemetria climática e contadores de API).
  - Criar `AppModalsContainer.tsx` (componente dedicado que agrupa e renderiza os modais).
  - Transformar `App.tsx` em um orquestrador conciso de $\le 150$ linhas.

### Gargalo 3: `IsometricMapCanvas.tsx` Monolítico (2.916 linhas)
- **Problema**: O palco do mapa é responsável pelo canvas gráfico, manipulação de matrizes de zoom/pan e renderização condicional de 6 diálogos modais de estados.
- **Solução**:
  - Extrair os diálogos laterais para `MapLateralDialogsManager.tsx` ($\le 220$ linhas).
  - Extrair a física de câmera e bounds para `useMapCameraController.ts`.

---

## 3. Matriz de Refatoração & Arquitetura Detalhada

```
                                      ARQUITETURA ALVO (VERSÃO BETA)
                                                     │
     ┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
     ▼                                               ▼                                               ▼
[FRONTEND: App.tsx CONCISO]             [MAPA: PALCO & DIÁLOGOS]                        [BACKEND: server.ts MODULAR]
App.tsx (~140 linhas)                   IsometricMapCanvas (~400 linhas)                server.ts (~80 linhas)
├── useAppModals                        ├── CoastalWavesCanvas (WebGL2)                 ├── routes/climateRoutes.ts
├── useAppKeyboardShortcuts             ├── StatePolygonRenderer                        ├── routes/geoRoutes.ts
├── useAppTelemetrySync                 └── MapLateralDialogsManager                    ├── routes/authRoutes.ts
└── AppModalsContainer                      ├── StateClimateDialog                      └── routes/guardianRoutes.ts
    ├── SettingsModal                       ├── StateBiodiversityDialog
    ├── UserProfileModal                    ├── StateGeopoliticsDialog
    ├── BrQuestHubModal                     ├── StateTerritoryDialog
    └── DailyTipsModal                      ├── StateMusicDialog
                                            └── StateAdventureDialog (Direita)
```

---

## 4. Plano de Execução em 4 Etapas Sequenciais

### Etapa 1: Limpeza e Modularização do `server.ts`
1. Criar `/src/server/geo/stateReverseLookup.ts` com o mapeamento fonético/normalizado de UFs brasileiras.
2. Criar `/src/server/routes/climateRoutes.ts` com cache central de 15 minutos, controle de buffer anti-spam e integração com o Open-Meteo.
3. Criar `/src/server/routes/geoRoutes.ts` com o proxy Nominatim.
4. Criar `/src/server/routes/authRoutes.ts` consolidando endpoints de usuário, login convidado e preferências SQLite.
5. Criar `/src/server/routes/guardianRoutes.ts` preparando o endpoint para streaming de IA.
6. Reduzir `server.ts` para apenas registrar os routers e iniciar Vite/Express.
7. Validar com `npm run lint` e testes automatizados.

### Etapa 2: Transformação do `App.tsx` em Orquestrador Conciso
1. Extrair hook `useAppModals.ts` em `/src/hooks/`.
2. Extrair hook `useAppKeyboardShortcuts.ts` em `/src/hooks/`.
3. Extrair hook `useAppTelemetrySync.ts` em `/src/hooks/`.
4. Criar o container `/src/components/modals/AppModalsContainer.tsx` ($\le 180$ linhas).
5. Reescrever `App.tsx` reduzindo-o de 1.055 para $\le 150$ linhas.
6. Validar compilação e não-regressão.

### Etapa 3: Desacoplamento dos Diálogos do Mapa
1. Criar `/src/components/map/dialogs/MapLateralDialogsManager.tsx` contendo a regra de posicionamento à Esquerda (Clima, Biomas, Geopolítica, Território, Música) e à Direita (Aventura).
2. Conectar o manager ao `IsometricMapCanvas.tsx`.
3. Validar a Regra de Não-Interferência Hermética dos 7 Modos.

### Etapa 4: Streaming de IA & Bateria de Testes E2E
1. Atualizar `/api/guardian-chat` para responder via Server-Sent Events / ReadableStream usando `@google/genai` (`generateContentStream`).
2. Conectar efeito máquina de escrever no `GuardianRPGScene.tsx`.
3. Executar suíte completa Playwright E2E para selar a Versão Beta.

---

## 5. Critérios de Aceite para Lançamento da Versão Beta

- [x] `server.ts` com $\le 100$ linhas (atual: 48 linhas), zero mocks inline e rotas desacopladas.
- [x] `App.tsx` orquestrador conciso com `AppModalsContainer.tsx` e hooks dedicados.
- [x] `IsometricMapCanvas.tsx` sem renderização inline de diálogos de estado (`MapLateralDialogsManager.tsx` ativo).
- [x] Standee do Guardião no modo Aventura ampliado com presença heróica, diálogo conciso e zero texto redundante embaixo.
- [x] Suíte de testes unitários 100% verde (20 arquivos de teste, 117 testes aprovados).
- [ ] Chat do Guardião respondendo em streaming sem latência inicial percebida.
- [ ] Sincronização em nuvem via Firebase Firestore operacional a partir do Perfil do Explorador.
