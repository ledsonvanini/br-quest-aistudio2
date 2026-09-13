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
│ H1: Imediato  │ "5 Dicas do Dia: Você Sabia?"    │ Retenção & DAU (Alavanca) │ Prior.1│
│ H1: Imediato  │ Nuvem & Auth (Firebase)          │ Conversão Free -> Pro     │ Prior.2│
│ H1: Imediato  │ Modularização de `BrazilMapD3`   │ Governança (250-270 lin)  │ Prior.3│
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

#### 1. Implementação do Mecanismo "5 Dicas do Dia: Você Sabia?"
- **Objetivo Estratégico:** Ativar o "Cavalo de Troia da Curiosidade" mapeado no Plano de Negócio (Seção 4).
- **Escopo Funcional:**
  - Carrossel / Card flutuante diário exibindo mini-drops de curiosidades oficiais baseadas em dados abertos (IBGE/INPE/NASA).
  - Botão de ação com teletransporte imediato (*"Ver no Globo 3D"* ou *"Explorar Estado"*).
  - Contador de leitura diária concedendo bônus de XP de exploração.

#### 2. Camada de Identidade e Nuvem (Firebase Auth + Firestore)
- **Objetivo Estratégico:** Habilitar a monetização do **Passe do Guardião Pro** e eliminar a perda de progresso em limpezas de cache.
- **Escopo Funcional:**
  - Autenticação federada (Google e E-mail/Senha).
  - Sincronização multi-dispositivo do perfil do jogador, nível de Guardião, XP acumulado, insígnias conquistadas e itens do baú de relíquias.
  - Suporte a perfil de visitante (anônimo) que migra o progresso local do `localStorage` para a nuvem ao autenticar.

#### 3. Refatoração e Decomposição de `src/components/map/BrazilMapD3.tsx`
- **Objetivo Estratégico:** Conformidade estrita com o limite de 250 a 270 linhas estipulado em `MODES_ARCHITECTURE_AND_CODE_GUIDELINES.md` e `requisitos_funcionais_e_nao_funcionais.md`.
- **Escopo Funcional:**
  - Extração de hooks: `useD3Projection`, `useD3ZoomPan` e `useMapBounds`.
  - Separação de subcomponentes de renderização vetorial.

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
