# Plano Arquitetural: Motor Cartográfico Procedural D3-Geo, Efeitos Atmosféricos e Alta Performance

Este documento estabelece o plano detalhado de engenharia, cartografia digital e renderização procedural para a reestruturação completa do mapa tático do projeto **Símbolos BR**, descartando texturas raster pesadas em prol de um **motor 100% vetorial, procedural e de alta fidelidade para Web (60 FPS)**.

---

## 1. Diretrizes Estratégicas e Filosofia de Performance

### 1.1. Eliminação de Texturas Raster Pesadas
- **Arquivos Descartados do Pipeline**:
  - `bg-mapa-br.png` (~5.8MB) ❌
  - `mapa-br-estados.png` (~2.2MB) ❌
  - `stroke-mapa-br-estados.png` (~0.9MB) ❌
  - `papel-mapa-br.jpg` ❌
- **Impacto**: Economia de **mais de 9 MB de transferência de rede**, eliminando tempo de carregamento e consumo excessivo de memória GPU/DOM.

### 1.2. Renderização Procedural e Vetorial Pura
- **Terra e Estados**: `GeoJSON` renderizado via `d3-geo` com SVG dinâmico e filtros de relevo procedural (`<feTurbulence>`, `<feDisplacementMap>`, `<feSpecularLighting>`).
- **Oceano Procedural e Batimetria**: Canvas 2D acelerado por hardware desenhando ondas senoidais multicamadas, malha de grade náutica (`d3.geoGraticule10()`) e gradientes de profundidade oceânica calculados matematicamente.
- **Camada Atmosférica Viva (Procedural FX)**:
  - *Bandos de Aves/Gaivotas (Boids)*: Simulação de voo com trajetórias suaves em curvas Bézier e batimento de asas procedural.
  - *Névoa e Nuvens Volumétricas*: Bancos de neblina translúcida gerados proceduralmente e deslocando-se com vento marítimo.
  - *Lens Flare & Reflexo Solar*: Efeito de brilho solar e reflexo especular na superfície do oceano e sobre as serras.

### 1.3. Prevenção de Bloat e "Flood Dependencies"
- **Stack Enxuta e Focada**:
  - `d3-geo`: Motor matemático de projeções, cálculo de centróides e caminhos vetoriais.
  - `Canvas 2D / SVG nativo`: Animações procedurais e física com zero overhead de bibliotecas extras.
  - `lucide-react` e `motion`: Ícones e transições de interface.
  - **Zero bibliotecas desnecessárias**: Sem pacotes pesados de física ou shaders externos desnecessários — matemática pura em TypeScript/Canvas.

### 1.4. Interação Cartográfica Suave, Escala Local e Centralização Calibrada
- **Centroide D3 como Âncora Focada**: Projeção centrada no ponto médio continental $[-54.39^\circ, -15.18^\circ]$ (Acre à Paraíba / Roraima ao Chuí).
- **Filtragem de Ilhas Oceânicas Remotas**: Polígonos de ilhas ultra-oceânicas do Pacífico (ex: Ilha de Páscoa a $-109^\circ$ e Galápagos a $-91^\circ$) filtrados para evitar deslocamentos indesejados da bounding box.
- **Hover Estável com Escala Local (`scale(1.05)`)**: Ao pairar o mouse sobre um estado, o mapa global permanece perfeitamente fixo, e o estado realiza uma elevação suave de camada e escala tendo o seu centróide vetorial exato (`transformOrigin: cx cy`) como pivô.
- **Mergulho Cinematográfico no Clique (`zoom 2.5x`)**: Ao selecionar o estado, a câmera executa um mergulho focado de 1500ms direto para o coração do estado, iniciando a transição de diálogo do Guardião.
- **Globo Terrestre 3D Opcional (`BrazilGlobeR3F.tsx`)**: Modo de visualização esférica 3D interativa com relevo, atmosfera e órbita livre.
- **Padrão Semântico "classe-para-humanos"**: Identificadores semânticos descritivos em todos os elementos (`container-mapa-br`, `painel-toolbar-relevo`, `pin-brasao-estado`, etc.).

---

## 2. Diagrama da Arquitetura do Componente

```
+--------------------------------------------------------------------------------------------------+
|                             ISOMETRIC MAP CANVAS (D3-GEO + PROCEDURAL FX)                        |
+--------------------------------------------------------------------------------------------------+
|  [HUD / Control Bar]: Estilos (Tiles vs Coroplético), Sub-temas, 3D/2D, Atmosfera FX, Som       |
+--------------------------------------------------------------------------------------------------+
|  [Viewport Container]: Clamped Pan & Zoom (Zero-Void Bounding Box)                               |
|                                                                                                  |
|   +-- [PERSPECTIVE STAGE (3D Isometric Tilt: 32°, Yaw: 0°~15°)] -------------------------------+ |
|   |                                                                                            | |
|   |   +-- CAMADA 0: Oceano Procedural Dinâmico (Canvas 2D @ 60 FPS)                            | |
|   |   |   - Ondulações marítimas procedurais (Multi-octave sine/perlin waves)                  | |
|   |   |   - Linhas náuticas D3 Graticule (Lat/Long) com iluminação sutil                       | |
|   |   |   - Batimetria oceânica com profundidade em gradiente dinâmico                         | |
|   |   +----------------------------------------------------------------------------------------+ |
|   |                                                                                            | |
|   |   +-- CAMADA 1: América do Sul e Territórios Contextuais (Vector Landmass)                 | |
|   |   |   - GeoJSON contextual continental com tonalidade cartográfica sóbria                  | |
|   |   +----------------------------------------------------------------------------------------+ |
|   |                                                                                            | |
|   |   +-- CAMADA 2: Brasil e 27 Estados (br.json + Shaders Procedurais)                        | |
|   |   |   * ESTILO A: Clipped Map Tiles (Padrão)                                               | |
|   |   |     - SVG <clipPath> + Textura de relevo e pergaminho gerada via feTurbulence          | |
|   |   |   * ESTILO B: Thematic Choropleth (Opcional)                                           | |
|   |   |     - Escalas cromáticas temáticas: Conquistas/XP, Regiões IBGE e Biomas               | |
|   |   |   * Relevo e Destaques:                                                                | |
|   |   |     - Sombra interna (50%) + Sombra de contorno (50%) + Borda Dourada Imperial         | |
|   |   +----------------------------------------------------------------------------------------+ |
|   |                                                                                            | |
|   |   +-- CAMADA 3: Centróides, Pins dos Guardiões & Partículas RPG                            | |
|   |   |   - Centróides D3 com micro-offsets matemáticos                                        | |
|   |   |   - Brasões de Armas Oficiais (SVG/PNG isolados), Avatares e Efeito de Partículas      | |
|   |   +----------------------------------------------------------------------------------------+ |
|   |                                                                                            | |
|   |   +-- CAMADA 4: Efeitos Atmosféricos Procedurais (Overlays)                                | |
|   |   |   - Bancos de névoa marítima e nuvens suaves em deslocamento lento                     | |
|   |   |   - Bandos de aves marinhas (Gaivotas / Boids procedurais) sobrevoando a costa         | |
|   |   |   - Lens Flare solar e brilho especular dinâmico                                       | |
|   |   +----------------------------------------------------------------------------------------+ |
|   |                                                                                            | |
|   +--------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
|  [Toolbar Inferior]: Carrossel de Estados com Sincronização Bidirecional e Busca Ágil            |
+--------------------------------------------------------------------------------------------------+
```

---

## 3. Especificação dos Módulos Procedurais

### 3.1. Projeção Cartográfica D3 & Clamping Anti-Vazio (`src/lib/mapProjections.ts`)
- Projeção de alta performance `geoMercator()` ou `geoConicConformal()` calibrada para o Brasil ($[-53^\circ, -14.2^\circ]$).
- Algoritmo de restrição (*clamping*) em tempo real que calcula a extensão do continente e do oceano, impedindo translações fora da caixa delimitadora e travando o zoom mínimo no preenchimento total da tela.

### 3.2. Oceano Procedural em Canvas (`src/components/map/ProceduralOceanCanvas.tsx`)
- Renderização via `requestAnimationFrame` com baixo consumo de CPU (< 3% em repouso).
- Ondas sintetizadas por superposição de frequências harmônicas $\sin(x \cdot k_1 + t \cdot \omega_1) + \sin(y \cdot k_2 + t \cdot \omega_2)$.
- Efeito de espuma/rebentação sutil ao longo da linha de costa brasileira.

### 3.3. Textura de Relevo Procedural em SVG (`src/components/map/ProceduralTerrainFilter.tsx`)
- Filtro SVG puro sem dependência de imagem externa:
  ```xml
  <filter id="proceduralPaperTerrain" x="0%" y="0%" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
    <feDiffuseLighting in="noise" lighting-color="#fff8e7" surfaceScale="1.5" result="light">
      <feDistantLight azimuth="45" elevation="60" />
    </feDiffuseLighting>
    <feBlend mode="multiply" in="SourceGraphic" in2="light" />
  </filter>
  ```

### 3.4. Atmosfera Procedural: Aves, Névoa e Lens Flare (`src/components/map/ProceduralAtmosphereLayer.tsx`)
- **Flock de Aves (Boids 2D/2.5D)**: 6 a 12 gaivotas desenhadas com traçado vetorial minimalista, sobrevoando a costa do Atlântico e a bacia Amazônica.
- **Névoa Marítima**: 3 a 5 partículas volumétricas de gradiente radial com movimento lento e interpolação de opacidade.
- **Lens Flare Tático**: Brilho solar no canto superior direito com anéis de refração e brilho dourado sobre a projeção isométrica.

### 3.5. Estilos Cartográficos e Escalas Cromáticas (`src/lib/mapColorScales.ts`)
1. **Modo Clipped Tiles (Padrão)**: Cores topográficas de atlas antigo com relevo procedural.
2. **Modo Coroplético Gamificado (XP/Progresso)**: Gradientes dinâmicos calculados a partir do `storage.ts` (concluídos em esmeralda/ouro, pendentes em safira/ardósia).
3. **Modo Coroplético IBGE**: Cores oficiais e harmonizadas para as 5 macrorregiões.
4. **Modo Coroplético Biomas**: Cores botânicas para Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa.

---

## 4. Estrutura Modular e Enxuta de Arquivos

```
src/
├── components/
│   ├── map/
│   │   ├── IsometricMapCanvas.tsx          # Orquestrador central e controle de câmera 2.5D / 2D
│   │   ├── BrazilGlobeR3F.tsx              # Modo Globo 3D Interativo (Three.js / React Three Fiber)
│   │   ├── ProceduralOceanCanvas.tsx       # Canvas de ondas, batimetria e malha náutica
│   │   ├── ProceduralAtmosphereLayer.tsx   # Aves, neblina volumétrica e lens flare
│   │   ├── ProceduralTerrainFilter.tsx     # Filtros SVG de relevo/pergaminho puro
│   │   ├── ParchmentTextureFilter.tsx      # Textura procedural de mapa antigo
│   │   ├── AgedParchmentOverlay.tsx        # Efeito de envelhecimento cartográfico
│   │   ├── AntiqueCartographyDecor.tsx     # Rosa dos ventos e ornamentos táticos
│   │   ├── CompassLoadingScreen.tsx        # Tela de carregamento temático
│   │   ├── StateDetailsSidebar.tsx         # Painel retrátil de detalhes do estado em foco
│   │   ├── IsolatedLeftGuardianStandee.tsx # Standee visual do Guardião do estado
│   │   ├── MapStatesLayer.tsx              # Renderização vetorial dos 27 estados (Tiles / Coroplético)
│   │   ├── MapPinsLayer.tsx                # Pins de Guardiões, Brasões e Partículas de XP
│   │   ├── MapControlsHUD.tsx              # HUD tático: Estilos, 3D/2D, Atmosfera On/Off
│   │   ├── MapChoroplethLegend.tsx         # Legenda temática com escalas cromáticas
│   │   └── MapStateCarousel.tsx            # Carrossel inferior sincronizado
│   └── ...
├── data/
│   ├── brazilStatesRegistry.ts             # Registro completo dos 27 estados e brasões
│   ├── brazilGeoCoordinates.ts             # Coordenadas e limites de referência
│   └── southAmericaGeo.ts                  # Massa continental contextual da América do Sul
├── lib/
│   ├── mapProjections.ts                   # Matemática D3, centróides e clamping anti-vazio
│   ├── mapColorScales.ts                   # Escalas de cores coropléticas e biomas
│   └── audioSynth.ts                       # Efeitos sonoros procedurais Web Audio
└── test/
    ├── mapProjections.test.ts              # Testes da projeção D3 e limites anti-vazio
    ├── mapColorScales.test.ts              # Testes das paletas e funções de cor
    ├── proceduralFX.test.ts                # Testes de limites matemáticos dos efeitos
    └── guardiansData.test.ts               # Testes de integridade dos 27 estados
```

---

## 5. Roteiro de Execução e Metas de Performance

| Etapa | Foco | Métrica de Aceitação |
| :--- | :--- | :--- |
| **Fase 1** | Projeção D3 & Clamping Anti-Vazio (`mapProjections.ts`) | Centróides sem NaN, 0% de tela preta/vazia em qualquer pan/zoom. |
| **Fase 2** | Oceano e Relevo Procedural Puro | 0 KB de imagens transferidas para o mapa, 60 FPS estáveis. |
| **Fase 3** | Modos Visuais: Clipped Tiles + Coroplético Temático | Alternância instantânea de temas com transição suave. |
| **Fase 4** | Efeitos Atmosféricos (Aves, Névoa, Lens Flare) | Animações procedurais com < 4% de uso de CPU e botão de toggle. |
| **Fase 5** | Camada de Pins e Guardiões RPG | Interações de hover com escala local sobre centróide, diálogo e hinos. |
| **Fase 6** | Globo 3D & Decorações Cartográficas | Modo 3D R3F interativo, rosa dos ventos vetorial e pergaminho. |
| **Fase 7** | Bateria de Testes, Linter e Commit Final | 100% dos testes passando no Vitest + Build Verde. |
