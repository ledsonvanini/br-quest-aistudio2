# Plano de Engenharia e Arquitetura: Refatoração Completa do Globo 3D (R3F / Three.js)
**Data:** 05 de Setembro de 2026  
**Documento:** `2026-09-05_refatoracao_globo_3d_astronomia_rotas_shaders.md`  
**Status:** Proposta de Arquitetura e Engenharia de Software  
**Alvo:** `src/components/map/BrazilGlobeR3F.tsx` e nova arquitetura modular em `src/lib/globeEngine/` e `src/components/globe/`

---

## 1. Visão Geral e Diagnóstico da Arquitetura Atual

### 1.1. Diagnóstico do Estado Atual
O componente atual (`BrazilGlobeR3F.tsx`, com ~895 linhas em arquivo monolítico) cumpre a função de visualização básica, porém apresenta limitações severas identificadas:
1. **Shaders Degradados e Rudimentares**: A renderização atual utiliza materiais padrão do Three.js (`MeshStandardMaterial` para a Terra e nuvens geradas em Canvas 2D procedural com ovais desenhadas no contexto 2D). Não há dispersão atmosférica (Rayleigh/Mie), o terminador dia/noite é uma transição escura sem luzes de cidades combinadas, e não há cálculo da camada de ozônio ou sombras de nuvens sobre a superfície.
2. **Falta de Profundidade Astronômica Tridimensional**: O Sol e a Lua são representados como fontes de luz simples em posições fixas ou coordenadas arbitrárias, sem modelo orbital tridimensional real, sem planetas do Sistema Solar e sem relação escalar com o espaço circunvizinho.
3. **Ausência de Conexões Geodésicas e Rotas**: Não há traçado tridimensional de rotas geodésicas (Grandes Círculos) conectando os estados/capitais do Brasil com fluxos dinâmicos.
4. **Cálculos de Distância Estáticos**: O usuário não possui ferramentas de telemetria espacial para calcular a distância e o tempo-luz a partir de seu estado até a Lua, até o Sol ou entre capitais.
5. **Monolitismo e Ausência de Preload Elegante**: Todas as texturas são carregadas sob demanda direta na GPU sem pipeline de pré-carregamento com cache (IndexedDB), sem *placeholders* progressivos (*blur-up*) e sem sistema em camadas modular desacoplado.

---

## 2. Visão do Novo Sistema: Os 5 Pilares da Refatoração

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       SISTEMA DO GLOBO 3D MODULAR                      │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. CAMADA CELESTE & SISTEMA SOLAR (Z ~ 20 a 1000 r)                      │
│    - Sol 3D com Corona Shader, Erupções e Iluminação Real               │
│    - Lua 3D com Textura de Albedo, Relevo (Normal Map) e Fases Reais    │
│    - Astros do Sistema Solar (Mercúrio, Vênus, Marte, Júpiter, Saturno) │
│    - Skybox de Campo Estelar com Constelações Visíveis no Brasil        │
├─────────────────────────────────────────────────────────────────────────┤
│ 2. CAMADA ATMOSFÉRICA & OZÔNIO (Z ~ 2.01 a 2.08 r)                      │
│    - Shader de Dispersão Atmosférica (Rayleigh + Mie Scattering)        │
│    - Absorção de Chappuis (Camada de Ozônio - Azul Cobalto no Crepúsculo)│
│    - Nuvens Volumétricas com Dinâmica Real e Sombras na Terra          │
├─────────────────────────────────────────────────────────────────────────┤
│ 3. CAMADA TERRESTRE MULTITEXTURA & ESTAÇÕES (Z ~ 2.00 r)                │
│    - Shader Dia/Noite com Blend Dinâmico no Terminador                  │
│    - City Lights / Night Lights (VIIRS NASA) de Alta Definição          │
│    - Simulação de Estações do Ano (Obliquidade Axial 23.44° e Albedo)   │
│    - Mapas Especular e de Relevo (Oceano Reflexivo + Relevo Continental)│
├─────────────────────────────────────────────────────────────────────────┤
│ 4. CAMADA GEODÉSICA & ROTAS 3D (Z ~ 2.01 a 2.30 r)                      │
│    - Arcos Geodésicos de Grande Círculo (Great-Circle Arcs)             │
│    - Partículas de Fluxo Cultural, Aéreo e Energético Inter-Estados     │
│    - Fronteiras Vetoriais D3 com Ouro Heraldico & Anti-Aliasing         │
├─────────────────────────────────────────────────────────────────────────┤
│ 5. CAMADA DE TELEMETRIA, HUD & PRELOADER PROGRESSIVO                    │
│    - Telemetria de Distâncias: Estado -> Lua / Sol / Estados (km e c)   │
│    - Preloader Assíncrono com IndexedDB e Fallback Procedural Blur-Up   │
│    - Controles de Câmera Suaves e Projeção de Pins em Espaço de Tela    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Novas Funcionalidades Detalhadas

### 3.1. Astros do Sistema Solar e Espaço Tridimensional
- **Posicionamento Real em 3D**:
  - Implementação de um módulo analítico de efemérides baseado no modelo astronômico kepleriano simplificado (VSOP87 reduzido), calculando ascensão reta ($\alpha$), declinação ($\delta$) e distância topocêntrica ($r$).
  - **O Sol**: Localizado a uma distância estática de visualização proporcional ($R_{sun} = 45 \times R_{terra}$ no modelo estético), com raio aparente correto, shader de emissão estelar com turbulência cromosférica procedural (Perlin Simplex) e *lens flare* anamórfico sutil.
  - **A Lua**: Posicionada na distância e ângulo azimutal/elevação corretos para o Horário de Brasília. Esfera lunar 3D com textura real da NASA (Lunar Reconnaissance Orbiter albedo + normal map), iluminada estritamente pelo vetor do Sol, gerando automaticamente a fase lunar real (Nova, Crescente, Quarto Crescente, Gibosa, Cheia, Minguante).
  - **Planetas Visíveis**: Representação dos 5 planetas clássicos visíveis a olho nu a partir do Brasil (Mercúrio, Vênus, Marte, Júpiter e Saturno com seus anéis característicos).
  - **Órbitas Visíveis Opcionais**: Linhas orbitais elípticas e eclíptica solar desenhadas com traço sutil e tênue, permitindo ao usuário entender o alinhamento planetário.

### 3.2. Telemetria de Distâncias Cósmicas em Tempo Real
- **Painel de Astrometria do Estado**:
  - Ao selecionar qualquer estado brasileiro (ex: Goiás / Brasília, Amazonas, Rio Grande do Sul):
    * **Distância Estado $\to$ Lua**: Calculada em tempo real em quilômetros (ex: $384.400 \text{ km} \pm \Delta_{topocentrico}$), com o tempo que a luz leva para percorrer o trajeto ($\sim 1,28 \text{ s}$).
    * **Distância Estado $\to$ Sol**: Calculada em quilômetros (ex: $149.597.870 \text{ km}$ no afélio/periélio) e tempo-luz ($\sim 8 \text{ min } 19 \text{ s}$).
    * **Ângulo de Insolação Local e Zênite**: Ângulo de incidência solar sobre a capital selecionada no momento atual.
    * **Linhas de Visada Tridimensionais (Laser Rays)**: Ao ativar o modo "Conectar ao Cosmos", um feixe luminoso translúcido é traçado da capital selecionada em direção ao centro da Lua e do Sol no espaço 3D.

### 3.3. Arcos Geodésicos e Rotas Inter-Estaduais
- **Traçado de Grandes Círculos (Great-Circle / Orthodromic Arcs)**:
  - Interpolação esférica (Slerp) entre as coordenadas $(\text{lat}_1, \text{lon}_1)$ e $(\text{lat}_2, \text{lon}_2)$ dos 27 estados.
  - Elevação do arco em relação à curvatura da Terra usando curva senoidal de altitude:
    $$h(\theta) = R_{\text{terra}} + H_{\text{max}} \cdot \sin(\theta), \quad \text{onde } \theta \in [0, \pi]$$
  - $H_{\text{max}}$ escala proporcionalmente à distância geodésica em Terra, garantindo que rotas curtas (ex: RJ $\to$ SP) não fiquem excessivamente altas, enquanto rotas continentais (ex: RS $\to$ RR) atinjam altitudes dramáticas na mesosfera.
- **Animação de Partículas de Pulso**:
  - Shader de traço com partículas luminosas (feixes de luz neon/ouro) que viajam ao longo das curvas das rotas, simulando conexões culturais, fluxos aéreos ou rotas históricas dos Guardiões.
- **Matriz de Distâncias Inter-Estaduais**:
  - Cálculo instantâneo da distância geodésica pela fórmula de Haversine com raio médio da Terra ($R = 6371 \text{ km}$), exibindo tempo estimado de voo comercial e conexões regionais.

### 3.4. Simulação de Estações do Ano e Insolação
- **Obliquidade da Eclíptica ($23,44^\circ$)**:
  - O eixo de rotação da Terra é inclinado em $23,44^\circ$ no espaço 3D.
  - A posição anual do Sol ao longo da eclíptica define o ângulo de declinação solar $\delta$:
    * **Solstício de Verão no Hemisfério Sul (Dezembro)**: O Trópico de Capricórnio (que cruza SP, PR e MS) recebe insolação vertical direta ($90^\circ$ ao meio-dia). O Polo Sul fica totalmente iluminado.
    * **Equinócios (Março e Setembro)**: A linha do Equador (que cruza AP, PA, AM e RR) recebe luz perpendicular; dias e noites têm durações idênticas no país.
    * **Solstício de Inverno no Hemisfério Sul (Junho)**: O Hemisfério Sul recebe luz oblíqua, noites mais longas no Sul/Sudeste e iluminação reduzida.
- **Controle Interativo de Estações**:
  - Slider temporal no HUD: permite ao usuário alternar entre "Hoje (Tempo Real)", "Solstício de Verão", "Equinócio de Outono", "Solstício de Inverno" e "Equinócio de Primavera", observando a migração do terminador e da zona de luz sobre o território brasileiro.

---

## 4. Engenharia de Shaders Fotorrealistas

### 4.1. Shader de Superfície Terrestre: Day/Night Blend com City Lights
O shader atual é substituído por um **GLSL Custom Shader** (`EarthDayNightShader`):
- **Uniformes**:
  - `u_dayMap`: Textura Blue Marble de alta resolução (NASA Visible Earth 2K/4K).
  - `u_nightMap`: Textura de Luzes Noturnas (NASA VIIRS Black Marble Night Lights).
  - `u_specularMap`: Máscara oceânica para cálculo de reflexo de Fresnel especular no Atlântico e rios principais.
  - `u_sunDirection`: Vetor tridimensional normalizado da direção do Sol.
  - `u_cityLightIntensity`: Fator de calibração para as luzes urbanas.
- **Física do Blend no Terminador**:
  ```glsl
  // Cálculo do cosseno do ângulo zenital solar
  float sunDot = dot(vNormal, u_sunDirection);

  // Transição suave no terminador (-0.15 a +0.15 para simular crepúsculo astronômico)
  float dayWeight = smoothstep(-0.12, 0.12, sunDot);
  float nightWeight = 1.0 - dayWeight;

  // Cor diurna com reflexo especular oceânico
  vec4 dayColor = texture2D(u_dayMap, vUv);
  float spec = pow(max(dot(reflect(-u_sunDirection, vNormal), vViewDir), 0.0), 32.0) * texture2D(u_specularMap, vUv).r;
  vec3 finalDay = dayColor.rgb + vec3(1.0, 0.95, 0.8) * spec * 0.6;

  // Luzes noturnas ativadas apenas na escuridão, com brilho dourado nas metrópoles
  vec3 nightLights = texture2D(u_nightMap, vUv).rgb * u_cityLightIntensity * 1.8;
  vec3 finalNight = nightLights * nightWeight;

  gl_FragColor = vec4(finalDay * dayWeight + finalNight, 1.0);
  ```

### 4.2. Shader da Camada de Ozônio e Dispersão Atmosférica (Atmospheric Scattering)
A atmosfera não pode ser apenas uma esfera azul semitransparente com `BackSide`. Ela é implementada com base na física de espalhamento óptico:
- **Dispersão de Rayleigh**: Espalha comprimentos de onda curtos (azul/violeta), gerando o halo azul celeste límpido durante o dia sobre o Brasil.
- **Dispersão de Mie**: Espalha luz para frente através de aerossóis e vapor de água, gerando o brilho esbranquiçado ao redor da linha solar.
- **Absorção de Chappuis (Camada de Ozônio)**:
  - O ozônio estratosférico absorve luz na faixa de $550\text{ a }650 \text{ nm}$ (amarelo e laranja).
  - Na linha do terminador (aurora e crepúsculo no Brasil), os raios solares percorrem uma camada extensa de ozônio, filtrando o amarelo e produzindo o característico **azul cobalto profundo / roxo crepuscular**.
- **GLSL Atmosphere Edge & Limb Glow**:
  ```glsl
  varying vec3 vNormal;
  varying vec3 vViewDir;
  uniform vec3 u_sunDirection;

  void main() {
    float viewDot = 1.0 - max(dot(vViewDir, vNormal), 0.0);
    float rim = pow(viewDot, 3.5);
    
    // Insolação no limbo atmosférico
    float sunFacing = max(dot(vNormal, u_sunDirection), 0.0);
    
    // Cor de dispersão: azul puro durante o dia, ouro/laranja no terminador, azul cobalto na transição
    vec3 rayleighColor = vec3(0.22, 0.58, 1.0);
    vec3 sunsetColor = vec3(1.0, 0.45, 0.15);
    vec3 ozoneChappuisColor = vec3(0.08, 0.18, 0.65);
    
    float sunsetFactor = smoothstep(0.15, -0.15, dot(vNormal, u_sunDirection)) * smoothstep(-0.3, 0.1, dot(vNormal, u_sunDirection));
    
    vec3 atmoColor = mix(rayleighColor, sunsetColor, sunsetFactor * 0.7);
    atmoColor = mix(atmoColor, ozoneChappuisColor, pow(viewDot, 2.0) * 0.35);

    gl_FragColor = vec4(atmoColor, rim * (sunFacing * 0.8 + 0.2));
  }
  ```

### 4.3. Shader de Nuvens Volumétricas e Projeção de Sombras
- **Nuvens Dinâmicas**: Utilização de mapa de nuvens 2K da NASA com textura procedural adicional de turbulência via GLSL para rotação diferenciada por latitude (ventos alísios de leste a oeste na faixa tropical do Brasil).
- **Projeção de Sombra**: No shader da Terra, as nuvens projetam uma sombra atenuada sobre a superfície:
  $$\text{UV}_{\text{sombra}} = \text{UV} - \vec{S}_{\text{tangente}} \times \Delta_{\text{altitude}}$$
  Isso adiciona profundidade tridimensional espetacular, especialmente nas cordilheiras e planaltos brasileiros.

---

## 5. Levantamento e Verificação de APIs e Fontes de Dados

| Domínio | Fonte / API | Descrição Técnica & Formato | Estratégia de Uso |
| :--- | :--- | :--- | :--- |
| **Luzes Noturnas** | **NASA VIIRS Black Marble** (GIBS / Visible Earth) | Textura global calibrada de radiância artificial noturna (DNB). Resolução 2048x1024 e 4096x2048 em formato JPEG/WebP. | Pré-otimizada e empacotada em CDN pública com cache local em IndexedDB. |
| **Satélite Diurno** | **NASA Blue Marble Next Generation** | Imagens mensais do satélite Terra/Aqua mostrando a vegetação sazonal e calotas de gelo. | Imagem base balanceada sem nuvens para a superfície terrestre. |
| **Nuvens Globais** | **NASA Earth Observatory / GOES-East** | Mapa equirretangular de cobertura de nuvens em escala de cinza com canal alfa. | Textura estática de alta fidelidade + shader procedural de perturbação por latitude. |
| **Efemérides Solares & Lunares** | **Módulo Analítico Local (VSOP87 / Meeus)** + `src/services/astronomyService.ts` | Fórmulas astronômicas determinísticas executadas no cliente sem dependência de rede externa (100% offline-ready e latência zero). | Posição precisa do Sol, fases da Lua e coordenadas celestes para o fuso UTC-3 (Brasília). |
| **Dados Planetários** | **NASA JPL Horizons API** (Fallback via Efemérides Analíticas) | Parâmetros orbitais keplerianos para posição dos planetas no espaço tridimensional. | Cálculo matemático client-side de baixa complexidade computacional para os 5 planetas. |
| **Geodésia Brasileira** | `src/data/brazilGeoCoordinates.ts` e `src/lib/geoDataLoader.ts` | Coordenadas cartográficas oficiais do IBGE para as 27 capitais e fronteiras de estado. | Geração dos vértices das rotas de Grande Círculo e projeção dos pins. |

---

## 6. Arquitetura Modular e Sistema em Camadas

Para manter o código limpo, testável e de alta performance, o arquivo monolítico `BrazilGlobeR3F.tsx` será dividido na seguinte árvore de módulos desacoplados:

```
src/
├── components/
│   └── globe/
│       ├── BrazilGlobeR3F.tsx               <-- Orquestrador principal (Canvas & ciclo de vida)
│       ├── GlobeControlsHUD.tsx             <-- Barra de ferramentas (Sol/Lua, Estações, Rotas, Zoom)
│       ├── GlobeTelemetryCard.tsx           <-- Painel de distâncias espaciais (Terra -> Lua / Sol)
│       ├── GlobePinsOverlay.tsx             <-- Projeção de escudos e pins em HTML/Screen-space
│       └── GlobeLoadingProgress.tsx         <-- Tela de transição elegante e sem congelamento
└── lib/
    └── globeEngine/
        ├── index.ts                         <-- Exportações unificadas da engine
        ├── types.ts                         <-- Interfaces de dados, rotas e efemérides
        ├── globePreloadManager.ts           <-- Gerenciador de download progressivo e IndexedDB Cache
        ├── celestialSystem.ts               <-- Sol 3D, Lua 3D, Sistema Solar e Eclíptica
        ├── geodesicRoutesEngine.ts          <-- Arcos de Grande Círculo, Slerp e Partículas
        ├── seasonsEngine.ts                 <-- Inclinação axial (23.44°), solstícios e insolação
        ├── shaders/
        │   ├── earthShader.ts               <-- GLSL: Day/Night, City Lights e Fresnel especular
        │   ├── atmosphereShader.ts          <-- GLSL: Dispersão de Rayleigh/Mie e Camada de Ozônio
        │   ├── cloudShader.ts               <-- GLSL: Rotação zonal de nuvens e projeção de sombra
        │   └── geodesicPulseShader.ts       <-- GLSL: Feixes de luz móveis nas rotas inter-estaduais
        └── math/
            ├── celestialMath.ts             <-- Efemérides keplerianas e coordenadas topocêntricas
            └── sphericalMath.ts             <-- Conversões Lat/Lon -> Vector3, Great-Circle e Haversine
```

### 6.1. Especificação das Camadas e Ordenação de Renderização
1. **Camada 0: Skybox & Espaço Profundo (`RenderOrder = 0`)**
   - Esfera estelar com estrelas pontuais e Via Láctea em textura esférica atenuada.
   - Astros: Sol com malha emissiva e Lua com textura fásica a distâncias seguras da câmera.
2. **Camada 1: Superfície Terrestre (`RenderOrder = 1`)**
   - Esfera da Terra ($R = 2,00$) executando `EarthDayNightShader`.
3. **Camada 2: Vetores e Rotas Geodésicas (`RenderOrder = 2`)**
   - Linhas douradas dos estados brasileiros ($R = 2,012$).
   - Arcos de Grande Círculo inter-estaduais com `geodesicPulseShader` ($R = 2,012 \to 2,30$).
4. **Camada 3: Manto de Nuvens (`RenderOrder = 3`)**
   - Esfera transparente de nuvens ($R = 2,022$) com `NormalBlending` e rotação diferencial.
5. **Camada 4: Halo Atmosférico e Camada de Ozônio (`RenderOrder = 4`)**
   - Esfera translúcida ($R = 2,075$) com `AdditiveBlending` e `atmosphereShader` em `BackSide/FrontSide`.
6. **Camada 5: Interface do Usuário e Projeção de Tela (`Z-Index DOM`)**
   - Pins dos estados com escudos heráldicos projetados em coordenadas $(X, Y)$ da tela sem colisão com o WebGL.

---

## 7. Sistema de Preload e Gerenciamento de Memória

### 7.1. O Problema do Congelamento (Stuttering)
Ao carregar texturas 2K/4K durante a inicialização do Three.js, a decodificação da imagem no thread principal do navegador causa congelamentos visíveis da UI (*jank* e queda de FPS para zero).

### 7.2. Pipeline de Carregamento em 4 Fases com IndexedDB
```
[Início da Aplicação / Idle Time]
                 │
                 ▼
     1. Verificação no IndexedDB ("globe_textures_v1")
        ├── [Hit]  -> Restaura Blobs em milissegundos do disco local
        └── [Miss] -> Inicia download assíncrono em background (streaming)
                 │
                 ▼
     2. Geração Instantânea de Placeholders (LQIP - Low Quality Image Placeholder)
        -> Texturas procedurais geradas em Canvas 2D (128x64px)
        -> O Globo 3D abre em menos de 100ms sem tela preta
                 │
                 ▼
     3. Decodificação em Background via createImageBitmap()
        -> A decodificação ocorre em thread assíncrona, fora da UI principal
                 │
                 ▼
     4. Atualização Suave das Texturas (Fade-In de Textura na GPU)
        -> Textura final em alta resolução substitui o placeholder com transição de opacidade
        -> Armazena no IndexedDB para as próximas sessões do usuário
```

### 7.3. Prevenção de Vazamento de Memória (Memory Leaks)
- Implementação rigorosa do método `disposeGlobeResources()`:
  - Todas as geometrias (`BufferGeometry`), materiais (`ShaderMaterial`, `MeshStandardMaterial`) e texturas (`Texture`) são descartadas explicitamente no `useEffect` de desmontagem do React.
  - Cancelamento imediato de `requestAnimationFrame` e desconexão de listeners do `OrbitControls`.

---

## 8. Novas Classes Semânticas (Regra "classe-para-humanos")

Seguindo as diretrizes obrigatórias do projeto, todos os novos elementos e painéis do Globo 3D receberão identificadores semânticos descritivos:
- `container-palco-globo-3d`: Canvas e container principal do globo tridimensional.
- `painel-hud-globo-controles`: Barra de controles de visualização (Sol, Nuvens, Rotas, Zoom).
- `painel-astrometria-telemetria`: Card HUD com distâncias Terra-Lua, Terra-Sol e tempo-luz.
- `menu-seletor-estacoes`: Controle de estações do ano e obliquidade axial.
- `btn-toggle-rotas-estaduais`: Botão para ativar/desativar os arcos geodésicos entre estados.
- `btn-conectar-cosmos`: Botão para traçar os vetores luminosos até a Lua e o Sol.
- `card-pin-globo-estado`: Marcador flutuante com brasão e nome do estado sobre a esfera.
- `barra-progresso-preload-globo`: Indicador visual de carregamento das texturas planetárias.

---

## 9. Plano de Execução em Fases

### Fase 1: Fundação Matemática e Modularização (Sem Quebrar o Sistema Atual)
1. Criar a pasta `src/lib/globeEngine/` e os utilitários matemáticos:
   - `sphericalMath.ts`: Funções de conversão esférica, matrizes de rotação e Slerp.
   - `celestialMath.ts`: Cálculo de posições 3D do Sol, Lua e planetas para o Horário de Brasília.
2. Criar o gerenciador de cache e carregamento progressivo `globePreloadManager.ts` com suporte a IndexedDB.
3. Validar a compilação e estabilidade com testes unitários.

### Fase 2: Shaders de Alta Fidelidade (Superfície, Atmosfera e Nuvens)
1. Implementar `earthShader.ts`: Day/Night blend contínuo com textura VIIRS Black Marble (City Lights) e canal especular oceânico.
2. Implementar `atmosphereShader.ts`: Dispersão de Rayleigh e Mie com absorção de Chappuis (Camada de Ozônio).
3. Implementar `cloudShader.ts`: Nuvens procedurais com rotação zonal e cálculo de sombras na superfície.
4. Integrar ao renderizador do Three.js e calibrar a iluminação direcional verdadeira.

### Fase 3: Astros do Sistema Solar e Astrometria 3D
1. Implementar a Lua 3D com coordenadas astronômicas reais e iluminação física (fases dinâmicas).
2. Implementar o Sol 3D com corona luminosa e feixes estelares.
3. Implementar os 5 planetas clássicos e linha eclíptica.
4. Construir o módulo de telemetria de distâncias (km, segundos-luz e minutos-luz) integrado ao estado selecionado.

### Fase 4: Arcos Geodésicos e Rotas Inter-Estaduais
1. Implementar `geodesicRoutesEngine.ts` com cálculo de Grandes Círculos entre as capitais brasileiras.
2. Desenvolver o shader de pulso de fluxo luminoso ao longo dos arcos.
3. Integrar com o seletor de estados: ao clicar em um estado, traçar rotas automáticas para as outras regiões com tabela de distâncias.

### Fase 5: Simulação de Estações e Interface HUD Final
1. Implementar o controle de estações do ano com obliquidade de $23,44^\circ$.
2. Extrair e desacoplar o HUD de controles (`GlobeControlsHUD.tsx`) e o card telemétrico (`GlobeTelemetryCard.tsx`).
3. Adicionar a barra de transição e preload progressivo sem impacto na experiência de navegação do usuário.
4. Executar verificação completa com `lint_applet` e `compile_applet`.

---

## 10. Conclusão e Próximos Passos
Este plano fornece uma base técnica e arquitetural robusta para elevar o modo **Globo 3D** de um visualizador básico para uma verdadeira **ferramenta de exploração planetária e espacial**, unindo rigor cartográfico brasileiro, astrometria tridimensional real e computação gráfica de ponta (GLSL Shaders e WebGL2) com performance fluida e carregamento assíncrono transparente.


REFERÊNCIAS:
https://www.cienciaviva.pt/equinocio/lat_long/index.asp
https://science.nasa.gov/earth/explore/el-nino/
https://www.noaa.gov/climate
https://www.gov.br/agricultura/pt-br/assuntos/inmet 
https://www.simepar.br/simepar



