# Ficha Técnica da Aplicação (Data Sheet)
**BR Quest — Plataforma Gamificada de Inteligência Geográfica, Biodiversidade e Cartografia 3D**  
*Versão:* 1.4.0 (Edição Pós-Guerra / Atlas Interativo) | *Data de Revisão:* Setembro de 2026  
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
│  OceanShaderCanvas (Batimetria & Swell) • ClimaticStreamEngine         │
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
  - *Atmosfera Rayleigh/Mie*: Dispersão de luz com efeito crepuscular azul cobalto (absorção de Chappuis na camada de ozônio).
  - *Terminador Dia/Noite*: Mistura contínua entre mapa de albedo diurno e luzes urbanas noturnas (NASA VIIRS).
  - *Oceano Cartográfico Procedural*: Swell bidirecional em alto-mar, Domain Warping duplo, cáusticas líquidas e atenuação costeira anti-aliased.

---

## 3. Microengines e Módulos Arquiteturais Internos

### 3.1. `CelestialSystem` (`src/lib/globeEngine/celestialSystem.ts`)
- **Astrometria Kepleriana**: Posicionamento tridimensional em tempo real ou simulado do Sol, da Lua e de planetas clássicos (Mercúrio, Vênus, Marte, Júpiter e Saturno com anéis).
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
