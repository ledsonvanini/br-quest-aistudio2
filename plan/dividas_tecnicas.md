# Registro Vivo de Dívidas Técnicas (Technical Debt Backlog)
**BR Quest — Plataforma Gamificada de Inteligência Geográfica, Biodiversidade e Globo 3D**  
*Documento Dinâmico:* `/plan/dividas_tecnicas.md` | *Versão:* 1.0.0 (Setembro de 2026)  
*Status:* Arquivo Vivo (Atualizado a cada ciclo de refatoração e lançamento)

---

## 1. Visão Geral e Matriz de Criticidade

Este documento mapeia e quantifica as dívidas técnicas acumuladas ao longo da evolução rápida do protótipo e da consolidação das microengines gráficas (Three.js, WebGL2, D3.js, áudio sintetizado e cartografia interativa). O objetivo é orientar o time de engenharia na priorização de refatorações sem comprometer a estabilidade do produto em produção.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MATRIZ DE DÍVIDAS TÉCNICAS (BR QUEST)                │
├───────────────────┬───────────────────┬───────────────────┬─────────────┤
│ Gravidade / Área  │ Arquitetura / Qty │ Funcional / Nuvem │ UX / A11y   │
├───────────────────┼───────────────────┼───────────────────┼─────────────┤
│ 🔴 CRÍTICA        │ Arquivos > 500 l. │ Sem Nuvem / Auth  │ Lazy Loading│
│ 🟡 MODERADA       │ Tipagens any/cast │ Falta IA Real Srv │ Testes Shdr │
│ 🟢 LEVE / TÉCNICA │ Nomenclaturas CSS │ Cache IndexedDB   │ Micro-sons  │
└───────────────────┴───────────────────┴───────────────────┴─────────────┘
```

---

## 2. Detalhamento por Categoria

### 2.1. Arquitetura de Componentes e Limite de Linhas (Regra 250-270 linhas)
Conforme definido em `MODES_ARCHITECTURE_AND_CODE_GUIDELINES.md`, arquivos de código devem conter preferencialmente entre 250 e 270 linhas. Diversos módulos centrais cresceram organicamente e necessitam de decomposição:

1. **`src/components/map/BrazilGlobeR3F.tsx` (Refatorado & Decomposto) 🟢 [RESOLVIDO / CONCLUÍDO]**
   - **Status**: Decomposto com sucesso na Sprint 1. O loop de animação, ciclo solar e controle de câmera foram desacoplados em hooks dedicados:
     - `useGlobeCameraRig`: hook customizado de animação esférica, voo orbital e `setViewOffset`.
     - `useGlobeSolarCycle`: hook de cálculo astronômico, interpolação temporal e dia/noite.
     - `useGlobeAstrometry`: hook de posições astronômicas de Sol, Lua, zodíaco e órbita.
   - **Resultado**: Código modular, alta manutenibilidade e compilação limpa.

2. **`src/components/map/BrazilMapD3.tsx` e sub-modos D3 🟡 [MODERADA]**
   - **Diagnóstico**: Lógica de projeção cartográfica misturada com manipulação de DOM SVG e cálculo de bounds de estados.
   - **Plano de Remediação**: Extrair gerador de paths para `/src/lib/geo/projectionEngine.ts` e isolar renderers de biomas e relevo.

3. **`src/components/globe/GlobeSolarSimulatorPanel.tsx` e abas (~250 linhas) 🟢 [ESTÁVEL]**
   - **Status**: Já modularizado em abas independentes (`GlobeSolarLightingTab`, `FullYearSimulationCard`), mantendo-se dentro dos limites aceitáveis.

---

### 2.2. Camada de Persistência, Identidade e Nuvem
1. **Persistência Volátil em `localStorage` 🔴 [CRÍTICA]**
   - **Diagnóstico**: Todo o progresso do usuário (XP, inventário de relíquias, 27 guardiões desbloqueados, insígnias de bioma e preferências de som) reside exclusivamente no `localStorage` do navegador do cliente.
   - **Impacto no Negócio**: Se o usuário limpa os cookies ou acessa em outro dispositivo, todo o esforço é perdido, impedindo a conversão para planos pagos (Freemium).
   - **Plano de Remediação**:
     - Integração com **Firebase Authentication** (Google Sign-In, E-mail/Senha e Apple).
     - Migração do schema para **Cloud Firestore** com sincronização transparente offline-first e persistência local via IndexedDB como fallback.

---

### 2.3. Inteligência Artificial e Backend dos Guardiões
1. **IA Generativa Conversacional dos 27 Guardiões 🟢 [RESOLVIDO / CONCLUÍDO]**
   - **Status**: Implementado com sucesso.
     - Endpoint server-side seguro `/api/guardian-chat` no `server.ts` consumindo o SDK oficial `@google/genai` (`gemini-3.8-flash`).
     - Serviço isolado `src/server/guardianChatService.ts` com injeção automática de personas regionais dos 27 Guardiões (história, fauna, flora, gastronomia, literatura e hinos) e fallback inteligente offline via Sacred Codex Lore Engine.
     - Componente interativo de interface `GuardianAIChatPanel.tsx` integrado à caixa de diálogo dos Guardiões (`GuardianDialogueBox.tsx`) sob a aba "Oráculo IA", com sugestões rápidas, histórico conversacional e respostas em áudio/texto.

---

### 2.4. Performance Gráfica, Assets e Consumo de Memória
1. **Carregamento Síncrono de Mosaicos e Texturas Planetárias 🟡 [MODERADA]**
   - **Diagnóstico**: As texturas de alta resolução (NASA Blue Marble, Night Lights, Topografia e relevo) são carregadas via `TextureLoader` diretamente pelo canvas 3D.
   - **Impacto**: Em redes 3G/4G ou em computadores escolares com pouca banda, pode ocorrer atraso no primeiro carregamento do globo.
   - **Plano de Remediação**:
     - Adicionar WebP progressivo com fallback para resoluções menores (1K -> 2K -> 4K).
     - Implementar Service Worker inteligente para cache persistente de texturas e malhas TopoJSON em disco local.

2. **Otimização de Render Loop e Desalocação de Shaders WebGL 🟡 [MODERADA]**
   - **Diagnóstico**: Ao alternar repetidamente entre o modo 2D e o Globo 3D, garantir que geometrias Three.js, buffers de materiais e instâncias de Canvas WebGL2 (`OceanShaderCanvas`) executem `dispose()` estrito para evitar vazamentos na VRAM.

---

### 2.5. Acessibilidade (A11y) e Internacionalização (i18n)
1. **Navegação por Teclado em Elementos Canvas 🟡 [MODERADA]**
   - **Diagnóstico**: Os elementos desenhados diretamente no Canvas ( Three.js e WebGL) não são nativamente focáveis por leitores de tela.
   - **Plano de Remediação**: Expandir a camada de HUD HTML e links acessíveis (`aria-live`, `aria-label`, foco em botões dos 27 estados) já padronizados com a regra `classe-para-humanos`.

2. **Infraestrutura de Multilíngue (i18n) para Mercado Estrangeiro 🟡 [MODERADA]**
   - **Diagnóstico**: Todas as constantes de texto estão escritas diretamente em português nos arquivos `/src/data/...`.
   - **Plano de Remediação**: Extrair strings de interface para um dicionário centralizado com suporte inicial a `pt-BR`, `en-US` e `es-ES`.

---

### 2.6. Automação de Testes e Garantia de Qualidade
1. **Cobertura Específica de Shaders e Canvas 🟢 [LEVE]**
   - **Diagnóstico**: O ecossistema possui testes E2E básicos com Playwright, mas carece de testes de regressão visual para garantir que os shaders do oceano e iluminação dia/noite mantenham a fidelidade após alterações no CSS global.

---

## 3. Matriz de Priorização para os Próximos Sprints

| Item / Dívida Técnica | Esforço | Impacto | Status |
| :--- | :---: | :---: | :---: |
| Decompor `BrazilGlobeR3F.tsx` em hooks e subcomponentes | 8 pts | Alto | Concluído (Sprint 1) |
| Endpoint `/api/guardian-chat` com IA Gemini server-side & Chat UI | 8 pts | Crítico | Concluído (Sprint 1) |
| Camada de Autenticação e Nuvem (Firebase Auth + Firestore) | 13 pts | Crítico | Em Planejamento |
| Lazy loading e compressão WebP de texturas da NASA/ESA | 5 pts | Médio | Backlog |
| Dicionário de Internacionalização (i18n: Inglês/Espanhol) | 8 pts | Alto | Backlog |
| Testes automatizados de regressão visual de shaders | 5 pts | Médio | Backlog |

---

*Este documento deve ser revisado ao final de cada ciclo quinzenal de engenharia.*
