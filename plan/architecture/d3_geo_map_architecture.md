# Arquitetura Cartográfica, Multimodal e de Dados do BR Quest

Este documento consolida a especificação técnica detalhada, escolhas arquiteturais, pipeline de renderização, fontes de dados e estratégias de performance do **BR Quest (Símbolos BR)**.

---

## 1. Visão Geral da Arquitetura & Filosofia de Engenharia

O motor cartográfico do BR Quest foi concebido a partir de quatro princípios intransigíveis:
1. **Renderização 100% Procedural e Vetorial**: Rejeição de mapas em imagens bitmap/raster pesadas (economia de >9 MB de tráfego inicial). O relevo, pergaminhos, ondas oceânicas e efeitos de iluminação são sintetizados matematicamente em tempo de execução.
2. **Arquitetura Multimodal Sem Recarga**: Alternância fluida e instantânea entre 5 modos de visualização e exploração operando sobre o mesmo estado de verdade.
3. **Consistência e Fidedignidade de Dados**: Integração com APIs científicas oficiais (IBGE, Open-Meteo, INMET, NOAA, ECMWF, GBIF e ICMBio), com telemetria padronizada no **Horário de Brasília (UTC-3)** e rastreamento transparente de latência e consumo de rede.
4. **Padrão Semântico "classe-para-humanos"**: Estruturação de componentes e containers com identificadores descritivos (`container-mapa-br`, `painel-toolbar-relevo`, `pin-brasao-estado`), garantindo manutenibilidade e clareza taxonômica no DOM.

---

## 2. Especificação Arquitetural por Modo Disponível

```
+-------------------------------------------------------------------------------------------------------+
|                                    BR QUEST - NÚCLEO ORQUESTRADOR                                     |
|                              (App.tsx / IsometricMapCanvas.tsx / DynamicFooter)                       |
+-------------------------------------------------------------------------------------------------------+
        |                        |                       |                     |                  |
        v                        v                       v                     v                  v
+---------------+       +------------------+    +-----------------+   +----------------+  +-----------------+
|    MODO 1     |       |      MODO 2      |    |     MODO 3      |   |     MODO 4     |  |     MODO 5      |
| Atlas 2D Flat |       | Isométrico 2.5D  |    |  Globo 3D R3F   |   | Observatório   |  | Guardiões / RPG |
| Cartográfico  |       | Tático RPG + FX  |    | Esférico Orbital|   | Clima em Tempo |  | Biodiversidade  |
|               |       |                  |    |                 |   | Real & Jatos   |  | & Quizzes       |
+---------------+       +------------------+    +-----------------+   +----------------+  +-----------------+
```

---

### 2.1. Modo 1: Atlas 2D Cartográfico Clássico (Flat Cartography)

#### A. Objetivo
Oferecer uma visualização bidimensional precisa, sóbria e de altíssima legibilidade cartográfica para análise espacial, regionalização, biomas e comparação temática coroplética.

#### B. Principais Features
- Projeção cônica e Mercator ajustada para a malha continental do Brasil ($[-53^\circ, -14.2^\circ]$).
- Filtro e isolamento automático de territórios remotos ultramarinos para evitar distorções na bounding box.
- Camada Coroplética Temática com 4 chaves de visualização:
  1. **Atlas Topográfico/Clipped Tiles** com textura de pergaminho procedural;
  2. **Macrorregiões do IBGE** (Norte, Nordeste, Centro-Oeste, Sudeste, Sul);
  3. **Biomas Continentais** (Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal, Pampa);
  4. **Nível de Progresso / Conquistas RPG** (cores baseadas em XP e missões concluídas).
- Inspeção por clique com zoom dinâmico e destaque perimetral do estado selecionado.

#### C. Tech Stack & APIs
- **Bibliotecas**: `d3-geo`, `d3-scale`, `d3-selection`, `d3-array`, SVG nativo com filtros declarativos.
- **Fontes de Dados**:
  - Malhas vetoriais TopoJSON/GeoJSON simplificadas do IBGE;
  - Registro de limites estaduais e centróides calibrados (`brazilStatesRegistry.ts`, `brazilGeoCoordinates.ts`);
  - Massa continental contextual da América do Sul (`southAmericaGeo.ts`).

#### D. Performance
- **FPS**: 60 FPS estáveis com zero jank em operações de pan/zoom.
- **Tamanho do Payload**: ~180 KB (GeoJSON comprimido dos 27 estados e América do Sul).
- **Consumo de Memória**: < 25 MB de heap no navegador.

#### E. Escolhas Arquiteturais
- **SVG vs. Canvas no 2D**: Adoção de SVG com polígonos nativos para viabilizar eventos de ponteiro nativos (`onMouseEnter`, `onClick`), escalabilidade infinita sem pixelização e aplicação direta de filtros de sombra e relevo (`<feTurbulence>`, `<feDisplacementMap>`).

---

### 2.2. Modo 2: Mapa Isométrico 2.5D Tático & RPG Atmosférico

#### A. Objetivo
Criar uma experiência imersiva de mesa tática de RPG e atlas histórico vivo, onde o mapa ganha profundidade angular, relevo tridimensional e vida através de simulações atmosféricas e marítimas em tempo real.

#### B. Principais Features
- Projeção isométrica por matriz CSS (`transform: perspective(1200px) rotateX(32deg) rotateZ(0deg)`).
- **Oceano Procedural Dinâmico**: Canvas 2D em background sintetizando ondas senoidais multicamadas, gradientes de profundidade batimétrica e malha de coordenadas náuticas (`d3.geoGraticule10()`).
- **Camada Atmosférica Viva (Procedural FX)**:
  - *Bandos de Aves (Boids)*: Simulação de voo de gaivotas costeiras com curvas de Bézier e batimento de asas;
  - *Bancos de Névoa Volumétrica*: Nuvens translúcidas em deriva impulsionadas por ventos alísios marítimos;
  - *Lens Flare & Reflexo Solar*: Brilho solar dinâmico e refração especular na linha d'água.
- **Pins 3D dos Guardiões**: Marcadores com brasões oficiais em relevo, partículas de aura e elevação dinâmica em hover.
- **Navegação com Clamping Anti-Vazio**: Algoritmo que restringe os limites de translação do usuário, impedindo telas pretas ou vazios fora do continente.

#### C. Tech Stack & APIs
- **Bibliotecas**: `Canvas 2D API` acelerada por hardware, `d3-geo`, `motion/react`, `lucide-react`.
- **Fontes de Dados**:
  - Catálogo de Guardiões e Brasões Históricos (`guardians.ts`, `brazilStatesRegistry.ts`);
  - Algoritmos matemáticos procedurais internos sem dependências externas.

#### D. Performance
- **Consumo de CPU em repouso**: < 3.5% em GPUs integradas.
- **Otimização de Render Loop**: Efeitos de ondas e partículas utilizam `requestAnimationFrame` desacoplado do estado do React para evitar re-renderizações desnecessárias da árvore de componentes.

#### E. Escolhas Arquiteturais
- **Isometria CSS + Canvas Composto**: Ao invés de carregar um motor pesado de jogos como Babylon.js ou Unity WebGL, a combinação de transformações 3D no DOM do SVG do mapa com um Canvas 2D nativo para fluidos alcança estética de alta qualidade com consumo mínimo de recursos.

---

### 2.3. Modo 3: Globo Terrestre 3D Esférico Orbital (WebGL / Three.js)

#### A. Objetivo
Apresentar o Brasil em seu contexto planetário esférico com geolocalização precisa, rotação orbital livre e simulação física da incidência da luz solar de acordo com o horário real.

#### B. Principais Features
- Esfera 3D tridimensional com projeção UV de relevo continental e oceanos.
- **Iluminação Solar Astronômica em Tempo Real**: Cálculo da posição do Sol (azimute e declinação solar) baseado nas efemérides astronômicas de Brasília para iluminar a face diurna e escurecer a face noturna do globo.
- Atmosfera volumétrica com shader de brilho de Rayleigh (halo azul da Terra no espaço).
- Órbita livre com amortecimento suave (`OrbitControls`), rotação automática opcional e botão de recentralização no Brasil.
- Pins esféricos georreferenciados calculados via conversão de coordenadas esféricas:
  $$x = R \cos(\text{lat}) \sin(\text{long}), \quad y = R \sin(\text{lat}), \quad z = R \cos(\text{lat}) \cos(\text{long})$$

#### C. Tech Stack & APIs
- **Bibliotecas**: `three`, `@react-three/fiber`, `@react-three/drei`.
- **Fontes de Dados**:
  - Coordenadas geográficas oficiais das 27 capitais (`brazilGeoCoordinates.ts`);
  - Calculador de efemérides astronômicas (`getBrasiliaCelestialEphemeris`).

#### D. Performance
- **Consumo WebGL**: Renderização a 60 FPS com alocação inteligente de geometrias (SphereGeometry de resolução intermediária e shaders GLSL otimizados).
- **Descarte de Memória (Cleanup)**: Ao sair do modo 3D, todos os recursos WebGL, texturas e geometrias são limpos do contexto do navegador para evitar memory leaks.

#### E. Escolhas Arquiteturais
- **React Three Fiber com Lazy Loading**: O módulo 3D é carregado de forma assíncrona apenas quando o usuário clica no modo Globo, reduzindo o bundle inicial da aplicação.

---

### 2.4. Modo 4: Observatório Climático & Fenômenos em Tempo Real

#### A. Objetivo
Monitorar, simular e ensinar a dinâmica meteorológica e climática do território brasileiro com dados científicos em tempo real, abrangendo fenômenos de macroescala e telemetria de todas as unidades federativas.

#### B. Principais Features
- **Camadas Dinâmicas de Fenômenos Atmosféricos**:
  1. *Frentes Polares / Frentes Frias*: Deslocamento do ar polar vindo da Antártica e bacia do Prata;
  2. *ZCAS (Zona de Convergência do Atlântico Sul)*: Faixa contínua de nebulosidade e umidade da Amazônia ao Sudeste;
  3. *Correntes de Jato Subtropical e Polar*: Vetores de ventos de alta altitude (> 200 km/h) guiando sistemas meteorológicos;
  4. *Rios Voadores Amazônicos*: Fluxos de vapor d'água transportados pelos ventos alísios da floresta em direção ao Centro-Oeste e Sul;
  5. *Vórtices Ciclônicos de Altos Níveis (VCAN)* e Bloqueios Atmosféricos / Domos de Calor.
- **Telemetria Climática das 27 Capitais**: Temperatura atual, sensações térmicas, índice UV, velocidade do vento, pressão barométrica, umidade e índice pluviométrico.
- **Monitor de El Niño / La Niña (Índice ONI)**: Monitoramento da temperatura da superfície do mar no Pacífico Equatorial e seus reflexos no regime de chuvas do Brasil.
- **Simulador de Precipitação Interativo**: Slider de simulação de chuvas e monitoramento de risco de enchentes/estiagem por estado.
- **Painel de Controle e HUD do Observatório**: Filtros de camadas, controle de velocidade da animação e alternância de modos.

#### C. Tech Stack & APIs
- **APIs Meteorológicas**:
  - `Open-Meteo API` (Dados em tempo real de estações e reanálise ECMWF/NOAA);
  - `INMET (Instituto Nacional de Meteorologia)` (Estações meteorológicas automáticas);
  - `NOAA Climate Prediction Center` (Índices oceânicos e atmosféricos do Pacífico).
- **Bibliotecas**: `Canvas 2D` para vetores de vento em partículas, `lucide-react`, `motion/react`.

#### D. Performance & Estratégia de Cache
- **Cache Local e Memória (TTL de 15 Minutos)**: Requisições meteorológicas são cacheadas em `localStorage` e memória RAM para garantir carregamento instantâneo e respeitar limites de requisição (*rate limiting*).
- **Horário de Brasília Estável**: A indicação de atualização exibe a hora exata da **última requisição às APIs**, sem sofrer mutações espúrias por cliques ou interações de UI do usuário.

---

### 2.5. Modo 5: RPG de Guardiões, Biodiversidade & Quiz Educacional

#### A. Objetivo
Fixar o aprendizado sobre a história, identidade, símbolos, biodiversidade e ecologia de cada estado através de narrativa de Guardiões, áudio patrimonial e desafios de gamificação.

#### B. Principais Features
- **27 Guardiões Estaduais Culturais**: Personificações antropológicas e históricas de cada estado (ex: Guardião dos Pampas, Guardião do Pantanal, Guardiã das Vertentes, etc.).
- **Diálogo e Cartão de Identidade do Estado**:
  - Brasão de Armas Oficial vetorizado;
  - Bandeira estadual e significado heráldico;
  - Hino oficial do estado com player de áudio integrado;
  - Dados demográficos, relevo, altitude e curiosidades históricas.
- **Catálogo de Biodiversidade & Espécies Ameaçadas**:
  - Espécies emblemáticas da fauna e flora de cada estado;
  - Status de conservação IUCN / Livro Vermelho do ICMBio (Pouco Preocupante, Vulnerável, Em Perigo, Criticamente Ameaçado);
  - Integração com dados taxonômicos do GBIF (*Global Biodiversity Information Facility*).
- **Sistema de Quizzes, XP e Medalhas**:
  - Perguntas desafiadoras sobre geografia, história, clima e biomas;
  - Acúmulo de Pontos de Experiência (XP) e níveis de patente;
  - **Árvore de Habilidades Ecológicas (Skill Tree)** para desbloquear competências de preservação ambiental.

#### C. Tech Stack & APIs
- **Bibliotecas**: `Web Audio API` (para sintetizador e efeitos sonoros procedurais), `HTML5 Audio` (para hinos orquestrados), `LocalStorage` para persistência de progresso e medalhas.
- **Fontes de Dados**:
  - Base de dados de biodiversidade brasileira compilada a partir do GBIF, ICMBio e IBAMA (`biodiversityService.ts`);
  - Base de dados de Guardiões e hinos históricos (`guardians.ts`, `audioRegistry.ts`).

---

## 3. Matriz Comparativa dos Modos

| Característica | 1. Atlas 2D Flat | 2. Isométrico 2.5D | 3. Globo 3D R3F | 4. Observatório Clima | 5. Guardiões / RPG |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tecnologia Principal** | SVG + D3-Geo | SVG + Canvas 2D | Three.js + WebGL | Canvas 2D + APIs | React + Web Audio |
| **Perspectiva** | Top-down (0°) | Angular (32°) | Esférica (3D) | Top-down / 2.5D | Modais & HUDs |
| **Foco Pedagógico** | Geografia & Biomas | Imersão & Relevo | Astronomia & Escala | Climatologia & Chuvas | História & Cultura |
| **Uso de Rede** | Baixo (~180 KB) | Mínimo (Procedural) | Médio (Assets 3D) | Médio (APIs Clima) | Baixo (Cache Local) |
| **Taxa de Quadros** | 60 FPS | 60 FPS | 60 FPS | 60 FPS | 60 FPS |
| **Interatividade** | Hover, Zoom, Filtros | Câmera, Drag, Pins | Órbita Livre 360° | Simuladores, Sliders | Quizzes, Áudio, XP |

---

## 4. Pipeline de Dados, Rastreamento & Fusos Horários

```
                                  [APIs Externas]
               (Open-Meteo / INMET / NOAA / GBIF / ICMBio / IBGE)
                                         |
                                         v
                         +-------------------------------+
                         |     apiTracker.ts             |
                         |  - Contagem de Requisições    |
                         |  - Monitor de Latência (ms)   |
                         |  - Resiliência a Falhas       |
                         +-------------------------------+
                                         |
                                         v
                         +-------------------------------+
                         |   climateService / biodiv     |
                         |  - Cache com TTL de 15 min    |
                         |  - Timestamp Persistente      |
                         |  - Sincronização Brasília     |
                         +-------------------------------+
                                         |
                                         v
                         +-------------------------------+
                         |   Barramento Reativo          |
                         |  (onClimateTelemetryUpdate)   |
                         +-------------------------------+
                                         |
                 +-----------------------+-----------------------+
                 |                                               |
                 v                                               v
     [DynamicAppFooter.tsx]                          [StateClimateDialog.tsx]
     - Badge de Clima                                - Estatísticas Detalhadas
     - Badge de Biodiversidade                       - Previsão & Enchentes
```

- **Fuso Horário Padrão**: Todas as datas e horas da aplicação são convertidas estritamente para o fuso `America/Sao_Paulo` (Horário de Brasília UTC-3), exibindo formato compacto amigável `[ícone_relógio | atualizado 15h15]`.
- **Rastreador de APIs Integrado**: O `apiTracker` monitora o tráfego gerado pela aplicação, permitindo auditoria em tempo real das chamadas a serviços terceiros e consumo de dados.

---

## 5. Dívidas Técnicas Identificadas (Technical Debts)

1. **Topologia de Fronteiras Interestaduais**: Embora os polígonos dos estados estejam perfeitamente alinhados, a simplificação geométrica de algumas divisas do Centro-Oeste/Norte possui micro-arestas que poderiam se beneficiar de uma malha unificada em formato `TopoJSON` com topologia compartilhada (*mesh topology*).
2. **Suporte a Modo Offline Completo (Service Worker / PWA)**: As malhas GeoJSON e a maior parte das informações culturais já estão embutidas no bundle, mas a instalação de um Service Worker dedicado para navegação 100% offline em escolas sem internet ainda precisa ser formalizada.
3. **Internacionalização de Metadados (i18n)**: A plataforma está integralmente em Português do Brasil (pt-BR). Para uso diplomático, turístico internacional (Embratur) ou acadêmico global, a extração de strings para suporte a Inglês e Espanhol é uma dívida arquitetural mapeada.
4. **Resolução de Shaders no Globo 3D para Dispositivos Legados**: Em smartphones de entrada com suporte limitado a WebGL 2.0, o shader de iluminação do globo 3D requer um fallback simplificado em Canvas 2D.

---

## 6. Opções para o Futuro & Roadmap Evolutivo

```
[FASE 1: CONCLUÍDA]               [FASE 2: EM ANDAMENTO]             [FASE 3: FUTURO PRÓXIMO]
- Motor D3 Vetorial               - Observatório de Clima Vivo       - Modo Multiplayer / Duelos
- 27 Guardiões & Brasões          - Catálogo de Biodiversidade       - Editor de Mapas & Missões
- Modos 2D, 2.5D e Globo 3D       - Telemetria de 27 Capitais        - Painel de Gestão Escolar
- Áudio & Hinos Históricos        - Rastreador de APIs               - Realidade Aumentada (AR)
```

### 6.1. Funcionalidades Planejadas para Próximas Versões
1. **Modo Multiplayer: "Duelo dos Guardiões"**: Desafios de conhecimento em tempo real entre salas de aula ou usuários online utilizando WebSockets com salas temáticas por região.
2. **Camada de Bacias Hidrográficas e Aquíferos Subterrâneos**: Visualização dinâmica do Rio Amazonas, Rio São Francisco, Bacia do Paraná e os Aquíferos Guarani e Alter do Chão com fluxo volumétrico animado.
3. **Painel do Professor (EdTech B2G)**: Dashboard administrativo para educadores criarem listas de exercícios personalizadas, monitorarem o engajamento dos alunos e gerarem relatórios de competências da BNCC.
4. **Realidade Aumentada (WebXR / AR)**: Capacidade de projetar o mapa 3D do Brasil ou os Guardiões em tamanho real sobre a mesa da sala de aula usando a câmera do smartphone.
5. **Histórico Paleogeográfico e Evolução Territorial**: Linha do tempo interativa permitindo ver a evolução das capitanias hereditárias (1534), Tratado de Tordesilhas, Tratado de Madri (1750), expansão dos bandeirantes e criação de novos estados (Acre, Tocantins, Mato Grosso do Sul, etc.).

---

*Documentação mantida pela equipe de engenharia e cartografia do BR Quest.*
