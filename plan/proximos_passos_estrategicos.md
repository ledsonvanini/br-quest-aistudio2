# Próximos Passos Estratégicos e Evolução do Produto
**BR Quest — O Super App da Geografia Viva, Clima e Identidade Nacional**  
*Documento Estratégico:* `/plan/proximos_passos_estrategicos.md` | *Versão:* 1.0.0 (Setembro de 2026)

---

## 1. Contexto e Status Atual da Plataforma

Após a conclusão das duas entregas estruturais críticas (Sprint 1):
1. **Modularização da Engine do Globo 3D (`BrazilGlobeR3F.tsx`)**: Desacoplada em hooks especializados (`useGlobeCameraRig`, `useGlobeSolarCycle`, `useGlobeAstrometry`).
2. **Oráculo IA dos 27 Guardiões Estaduais (`@google/genai` server-side)**: Rota `/api/guardian-chat`, injeção das personas canônicas dos 27 estados e interface interativa integrada no `GuardianDialogueBox.tsx`.

A plataforma atinge maturidade de infraestrutura gráfica e de IA. A transição agora deve focar em **retenção de usuários diários**, **monetização Freemium** e **adoção institucional (B2B/B2G)**.

---

## 2. Matriz de Classificação Estratégica dos Próximos Passos

Os próximos passos foram agrupados em quatro pilares estratégicos, priorizados conforme **Impacto no Negócio**, **Viabilidade Técnica** e **Alinhamento com o Plano de Negócio**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MATRIZ DE HORIZONTES E EVOLUÇÃO ESTRATÉGICA                     │
├───────────────┬──────────────────────────────────┬───────────────────────────┬────────┤
│ Horizonte     │ Iniciativa                       │ Pilar de Valor            │ Status │
├───────────────┼──────────────────────────────────┼───────────────────────────┼────────┤
│ H1: Imediato  │ "5 Dicas do Dia: Você Sabia?"    │ Retenção & DAU (Alavanca) │Concluído
│ H1: Imediato  │ SQLite Local (Dados & Prefs)     │ Persistência Leve e Rápida│Concluído
│ H1: Imediato  │ Arquitetura de Auth Desacoplada  │ Flexibilidade de Vendors  │Concluído
│ H1: Imediato  │ Buffer & Cache Central de APIs   │ Resiliência & Custo Zero  │Concluído
│ H1: Imediato  │ Painel Explorador: Favs/Hist/Prefs│ Retenção & Engajamento   │ Em Execução
│ H1: Imediato  │ Nuvem / Auth no Firestore        │ Sincronização & Identidade│ Planej.│
│ H1: Imediato  │ Modularização de `MapStatesLayer`│ Governança (250-270 lin)  │ Prior.1│
├───────────────┼──────────────────────────────────┼───────────────────────────┼────────┤
│ H2: Médio     │ Portal do Educador (BR Quest Edu)│ B2B Escolas & BNCC        │ Planej.│
│ H2: Médio     │ PWA & Cache L3 (IndexedDB)       │ Performance & Uso Escolar │ Planej.│
│ H2: Médio     │ Streaming de IA no Chat dos Guard│ UX Conversacional Fluida  │ Planej.│
├───────────────┼──────────────────────────────────┼───────────────────────────┼────────┤
│ H3: Expansão  │ Internacionalização (i18n)       │ Turismo ("Discover Brazil)│ Backlog│
│ H3: Expansão  │ Guardiões da América do Sul      │ Geopolítica Continental   │ Backlog│
│ H3: Expansão  │ Trilhas ESG & Patrocínio B2G     │ Sustentabilidade & Edital │ Backlog│
└───────────────┴──────────────────────────────────┴───────────────────────────┴────────┘
```

---

## 3. Detalhamento dos Próximos Passos por Horizonte

### Horizonte 1: Imediato (Sprint 2 — Fundação de Retenção & Conversão)

#### 1. Mecanismo "5 Dicas do Dia: Você Sabia?" [CONCLUÍDO]
- **Objetivo Estratégico:** Ativar o "Cavalo de Troia da Curiosidade" mapeado no Plano de Negócio (Seção 4).
- **Entregáveis Implementados:**
  - `src/data/dailyTipsData.ts`: Catálogo de curiosidades geo-históricas com dados oficiais (IBGE, INPE, NASA, ICMBio) e seleção determinística diária com base na data brasileira.
  - `src/hooks/useDailyTips.ts`: Hook com persistência local, rastreio de dicas lidas e concessão de XP (+10 XP por dica, +50 XP bônus ao ler as 5).
  - `src/components/quest/DailyTipsModal.tsx` & `DailyTipCard.tsx`: Modal interativo responsivo com botões de teletransporte direto para o estado em 2D ou Globo 3D.
  - Integração no `TopRightNavigationDock.tsx`, `TopGlobalNavMenu.tsx`, `IsometricMapCanvas.tsx` e `App.tsx` com contador de não lidas e badge animado.

#### 2. SQLite Local (Dados & Preferências) e Arquitetura de Auth Desacoplada [CONCLUÍDO]
- **Objetivo Estratégico:** Garantir uma camada local rápida e leve (`node:sqlite` nativo em `src/server/db/database.ts` e `userRepository.ts`) para dados, configurações e preferências locais do usuário, mantendo a arquitetura de autenticação completamente desacoplada (Vendor-Agnostic) para facilitar troca de fornecedores sem acoplamento a bibliotecas proprietárias no backend.
- **Entregáveis Implementados:**
  - `src/server/db/database.ts`: Instância singleton SQLite nativa com esquema de tabelas para usuários, preferências de interface e progresso local.
  - `src/server/db/userRepository.ts`: Interface e repositório desacoplado para persistência de dados de usuários e preferências.
  - Endpoints REST em `server.ts` (`/api/auth/*`, `/api/user/preferences`, `/api/user/progress`, `/api/climate/*`, `/api/species/*` com cache e buffer inteligente de rate-limiting).

#### 3. Painel do Explorador: Favoritos, Histórico & Preferências Avançadas [EM EXECUÇÃO]
- **Objetivo Estratégico:** Fornecer ao usuário controle unificado sobre suas preferências de visualização, curadoria de conteúdos prediletos (biomas, fauna, flora e UFs) e acompanhamento do histórico de progresso, impulsionando retenção e personalização.
- **Entregáveis em Desenvolvimento:**
  - `src/types/userPreferences.ts`: Tipagem expandida com listas de favoritos (biomas, espécies e estados), metas de aprendizado e histórico de pontuações.
  - Expansão do schema SQLite em `src/server/db/database.ts` e repositório `userRepository.ts` para persistência local de favoritos e histórico.
  - Decomposição modular do `UserProfileModal.tsx` em abas especializadas (`FavoritosTab`, `HistoricoTab`, `PreferenciasTab`, `IdentidadeTab`) respeitando o teto de 250 linhas.

#### 4. Autenticação e Sincronização em Nuvem (Firestore / Firebase Auth) [PLANEJAMENTO]
- **Objetivo Estratégico:** Habilitar autenticação federada (Google / E-mail) e sincronização multi-dispositivo do progresso via Firestore, conectando-se à camada de identidade sem quebrar a flexibilidade dos adaptadores.
- **Escopo Funcional:**
  - Setup do Firebase via `set_up_firebase` no momento em que a nuvem for acionada.
  - Sincronização em nuvem do progresso e inventário mantendo fallback local consistente.

#### 5. Refatoração e Decomposição de `src/components/map/MapStatesLayer.tsx` [PRÓXIMO PASSO]
- **Objetivo Estratégico:** Conformidade estrita com o limite de 250 a 270 linhas estipulado em `MODES_ARCHITECTURE_AND_CODE_GUIDELINES.md` e `requisitos_funcionais_e_nao_funcionais.md` (`MapStatesLayer.tsx` atualmente possui ~1.000 linhas).
- **Escopo Funcional:**
  - Extração de camadas: `SouthAmericaLandmassLayer.tsx`, `StatePolygonRenderer.tsx`, `StateFillStyler.ts`.
  - Isolamento de handlers e overlays temáticos.

---

### Horizonte 2: Médio Prazo (Sprint 3 e 4 — Engajamento B2B & PWA)

#### 4. Painel do Educador ("BR Quest Edu" — B2B Escolar)
- **Objetivo Estratégico:** Validar a proposta B2B descrita no plano executivo com precificação de R$ 3,50 a R$ 6,00/aluno/mês.
- **Escopo Funcional:**
  - Criação de turmas e acompanhamento de relatórios diagnósticos para simulados e ENEM.
  - Trilhas pedagógicas por bioma (Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa).
  - Exportação de fichas e relatórios de atividades em PDF/CSV.

#### 5. PWA (Progressive Web App) & Cache L3 Offline
- **Objetivo Estratégico:** Permitir uso em escolas com infraestrutura de internet instável e instalação direta na tela inicial sem taxa de download de app stores.
- **Escopo Funcional:**
  - Service Worker com estratégia Cache-First para texturas planetárias e malhas TopoJSON do IBGE.
  - Manifest PWA com ícones responsivos, splash screen e suporte a instalação desktop/mobile.

#### 6. Streaming Reativo e RAG no Oráculo dos Guardiões
- **Objetivo Estratégico:** Reduzir o tempo de resposta percebido da IA e enriquecer as falas com dados climáticos ao vivo.
- **Escopo Funcional:**
  - Suporte a Server-Sent Events (SSE) ou streaming chunks no endpoint `/api/guardian-chat`.
  - Injeção dinâmica da telemetria meteorológica da capital no system prompt do modelo.

---

### Horizonte 3: Longo Prazo (Escala Internacional & Expansão B2G/ESG)

#### 7. Internacionalização Completa (i18n — "BR Quest: Discover Brazil")
- **Objetivo Estratégico:** Capturar o mercado de turismo internacional e estudantes estrangeiros de língua inglesa e espanhola.
- **Escopo Funcional:**
  - Dicionários i18n em Inglês e Espanhol para as lendas, biomas, fichas dos 27 estados e interface geral.

#### 8. Expansão "Guardiões da América do Sul" (Geopolítica Continental)
- **Objetivo Estratégico:** Ampliar a cartografia vetorial e os arcos geodésicos para os países limítrofes e bacias hidrográficas transfronteiriças.

#### 9. Trilhas Corporativas ESG e Licenciamento Governamental (B2G)
- **Objetivo Estratégico:** Monetização em editais públicos do MEC/FNDE e patrocínios de marcas alinhadas a sustentabilidade (ex: trilhas de transição energética e conservação hídrica).

---

## 4. Próxima Ação Recomendada

Iniciar imediatamente pelo **Horizonte 1 (Passo 1: "5 Dicas do Dia: Você Sabia?")**, pois é uma alavanca de zero fricção técnica que conecta o Clima e o Globo 3D, gerando impacto direto nas métricas de engajamento e retenção diária (DAU).
