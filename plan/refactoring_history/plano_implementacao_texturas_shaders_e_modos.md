# Plano de Implementação: Arquitetura de Texturas Shaders, Apps Laterais & Isolamento Hermético dos 7 Modos

**Projeto:** BR Quest — Plataforma Cartográfica, Pedagógica e Científica do Brasil  
**Data:** 22 de Setembro de 2026  
**Status:** Aprovado para Execução  
**Autores:** Arquiteto de Soluções & Engenheiro Chefe de Cartografia  

---

## 1. Visão Executiva & Objetivos Estruturais

A auditoria de ponta a ponta constatou que o modo **Clima e Atmosfera** tornou-se o mais maduro e consistente da plataforma porque recebeu regras rígidas de renderização isolada e dados dinâmicos estruturados. Os outros módulos, contudo, ainda sofrem de:
1. **Inconsistência de docking e câmera nos Apps Laterais**: assimetrias de abertura e submenus que permanecem abertos cobrindo o conteúdo.
2. **Ausência de texturas cartográficas vivas e científicas**: mapas com preenchimentos monótonos ou sem relação pedagógica com o modo.
3. **Falta de modelagem macroclimática ENSO (El Niño / La Niña)**: fenômenos climáticos essenciais no Brasil sem representação cartográfica fidedigna (referências: NASA Earth Science, NOAA Climate, INMET, SIMEPAR).
4. **Acoplamento no monólito do mapa (`IsometricMapCanvas.tsx` com 2.787 linhas)**.

Este plano define a arquitetura técnica, os contratos de interface, o sistema de **Skills da Engine de Renderização (Preenchimento $\leftrightarrow$ Shaders)** e o faseamento de entrega sem qualquer risco de regressão.

---

## 2. Padrão Arquitetural dos Apps Laterais vs. Modo Aventura

### 2.1 Os 5 Modos com AppLateral Oficial (Clima, Biodiversidade, Geopolítica, Território, Musicalidades)
Todos os modos informativos e analíticos compartilham a mesma gramática de interface:

| Propriedade | Especificação Técnica Obrigatória |
| :--- | :--- |
| **Doca de Abertura** | **Esquerda** estrita: `fixed left-2 sm:left-[84px] lg:left-[88px] top-3 bottom-14 z-40` |
| **Largura Compacta** | `w-[500px]` a `w-[520px]` (permite leitura rica sem ocultar o mapa em telas médias) |
| **Largura Expandida** | `w-[calc(50vw-48px)]` (split exato de 50% da viewport para análise lado a lado) |
| **Câmera & Centralização** | Ao abrir ou expandir, calcular `screenOffsetX > 0` via `centralizarZoomMapa`, deslocando o centróide do estado para a metade livre da direita da tela |
| **Fechamento Atômico** | Quando `selectedStateId !== null`, o sistema fecha imediatamente e sem animações concorrentes: submenus da barra superior, gaveta de Território e filtros flutuantes |

### 2.2 A Exceção Estrutural: `StateAdventureDialog` (Guardiões & Aventura)
* **Doca de Abertura**: **Direita** estrita (`right-2 sm:right-4 top-16 sm:top-20 z-40`).
* **Justificativa de Produto**: O modo Guardiões/Aventura é um jogo narrativo (RPG) guiado por missões e avatares. Ele **não** possui um AppLateral de censo/análise técnica e **não** realiza split de 50% de tela. Seu diálogo flutuante detalha o Guardião, as lendas locais e os desafios da BNCC, mantendo a visão livre do território e da rota pontilhada da expedição à esquerda.

---

## 3. Engine de Texturas: Preenchimento $\leftrightarrow$ Shaders por Skills

As texturas deixam de ser papéis de parede estáticos e passam a ser operadas como **Skills modulares da Engine de Renderização**, aliando fidelidade científica, legibilidade e performance a 60 FPS:

```
                      ┌───────────────────────────────────────────────┐
                      │    ENGINE DE RENDERIZAÇÃO CARTOGRÁFICA        │
                      └──────────────────────┬────────────────────────┘
                                             │
      ┌──────────────────────┬───────────────┴──────────────┬────────────────────────┐
      │                      │                              │                        │
┌─────▼──────────────┐ ┌─────▼──────────────┐ ┌─────────────▼────────┐ ┌─────────────▼────────┐
│ SKILL 1: CLIMA     │ │ SKILL 2: BIOMAS    │ │ SKILL 3: GEOPOLÍTICA │ │ SKILL 4: TERRITÓRIO  │
│ - ECMWF/Forecast   │ │ - Dossel Florestal │ │ - Densidade Censo    │ │ - Hillshade 3D       │
│ - ENSO (El Niño /  │ │ - Caatinga Estépi- │ │ - Macrorregiões      │ │ - Hachuras ANA 30°   │
│   La Niña NOAA)    │ │   ca / Cerrado     │ │ - Complexos Geiger   │ │ - Hierarquia Fluvial │
│ - Isolinhas T/P    │ │ - Pampas / Pantanal│ │ - Micromalha Pontos  │ │ - Divisores D'água   │
└────────────────────┘ └────────────────────┘ └──────────────────────┘ └──────────────────────┘
```

### Detalhamento das 6 Skills Texturais da Engine:

#### Skill 1: Clima, Atmosfera & Macroclima ENSO (El Niño / La Niña)
* **Base Científica**:
  - **NASA Earth Science**: Anomalias de Temperatura da Superfície do Mar (TSM) no Pacífico Tropical (Niño 3.4).
  - **NOAA Climate**: Índice Oceânico do Niño (ONI) e padrões de teleconexão global.
  - **INMET / MAPA**: Impactos regionais no agronegócio e climatologia do semiárido e sul.
  - **SIMEPAR**: Dinâmica de frentes frias austrais, bloqueios atmosféricos e jatos de baixos níveis.
* **Comportamento Textural no Mapa**:
  - **El Niño Ativo**: Aquecimento anômalo e textura de aridez no Norte e Nordeste (isolinhas avermelhadas com fluxo reduzido); convergência de umidade e tempestades convectivas intensas no Sul/Sudeste (isolinhas azuis densas e partículas de precipitação aceleradas).
  - **La Niña Ativa**: Resfriamento equatorial, aumento de precipitação no Semiárido e estiagem no Sul.
  - **Gradiente Térmico Contínuo**: Paleta espectral contínua calibrada (`#1e3a8a` gelo a `#7f1d1d` calor extremo) sem faixas duras de cor.

#### Skill 2: Território, Hidrografia & Relevo Físico
* **Relevo Sombreado (*Hillshade*)**: Simulação de iluminação zenital a 315° sobre as curvas de nível do relevo brasileiro (Serra do Mar, Mantiqueira, Espinhaço, Planalto Central).
* **Hachuras Orográficas Processuais**: Padrão vetorial de hachura a 30° com densidade proporcional à altitude (altimetria IBGE).
* **Rede Hidrográfica ANA**: Traçado vetorial suavizado com espessura variável proporcional à ordem de Strahler dos rios das 12 Bacias Hidrográficas.

#### Skill 3: Biodiversidade & Fitofisionomia dos 6 Biomas
* **Amazônia & Mata Atlântica**: Microtextura de copas de dossel denso e células biológicas clorofiladas (`#064e3b` a `#047857`).
* **Cerrado**: Textura savânica com gramíneas e arbustos retorcidos espaçados (`#a16207` a `#ca8a04`).
* **Caatinga**: Padrão estépico xérico com filigranas de galhos secos e cactáceas (`#c2410c` a `#ea580c`).
* **Pantanal**: Textura hídrica pulsante de planície inundável com meandros (`#0e7490` a `#0284c7`).
* **Pampa**: Ondulações suaves de coxilhas e campos limpos (`#4d7c0f` a `#65a30d`).

#### Skill 4: Geopolítica, Censo 2022 & Divisões Modernas
* **Micromalha Densitária Censitária**: Textura de pontos estocásticos calculada diretamente da densidade populacional oficial do Censo 2022 ($\text{hab/km}^2$). Quanto maior a densidade, mais compacta a trama de pontos.
* **Divisões Regionais Modernas Alternáveis**:
  - **Macrorregiões Tradicionais do IBGE** (Norte, Nordeste, Centro-Oeste, Sudeste, Sul).
  - **Complexos Geoeconômicos de Pedro Pinchas Geiger** (Amazônia, Nordeste e Centro-Sul), respeitando as dinâmicas socioeconômicas reais que cortam fronteiras estaduais.

#### Skill 5: Musicalidades & Paisagem Sonora
* **Padrão de Ranhuras Acústicas de Vinil**: Microlinhas concêntricas gravadas sobre o fundo ardósia do mapa.
* **Ondas Hertzianas de Rádio**: Círculos de dispersão pulsantes irradiando das capitais emissoras AM/FM ao longo do relevo.

#### Skill 6: Guardiões & Cartografia Mística (RPG)
* **Textura de Pergaminho Iluminado**: Granulação de papel envelhecido, linhas de loxodromia náuticas e selos dourados das constelações indígenas (Homem Velho, Ema, Anta).

---

## 4. Política de Otimização e Economia Estrita de APIs

Para garantir que a aplicação rode com custo zero, resposta instantânea e total resiliência mesmo sem internet:

```
                    Requisição de Dados Climáticos/Censitários
                                        │
                               ┌────────▼────────┐
                               │ Cache L1 (RAM)  │──[Hit < 1ms]──> Retorno Instantâneo
                               └────────┬────────┘
                                        │ Miss
                               ┌────────▼────────┐
                               │ Cache L2        │──[Hit < 5ms]──> Popula L1 & Retorna
                               │ (sessionStorage)│
                               └────────┬────────┘
                                        │ Miss (expirou ou 1ª vez)
                               ┌────────▼────────┐
                               │ inFlight Dedupe │──[Requisição em voo?]──> Aguarda Promise existente
                               └────────┬────────┘
                                        │ Nova Chamada
                               ┌────────▼────────┐
                               │ Chamada Externa │──[Falha / Timeout]──> Fallback Local Real
                               │ (Open-Meteo/etc)│
                               └────────┬────────┘
                                        │ Sucesso
                               ┌────────▼────────┐
                               │ Grava L1 + L2   │
                               │ (TTL 15-60 min) │
                               └─────────────────┘
```

1. **Camadas de Cache**: L1 (memória React/Ref) + L2 (`sessionStorage` serializado com carimbo de tempo).
2. **TTL Inteligente**:
   - Dados Meteorológicos em Tempo Real: TTL de 30 minutos.
   - Projeções de El Niño / Climatologia Histórica: TTL de 24 horas.
   - Dados do Censo IBGE e Hidrografia ANA: Estáticos com carregamento local sob demanda (TTL infinito na sessão).
3. **Controle de Cota no `apiTrackerService`**: O monitor de requisições bloqueia automaticamente qualquer surto de requisições repetidas decorrentes de cliques rápidos em estados.

---

## 5. Cronograma de Execução em Fases

### Fase 1: Padronização dos Apps Laterais & Desligamento Atômico de Submenus *(Prioridade 1)*
- [ ] Padronizar `handleStateClick` para emitir `onSelectStateId(stateId)` em todos os 6 modos no `IsometricMapCanvas.tsx`.
- [ ] Implementar fechamento imediato de todos os submenus no `TopGlobalNavMenu.tsx` ao detectar estado selecionado.
- [ ] Ajustar `StateGeopoliticsDialog`, `StateBiodiversityDialog`, `StateTerritoryDialog` e `StateMusicDialog` para ancoragem uniforme à esquerda com offset de câmera padronizado.
- [ ] Preservar e blindar `StateAdventureDialog` na doca direita sem split de tela.

### Fase 2: Implementação da Engine de Texturas & Shaders Cartográficos *(Prioridade 2)*
- [ ] Criar `/src/components/map/textures/MapCartographicTextures.tsx` ($\le 240$ linhas) contendo os defs SVG das 6 Skills.
- [ ] Integrar a camada textural ao `StatePolygonRenderer.tsx` com chaveamento limpo por modo.
- [ ] Implementar a modelagem ENSO (El Niño / La Niña) com base em dados NOAA/NASA/INMET/SIMEPAR no serviço meteorológico.
- [ ] Adicionar suporte à visualização dos Complexos Geoeconômicos no modo Geopolítica.

### Fase 3: Desacoplamento do Monólito do Mapa *(Prioridade 3)*
- [ ] Extrair os diálogos laterais para `/src/components/map/dialogs/MapLateralDialogsManager.tsx` ($\le 220$ linhas).
- [ ] Extrair a lógica de pan/zoom para o hook `/src/hooks/useMapCameraController.ts` ($\le 240$ linhas).
- [ ] Garantir que `IsometricMapCanvas.tsx` atinja a meta de $\le 270$ linhas.

### Fase 4: Validação de Qualidade & Testes E2E com Playwright *(Prioridade 4)*
- [ ] Atualizar testes unitários (`vitest run`).
- [ ] Executar suíte de testes Playwright verificando ausência de sobreposição de menus, cálculo de câmera em 50% de tela e isolamento hermético dos modos.

---

**Diretriz de Commit**:
```bash
git commit -m "feat(arch): standardize lateral apps, texture shader skills engine and AGENTS.md guidelines"
```
