# Ficha Técnica da Aplicação (Data Sheet)
**BR Quest — Plataforma Gamificada de Inteligência Geográfica, Biodiversidade e Cartografia 3D**  
*Versão:* 1.5.0 (Edição Atlas Cósmico & Sistema Solar) | *Data de Revisão:* Setembro de 2026  
*Documento:* `/plan/ficha_tecnica.md`

---

## 1. Identificação Geral do Sistema

| Atributo | Especificação Técnica |
| :--- | :--- |
| **Nome Oficial** | BR Quest (Símbolos BR - RPG Isométrico & Atlas 3D) |
| **Classificação** | Aplicação Web Progressiva (PWA/SPA), EdTech, Cartografia Digital Interativa |
| **Domínio Primário** | Geografia, Climatologia em Tempo Real, Biodiversidade (GBIF), História e Símbolos Nacionais |
| **Padrão Arquitetural** | Clean Architecture Frontend, Modularidade Baseada em Microengines, Single-Source of Truth |
| **Target de Desempenho**| 60 FPS contínuos em WebGL2/Canvas, consumo de memória heap < 140MB, FCP < 1.2s |
| **Acessibilidade** | WCAG 2.1 Nível AA, navegação por teclado, leitor de tela, semântica `classe-para-humanos` |

---

## 2. Stack Tecnológica e Bibliotecas Principais

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CAMADA DE INTERFACE & UI                     │
│  React 18+ • TypeScript 5.x • Tailwind CSS • Lucide React • Motion      │
├────────────────────────────────────────────────────────────────────────┤
│                       CAMADA DE RENDERIZAÇÃO & CANVAS                  │
│  Three.js r128+ • GLSL Shaders Customizados • D3.js (d3-geo) • WebGL2  │
├────────────────────────────────────────────────────────────────────────┤
│                       MICROENGINES ESPECIALIZADAS                      │
│  CelestialSystem • CameraOrbitController • CosmicLaser • GeodesicEngine │
│  OceanShaderCanvas (Batimetria & Swell) • SunPhotosphereShader (GLSL)  │
├────────────────────────────────────────────────────────────────────────┤
│                       SERVIÇOS DE DADOS & APIS EXTERNAS                │
│  Open-Meteo (Clima/Vento) • GBIF/ICMBio (Espécies) • IBGE (Malhas D3)  │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1. Núcleo de Execução
- **React 18+ & Vite 6+**: Renderização reativa, code-splitting e suporte a Hot Module Replacement otimizado.
- **TypeScript (Strict Mode)**: 100% tipado, zero uso de `any` em contratos de dados de telemetria, biomas e astros.
- **Motion (`motion/react`)**: Transições fluidas de painéis laterais, HUDs contextuais e modais de quiz.
- **Tailwind CSS**: Estilização utilitária de alto contraste, variáveis CSS integradas para modos claro/escuro.

### 2.2. Cartografia e Computação Gráfica
- **Three.js (r128+)**: Renderização da esfera terrestre tridimensional, coordenadas esféricas geodésicas, iluminação solar fotorrealista e campo estelar.
- **D3.js (`d3-geo`, `d3-array`)**: Projeções cartográficas ortográficas e cônicas conformes de Albers para o Brasil, interpolação de fronteiras estaduais e polígonos dos 6 biomas.
- **GLSL Shaders Customizados (WebGL2)**:
  - *SunPhotosphereShader & SunCoronaGlowShader*: Shader de fotossfera solar com granulação convectiva via ruído simplex 3D/FBM, perturbação tridimensional de normais para relevo plasmático, manchas solares magnéticas realistas com penumbra, e halo volumétrico radial (corona solar) com decaimento exponencial suave (smoothstep), eliminando qualquer aresta ou contorno rígido de esfera.
  - *Microengine Planetário PBR (`celestialPBR.ts`)*: Renderização baseada em física (PBR) completa para os corpos celestes com geração procedural de mapas de Albedo, Bump/Normal (cânions, crateras, vulcões, bandas de jatos zonais), Rugosidade (Roughness) diferenciada e Oclusão Ambiental (AO).
  - *Atmosferas Planetárias Rayleigh/Mie (`planetAtmosphereShader.ts`)*: Camada de dispersão atmosférica e brilho de limbo Fresnel ajustada espectralmente para planetas com atmosfera (Vênus, Marte, Júpiter, Saturno, Urano e Netuno).
  - *Atmosfera Terrestre Rayleigh/Mie*: Dispersão de luz com efeito crepuscular azul cobalto (absorção de Chappuis na camada de ozônio).
  - *Terminador Dia/Noite*: Mistura contínua entre mapa de albedo diurno e luzes urbanas noturnas (NASA VIIRS).
  - *Oceano Cartográfico Procedural*: Swell bidirecional em alto-mar, Domain Warping duplo, cáusticas líquidas e atenuação costeira anti-aliased.

---

## 3. Microengines e Módulos Arquiteturais Internos

### 3.1. `CelestialSystem` (`src/lib/globeEngine/celestialSystem.ts`)
- **Astrometria Kepleriana e Escala Cosmológica**: Posicionamento tridimensional em tempo real ou simulado do Sol, da Lua e de planetas clássicos (Mercúrio, Vênus, Marte, Júpiter, Saturno com anéis, Urano e Netuno).
- **Proporção Escalar Terra-Sol Reajustada**: Raio orbital da Terra calibrado para 58 unidades de cena (com Sol a 3.6 de raio e luz pontual com raio de 550 unidades), eliminando a sensação de proximidade excessiva e conferindo profundidade astronômica real.
- **Shader Solar Fotorrealista (`sunShader.ts`)**: Fotossfera procedural viva com convecção turbulenta, relevo de normais, e corona solar volumétrica billboard orientada à câmera com plumas e filamentos de proeminência dinâmicos.
- **Materiais PBR Planetários & Limbo Atmosférico**: Todos os planetas e a Lua utilizam mapas procedurais de Albedo, Bump (relevo) e Rugosidade (GGX specular), acompanhados de conchas atmosféricas Fresnel com dispersão Rayleigh voltada ao Sol.
- **Renderização Condicional Discreta de Linhas Orbitais**: Linhas de órbita, cinturão de asteroides, cometa e labels celestes permanecem estritamente invisíveis na visão padrão estática, surgindo de forma tênue (opacidade 0.20) exclusivamente durante a simulação da animação dos ciclos solares/lunares.
- **Fases Lunares Físicas**: A iluminação da malha lunar é derivada diretamente do vetor de incidência solar, gerando fases geometricamente fidedignas (Nova, Crescente, Cheia, Minguante).
- **Simulador 24h & Eclíptica**: Controle interativo de hora solar e dia do ano com cálculo de declinação axial ($23,44^\circ$) e solstícios/equinócios.

### 3.2. `CameraOrbitController` (`src/lib/globeEngine/cameraOrbitController.ts`)
- **Transição Geodésica de Câmera (`glideTo`)**: Suavização esférica contínua sem curvas parabólicas ou inversões bruscas de azimute.
- **Continuous Astro Tracking**: Acompanha dinamicamente corpos em órbita contínua mantendo o enquadramento estável.
- **Recálculo de Offset Dinâmico (`camera.setViewOffset`)**: Desloca o frustum de projeção lateralmente de acordo com o painel ativo na interface, impedindo que astros ou capitais fiquem escondidos sob a UI.

### 3.3. `CosmicLaserBeam` (`src/lib/globeEngine/cosmicLaserBeam.ts`)
- **Feixe Cósmico Volumétrico**: Projeta vetor emissivo tridimensional conectando o ponto geográfico da capital selecionada no globo ao centro do astro focalizado (Sol ou Lua).
- **Pulsação Fotônica**: Animação de feixes de partículas com decaimento suave e halos volumétricos translúcidos.

### 3.4. `GeodesicEngine` (`src/lib/globeEngine/geodesicRoutes.ts`)
- **Arcos de Grande Círculo (Great Circles)**: Interpolação esférica tridimensional com elevação senoidal proporcional à distância na mesosfera.
- **Cálculo de Distâncias e Rotas**: Resolução pela fórmula de Haversine ($R = 6371 \text{ km}$) com tempo estimado de trânsito aéreo e conexões culturais entre capitais.

### 3.5. `OceanEngine` (`src/components/map/CoastalWavesCanvas.tsx`)
- **Campo Contínuo Procedural**: Shader WebGL2 contínuo cobrindo toda a bacia oceânica sem emendas ou cortes em bloco.
- **Batimetria Gradual**: Transição orgânica de profundidade abissal para águas rasas e praias com ruído fractal e atenuação nas bordas do canvas (Zero Bounding Box).

### 3.6. `AudioEngine` (`src/lib/audioSynth.ts`)
- **Síntese Web Audio API Pura**: Osciladores senoidais, dentes de serra e triangulares sem arquivos pesados de áudio externo.
- **Proteção Anti-Double-Click**: Debounce temporal nativo (<75ms) para eventos de clique do sistema, eliminando sobreposições e ecos sonoros acidentais.

### 3.7. `NavFlyoutMenu & TopGlobalNavMenu` (`src/components/nav/NavFlyoutMenu.tsx`)
- **Menus Flutuantes por Modo**: Arquitetura modular de submenus reativos para os 6 modos principais (Aventura, Clima/Temperatura ECMWF, Biodiversidade, Geopolítica, Musicalidades e Globo 3D).
- **Isolamento de Painéis e Exclusividade Mútua**: Abertura de subitens com fechamento automático de menus e garantia de fechamento cruzado de painéis laterais.

### 3.8. `GeopoliticsMapLayer` (`src/components/map/GeopoliticsMapLayer.tsx`)
- **Pins Geopolíticos de Alta Densidade**: Badges resumidos de ultra-legibilidade (ex: `RO: 69% P`), substituindo textos prolixos e eliminando filtros de drop-shadow excessivos por sombreamento sutil e nítido.

---

## 4. Integrações de Dados e APIs Externas

| Provedor / API | Dados Fornecidos | Estratégia de Consumo & Cache |
| :--- | :--- | :--- |
| **Open-Meteo API** | Temperatura, vento, umidade, pressão, radiação solar e ZCAS | Cache L1 em memória + Cache L2 no SessionStorage (TTL: 15 min) |
| **IBGE (Malhas Digitais)**| TopoJSON/GeoJSON dos 26 estados + DF, divisas e capitais | Arquivo vetorial local estático, zero latência de rede |
| **GBIF / ICMBio** | Catálogo taxonômico e espécies ameaçadas da fauna/flora | Dicionário estruturado com lazy loading por bioma/estado |
| **NASA Earth Observatory**| Texturas Blue Marble, luzes urbanas noturnas VIIRS e mapa lunar | Assets otimizados WebP/JPEG com pré-carregamento assíncrono |

---

## 5. Requisitos de Ambiente e Infraestrutura

- **Porta de Execução**: `3000` (exclusiva, roteamento reverso padronizado).
- **Compatibilidade de Navegadores**: Google Chrome 90+, Microsoft Edge 90+, Mozilla Firefox 88+, Safari 14+.
- **Dispositivos Suportados**: Desktop, Notebooks, Tablets e Smartphones (design responsivo fluido mobile-first com alvos de toque $\ge 44\text{px}$).
- **Modo Offline**: Service Workers configuráveis para cache de dados cartográficos e execução em laboratórios de informática com baixa conectividade.

---

## 6. Levantamento Quantitativo de Linhas de Código por Módulo (Censo Atual)

Auditoria censitária automatizada realizada em todo o ecossistema de código fonte (`src/`, `server.ts`, `e2e/`), segmentando a complexidade por domínio funcional e identificando a densidade de linhas e aderência à meta de engenharia ($\le 270$ linhas/arquivo).

### 6.1. Tabela Analítica de Distribuição por Módulo

| Módulo / Camada Técnica | Arquivos | Linhas de Código (LOC) | % do Total | Média LOC/Arq. | Arquivos > 270 LOC | Status de Aderência |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **1. Território, Oceano & Cartografia Base** | 73 | 18.704 | 20,1% | 256,2 | 23 | ⚠️ Atenção (Canvas monólito) |
| **2. Globo 3D & Astrometria (CelestialSystem)** | 61 | 12.697 | 13,6% | 208,1 | 6 | 🟢 Boa (Microengine Three.js) |
| **3. Guardiões, Aventura & RPG** | 25 | 12.407 | 13,3% | 496,3 | 13 | 🔴 Crítico (Dados/UI acoplados) |
| **4. Dados Estruturados & Base Histórica/Cartográfica** | 27 | 8.613 | 9,2% | 319,0 | 11 | ⚠️ Atenção (Tabelas brutas em TS) |
| **5. Biodiversidade & Biomas (GBIF/ICMBio)** | 16 | 6.162 | 6,6% | 385,1 | 6 | ⚠️ Atenção (Dicionários extensos) |
| **6. Shell, Orquestrador & Entry Points** | 13 | 5.656 | 6,1% | 435,1 | 6 | 🔴 Crítico (App.tsx / NavMenu) |
| **7. Autenticação, Portal Educador & Backend** | 21 | 5.435 | 5,8% | 258,8 | 6 | 🟢 Boa (Serviços e APIs REST) |
| **8. Musicalidades & Rádio Vintage** | 9 | 4.925 | 5,3% | 547,2 | 5 | 🔴 Crítico (Player analógico denso) |
| **9. Geopolítica & Censo Demográfico** | 8 | 4.866 | 5,2% | 608,2 | 4 | 🔴 Crítico (Matriz IBGE embutida) |
| **10. Clima & Meteorologia em Tempo Real** | 12 | 4.631 | 5,0% | 385,9 | 4 | ⚠️ Atenção (Camadas meteorológicas) |
| **11. Serviços de Infra, Áudio & APIs** | 19 | 3.221 | 3,5% | 169,5 | 4 | 🟢 Excelente (Micro-serviços) |
| **12. Navegação, Rodapé & HUDs** | 11 | 3.164 | 3,4% | 287,6 | 3 | 🟡 Regular (Flyouts multifuncionais) |
| **13. Testes Automatizados (Vitest + Playwright)** | 24 | 2.227 | 2,4% | 92,8 | 0 | 🟢 Excelente (100% compliant) |
| **14. Contratos & Tipagem Estrita TypeScript** | 6 | 470 | 0,5% | 78,3 | 0 | 🟢 Excelente (100% compliant) |
| **TOTAL GERAL AUDITADO** | **325** | **93.178** | **100,0%** | **286,7** | **91** | **Taxa Global de Violação: 28,0%** |

### 6.2. Gráfico de Dispersão e Participação Relativa de Código

```
Território & Cartografia ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 20.1% (18.704 LOC)
Globo 3D & Astrometria   ▓▓▓▓▓▓▓▓▓▓▓▓▓ 13.6% (12.697 LOC)
Guardiões & Aventura RPG ▓▓▓▓▓▓▓▓▓▓▓▓▓ 13.3% (12.407 LOC)
Dados Estruturados TS    ▓▓▓▓▓▓▓▓▓ 9.2% (8.613 LOC)
Biodiversidade & Biomas  ▓▓▓▓▓▓ 6.6% (6.162 LOC)
Shell & Orquestradores   ▓▓▓▓▓▓ 6.1% (5.656 LOC)
Autenticação & Educador  ▓▓▓▓▓ 5.8% (5.435 LOC)
Musicalidades & Rádio    ▓▓▓▓▓ 5.3% (4.925 LOC)
Geopolítica & Censo      ▓▓▓▓▓ 5.2% (4.866 LOC)
Clima & Meteorologia     ▓▓▓▓▓ 5.0% (4.631 LOC)
Serviços & Áudio Synth   ▓▓▓ 3.5% (3.221 LOC)
Navegação & HUDs         ▓▓▓ 3.4% (3.164 LOC)
Testes (Unit + E2E)      ▓▓ 2.4% (2.227 LOC)
Contratos & Interfaces   ▏ 0.5% (470 LOC)
```

---

## 7. Diagnóstico Técnico de Concentração e Débitos de Extensão

O censo identificou que **91 dos 325 arquivos (28%)** ultrapassam o limite estrito de 270 linhas, concentrando mais de **54.000 linhas (58% de todo o código da aplicação)** em arquivos grandes.

### 7.1. Os 20 Maiores Monólitos Identificados

| Rank | Arquivo | Linhas (LOC) | Domínio Técnico | Diagnóstico e Causa Raiz |
| :---: | :--- | :---: | :--- | :--- |
| **1** | `src/components/IsometricMapCanvas.tsx` | **2.787** | Território / Canvas | Acúmulo de orquestração de zoom, pan, renderização SVG e múltiplos modais em um único componente. |
| **2** | `src/data/brazilBiodiversityData.ts` | **2.557** | Biodiversidade | Dicionário maciço de espécies de fauna/flora por bioma codificado diretamente como constantes TypeScript. |
| **3** | `src/data/geopoliticaData.ts` | **2.269** | Geopolítica | Matriz censitária bruta do IBGE para as 27 UFs embutida no bundle de código fonte. |
| **4** | `src/components/music/VintageRadioPlayer.tsx` | **1.747** | Musicalidades | Agrupamento de sintetizador sonoro analógico, dial de sintonia, agulha física e UI do dial em arquivo único. |
| **5** | `src/data/musicalHeritageData.ts` | **1.646** | Musicalidades | Catálogo descritivo e histórico de ritmos, instrumentos e biografias em formato TypeScript puro. |
| **6** | `src/components/map/BrazilGlobeR3F.tsx` | **1.635** | Globo 3D | Renderização R3F do globo agregando iluminação, malha continental, rotas aéreas e labels. |
| **7** | `src/data/officialFullAnthemsData.ts` | **1.601** | Dados Históricos | Letras completas, partituras e histórico de hinos estaduais mantidos como literais de string em TS. |
| **8** | `src/data/guardiansData.ts` | **1.579** | Guardiões / RPG | Descrições de folclore, atributos, biomas, itens e diálogos dos 27 guardiões em um único arquivo. |
| **9** | `src/components/map/ClimatePhenomenaLayer.tsx` | **1.459** | Clima | Orquestração simultânea de Alísios, ZCAS, Frentes Polares e Ciclones sem subcamadas isoladas. |
| **10** | `src/components/TopGlobalNavMenu.tsx` | **1.349** | Navegação | Menu superior contendo lógica de acionamento e rendering de botões para os 6 modos em uma única tela. |
| **11** | `src/components/quest/BrQuestHubModal.tsx` | **1.294** | Quests / RPG | Hub de missões integrando inventário, árvore de talentos, codex e ranking em modal monolítico. |
| **12** | `src/components/nav/NavFlyoutMenu.tsx` | **1.246** | Navegação | Flyouts contextuais para todos os 6 modos no mesmo componente com renderização condicional densa. |
| **13** | `src/data/anthemsData.ts` | **1.117** | Dados Históricos | Metadados adicionais dos hinos e links de streaming sem compressão estrutural. |
| **14** | `src/App.tsx` | **1.042** | Shell Principal | Orquestrador global com múltiplos estados de telemetria, modais de diálogo e hooks de geolocalização. |
| **15** | `src/components/map/GeopoliticsControlPanel.tsx` | **1.004** | Geopolítica | Painel de controle agregando filtros, ordenação e renderização de comparativos estaduais. |
| **16** | `src/data/stateQuestionsData.ts` | **990** | Guardiões / Quiz | Banco de questões do quiz com enunciados e alternativas em constantes de código. |
| **17** | `src/data/brQuestQuestionsData.ts` | **973** | Quests / Quiz | Banco secundário de desafios pedagógicos embutido diretamente no repositório. |
| **18** | `src/components/CodexInsignias.tsx` | **962** | Guardiões / Gamificação | Vitrine de medalhas e conquistas com renderização detalhada de efeitos visuais e áudio. |
| **19** | `src/lib/globeEngine/celestialSystem.ts` | **961** | Astrometria | Microengine astronômico calculando efemérides solares, lunares e planetárias em um único módulo. |
| **20** | `src/components/guardian/GuardianInventoryModal.tsx` | **888** | Guardiões / RPG | Modal de gerenciamento de itens com lógica de drag/drop, atributos e cálculo de poder. |

---

## 8. Projeções de Volume de Código: Atual vs. Beta vs. Release v1.0.0

A evolução da base de código divide-se em duas etapas estratégicas: a **conclusão funcional da versão Beta** (acréscimo de conteúdo e fechamento de escopo) e a **reestruturação arquitetural para a versão v1.0.0** (modularização radical, isolamento de dados estáticos para JSON e aplicação da regra de $\le 270$ linhas).

### 8.1. Comparativo de Projeção em 3 Fases

| Dimensão Técnica | Estado Atual (Set/2026) | Projeção Conclusão Beta | Projeção Release v1.0.0 | Variação (Beta $\to$ v1.0.0) |
| :--- | :---: | :---: | :---: | :---: |
| **Linhas de Código TS/TSX** | 93.178 LOC | **101.400 LOC** | **80.500 LOC** | **-20,6% (Otimização)** |
| **Arquivos de Código Fonte** | 325 arquivos | **365 arquivos** | **445 arquivos** | **+21,9% (Desacoplamento)** |
| **Média de Linhas por Arquivo**| 286,7 LOC/arq. | **277,8 LOC/arq.** | **180,9 LOC/arq.** | **-34,9% (Modularidade)** |
| **Arquivos Acima de 270 Linhas**| 91 (28,0%) | **98 (26,8%)** | **0 (0,0%)** | **Meta Zero Monólitos** |
| **Dados Estáticos em JSON (externo)**| 0 linhas | **0 linhas** | **~24.000 linhas** | **Isolamento de Chunks** |
| **Volume de Testes (Vitest + E2E)**| 2.227 LOC (24 arq.) | **3.800 LOC (32 arq.)** | **5.200 LOC (48 arq.)** | **+36,8% (Cobertura Total)** |
| **Tamanho Estimado do Bundle JS**| ~1.95 MB (gzipped: 520 KB) | ~2.18 MB (gzipped: 575 KB) | **~1.25 MB (gzipped: 310 KB)** | **-42,7% (Carregamento)** |

### 8.2. Vetores de Expansão na Finalização da Versão Beta (+8.222 LOC)
1. **Guardiões e Quests (+2.100 LOC)**: Conclusão das 135 perguntas pedagógicas oficiais dos 27 estados (5 por estado), com feedback detalhado para erros/acertos e conexões curriculares com a BNCC.
2. **Biodiversidade & Flora Nativa (+1.500 LOC)**: Inclusão de catálogo botânico com espécies arbóreas nativas e fungos medicinais em risco para todos os biomas.
3. **Musicalidades & Acervo de Áudio (+1.200 LOC)**: Integração de faixas de domínio público em áudio sintetizado e rádios AM/FM locais dos estados restantes.
4. **Portal do Educador & Backend Express (+1.400 LOC)**: Gestão de turmas com relatórios de aproveitamento escolar, geração de certificados em PDF e persistência offline no IndexedDB/Firestore.
5. **Cobertura de Testes de Integração e E2E (+1.573 LOC)**: Suites completas de teste para fluxos de áudio, alternância de modos e navegação geodésica no Playwright.
6. **Polimento de PWA e Acessibilidade (+449 LOC)**: Manifestos PWA atualizados, service worker de alta performance com cache inteligente de malhas IBGE e atalhos globais de teclado (WCAG 2.1).

### 8.3. Vetores de Otimização e Refatoração para a Versão 1.0.0 (-20.900 LOC em TS)
1. **Desacoplamento de Dados Brutos para JSON (-16.500 LOC em TS)**:
   - Extração de `brazilBiodiversityData.ts`, `geopoliticaData.ts`, `officialFullAnthemsData.ts`, `anthemsData.ts`, `guardiansData.ts` e bancos de questões para a pasta `public/data/` ou `src/assets/data/*.json`.
   - Carregamento assíncrono via `fetch` local ou imports dinâmicos (`import()`), permitindo *code-splitting* real e retirando a carga de tipagem estática maciça do compilador TypeScript (`tsc`).
2. **Decomposição Modular de Telas e Canvas (-3.200 LOC em redundâncias)**:
   - Decomposição do `IsometricMapCanvas.tsx` (2.787 LOC) em 11 subcomponentes especializados com menos de 200 linhas cada:
     - `MapViewportController.tsx` (gerenciamento de câmera/pan)
     - `MapSvgLayerRenderer.tsx` (desenho de caminhos de estados)
     - `MapInteractionsManager.tsx` (eventos de hover/click)
     - `MapOceanBackdrop.tsx` (ligação com WebGL2)
     - 7 sub-modais extraídos para componentes autônomos.
   - Decomposição do `VintageRadioPlayer.tsx` (1.747 LOC) em 5 módulos: `RadioCabinet`, `RadioDialMesh`, `RadioAudioEngineBridge`, `RadioStationFrequencyScroller`, `RadioKnobController`.
   - Quebra do `ClimatePhenomenaLayer.tsx` (1.459 LOC) em 6 subcamadas independentes (`ZcasLayer`, `TradeWindsLayer`, `PolarFrontsLayer`, `BoliviaHighLayer`, `CycloneLayer`, `AtmosphericRiversLayer`).
3. **Reuso e Abstração de Padrões Visuais (-1.200 LOC)**:
   - Consolidação do padrão **Card Cartográfico 4x2** e **4x3** (`CartographicCard.tsx`) compartilhado universalmente entre os modos Clima, Geopolítica, Biodiversidade e Território, eliminando templates HTML repetidos.

---

## 9. Plano Diretor de Aderência à Regra Estrita ($\le 270$ LOC/Arquivo)

Para assegurar manutenibilidade absoluta e conformidade estrita com as diretrizes do sistema na versão v1.0.0, a refatoração obedecerá às seguintes regras de arquitetura:

### 9.1. Matriz de Refatoração dos 10 Principais Monólitos

```
┌─────────────────────────────────┬───────────┬──────────────────────────────────────────────┐
│ Arquivo Monolítico Atual        │ LOC Atual │ Submódulos Resultantes (Todos <= 220 LOC)    │
├─────────────────────────────────┼───────────┼──────────────────────────────────────────────┤
│ IsometricMapCanvas.tsx          │ 2.787 LOC │ 11 arquivos: Viewport, Layers, TooltipHooks  │
│ brazilBiodiversityData.ts       │ 2.557 LOC │ Migrado para JSON + 3 loaders tipados        │
│ geopoliticaData.ts              │ 2.269 LOC │ Migrado para JSON + Service de agregação     │
│ VintageRadioPlayer.tsx          │ 1.747 LOC │ 6 arquivos: Dial, Cabinet, Needle, Knob, Sfx │
│ musicalHeritageData.ts          │ 1.646 LOC │ Migrado para JSON + MusicTaxonomyService     │
│ BrazilGlobeR3F.tsx              │ 1.635 LOC │ 7 arquivos: Atm, Continent, Lights, Flight   │
│ officialFullAnthemsData.ts      │ 1.601 LOC │ Migrado para JSON compactado sob demanda     │
│ guardiansData.ts                │ 1.579 LOC │ Migrado para JSON + GuardianRegistryService  │
│ ClimatePhenomenaLayer.tsx       │ 1.459 LOC │ 6 arquivos: ZCAS, Alísios, Frentes, Ciclones │
│ TopGlobalNavMenu.tsx            │ 1.349 LOC │ 6 arquivos: NavButtons por Modo Contextual   │
└─────────────────────────────────┴───────────┴──────────────────────────────────────────────┘
```

### 9.2. Protocolo de Decomposição em 4 Camadas
1. **Camada de Dados & Modelos**: Arquivos de dados brutos são obrigatoriamente arquivos `.json` ou endpoints locais de serviço. Arquivos `.ts` contêm apenas interfaces, tipos puros e validadores de contrato.
2. **Camada de Lógica de Negócio**: Toda computação de coordenadas, cálculos de vento, regras de RPG e fórmulas de pontuação residem em `services/` ou Custom Hooks (`hooks/`), isolados de JSX.
3. **Camada de Composição de UI**: Componentes React operam puramente como renderizadores de visão com foco visual, sem acúmulo de estado complexo, garantindo leitura instantânea e isolamento de falhas.
4. **Camada de Testes Automatizados**: Cada subcomponente e serviço extraído recebe testes unitários focados, impedindo regressões em layouts, proporções 4x2 ou coordenadas cartográficas.
