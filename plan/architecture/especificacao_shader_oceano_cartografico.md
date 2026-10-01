# Especificação de Shader Procedural para Oceano Cartográfico
## React + Vite + TypeScript + WebGL/GLSL

---

## 1. Objetivo

Este documento descreve uma proposta de arquitetura visual e técnica para substituir um oceano com marolas artificiais por uma **simulação procedural contínua de água**, adequada a um mapa cartográfico interativo.

O objetivo não é realizar uma simulação física realista do oceano. O objetivo é produzir a **percepção visual de um oceano vivo**, com:

- ondas e marolas orgânicas;
- diferenciação entre mar raso e profundo;
- espuma e turbulência próximas à costa;
- variação gradual de cores;
- correntes e movimentos em diferentes direções;
- ausência de padrões repetitivos;
- ausência de bordas visíveis nas ondas;
- integração perfeita entre continente e oceano;
- bom desempenho em navegador.

A referência visual desejada é mais próxima do **Anexo 2**, enquanto o **Anexo 1** representa a situação atual, com ondas e marolas percebidas como elementos artificiais sobrepostos ao mapa.

---

# 2. Diagnóstico visual

## 2.1 Anexo 1 — problema atual

O oceano atual pode ser entendido visualmente como:

```text
MAPA
 │
 └── OCEANO AZUL
       │
       ├── ONDA A
       ├── ONDA B
       └── MAROLAS
```

O principal problema é que as ondas parecem ser **elementos adicionados ao oceano**, e não uma propriedade contínua da própria superfície da água.

Isso gera:

- bordas perceptíveis;
- padrões repetitivos;
- ondas com início e fim artificial;
- diferença brusca entre continente e mar;
- pouca percepção de profundidade;
- mar raso e profundo com aparência semelhante;
- sensação de overlay;
- aparência de textura ou pixels delimitados;
- menor naturalidade da animação.

O problema, portanto, não é simplesmente a quantidade de ondas. É o **modelo de representação**.

---

## 2.2 Anexo 2 — comportamento desejado

O Anexo 2 funciona melhor porque o oceano parece constituir um **campo visual contínuo**.

Em vez de desenhar ondas individuais, a aparência da água resulta da combinação de funções matemáticas que variam continuamente no espaço e no tempo.

Conceitualmente:

```text
                    OCEANO
                      │
          ┌───────────┴───────────┐
          │                       │
      MAR RASO              OCEANO PROFUNDO
          │                       │
   pequenas ondas            grandes fluxos
   turbulência               swell
   espuma                    variações suaves
   tons claros               tons profundos
          │                       │
          └───────────┬───────────┘
                      │
               TRANSIÇÃO CONTÍNUA
```

A percepção final deve ser:

> "O oceano está se movimentando."

e não:

> "Existe uma textura animada repetindo sobre o mapa."

---

# 3. Arquitetura geral

A solução recomendada é dividir a renderização em três grandes camadas:

```text
┌────────────────────────────────────────────┐
│  1. MAPA                                   │
│  continente + estados + cidades + UI       │
├────────────────────────────────────────────┤
│  2. ZONA COSTEIRA / MAR RASO               │
│  beach + espuma + pequenas ondas           │
├────────────────────────────────────────────┤
│  3. OCEANO PROFUNDO                        │
│  swell + correntes + variação de cor       │
└────────────────────────────────────────────┘
```

Existe, porém, uma regra fundamental:

**as camadas 2 e 3 não devem possuir uma fronteira visual rígida.**

Evitar:

```glsl
if (x < 100.0) {
    shallow();
} else {
    deep();
}
```

Preferir uma transição contínua:

```glsl
float shallowFactor = smoothstep(
    shallowStart,
    shallowEnd,
    coastDistance
);
```

Assim, o mar raso gradualmente se transforma em oceano profundo.

---

# 4. Arquitetura de composição

Uma arquitetura recomendada para React/Vite:

```text
                         React
                           │
              ┌────────────┴────────────┐
              │                         │
          Map Renderer             Ocean Renderer
              │                         │
          SVG/Canvas                    WebGL
              │                         │
              └────────────┬────────────┘
                           │
                       composição
```

Exemplo conceitual:

```tsx
<div className="map">
    <MapLayer />
    <OceanShader />
    <MarkersLayer />
    <LabelsLayer />
</div>
```

A camada WebGL deve ficar atrás das informações cartográficas, mas integrada ao sistema de coordenadas do mapa.

---

# 5. Camada 1 — mapa

O mapa continua sendo responsável por:

- continente;
- estados;
- fronteiras;
- cidades;
- marcadores;
- temperaturas;
- textos;
- elementos de interface.

O oceano deve ser tratado separadamente sempre que possível.

Idealmente:

```text
GeoJSON / SVG
      │
      ├── geometria do mapa
      │
      └── geometria da costa
                │
                ▼
          Ocean Shader
```

Essa separação evita transformar o oceano em uma simples imagem rasterizada.

---

# 6. Máscara da costa

Este é um dos componentes mais importantes da solução.

Uma máscara binária simples seria:

```text
terra = 1
água = 0
```

Porém, para produzir transições suaves, o ideal é trabalhar com uma **Distance Field / Signed Distance Field (SDF)** da costa.

Conceitualmente:

```text
                    OCEANO

             100px    50px    20px
                │       │       │
                ▼       ▼       ▼

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~╲
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~╲
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~╲
                                  █████████
                                  █ TERRA █
                                  █████████
```

Cada ponto da água possui uma informação aproximada de distância até a costa:

```text
0    = exatamente na costa
10   = 10 px da costa
50   = 50 px
200  = distante da costa
```

Isso permite construir regiões de influência:

```text
COSTA
 │
 ├── 0–10 px      → espuma / turbulência
 ├── 10–40 px     → água rasa
 ├── 40–100 px    → transição
 └── 100 px+      → oceano profundo
```

A vantagem é que não existe uma linha de separação desenhada.

---

# 7. Mar raso

A região costeira deve utilizar fenômenos de menor escala.

Recomenda-se combinar:

```text
MAR RASO

1. pequenas ondas
2. turbulência costeira
3. espuma
4. variação de tonalidade
```

## 7.1 Pequenas ondas

Combinar múltiplas funções:

```glsl
wave1 = sin(
    position.x * frequency1 +
    time * speed1
);

wave2 = sin(
    position.x * frequency2 +
    position.y * frequency2 * 0.7 +
    time * speed2
);

wave3 = noise(
    position * frequency3 +
    time * speed3
);
```

Depois:

```glsl
float waves =
    wave1 * 0.20 +
    wave2 * 0.15 +
    wave3 * 0.65;
```

É importante evitar uma única direção dominante.

Uma combinação mais natural utiliza fluxos diferentes:

```text
→ → →
 ↗ ↗
  ← ←
 ↘ ↘
```

---

# 8. Evitar o efeito de textura repetida

Um dos maiores riscos é utilizar uma pequena textura de espuma ou ondas repetida no espaço:

```text
[ A ][ B ][ A ][ B ][ A ][ B ]
```

Isso eventualmente denuncia o padrão.

Para evitar isso, utilizar **Domain Warping**.

Fluxo:

```text
UV
 │
 ▼
Noise
 │
 ▼
Domain Warp
 │
 ▼
Noise
 │
 ▼
Wave
 │
 ▼
Color
```

Conceitualmente:

```glsl
vec2 warpedUV = uv;

warpedUV +=
    noise(uv * 1.7 + time * 0.05) * 0.12;
```

O domínio espacial é deformado antes de gerar a onda.

O resultado parece menos uma textura repetida e mais um campo físico/procedural.

---

# 9. Espuma costeira

A espuma não deve ser uma linha contínua ao redor do continente.

Evitar:

```text
████████████████████████
████████████████████████
████████████████████████
```

Preferir uma faixa irregular que nasce e desaparece.

A espuma deve depender de:

```text
distância da costa
+
noise
+
ondas
+
tempo
```

Conceitualmente:

```glsl
float coastBand =
    1.0 - smoothstep(
        0.0,
        foamWidth,
        distanceToCoast
    );

float foamNoise =
    fbm(
        warpedPosition * foamScale +
        time * foamSpeed
    );

float foam =
    coastBand *
    smoothstep(
        foamThreshold,
        1.0,
        foamNoise
    );
```

Visualmente:

```text
TERRA
████
  ██
    █
      ░
        ░
           ÁGUA
```

A espuma deve possuir variação espacial e temporal.

---

# 10. Oceano profundo

No oceano profundo, a escala dos movimentos deve aumentar.

A diferença conceitual é:

```text
MAR RASO
frequência alta
amplitude pequena
muitos detalhes

OCEANO PROFUNDO
frequência baixa
amplitude maior
fluxos de grande escala
```

Uma onda profunda pode ser representada por:

```glsl
float deepWave =
    sin(
        dot(position, direction1) *
        largeScale +
        time * slowSpeed
    );
```

E complementada por outra direção:

```glsl
float deepWave2 =
    sin(
        dot(position, direction2) *
        largeScale2 +
        time * slowerSpeed
    );
```

A soma de ondas de grande escala cria o chamado **swell** visual.

---

# 11. Correntes e Flow Field

Para evitar que todas as ondas simplesmente caminhem na mesma direção:

```text
→ → → → → → →
```

deve existir um **campo de fluxo**.

Exemplo conceitual:

```text
        ↗
    → → → ↗
  → → → → →
 → → → ↘
   ↘ ↘ ↘
```

Um campo simples pode ser criado proceduralmente:

```glsl
vec2 flow = vec2(
    sin(position.y * 0.4),
    cos(position.x * 0.3)
);
```

E utilizado para modificar o domínio:

```glsl
uv += flow * time * FLOW_SPEED;
```

Uma implementação mais sofisticada pode utilizar:

```glsl
uv += flowField(position) * time;
```

Isso cria a sensação de massa líquida se deslocando.

---

# 12. Variação de cor

A água não deve utilizar uma única cor.

Evitar:

```text
#006080
```

como cor uniforme do oceano.

A proposta é criar uma variação gradual:

```text
                 COSTA
                   │
                   ▼

            areia / espuma
                   ↓
             azul turquesa
                   ↓
               azul médio
                   ↓
             azul profundo
                   ↓
          azul muito profundo
```

A transição pode ser realizada com:

```glsl
color = mix(
    shallowColor,
    deepColor,
    depthFactor
);
```

Onde:

```glsl
depthFactor =
    smoothstep(
        SHALLOW_DISTANCE,
        DEEP_DISTANCE,
        distanceToCoast
    );
```

Para evitar uma aparência excessivamente matemática, acrescentar uma pequena variação procedural:

```glsl
depthFactor +=
    lowFrequencyNoise(position) * 0.12;
```

Isso permite criar regiões mais claras e escuras sem produzir faixas rígidas.

---

# 13. Depth Field

Uma melhoria importante é utilizar um **Depth Field** independente da simples distância da costa.

Por exemplo:

```text
depthMap.png

████████████████████
████████████████████
███░░░░░░░░░░░░░░░██
██░░░░░░░░░░░░░░░░██
█░░░░░░░░░░░░░░░░░░█
```

Conceito:

```text
preto  → costa / água rasa
cinza  → profundidade intermediária
branco → oceano profundo
```

Isso oferece controle artístico superior.

Também permite representar uma profundidade estilizada que não depende exclusivamente da distância da costa.

---

# 14. Anti-aliasing da costa

Para evitar bordas perceptíveis, não depender apenas de `smoothstep`.

A GPU disponibiliza derivadas de fragmento que podem ser utilizadas para adaptar a suavização à resolução.

Funções importantes:

```glsl
fwidth()
dFdx()
dFdy()
```

Exemplo conceitual:

```glsl
float edge = fwidth(distanceToCoast);

float coast =
    smoothstep(
        -edge,
        edge,
        distanceToCoast
    );
```

Isso ajuda a reduzir:

- serrilhado;
- bordas duras;
- transições pixeladas;
- artefatos em zooms diferentes.

---

# 15. Não utilizar partículas para representar o oceano

Para esse caso, evitar uma solução baseada em:

```text
ParticleSystem
      │
      └── milhares de ondas
```

Partículas são excelentes para:

- chuva;
- neve;
- poeira;
- folhas;
- espuma pontual.

Mas o oceano cartográfico deve ser principalmente **procedural**.

O shader permite que a água seja:

- contínua;
- barata;
- escalável;
- livre de repetição evidente;
- independente de sprites individuais.

---

# 16. Shader final — arquitetura lógica

O fragment shader pode ser entendido como:

```text
                FRAGMENT SHADER
                       │
              ┌────────┴─────────┐
              │                  │
          Coast SDF          Depth Field
              │                  │
              └────────┬─────────┘
                       │
                  Domain Warp
                       │
          ┌────────────┴────────────┐
          │                         │
     Shallow Waves             Deep Waves
          │                         │
          └────────────┬────────────┘
                       │
                   Flow Field
                       │
                       ▼
                 Color Mixing
                       │
                       ▼
                 Foam / Glints
                       │
                       ▼
                  Final Color
```

---

# 17. Arquitetura recomendada para React/Vite

Stack base:

```text
React
Vite
TypeScript
Three.js
GLSL
```

Opcionalmente:

```text
@react-three/fiber
```

Caso seja desejável integrar a cena WebGL diretamente à árvore React.

Porém, se o objetivo for controle absoluto do shader, não há necessidade de transformar tudo em React Three Fiber.

Uma arquitetura direta com Three.js também é adequada:

```text
React
 └── OceanRenderer
       └── THREE.WebGLRenderer
             └── ShaderMaterial
                   ├── vertex.glsl
                   └── fragment.glsl
```

---

# 18. Estrutura de arquivos sugerida

```text
src/
│
├── components/
│   └── map/
│       ├── MapView.tsx
│       ├── OceanLayer.tsx
│       ├── MapLabels.tsx
│       └── MapMarkers.tsx
│
├── rendering/
│   └── ocean/
│       ├── OceanRenderer.ts
│       ├── OceanMaterial.ts
│       ├── OceanUniforms.ts
│       │
│       ├── shaders/
│       │   ├── ocean.vert.glsl
│       │   ├── ocean.frag.glsl
│       │   ├── noise.glsl
│       │   ├── fbm.glsl
│       │   ├── waves.glsl
│       │   ├── foam.glsl
│       │   ├── flow.glsl
│       │   └── color.glsl
│       │
│       └── masks/
│           ├── coastline.png
│           └── depth.png
│
└── assets/
    └── map/
```

A recomendação é separar os GLSL por responsabilidade.

Evitar um único `ocean.frag.glsl` gigantesco com toda a lógica.

---

# 19. Configuração do shader

Os parâmetros do oceano devem ser configuráveis.

Uma interface TypeScript possível:

```ts
interface OceanShaderConfig {
    shallowColor: Color;
    deepColor: Color;

    waveSpeed: number;
    waveScale: number;
    waveStrength: number;

    swellSpeed: number;
    swellScale: number;
    swellStrength: number;

    foamWidth: number;
    foamStrength: number;

    turbulence: number;
    depthVariation: number;

    flowSpeed: number;
}
```

A configuração alimenta os uniforms:

```text
OceanShaderConfig
       │
       ▼
    Uniforms
       │
       ▼
      GLSL
       │
       ▼
 WebGL rendering
```

Isso também abre espaço para um editor visual.

---

# 20. Editor visual futuro

Os parâmetros poderiam ser expostos em uma interface de desenvolvimento:

```text
VELOCIDADE ........ ●──────

ONDULAÇÃO .......... ───●──

TURBULÊNCIA ........ ──●───

ESPUMA ............. ●─────

PROFUNDIDADE ....... ────●─

VARIAÇÃO ........... ──●───
```

Isso permitiria ajustar o oceano sem alterar diretamente os shaders.

Para uma aplicação cartográfica estilizada, essa abordagem é especialmente útil porque a intenção é **controle artístico**, e não precisão física.

---

# 21. Fonte da máscara — recomendação importante

Se o projeto já possui os polígonos dos estados em SVG/GeoJSON, não utilizar uma imagem estática da costa como única fonte da máscara.

Preferir:

```text
GeoJSON / SVG
       │
       ▼
   geometria
       │
       ├── mapa
       │
       └── coastline mask
                    │
                    ▼
               Ocean Shader
```

Vantagens:

- mantém a costa alinhada;
- funciona melhor com zoom;
- permite alterar escala;
- permite alterar projeção;
- evita desalinhamento entre mapa e oceano;
- reduz o risco de uma borda visual artificial.

Um deslocamento de poucos pixels na costa pode ser especialmente perceptível quando o oceano está animado.

---

# 22. Fluxo completo recomendado

```text
                         GEOJSON / SVG
                               │
                ┌──────────────┴──────────────┐
                │                             │
             MAPA                         COSTA
                │                             │
                │                             ▼
                │                         Coast SDF
                │                             │
                │                         Depth Field
                │                             │
                │                             ▼
                │                        Ocean Shader
                │                             │
                │                 ┌───────────┴───────────┐
                │                 │                       │
                │            MAR RASO                MAR PROFUNDO
                │                 │                       │
                │            Foam + Waves           Swell + Flow
                │                 │                       │
                │                 └───────────┬───────────┘
                │                             │
                │                        Color Mixing
                │                             │
                └─────────────────────┬───────┘
                                      │
                                      ▼
                                  COMPOSIÇÃO
                                      │
                                      ▼
                                MAPA FINAL
```

---

# 23. Parâmetros visuais sugeridos

Como ponto de partida:

```text
┌────────────────────────┬─────────────────────┐
│ Parâmetro              │ Intenção            │
├────────────────────────┼─────────────────────┤
│ Wave Scale             │ pequena escala      │
│ Wave Speed             │ lenta/moderada      │
│ Wave Strength          │ baixa               │
│ Swell Scale            │ grande              │
│ Swell Speed            │ lenta               │
│ Swell Strength         │ moderada            │
│ Foam Width             │ estreita            │
│ Foam Strength          │ baixa/moderada      │
│ Turbulence             │ baixa/moderada      │
│ Depth Variation        │ baixa               │
│ Flow Speed             │ muito baixa         │
└────────────────────────┴─────────────────────┘
```

A prioridade deve ser **movimento sutil**.

O oceano não deve roubar atenção do mapa.

---

# 24. Princípios visuais

## 24.1 Continuidade

Nenhuma onda deve possuir:

```text
início ───────── fim
```

Ela deve fazer parte de um campo procedural contínuo.

---

## 24.2 Hierarquia de escala

Utilizar simultaneamente:

```text
alta frequência
    ↓
pequenas ondas

média frequência
    ↓
marolas / turbulência

baixa frequência
    ↓
grandes fluxos / swell
```

---

## 24.3 Profundidade

A cor deve comunicar profundidade sem precisar de uma borda:

```text
costa → raso → médio → profundo
```

---

## 24.4 Movimento

Evitar uma única direção uniforme.

Utilizar:

```text
Noise
+
Flow Field
+
ondas em múltiplas direções
```

---

## 24.5 Sutileza

A animação deve funcionar como pano de fundo.

O usuário deve perceber o movimento principalmente quando observa por alguns segundos.

---

# 25. O que deve ser evitado

```text
❌ Textura pequena repetida
❌ Linhas de espuma contínuas
❌ Ondas com bordas retangulares
❌ Partículas para representar toda a superfície
❌ Uma única frequência de noise
❌ Uma única direção de movimento
❌ Cor uniforme no oceano
❌ Corte abrupto entre raso e profundo
❌ Máscara desalinhada com a costa
❌ Física de oceano real para uma aplicação cartográfica
```

---

# 26. Refatoração conceitual do sistema atual

### Antes

```text
MAPA
 ↓
OCEANO AZUL
 ↓
ONDA A
 ↓
ONDA B
 ↓
MAROLA
```

### Depois

```text
MAPA
 │
 ├── continente
 │
 └── máscara oceânica
          │
          ▼
      OCEAN SHADER
          │
          ├── Coast SDF
          │
          ├── Depth Field
          │
          ├── Flow Field
          │
          ├── Deep Swell
          │
          ├── Surface Waves
          │
          ├── Coastal Turbulence
          │
          ├── Foam
          │
          └── Color Gradient
                   │
                   ▼
              COMPOSIÇÃO
```

Essa mudança é mais importante do que simplesmente "melhorar as ondas".

Ela muda o oceano de uma coleção de efeitos para um **sistema visual procedural coerente**.

---

# 27. Stack final recomendada

```text
React
Vite
TypeScript
        │
        ├── SVG / GeoJSON
        │      → mapa
        │
        ├── Three.js
        │      → WebGL
        │
        └── GLSL
               ├── FBM Noise
               ├── Domain Warping
               ├── Flow Field
               ├── SDF Coast
               ├── Depth Gradient
               ├── Wave Function
               └── Foam
```

Não é necessário implementar física real.

A solução ideal é uma **simulação visual procedural**.

---

# 28. Resultado visual esperado

O resultado deve combinar:

```text
                         OCEANO

             ~      ≋         ~
        ≋          ~~~~~            ≋

    ~~~~~~~~~~~~~~~~░░░░░░░░░░~~~~~~~~~~
                     ↑
               transição contínua

               ░░░░░░░░
             ░░░░░░░░░░░
           ░░░░░░░░░░░░░
          ███████████████
          █     BRASIL    █
          █               █
          █               █
```

As "ondas" representadas acima são apenas uma metáfora visual.

No shader real, elas não existirão como objetos ou faixas isoladas. Serão resultado de:

```text
SDF
 +
Noise
 +
FBM
 +
Domain Warping
 +
Flow
 +
Depth
 +
Time
```

O objetivo final é eliminar a percepção de pixels, tiles ou limites artificiais.

---

# 29. Conclusão

A principal recomendação é não tentar corrigir o Anexo 1 adicionando mais ondas.

O problema é estrutural.

A solução deve transformar o oceano em uma **superfície procedural contínua**, composta por diferentes escalas de movimento e condicionada pela geografia.

A arquitetura recomendada é:

```text
MAPA
  ↓
COSTA / SDF
  ↓
DEPTH FIELD
  ↓
DOMAIN WARP
  ↓
┌───────────────────────┐
│                       │
│  MAR RASO             │
│  • ondas pequenas     │
│  • turbulência        │
│  • espuma             │
│                       │
├───────────────────────┤
│                       │
│  OCEANO PROFUNDO      │
│  • swell              │
│  • flow field         │
│  • grandes variações  │
│                       │
└───────────────────────┘
  ↓
COLOR MIXING
  ↓
FOAM / GLINTS
  ↓
WEBGL
  ↓
MAPA FINAL
```

O ponto central é:

> **Não desenhar ondas. Gerar um campo de água do qual as ondas emergem.**

Essa abordagem é a que melhor atende ao requisito de eliminar bordas perceptíveis, manter o minimalismo cartográfico e, ao mesmo tempo, aproximar o comportamento visual do Anexo 2.

---

## Próximo passo técnico recomendado

A primeira implementação deve ser um **Ocean Shader V1**, contendo somente:

```text
1. Coast SDF
2. Shallow/Deep Color Gradient
3. FBM Noise
4. Domain Warping
5. Deep Swell
6. Coastal Waves
7. Flow Field
8. Foam costeira
9. fwidth() para suavização
10. uniforms configuráveis
```

Depois disso, o refinamento deve ser visual, ajustando escala, velocidade, amplitude, profundidade e espuma até que o oceano deixe de parecer uma camada sobre o mapa e passe a parecer parte dele.
