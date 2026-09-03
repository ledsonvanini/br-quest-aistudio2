# Plano Mestre de Refatoração e Saúde de Código do Sistema
**Data:** 02 de Setembro de 2026  
**Documento:** `/plan/REFACTORING_PLAN_2026_09_02.md`  
**Status:** Aprovado para Execução Faseada  
**Princípio Maior:** Não-Regressão Absoluta (Zero Quebra de UI / UX / Funcionalidades) + Conformidade Estrita com `classe-para-humanos`

---

## 1. Sumário Executivo e Objetivos

Este plano estabelece a estratégia técnica detalhada para a modernização, redução de complexidade ciclomática, otimização de cache, consolidação de dados e higienização do código-fonte do projeto **BR Quest / Brasil Interativo**.

### Metas Estratégicas:
1. **Regra de Ouro dos Arquivos (Teto de 270 Linhas):** Decompor todos os 61 arquivos que atualmente ultrapassam 270 linhas em submódulos coesos, componentes atômicos especializados e custom hooks.
2. **Arquitetura Coesa e Separação de Camadas:** Isolar Camada de Apresentação (View/UI), Camada de Lógica/Orquestração (Hooks), Camada de Domínio/Dados (Bundles e Regras de Negócio) e Camada de Infraestrutura/Integração (Serviços e APIs).
3. **Eliminação de Redundâncias e Fonte Única da Verdade (SSOT):** Migrar progressivamente os monolitos legados de dados para a nova arquitetura modular de bundles (`src/data/states/{uf}/`), mantendo fachadas retrocompatíveis (`facade adapters`) para garantir zero quebra de imports.
4. **Funções Reaproveitáveis e Parametrizadas:** Centralizar utilitários de transformação geométrica/projeções, formatação numérica/moeda/biomas, hooks de acessibilidade/modais e síntese de áudio.
5. **Otimização de Cache e Saúde de Consumo de APIs (API Usage Health):** Estabelecer arquitetura de cache em 3 níveis (Memória L1 + Persistência Local L2 + Fallback Offline L3), deduplicação de requisições em voo (*in-flight request deduplication*), controle de concorrência com *rate limiting* estrito e telemetria transparente.
6. **Rastreabilidade Total:** Mapeamento exaustivo de cada arquivo com diagnóstico, ação corretiva planejada, arquivos resultantes esperados, impacto funcional e prioridade.

---

## 2. Diagnóstico Atual do Sistema (Baseline Audit)

### 2.1 Mapeamento de Arquivos que Excedem o Teto de 270 Linhas
Atualmente, o projeto possui **61 arquivos** de código fonte (`.ts` e `.tsx`) acima do limite de 270 linhas, totalizando mais de 45.000 linhas concentradas em monólitos:

| # | Arquivo Atual | Linhas | Categoria | Risco de Fragilidade |
|---|---|---|---|---|
| 1 | `src/data/brazilBiodiversityData.ts` | 2.557 | Dados | Monolito estático de espécies e espécimes |
| 2 | `src/data/geopoliticaData.ts` | 2.269 | Dados | Matriz de métricas demográficas, PIB, IDH |
| 3 | `src/components/IsometricMapCanvas.tsx` | 2.189 | UI / Motor | Canvas central acumulando projeção, gestos e HUD |
| 4 | `src/data/musicalHeritageData.ts` | 1.610 | Dados | Acervo musical das 27 UFs e gêneros |
| 5 | `src/data/guardiansData.ts` | 1.579 | Dados | Registro detalhado dos 27 Guardiões |
| 6 | `src/components/nav/NavFlyoutMenu.tsx` | 1.388 | UI | Menu flyout com múltiplos sub-painéis embutidos |
| 7 | `src/components/map/ClimatePhenomenaLayer.tsx` | 1.344 | UI / Shaders | Renderização climática, frentes e partículas |
| 8 | `src/components/music/VintageRadioPlayer.tsx` | 1.259 | UI / Áudio | Player vintage de rádio e sintetizador |
| 9 | `src/data/anthemsData.ts` | 1.117 | Dados | Letras e dados históricos dos hinos |
| 10 | `src/components/TopGlobalNavMenu.tsx` | 1.028 | UI | Barra superior com múltiplos seletores acoplados |
| 11 | `src/data/stateQuestionsData.ts` | 990 | Dados | Banco de perguntas regionais por estado |
| 12 | `src/components/map/GeopoliticsControlPanel.tsx` | 976 | UI | Painel de controle de geopolítica |
| 13 | `src/components/CodexInsignias.tsx` | 962 | UI | Painel e visualizador de insígnias e troféus |
| 14 | `src/components/map/MapStatesLayer.tsx` | 950 | UI / SVG | Camada de renderização vetorial de caminhos SVG |
| 15 | `src/components/map/BrazilGlobeR3F.tsx` | 894 | UI / 3D | Globo Three.js / React Three Fiber |
| 16 | `src/data/brQuestQuestionsData.ts` | 890 | Dados | Banco de questões nacionais do BrQuest |
| 17 | `src/components/guardian/GuardianInventoryModal.tsx` | 888 | UI | Modal do inventário cultural do jogador |
| 18 | `src/components/GuardianRPGScene.tsx` | 843 | UI / RPG | Cenário RPG do Guardião em 3D/2.5D |
| 19 | `src/data/stateClimatologyData.ts` | 821 | Dados | Dados climatológicos de referência histórica |
| 20 | `src/data/culturalInventoryData.ts` | 818 | Dados | Itens colecionáveis e artefatos culturais |
| 21 | `src/components/map/StateBiodiversityDialog.tsx` | 781 | UI / Modal | Modal de detalhes de fauna/flora do estado |
| 22 | `src/App.tsx` | 755 | Orquestração | Raiz com excesso de estados e listeners |
| 23 | `src/components/GuardianDialog.tsx` | 742 | UI / Modal | Diálogo interativo com o Guardião |
| 24 | `src/components/map/StateClimateDialog.tsx` | 741 | UI / Modal | Modal com telemetria climática e gráficos |
| 25 | `src/components/map/UnifiedStateHoverTooltip.tsx` | 695 | UI | Tooltip flutuante com múltiplos subtemas |
| 26 | `src/components/guardian/GuardianDialogueBox.tsx` | 689 | UI | Caixa de narrativa com vozes e retratos |
| 27 | `src/services/climateService.ts` | 682 | Serviço | Chamadas Open-Meteo, telemetria e cache |
| 28 | `src/components/DynamicAppFooter.tsx` | 655 | UI | Rodapé com telemetria climática e controles |
| 29 | `src/services/apiTracker.ts` | 654 | Serviço | Telemetria de requisições, métricas e erros |
| 30 | `src/components/map/BiodiversityMapLayer.tsx` | 615 | UI | Camada de pontos e marcadores de espécies |
| 31 | `src/components/quest/BrQuestHubModal.tsx` | 614 | UI | Hub central da jornada de perguntas |
| 32 | `src/components/ApiStatusModal.tsx` | 609 | UI | Modal com status e histórico de APIs |
| 33 | `src/components/map/MapControlsHUD.tsx` | 600 | UI | HUD com botões de zoom, filtros e modos |
| 34 | `src/components/guardian/GuardianQuizModal.tsx` | 583 | UI | Quiz interativo do Guardião |
| 35 | `src/components/map/GeopoliticsMapLayer.tsx` | 572 | UI | Camada coroplética do mapa com gradientes |
| 36 | `src/components/map/BiodiversityControlPanel.tsx` | 572 | UI | Painel de filtros de reino/bioma/ameaça |
| 37 | `src/lib/mapProjections.ts` | 547 | Utilitário | Cálculos de projeção, matrizes e bounds |
| 38 | `src/components/map/ClimateControlPanel.tsx` | 540 | UI | Painel de controle de variáveis climáticas |
| 39 | `src/services/biodiversityImageService.ts` | 533 | Serviço | Busca iNaturalist, GBIF, Wikimedia e cache |
| 40 | `src/components/guardian/GuardianItemReadingModal.tsx` | 524 | UI | Leitor de pergaminho/documentos do item |
| 41 | `src/components/map/StateGeopoliticsDialog.tsx` | 483 | UI | Modal detalhado de geopolítica e indicadores |
| 42 | `src/components/guardian/RPGEnvironmentGadgetHUD.tsx` | 482 | UI | HUD de equipamentos e mini-gadgets |
| 43 | `src/components/map/GizmoCompassHUD.tsx` | 478 | UI | Rosa dos ventos e indicador de rotação |
| 44 | `server.ts` | 461 | Backend | Servidor Express, proxies e rotas |
| 45 | `src/components/map/CoastalWavesCanvas.tsx` | 449 | UI / Canvas | Simulação procedural de ondas costeiras |
| 46 | `src/components/map/CartographicGraticuleLayer.tsx` | 449 | UI / Canvas | Grade de coordenadas geográficas e paralelos |
| 47 | `src/data/guardianPhrases.ts` | 446 | Dados | Frases situacionais e falas dos guardiões |
| 48 | `src/components/map/RainSimulationLayer.tsx` | 392 | UI / Canvas | Canvas de simulação de chuva procedural |
| 49 | `src/components/map/MapStateCarousel.tsx` | 383 | UI | Carrossel horizontal de navegação de estados |
| 50 | `src/components/music/RadioCabinetIllustrations.tsx` | 359 | UI / SVG | Desenho dos gabinetes de rádio retrô |
| 51 | `src/services/biodiversityService.ts` | 350 | Serviço | Consultas de ocorrências taxonômicas |
| 52 | `src/components/map/CulturalChestInventory.tsx` | 347 | UI | Baú cultural e inventário do estado |
| 53 | `src/components/guardian/GuardianWelcomeModal.tsx` | 345 | UI | Modal de boas-vindas do guardião do estado |
| 54 | `src/lib/audioSynth.ts` | 343 | Utilitário | Sintetizador de áudio WebAudio procedural |
| 55 | `src/data/brazilStatesRegistry.ts` | 338 | Dados | Registro básico das 27 UFs |
| 56 | `src/components/SettingsModal.tsx` | 334 | UI | Configurações de som, idioma e preferências |
| 57 | `src/components/map/CustomCanvasCursor.tsx` | 329 | UI | Cursor cartográfico customizado |
| 58 | `src/lib/vintageRadioEngine.ts` | 322 | Áudio / Motor | Motor de sintonia e estática de rádio |
| 59 | `src/data/vintageRadioEras.ts` | 297 | Dados | Metadados históricos das eras do rádio |
| 60 | `src/data/southAmericaNeighborsData.ts` | 295 | Dados | Países vizinhos da América do Sul |
| 61 | `src/components/map/MapPinsLayer.tsx` | 290 | UI | Marcadores de bandeiras e mastros no mapa |

---

## 3. Pilares da Arquitetura Alvo

### 3.1 Pilar 1: Arquitetura em Camadas Estritas
```
┌─────────────────────────────────────────────────────────────┐
│ 1. APRESENTAÇÃO (UI / React 18 Components)                  │
│   - Componentes Puros e Atômicos (≤ 200 linhas)             │
│   - Classes obrigatórias 'classe-para-humanos'              │
│   - Zero lógica de rede ou cálculos complexos inline        │
├─────────────────────────────────────────────────────────────┤
│ 2. LÓGICA E ORQUESTRAÇÃO (Custom Hooks & Controllers)       │
│   - useMapNavigation, useClimateTelemetry, useAudioPlayer  │
│   - Gerenciamento de ciclo de vida e estado local           │
├─────────────────────────────────────────────────────────────┤
│ 3. DOMÍNIO E MODELOS DE DADOS (SSOT Bundles)                │
│   - /src/data/states/{uf}/ (Bundles encapsulados por estado)│
│   - Facades unificados (getStateBundle, getGuardianByUf)    │
├─────────────────────────────────────────────────────────────┤
│ 4. INFRAESTRUTURA E APIS (Services & Caching)               │
│   - Cache L1 (Memória) -> L2 (LocalStorage) -> L3 (Offline) │
│   - In-flight Promise Sharing & Deduplication               │
│   - Rate Limiting e Circuit Breaker                         │
│   - Telemetria de Saúde no apiTracker                       │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Pilar 2: Eliminação de Redundâncias e Fonte Única da Verdade
- **Problema Atual:** Dados geográficos e cadastrais repetem-se entre `brazilStatesRegistry.ts`, `guardiansData.ts`, `stateCapitalGeoData.ts`, `stateClimatologyData.ts` e `ALL_STATE_BUNDLES`.
- **Solução Arquitetural:**
  1. A fonte da verdade definitiva é o modelo por estado em `src/data/states/{uf}/`.
  2. O arquivo `src/data/states/index.ts` exporta `ALL_STATE_BUNDLES` e funções de consulta otimizadas.
  3. Módulos legados tornam-se **fachadas finas (Thin Facades)** que apenas leem e re-exportam a partir dos bundles, preservando 100% da compatibilidade de código antigo sem duplicar estruturas na memória.

### 3.3 Pilar 3: Funções Parametrizadas e Utilitários Compartilhados
Criar submódulos especializados em `/src/lib/`:
- `src/lib/formatters.ts`: Formatação de moedas (BRL), percentuais, habitantes, temperaturas (°C), coordenadas (DMS/Decimais).
- `src/lib/geoTransforms.ts`: Funções parametrizadas para conversão lat/lng para coordenadas do canvas SVG e matrizes de rotação isométrica.
- `src/hooks/useModalAccessibility.ts`: Gerenciamento padronizado de tecla ESC, bloqueio de rolagem do body e trapping de foco para todos os modais.
- `src/lib/cacheEngine.ts`: Classe genérica parametrizada `MultiTierCache<T>` para reutilização uniforme em todos os serviços.

### 3.4 Pilar 4: Governança do Limite Máximo de 270 Linhas por Arquivo
- **Componentes React Grandes (> 270 linhas):**
  - Extrair sub-componentes visuais para a pasta do componente (ex: `IsometricMapCanvas/` com `MapViewport.tsx`, `MapPointerEvents.tsx`, `MapOverlays.tsx`).
  - Extrair o estado complexo para um Custom Hook dedicado (ex: `useIsometricMap.ts`).
- **Arquivos de Dados Grandes (> 270 linhas):**
  - Fatiar por região (`norte.ts`, `nordeste.ts`, `centroOeste.ts`, `sudeste.ts`, `sul.ts`) ou por domínio funcional, unificando via `index.ts` re-exporter que respeita o teto.

### 3.5 Pilar 5: Otimização de Cache e Saúde de Consumo de APIs
- **Nível 1 (Memória - L1):** `Map<string, { data: T, timestamp: number }>` com acesso síncrono instantâneo.
- **Nível 2 (Persistência Local - L2):** `localStorage` com controle de cota (limite máx. 4MB) e serialização com timestamp de expiração (TTL de 24h a 14 dias dependendo da volatilidade do dado).
- **Nível 3 (Snapshot Offline - L3):** Banco estático embutido para garantia de funcionamento com 0% de quebra mesmo sem conexão com internet.
- **Deduplicação de Requisições:** Se 3 componentes solicitarem a previsão do tempo do "DF" simultaneamente, apenas 1 requisição de rede é disparada, e os 3 recebem o resultado da mesma Promise.
- **Circuit Breaker:** Se uma API externa retornar erro 429 ou falhar 3 vezes consecutivas, entra em modo de contingência por 5 minutos, servindo imediatamente o cache offline sem onerar a rede ou travar a UI.

---

## 4. Matriz de Rastreabilidade Total por Módulo

Abaixo está o detalhamento módulo a módulo com os diagnósticos, as ações e os novos arquivos projetados (todos com garantia de estarem abaixo de 270 linhas):

### Módulo 1: Core, Shell da Aplicação e Servidor
| Arquivo Original | Linhas | Problemas Identificados | Ação de Refatoração Proposta | Novos Arquivos Planejados (≤ 270 linhas) | Prioridade |
|---|---|---|---|---|---|
| `src/App.tsx` | 755 | 28 estados no mesmo componente, acoplamento de listeners de telemetria climática, renderização de múltiplos modais. | Extrair hook de orquestração `useAppState`, extrair container de modais `AppModalsContainer.tsx`. | `src/App.tsx` (~180 l.)<br>`src/hooks/useAppState.ts` (~220 l.)<br>`src/components/shell/AppModalsContainer.tsx` (~210 l.) | **P0** |
| `server.ts` | 461 | Rotas de API, configuração Vite, proxies externos e leitura de disco misturados. | Modularizar rotas em `server/routes/states.ts`, `server/routes/proxy.ts`, `server/routes/climate.ts`. | `server.ts` (~120 l.)<br>`server/routes/statesRouter.ts` (~110 l.)<br>`server/routes/proxyRouter.ts` (~140 l.)<br>`server/routes/climateRouter.ts` (~130 l.) | **P1** |
| `src/components/DynamicAppFooter.tsx` | 655 | Mistura player musical, ticker de telemetria meteorológica e botões de atalho. | Decompor em componentes especializados de barra de status e ticker. | `src/components/footer/DynamicAppFooter.tsx` (~190 l.)<br>`src/components/footer/ClimateTelemetryTicker.tsx` (~180 l.)<br>`src/components/footer/AudioQuickBar.tsx` (~160 l.) | **P1** |

### Módulo 2: Motor Cartográfico & Isometric Canvas
| Arquivo Original | Linhas | Problemas Identificados | Ação de Refatoração Proposta | Novos Arquivos Planejados (≤ 270 linhas) | Prioridade |
|---|---|---|---|---|---|
| `src/components/IsometricMapCanvas.tsx` | 2.189 | Monólito principal da cartografia: cálculo de projeção, eventos mouse/touch/wheel, render de biomas, relevo e shaders. | Dividir em subcomponentes do SVG e hook `useMapGesturesAndTransform`. | `src/components/map/IsometricMapCanvas.tsx` (~220 l.)<br>`src/hooks/useMapGestures.ts` (~240 l.)<br>`src/components/map/canvas/MapBackgroundAtmosphere.tsx` (~180 l.)<br>`src/components/map/canvas/MapTerrainMeshes.tsx` (~210 l.)<br>`src/components/map/canvas/MapCompassGizmoAnchor.tsx` (~150 l.) | **P0** |
| `src/components/map/ClimatePhenomenaLayer.tsx` | 1.344 | Partículas de vento, frentes frias, massas de ar e tempestades no mesmo arquivo. | Separar cada fenômeno atmosférico em seu próprio componente de partículas SVG. | `src/components/map/climate/ClimatePhenomenaLayer.tsx` (~190 l.)<br>`src/components/map/climate/ColdFrontsMesh.tsx` (~210 l.)<br>`src/components/map/climate/WindStreamParticles.tsx` (~230 l.)<br>`src/components/map/climate/AtmosphericPressureBlobs.tsx` (~200 l.) | **P0** |
| `src/components/map/MapStatesLayer.tsx` | 950 | Renderiza todos os paths SVG dos 27 estados, labels comemorativas e eventos de hover. | Extrair `StateSvgPath.tsx` individual e memoizado, isolando cálculo de gradientes. | `src/components/map/MapStatesLayer.tsx` (~180 l.)<br>`src/components/map/states/StateSvgPath.tsx` (~220 l.)<br>`src/components/map/states/StateBorderOverlays.tsx` (~190 l.) | **P0** |
| `src/components/map/BrazilGlobeR3F.tsx` | 894 | Renderizador Three.js do globo, rotação orbital, iluminação solar e texturas. | Separar cena, luzes, malha da terra e marcadores de estado. | `src/components/globe/BrazilGlobeR3F.tsx` (~190 l.)<br>`src/components/globe/GlobeSceneLighting.tsx` (~160 l.)<br>`src/components/globe/GlobeEarthMesh.tsx` (~220 l.)<br>`src/components/globe/GlobeStateMarkers.tsx` (~210 l.) | **P1** |
| `src/components/map/GeopoliticsMapLayer.tsx` | 572 | Escalas de cores de PIB, IDH, população e interpolação coroplética. | Extrair paletas e interpolação de gradientes para helper. | `src/components/map/GeopoliticsMapLayer.tsx` (~230 l.)<br>`src/components/map/geopolitics/ChoroplethPathFill.tsx` (~200 l.) | **P1** |
| `src/components/map/BiodiversityMapLayer.tsx` | 615 | Marcadores de espécies, agrupamentos por bioma e animações de radar. | Extrair marcadores de espécimes em componente memoizado. | `src/components/map/BiodiversityMapLayer.tsx` (~220 l.)<br>`src/components/map/biodiversity/SpecimenMapPin.tsx` (~190 l.) | **P1** |
| `src/lib/mapProjections.ts` | 547 | Matrizes isométricas, Mercator, Albers e cálculo de zoom bounds. | Fatiar em projeções matemáticas puras e funções utilitárias de bounds. | `src/lib/map/projectionsCore.ts` (~230 l.)<br>`src/lib/map/viewportBounds.ts` (~210 l.) | **P1** |
| `src/components/map/UnifiedStateHoverTooltip.tsx` | 695 | Um tooltip enorme para exibir clima, geopolítica, biodiversidade e guardião. | Extrair abas do tooltip em cartões modulares. | `src/components/map/tooltips/UnifiedStateHoverTooltip.tsx` (~190 l.)<br>`src/components/map/tooltips/TooltipClimateCard.tsx` (~170 l.)<br>`src/components/map/tooltips/TooltipGeopoliticsCard.tsx` (~160 l.)<br>`src/components/map/tooltips/TooltipGuardianCard.tsx` (~150 l.) | **P1** |
| `src/components/map/MapPinsLayer.tsx` | 290 | Pinos com mastros, bandeiras oficiais e brasões de repouso. | Isolar a haste e o card ornamental em subcomponentes puros. | `src/components/map/MapPinsLayer.tsx` (~160 l.)<br>`src/components/map/pins/StateFlagStandee.tsx` (~150 l.) | **P2** |

### Módulo 3: Menus, HUDs e Navegação
| Arquivo Original | Linhas | Problemas Identificados | Ação de Refatoração Proposta | Novos Arquivos Planejados (≤ 270 linhas) | Prioridade |
|---|---|---|---|---|---|
| `src/components/nav/NavFlyoutMenu.tsx` | 1.388 | Menu lateral gigante com abas de modos, filtros de bioma, seletor de eras do rádio e atalhos. | Decompor em abas autônomas e painéis acoplados. | `src/components/nav/NavFlyoutMenu.tsx` (~210 l.)<br>`src/components/nav/tabs/NavModesTab.tsx` (~220 l.)<br>`src/components/nav/tabs/NavBiomesFilterTab.tsx` (~200 l.)<br>`src/components/nav/tabs/NavRadioEraTab.tsx` (~190 l.)<br>`src/components/nav/tabs/NavSettingsTab.tsx` (~180 l.) | **P0** |
| `src/components/TopGlobalNavMenu.tsx` | 1.028 | Barra superior contendo botões de ação, relógio celestial, seletor de temas e barra de XP. | Separar em seções: UserStatusHUD, ModeSwitchDock, QuickActionDock. | `src/components/nav/TopGlobalNavMenu.tsx` (~190 l.)<br>`src/components/nav/dock/UserProgressDock.tsx` (~180 l.)<br>`src/components/nav/dock/ModeSelectorDock.tsx` (~200 l.)<br>`src/components/nav/dock/UtilityToolsDock.tsx` (~170 l.) | **P0** |
| `src/components/map/GeopoliticsControlPanel.tsx` | 976 | Painel com métricas, filtros, ranking de estados e gráficos de barra. | Separar cabeçalho, seletor de métrica e tabela/ranking. | `src/components/map/geopolitics/GeopoliticsControlPanel.tsx` (~200 l.)<br>`src/components/map/geopolitics/MetricSelectorGrid.tsx` (~210 l.)<br>`src/components/map/geopolitics/StateRankingList.tsx` (~220 l.) | **P1** |
| `src/components/map/MapControlsHUD.tsx` | 600 | Controles de zoom, compasso, botão de reset e alternadores de camadas. | Extrair botões atômicos e agrupar por função. | `src/components/map/hud/MapControlsHUD.tsx` (~210 l.)<br>`src/components/map/hud/ZoomAndCompassCluster.tsx` (~190 l.)<br>`src/components/map/hud/LayerToggleCluster.tsx` (~180 l.) | **P1** |
| `src/components/map/BiodiversityControlPanel.tsx` | 572 | Painel com botões de reinos (fauna/flora), biomas e espécies ameaçadas. | Separar filtros taxonômicos e estatísticas. | `src/components/map/biodiversity/BiodiversityControlPanel.tsx` (~200 l.)<br>`src/components/map/biodiversity/TaxonFilterBar.tsx` (~210 l.) | **P1** |
| `src/components/map/ClimateControlPanel.tsx` | 540 | Painel de controle de temperatura, umidade, vento e precipitação. | Separar seletor de camadas e card de telemetria da capital. | `src/components/map/climate/ClimateControlPanel.tsx` (~210 l.)<br>`src/components/map/climate/ClimateLayerSelector.tsx` (~190 l.) | **P1** |
| `src/components/map/GizmoCompassHUD.tsx` | 478 | Rosa dos ventos, cálculo de ângulo de rotação e bússola náutica. | Decompor representação visual e controlador matemático. | `src/components/map/compass/GizmoCompassHUD.tsx` (~220 l.)<br>`src/components/map/compass/CompassRoseSvg.tsx` (~180 l.) | **P2** |

### Módulo 4: Sistema de Guardiões e Experiência RPG
| Arquivo Original | Linhas | Problemas Identificados | Ação de Refatoração Proposta | Novos Arquivos Planejados (≤ 270 linhas) | Prioridade |
|---|---|---|---|---|---|
| `src/components/guardian/GuardianInventoryModal.tsx` | 888 | Inventário do jogador com grade de itens, detalhes do item, filtros e filtros de raridade. | Dividir em grade de itens, visualizador de detalhes e barra de abas. | `src/components/guardian/inventory/GuardianInventoryModal.tsx` (~200 l.)<br>`src/components/guardian/inventory/InventoryItemGrid.tsx` (~220 l.)<br>`src/components/guardian/inventory/InventoryItemDetailPanel.tsx` (~210 l.) | **P0** |
| `src/components/GuardianRPGScene.tsx` | 843 | Cenário interativo 2.5D com avatar, animações CSS, diálogo e background sonoro. | Separar palco visual, avatar do guardião e painel de ações. | `src/components/guardian/rpg/GuardianRPGScene.tsx` (~220 l.)<br>`src/components/guardian/rpg/GuardianStageBackground.tsx` (~190 l.)<br>`src/components/guardian/rpg/GuardianInteractiveAvatar.tsx` (~200 l.) | **P0** |
| `src/components/GuardianDialog.tsx` | 742 | Diálogo com árvore de conversação, opções de escolha e ganho de afinidade. | Isolar histórico de fala e árvore de opções em submódulos. | `src/components/guardian/dialog/GuardianDialog.tsx` (~210 l.)<br>`src/components/guardian/dialog/DialogueChoicesMenu.tsx` (~190 l.)<br>`src/components/guardian/dialog/GuardianAffinityGauge.tsx` (~160 l.) | **P1** |
| `src/components/guardian/GuardianDialogueBox.tsx` | 689 | Caixa clássica de RPG com efeito typewriter de texto, som de digitação e retrato. | Extrair hook de digitação `useTypewriter` e retrato. | `src/components/guardian/box/GuardianDialogueBox.tsx` (~220 l.)<br>`src/hooks/useTypewriter.ts` (~140 l.)<br>`src/components/guardian/box/GuardianPortraitFrame.tsx` (~170 l.) | **P1** |
| `src/components/guardian/GuardianQuizModal.tsx` | 583 | Modal de desafio do guardião com cronômetro, pontuação e feedback de acerto/erro. | Separar lógica de pontuação, tela de resultado e pergunta ativa. | `src/components/guardian/quiz/GuardianQuizModal.tsx` (~210 l.)<br>`src/components/guardian/quiz/QuizActiveQuestionCard.tsx` (~200 l.)<br>`src/components/guardian/quiz/QuizResultsSummary.tsx` (~180 l.) | **P1** |
| `src/components/guardian/GuardianItemReadingModal.tsx` | 524 | Leitor de pergaminho antigo, exibição de gravuras e histórias culturais. | Separar moldura de pergaminho e conteúdo textual. | `src/components/guardian/reading/GuardianItemReadingModal.tsx` (~220 l.)<br>`src/components/guardian/reading/ParchmentScrollFrame.tsx` (~190 l.) | **P1** |

### Módulo 5: Modais Educacionais, Quests e Configurações
| Arquivo Original | Linhas | Problemas Identificados | Ação de Refatoração Proposta | Novos Arquivos Planejados (≤ 270 linhas) | Prioridade |
|---|---|---|---|---|---|
| `src/components/CodexInsignias.tsx` | 962 | Lista de todas as conquistas, insígnias de estados, progresso geral e filtros. | Decompor em grid de insígnias, modal de detalhes e barra de estatísticas. | `src/components/codex/CodexInsignias.tsx` (~210 l.)<br>`src/components/codex/InsigniaCardItem.tsx` (~190 l.)<br>`src/components/codex/InsigniaProgressHeader.tsx` (~180 l.) | **P0** |
| `src/components/map/StateBiodiversityDialog.tsx` | 781 | Lista de espécimes, status de conservação, foto e abas de reino. | Separar catálogo de espécies e modal de visualização de foto em alta definição. | `src/components/map/dialogs/StateBiodiversityDialog.tsx` (~210 l.)<br>`src/components/map/dialogs/biodiversity/SpecimenDetailCard.tsx` (~200 l.)<br>`src/components/map/dialogs/biodiversity/SpecimenCatalogList.tsx` (~220 l.) | **P0** |
| `src/components/map/StateClimateDialog.tsx` | 741 | Gráficos de previsão de 7 dias, dados atuais, sensações térmicas e ventos. | Separar cartão de condições atuais e previsão estendida. | `src/components/map/dialogs/StateClimateDialog.tsx` (~200 l.)<br>`src/components/map/dialogs/climate/CurrentTelemetryView.tsx` (~210 l.)<br>`src/components/map/dialogs/climate/SevenDayForecastView.tsx` (~220 l.) | **P0** |
| `src/components/quest/BrQuestHubModal.tsx` | 614 | Hub da jornada nacional de perguntas, seleção de pilares e ranking. | Separar seletor de pilares e cartão de missão ativa. | `src/components/quest/BrQuestHubModal.tsx` (~210 l.)<br>`src/components/quest/QuestPillarSelectorGrid.tsx` (~200 l.)<br>`src/components/quest/QuestMissionCard.tsx` (~180 l.) | **P1** |
| `src/components/ApiStatusModal.tsx` | 609 | Modal com telemetria de 6 APIs, gráficos de tempo de resposta e botão de teste. | Separar lista de status de APIs e log de eventos recentes. | `src/components/api/ApiStatusModal.tsx` (~210 l.)<br>`src/components/api/ApiHealthIndicatorCard.tsx` (~190 l.)<br>`src/components/api/ApiLatencyChart.tsx` (~170 l.) | **P1** |
| `src/components/map/StateGeopoliticsDialog.tsx` | 483 | Modal de indicadores econômicos, sociais e demográficos da UF. | Separar gráficos de distribuição e indicadores-chave. | `src/components/map/dialogs/StateGeopoliticsDialog.tsx` (~220 l.)<br>`src/components/map/dialogs/geopolitics/UfIndicatorsSummary.tsx` (~200 l.) | **P1** |
| `src/components/SettingsModal.tsx` | 334 | Configuração de som, idioma, modo de relevo e reset de progresso. | Extrair seções de preferências sonoras e visuais. | `src/components/settings/SettingsModal.tsx` (~190 l.)<br>`src/components/settings/AudioPreferencesSection.tsx` (~140 l.) | **P2** |

### Módulo 6: Rádio Vintage e Áudio WebAudio
| Arquivo Original | Linhas | Problemas Identificados | Ação de Refatoração Proposta | Novos Arquivos Planejados (≤ 270 linhas) | Prioridade |
|---|---|---|---|---|---|
| `src/components/music/VintageRadioPlayer.tsx` | 1.259 | Dial giratório, afinação de frequência com estática procedural, lista de faixas e exibição de letra. | Separar componente do Dial analógico, painel de estações e tocador. | `src/components/music/VintageRadioPlayer.tsx` (~220 l.)<br>`src/components/music/radio/RadioTuningDial.tsx` (~230 l.)<br>`src/components/music/radio/RadioStationCatalog.tsx` (~210 l.)<br>`src/components/music/radio/RadioTrackInfoDisplay.tsx` (~180 l.) | **P0** |
| `src/components/music/RadioCabinetIllustrations.tsx` | 359 | Arte vetorial de gabinetes de madeira e baquelite de 1930 a 1980. | Fatiar gabinetes por época em subcomponentes SVG. | `src/components/music/cabinets/VintageCabinet1930.tsx` (~130 l.)<br>`src/components/music/cabinets/VintageCabinet1950.tsx` (~140 l.)<br>`src/components/music/cabinets/VintageCabinet1970.tsx` (~140 l.) | **P2** |
| `src/lib/audioSynth.ts` | 343 | Sintetizador de bips náuticos, cliques de rádio, fanfarras e efeitos de conquista. | Separar sintetizador instrumental de efeitos de interface (SFX). | `src/lib/audio/webAudioCore.ts` (~180 l.)<br>`src/lib/audio/uiSoundEffects.ts` (~170 l.) | **P2** |
| `src/lib/vintageRadioEngine.ts` | 322 | Síntese de ruído marrom/rosa, estática de rádio AM e oscilador heterodino. | Separar geradores de ruído estático e controlador de frequência. | `src/lib/radio/radioNoiseGenerators.ts` (~170 l.)<br>`src/lib/radio/radioTuningEngine.ts` (~160 l.) | **P2** |

### Módulo 7: Serviços e Infraestrutura de APIs
| Arquivo Original | Linhas | Problemas Identificados | Ação de Refatoração Proposta | Novos Arquivos Planejados (≤ 270 linhas) | Prioridade |
|---|---|---|---|---|---|
| `src/services/climateService.ts` | 682 | Requisições à API Open-Meteo, cálculo de sensações, cache em memória, telemetria e dados de contingência. | Decompor em cliente de API, cache especializado e dados históricos de fallback. | `src/services/climate/climateService.ts` (~210 l.)<br>`src/services/climate/openMeteoClient.ts` (~220 l.)<br>`src/services/climate/climateOfflineFallback.ts` (~190 l.) | **P0** |
| `src/services/apiTracker.ts` | 654 | Armazenamento de logs de requisições, métricas agregadas de taxa de erro e listeners. | Separar armazenamento de histórico, cálculo de estatísticas e emissor de eventos. | `src/services/telemetry/apiTracker.ts` (~220 l.)<br>`src/services/telemetry/apiMetricsEngine.ts` (~200 l.)<br>`src/services/telemetry/apiEventHub.ts` (~150 l.) | **P1** |
| `src/services/biodiversityImageService.ts` | 533 | Busca em iNaturalist, GBIF e Wikimedia, fila com rate limit e cache em 2 níveis. | Separar clientes específicos de cada provedor externo e a fila com rate limiter. | `src/services/biodiversity/biodiversityImageService.ts` (~210 l.)<br>`src/services/biodiversity/iNaturalistClient.ts` (~190 l.)<br>`src/services/biodiversity/wikimediaCommonsClient.ts` (~180 l.)<br>`src/services/biodiversity/gbifMediaClient.ts` (~160 l.) | **P1** |
| `src/services/biodiversityService.ts` | 350 | Consultas taxonômicas, filtros por bioma e fallback offline. | Isolar provedor de dados locais e cliente remoto. | `src/services/biodiversity/biodiversityService.ts` (~190 l.)<br>`src/services/biodiversity/taxonQueryFilter.ts` (~170 l.) | **P2** |

### Módulo 8: Camada de Dados e Cadastros
| Arquivo Original | Linhas | Problemas Identificados | Ação de Refatoração Proposta | Novos Arquivos Planejados (≤ 270 linhas) | Prioridade |
|---|---|---|---|---|---|
| `src/data/brazilBiodiversityData.ts` | 2.557 | Monolito de fauna e flora com centenas de espécies em um único arquivo. | Fatiar por biomas: Amazônia, Cerrado, Mata Atlântica, Caatinga, Pampa e Pantanal. | `src/data/biodiversity/index.ts` (~160 l.)<br>`src/data/biodiversity/amazonia.ts` (~250 l.)<br>`src/data/biodiversity/cerrado.ts` (~250 l.)<br>`src/data/biodiversity/mataAtlantica.ts` (~250 l.)<br>`src/data/biodiversity/caatinga.ts` (~240 l.)<br>`src/data/biodiversity/pampa.ts` (~220 l.)<br>`src/data/biodiversity/pantanal.ts` (~230 l.) | **P0** |
| `src/data/geopoliticaData.ts` | 2.269 | Tabelas extensas com indicadores demográficos, econômicos e sociais dos 27 estados. | Fatiar por macro-regiões (Norte, Nordeste, Centro-Oeste, Sudeste, Sul). | `src/data/geopolitica/index.ts` (~180 l.)<br>`src/data/geopolitica/norte.ts` (~240 l.)<br>`src/data/geopolitica/nordeste.ts` (~250 l.)<br>`src/data/geopolitica/centroOeste.ts` (~210 l.)<br>`src/data/geopolitica/sudeste.ts` (~240 l.)<br>`src/data/geopolitica/sul.ts` (~220 l.) | **P0** |
| `src/data/musicalHeritageData.ts` | 1.610 | Todas as faixas e gêneros musicais regionais dos 27 estados em um bloco só. | Fatiar por macro-regiões com re-export consolidado. | `src/data/music/index.ts` (~170 l.)<br>`src/data/music/norte.ts` (~240 l.)<br>`src/data/music/nordeste.ts` (~260 l.)<br>`src/data/music/centroOeste.ts` (~220 l.)<br>`src/data/music/sudeste.ts` (~250 l.)<br>`src/data/music/sul.ts` (~230 l.) | **P0** |
| `src/data/guardiansData.ts` | 1.579 | Monolito antigo dos Guardiões das 27 UFs. Já foi distribuído nos bundles `src/data/states/`. | Substituir por fachada fina (`facade`) que monta o mapa lendo dos bundles modulares. | `src/data/guardiansData.ts` (~95 l. - fachada)<br>*(dados residem nos bundles de cada estado)* | **P0** |
| `src/data/anthemsData.ts` | 1.117 | Letras de hinos das 27 UFs em um só arquivo. | Fatiar por macro-regiões ou alimentar a partir dos bundles estaduais. | `src/data/anthems/index.ts` (~150 l.)<br>`src/data/anthems/norte.ts` (~230 l.)<br>`src/data/anthems/nordeste.ts` (~250 l.)<br>`src/data/anthems/centroOeste.ts` (~200 l.)<br>`src/data/anthems/sudeste.ts` (~240 l.)<br>`src/data/anthems/sul.ts` (~210 l.) | **P1** |
| `src/data/stateQuestionsData.ts` | 990 | Perguntas do quiz dos 27 estados em arquivo monolítico. | Fatiar por macro-região. | `src/data/questions/index.ts` (~140 l.)<br>`src/data/questions/norte.ts` (~220 l.)<br>`src/data/questions/nordeste.ts` (~240 l.)<br>`src/data/questions/centroOeste.ts` (~200 l.)<br>`src/data/questions/sudeste.ts` (~230 l.)<br>`src/data/questions/sul.ts` (~210 l.) | **P1** |
| `src/data/brQuestQuestionsData.ts` | 890 | Questões nacionais organizadas por pilares temáticos. | Fatiar por pilares: História, Geografia, Cultura, Natureza e Ciência. | `src/data/brQuest/index.ts` (~140 l.)<br>`src/data/brQuest/historia.ts` (~210 l.)<br>`src/data/brQuest/geografia.ts` (~220 l.)<br>`src/data/brQuest/cultura.ts` (~210 l.)<br>`src/data/brQuest/natureza.ts` (~210 l.) | **P1** |
| `src/data/stateClimatologyData.ts` | 821 | Médias térmicas e pluviométricas históricas das 27 UFs. | Fatiar por região e consolidar. | `src/data/climatology/index.ts` (~150 l.)<br>`src/data/climatology/norteNordeste.ts` (~240 l.)<br>`src/data/climatology/centroSul.ts` (~240 l.) | **P1** |
| `src/data/culturalInventoryData.ts` | 818 | Catálogo geral de artefatos culturais e relíquias das 27 UFs. | Fatiar por região ou ler dos bundles estaduais. | `src/data/culturalInventory/index.ts` (~160 l.)<br>`src/data/culturalInventory/norteNordeste.ts` (~240 l.)<br>`src/data/culturalInventory/centroSul.ts` (~250 l.) | **P1** |
| `src/data/guardianPhrases.ts` | 446 | Frases de diálogo de todos os guardiões. | Fatiar por contexto: saudações, dicas e despedidas. | `src/data/dialogues/guardianPhrases.ts` (~180 l.)<br>`src/data/dialogues/guardianLoreTips.ts` (~210 l.) | **P2** |
| `src/data/brazilStatesRegistry.ts` | 338 | Registro de nomes, capitais, brasões e bandeiras. | Fachada que lê de `src/data/states/index.ts` eliminando duplicidade. | `src/data/brazilStatesRegistry.ts` (~120 l. - fachada) | **P2** |

---

## 5. Roteiro de Execução em 6 Fases

O plano foi estruturado para ser executado de forma incremental e segura. Cada fase pode ser aplicada independentemente, sem comprometer a compilação ou o funcionamento da aplicação:

### Fase 1: Fundação de Utilitários e Infraestrutura de Caching (P0)
- Criar `/src/lib/cacheEngine.ts` com cache genérico multi-nível (L1 Memória, L2 LocalStorage com cota e TTL, L3 Snapshot).
- Criar `/src/lib/formatters.ts` e `/src/lib/geoTransforms.ts`.
- Criar `/src/hooks/useModalAccessibility.ts` e `/src/hooks/useTypewriter.ts`.
- **Validação:** Compilar e rodar testes automatizados (`vitest`).

### Fase 2: Modularização da Camada de Serviços e APIs (P0)
- Decompor `src/services/climateService.ts` em `openMeteoClient.ts`, `climateOfflineFallback.ts` e manter `climateService.ts` como coordenador leve (< 220 linhas).
- Decompor `src/services/biodiversityImageService.ts` isolando clientes iNaturalist, GBIF e Wikimedia.
- Refatorar `src/services/apiTracker.ts` isolando motor de métricas.
- Adicionar deduplicação de requisições em voo (*in-flight promise sharing*) em todas as chamadas de rede.
- **Validação:** Verificar rotas de telemetria e modal de status de APIs (`ApiStatusModal`).

### Fase 3: Decomposição dos Monólitos de Dados (P0 / P1)
- Refatorar `guardiansData.ts` e `brazilStatesRegistry.ts` para se tornarem adaptadores finos lendo de `src/data/states/index.ts`.
- Fatiar `brazilBiodiversityData.ts` por biomas em sub-arquivos ≤ 250 linhas.
- Fatiar `geopoliticaData.ts` por macro-regiões em sub-arquivos ≤ 250 linhas.
- Fatiar `musicalHeritageData.ts`, `anthemsData.ts` e `culturalInventoryData.ts`.
- **Validação:** Testes de regressão em `src/test/stateBundles.test.ts` e `src/test/guardiansData.test.ts`.

### Fase 4: Decomposição do Shell e Orquestração (`App.tsx` e `server.ts`) (P0)
- Extrair `useAppState.ts` para aliviar os 28 estados de `src/App.tsx`.
- Extrair `AppModalsContainer.tsx` para gerenciar a renderização dos diálogos.
- Modularizar `server.ts` dividindo rotas em `server/routes/`.
- **Validação:** Testar abertura e fechamento de todos os 9 modais e verificar rotas Express.

### Fase 5: Decomposição dos Painéis de Navegação e HUDs (P0 / P1)
- Decompor `NavFlyoutMenu.tsx` (1.388 linhas) em abas atômicas (< 220 linhas cada).
- Decompor `TopGlobalNavMenu.tsx` (1.028 linhas) em docks funcionais.
- Decompor `MapControlsHUD.tsx`, `GeopoliticsControlPanel.tsx` e `ClimateControlPanel.tsx`.
- **Validação:** Testar todos os filtros de bioma, modos de exibição e controles na UI.

### Fase 6: Decomposição do Motor Cartográfico e Modais RPG (P0 / P1 / P2)
- Decompor `IsometricMapCanvas.tsx` (2.189 linhas) extraindo `useMapGestures.ts` e subcomponentes SVG.
- Decompor `ClimatePhenomenaLayer.tsx` (1.344 linhas) em subcamadas de frentes, ventos e pressão.
- Decompor `VintageRadioPlayer.tsx` (1.259 linhas) e modais RPG (`GuardianInventoryModal`, `GuardianRPGScene`, `CodexInsignias`).
- **Validação Final:** Verificação completa de 60 FPS, teste de memória, compilação de produção e auditoria de linhas (nenhum arquivo com mais de 270 linhas).

---

## 6. Diretrizes Inegociáveis de Não-Regressão

Para garantir que a experiência do usuário, a interface e todas as regras do projeto permaneçam impecáveis durante a execução de cada fase:

1. **Preservação de Todas as Classes `classe-para-humanos`:**
   Todo elemento refatorado ou extraído **DEVE MANTER RIGOROSAMENTE** as classes semânticas estabelecidas (ex: `container-app-principal`, `container-mapa-br`, `container-canva-mapa-br`, `painel-toolbar-relevo`, `painel-guardiao-detalhes`, `pin-brasao-estado`, `quadro-moldura-bandeira-real`, `haste-mastro-bandeira`, `menu-superior-status`, etc.).
2. **Preservação dos Contratos de Props e Exportações:**
   Nenhum componente ou módulo terá seus nomes de props ou assinaturas públicas quebrados. Onde for necessária mudança interna, a interface externa pública será mantida como fachada retrocompatível.
3. **Validação Contínua com TypeScript e Testes:**
   A cada edição, executar `npx tsc --noEmit` e `npm test -- --run`. Qualquer erro de tipo ou falha de teste bloqueia a etapa até correção cirúrgica.
4. **Respeito aos Componentes de Animação `motion/react`:**
   Manter intactas todas as transições fluidas de layout, animações de entrada e efeitos táteis de clique/hover.
5. **Preservação dos Recursos Locais SVG e Assets:**
   Manter as rotas locais seguras criadas para os 27 estados (`/flags/{uf}.svg` e `/states/{uf}/flag.svg`) e `/brasao_br/` sem regressão.

---

## 7. Rastreamento e Registro de Progresso

| Fase | Descrição do Escopo | Status | Arquivos Refatorados | Cobertura de Testes |
|---|---|---|---|---|
| **Planejamento** | Diagnóstico, mapeamento dos 61 arquivos > 270 linhas e arquitetura alvo | **CONCLUÍDO** | Documentado em `/plan/REFACTORING_PLAN_2026_09_02.md` | 100% (16/16 testes verdes) |
| **Fase 1** | Utilitários compartilhados, formatadores e motor genérico de cache | **CONCLUÍDO** | `src/lib/cacheEngine.ts`, `src/lib/formatters.ts`, `src/lib/geoTransforms.ts`, `src/hooks/useModalAccessibility.ts`, `src/hooks/useTypewriter.ts` | 100% (26/26 testes verdes) |
| **Fase 2** | Decomposição e resiliência dos serviços (`climateService`, `biodiversity`, `apiTracker`) | *Aguardando Início* | - | - |
| **Fase 3** | Eliminação de redundâncias de dados e fatiamento dos monólitos de dados | *Aguardando Início* | - | - |
| **Fase 4** | Decomposição do Shell (`App.tsx`, `server.ts`, footer) | *Aguardando Início* | - | - |
| **Fase 5** | Decomposição dos menus e HUDs (`NavFlyoutMenu`, `TopGlobalNavMenu`, etc.) | *Aguardando Início* | - | - |
| **Fase 6** | Decomposição do Canvas Cartográfico e Cenas RPG | *Aguardando Início* | - | - |

---
*Plano elaborado e validado em 02/09/2026 para o projeto BR Quest.*
