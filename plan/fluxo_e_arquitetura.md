# Fluxo do Usuário e Arquitetura do Sistema
**BR Quest — O Super App da Geografia Viva, Clima e Identidade Nacional**  
*Documento Arquitetural:* `/plan/fluxo_e_arquitetura.md` | *Versão Oficial:* 2.0.0 (Setembro de 2026)

---

## 1. Visão Geral da Arquitetura do Sistema

O **BR Quest** opera como um **Super App de Geografia, Astrometria e RPG Cultural**, estruturado em uma arquitetura desacoplada e reativa. O sistema combina renderização vetorial bidimensional (D3.js), computação gráfica tridimensional esférica (Three.js / React Three Fiber), shaders procedurais em WebGL2 para superfícies líquidas e um backend seguro de Inteligência Artificial para os Guardiões.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                        ARQUITETURA EM CAMADAS (BR QUEST)                  │
├───────────────────────────────────────────────────────────────────────────┤
│ 1. CAMADA DE APRESENTAÇÃO & HUD (React 18 + Tailwind + Motion)           │
│    - Menus, Docks, Cards, Carrossel de Estados, Popovers e Modais         │
│    - Diretriz Obrigatória: Prática "classe-para-humanos" em todos os nós  │
├───────────────────────────────────────────────────────────────────────────┤
│ 2. CAMADA DE ENGENHARIA GRÁFICA & SHADERS (WebGL2 / Three.js / D3)       │
│    - Globo 3D Esférico Orbital (Terra, Atmosfera, Nuvens, Sol e Lua)      │
│    - Shader Oceânico Procedural Contínuo (Domain Warping + Cáusticas)     │
│    - Projeção Vetorial Cartográfica D3 (Modo 2D Plano e 2.5D Isométrico)  │
├───────────────────────────────────────────────────────────────────────────┤
│ 3. CAMADA DE MICROENGINES DE DOMÍNIO (Engenharia Pura / TypeScript)      │
│    - CelestialSystem (Mecânica Celeste Kepleriana e Ciclo Solar 24h)      │
│    - GeodesicEngine (Cálculo de Arcos Ortodrômicos e Rotas Capitais)      │
│    - CosmicLaserEngine (Vetores Fotônicos e Cálculo de Tempo-Luz)         │
│    - AudioEngine (Síntese Sonora Web Audio API e Micro-SFX)               │
├───────────────────────────────────────────────────────────────────────────┤
│ 4. CAMADA DE INTELIGÊNCIA ARTIFICIAL SERVER-SIDE (Gemini API)            │
│    - Endpoint `/api/guardian-chat` via `@google/genai`                    │
│    - Personas Regionais dos 27 Guardiões + Método Socrático de Tutoria    │
├───────────────────────────────────────────────────────────────────────────┤
│ 5. CAMADA DE SERVIÇOS & APIS EXTERNAS (Cache L1 / L2 / L3)               │
│    - Open-Meteo (Clima ao vivo), IBGE (Malhas/Censo), GBIF (Biodiversidade)│
│    - Texturas NASA Blue Marble, ESA e Black Marble Night Lights          │
├───────────────────────────────────────────────────────────────────────────┤
│ 6. CAMADA DE IDENTIDADE & NUVEM (Firebase Auth + Cloud Firestore)        │
│    - Login Google/Apple/E-mail, Sincronização de Progresso, Inventário/XP │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Jornada e Fluxo Completo do Usuário (User Journey Flow)

A navegação foi projetada em torno do conceito **"Cavalo de Troia da Curiosidade"**, onde a utilidade do clima e a surpresa das dicas diárias transformam a exploração em aprendizado orgânico contínuo:

```
                  ┌─────────────────────────────────────┐
                  │ 1. PONTO DE ENTRADA DO USUÁRIO     │
                  │    - Clima / Temperatura da Capital │
                  │    - Relógio Solar Brasília (UTC-3) │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │ 2. DROPS DIÁRIOS ("VOCÊ SABIA?")    │
                  │    - 5 Curiosidades Geográficas     │
                  │    - Gatilho: [Ver no Globo 3D]     │
                  └──────────────────┬──────────────────┘
                                     │
        ┌────────────────────────────┴────────────────────────────┐
        ▼                                                         ▼
┌───────────────────────────────┐         ┌───────────────────────────────┐
│ 3A. NAVEGAÇÃO NO GLOBO 3D     │         │ 3B. EXPLORAÇÃO DO ESTADO      │
│ - Giro orbital e zoom livre   │         │ - Malha D3 (2D ou Isométrica) │
│ - Solstícios e Equinócios     │         │ - Biomas, Relevo e Bacias     │
│ - Rotas Geodésicas e Feixes   │         │ - Censo IBGE e Curiosidades   │
└───────────────┬───────────────┘         └───────────────┬───────────────┘
                │                                         │
                └────────────────────┬────────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │ 4. ENCONTRO COM O GUARDIÃO REGIONAL │
                  │    - Heráldica, Brasão e Hino       │
                  │    - Chat com IA: Dúvidas e Lendas  │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │ 5. QUEST / DESAFIO DO CONHECIMENTO  │
                  │    - O usuário já sabe a resposta   │
                  │      porque acabou de ver no mapa!  │
                  │    - Feedback pedagógico socrático  │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │ 6. RECOMPENSA E PROGRESSÃO RPG      │
                  │    - Ganho de XP e Insígnias        │
                  │    - Relíquias no Inventário        │
                  │    - Desbloqueio na Árvore Habilid. │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │ 7. RETENÇÃO E CONVERSÃO FREEMIUM    │
                  │    - Salvar conquistas na nuvem     │
                  │    - Desbloquear Modo Pro / 27 UFs  │
                  └─────────────────────────────────────┘
```

---

## 3. Matriz de Estados e Ciclo de Vida dos Modos

Conforme estabelecido nas regras de governança (`MODES_ARCHITECTURE_AND_CODE_GUIDELINES.md`), cada modo possui isolamento completo de renderização:

| Modo Principal | Tecnologia Gráfica | Foco de Domínio | Elementos Chave |
| :--- | :--- | :--- | :--- |
| **`clima`** | Canvas 2D + D3 | Meteorologia ao vivo | Rios voadores, frentes frias, ZCAS, jatos |
| **`biodiversidade`** | SVG D3 + Canvas | Ecologia e conservação | Biomas, espécimes ameaçadas, flora e fauna |
| **`geopolitica`** | Malha D3 Vetorial | Censo e demografia | Índices IBGE, densidade populacional, PIB |
| **`musicalidades`** | AudioEngine + SVG | Patrimônio imaterial | Hinos oficiais orquestrados, ritmos regionais |
| **`globo3d`** | Three.js / R3F | Astronomia e Terra | Esfera planetária, Sol, Lua, arcos geodésicos |
| **`aventura`** | React + Canvas | Narrativa e RPG | 27 Guardiões, brasões vetorizados, inventário |
| **`brquest`** | React + Shaders | Avaliação gamificada | Desafios interdisciplinares e ranking |

---

## 4. Governança de Layout, Câmera e Prevenção de Sobreposição

Para garantir uma interface de nível profissional (*anti-slop* e sem colisão de janelas):

1. **Regra da Exclusividade Mútua de Painéis:**
   - Apenas um painel flutuante de grande porte (Simulador Solar, Telemetria Cósmica, Trajetória Interplanetária ou Mosaicos da NASA) pode permanecer aberto por vez.
   - A abertura de qualquer menu aciona automaticamente o callback `closeAllPanelsExcept()`.
2. **Desobstrução do Dock Superior e Rodapé:**
   - Todos os painéis flutuantes respeitam `top-14` (56px do topo), garantindo que os botões de controle de zoom (`+`, `-`, `⌖`) permaneçam 100% visíveis e clicáveis.
   - O rodapé (`GlobeControlsHUD`) mantém botões com dimensões fixas uniformes e ícones sem texto solto, impedindo quebras de linha em telas mobile.
3. **Câmera com `setViewOffset`:**
   - Quando um painel lateral é aberto, a câmera 3D desloca dinamicamente seu centro de projeção (`camera.setViewOffset`), assegurando que o território brasileiro ou o astro celeste selecionado continue enquadrado na área útil visível.

---

## 5. Estratégia de Dados e Cache em 3 Níveis

Para manter a aplicação ultraleve e reduzir a zero o custo de requisições redundantes:

- **Cache L1 (Memória Heap):** Estados reativos em hooks React (`useMemo`, `useCallback`, `useRef`), garantindo 60 FPS contínuos no loop de renderização.
- **Cache L2 (SessionStorage):** Respostas de telemetria climática das capitais com TTL (Time-To-Live) de 15 minutos, evitando re-fetch em trocas de modo.
- **Cache L3 (IndexedDB / Cache API):** Armazenamento local das malhas TopoJSON do IBGE e texturas raster da Terra, viabilizando carregamento instantâneo no PWA.

---

*Documento revisado e homologado para a evolução contínua da arquitetura do BR Quest.*
