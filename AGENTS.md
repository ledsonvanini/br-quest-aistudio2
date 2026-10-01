# Diretrizes do Projeto & Regras Personalizadas (AGENTS.md)

## Regra Pétrea: Isolamento Hermético dos 7 Modos ("O Mapa é Um Só, as Lentes são Únicas")
O contorno geográfico das 27 UFs e a projeção D3 são a base compartilhada, mas **CADA MODO É UMA LENTE CIENTÍFICA/CULTURAL INDEPENDENTE E NÃO PODE VAZAR PARA OS OUTROS**:

1. **Território (Oridrografia & Biogeografia)**: 100% técnico, sóbrio e cartográfico. Foco em bacias da ANA, divisores orográficos e relevo. Proibido misturar avatares, fotos ou dados climáticos.
2. **Clima & Meteorologia**: Fenômenos atmosféricos dinâmicos (ECMWF, ZCAS, Alísios, frentes frias) e macroclima ENSO (El Niño / La Niña com base em NASA, NOAA, INMET e SIMEPAR). As texturas de temperatura, vento e pressão vivem exclusivamente nesta camada.
3. **Biodiversidade (GBIF/ICMBio)**: Dossel ecológico, flora nativa e fauna endêmica dos 6 biomas. Texturas e selos botânicos/zoológicos isolados.
4. **Geopolítica & Censo**: Demografia analítica do IBGE (Censo 2022), divisões regionais modernas (Macrorregiões e Geoeconômicas), densidade e indicadores humanos em cards de alto contraste.
5. **Musicalidades & Rádio**: Paisagem sonora, instrumentos típicos, frequências AM/FM históricas e partituras/hinos.
6. **Guardiões & Aventura (RPG)**: Gamificação narrativa, mitologia, folclore, quizzes e talentos pedagógicos.
7. **Globo 3D & Astrometria**: Astrofísica, iluminação solar kepleriana, ciclo dia/noite e rotas geodésicas.

> ⚠️ **LEI DE NÃO-INTERFERÊNCIA**: Quando você altera estilos, camadas, texturas, handlers de clique ou painéis de um modo, é **TERMINANTEMENTE PROIBIDO** alterar ou impactar visualmente/funcionalmente qualquer outro modo. Cada modo deve possuir seu próprio renderizador de camada e seu próprio styler de preenchimento (`modeLayerRenderers` isolados).

---

## Regra de Arquitetura dos Apps Laterais vs. Modo Aventura

### 1. Os 5 Modos com AppLateral Oficial (Clima, Biodiversidade, Geopolítica, Território, Musicalidades):
- **Posicionamento Obrigatório**: Doca lateral à **Esquerda** (`left-2 sm:left-[84px] lg:left-[88px]`), com altura vertical de `top-3 bottom-14`.
- **Dimensões Padronizadas**: Modo Compacto (`w-[500px]` a `w-[520px]`) e Modo Expandido 50% de tela (`w-[calc(50vw-48px)]`).
- **Deslocamento de Câmera**: Ao abrir, a câmera calcula offset positivo (`screenOffsetX > 0`), mantendo o mapa do Brasil e o estado focado perfeitamente visíveis nos 50% livres da direita.
- **Fechamento Atômico de Submenus**: Ao selecionar um estado (`selectedStateId !== null`), o sistema **DEVE** fechar automaticamente: submenus de território, flyouts do menu superior, gavetas de navegação e filtros flutuantes.

### 2. A Exceção Estrutural: `StateAdventureDialog` (Guardiões & Aventura):
- **Posicionamento à Direita**: É o **ÚNICO** diálogo que abre à **Direita** (`right-2 sm:right-4 top-16 sm:top-20`).
- **Justificativa de Produto**: O modo Guardiões não possui um AppLateral de tela cheia nem sobrepõe a leitura do mapa. Seu propósito é exibir a ficha do Guardião e a jornada de RPG mantendo a visão livre do território e da rota de expedição à esquerda. Não realiza split de 50% de tela.

---

## Regra da Engine de Texturas: Preenchimento $\leftrightarrow$ Shaders por Skills
As texturas cartográficas não são meros fundos cosméticos: são **Shaders e Padrões Vetoriais Processuais Integrados à Microengine de Renderização**, educando enquanto encantam:

1. **Skill Clima & ENSO (El Niño / La Niña)**:
   - Base científica estrita referenciada em **NASA Earth Science, NOAA Climate, INMET e SIMEPAR**.
   - Modelagem de anomalias: El Niño (aquecimento e seca no N/NE; precipitação intensa e bloqueio de frentes no S/SE); La Niña (inverso meteorológico).
   - Isolinhas térmicas dinâmicas, gradientes de temperatura contínuos e vetor de correntes marítimas e ventos.
2. **Skill Território & Hidrografia (ANA & Relevo)**:
   - Shading de relevo orográfico com hachuras e sombreamento de encostas (*hillshade*).
   - Vetores de fluxo e hierarquia de drenagem das 12 Bacias Hidrográficas da ANA.
3. **Skill Biodiversidade (Biomas & Fitofisionomia)**:
   - Texturas de dossel florestal denso (Amazônia/Mata Atlântica), estépica/espinhosa (Caatinga), savânica/retorcida (Cerrado), campos abertos (Pampa) e alagáveis (Pantanal).
4. **Skill Geopolítica (Censo IBGE & Divisões Modernas)**:
   - Micromalha densitária com pontilhado de alta precisão proporcional à densidade habitacional ($\text{hab/km}^2$).
   - Suporte a recortes modernos: Macrorregiões oficiais do IBGE e Complexos Geoeconômicos (Amazônia, Nordeste, Centro-Sul de Pedro Pinchas Geiger).
5. **Skill Musicalidades (Acústica & Rádio)**:
   - Padrão de ranhuras físicas de vinil e anéis de ondas de rádio concêntricas irradiando das matrizes culturais.
6. **Skill Globo 3D & Astrometria**:
   - Shaders WebGL2 de iluminação kepleriana, scattering atmosférico Rayleigh/Mie e ciclo solar em tempo real.

---

## Regra de Economia Rigorosa de Requisições de APIs
1. **Cache em Camadas Obrigatório**: Toda requisição para fontes externas (Open-Meteo, ECMWF, INMET, IBGE, GBIF) deve passar pelo cache L1 (memória) e L2 (`sessionStorage` com TTL de 15 a 60 minutos).
2. **Zero Requisições Redundantes**: Deduplicação ativa via promises em voo (`inFlight`) e proibição de chamadas repetidas ao alternar de abas.
3. **Fallback Resiliente Local**: Na ausência de conexão ou estouro de cota, a aplicação deve usar imediatamente os dados climáticos e biogeográficos locais de alta fidelidade sem emitir erros na interface.

---

## Regra Pré-Flight: Limite Estrito de 250 a 270 Linhas por Arquivo
1. **Bloqueio de Entrada**: Antes de editar qualquer arquivo, avalie seu tamanho. Se o arquivo já tiver mais de 250 linhas, ou se a sua modificação fizer ele ultrapassar 270 linhas, **É TERMINANTEMENTE PROIBIDO EXPANDI-LO DIRETAMENTE**.
2. **Extração Obrigatória**: A nova funcionalidade DEVE ser extraída em um subcomponente autônomo em pasta dedicada, em um Custom Hook (`use...`) ou em um Service utilitário, importando apenas o componente desacoplado.
3. **Composição Limpa**: Componentes principais de tela atuam apenas como compositores de orquestração de subcomponentes de $\le 200$ linhas.

---

## Design System Cartográfico & Anti-Slop (Legibilidade e Texturas)
1. **Tipografia e Escala de Leitura**:
   - **Tamanho Mínimo**: Nenhum texto informativo ou técnico pode ter menos de `13px` (`text-[13px]`). Texto corrido e dados principais devem ter `15px` a `16px`. Proibido `text-[10px]` ou `text-xs` apagado.
   - **Contraste WCAG AA**: Texto sempre em branco puro (`#F8FAFC`) ou ardósia clara (`#E2E8F0`) sobre superfícies escuras `#020617` ou `#0F172A`. Proibido cinza médio em fundo escuro.
2. **Cards Proporcionais 4x2 e 4x3**:
   - Balões e painéis informativos devem adotar proporções áureas amplas (largura $\ge 340\text{px}$), com padding generoso ($\ge 16\text{px}$), badges temáticas sólidas e dados escaneáveis em tópicos (máximo 2 a 3 linhas por sentença).
3. **Sombreamento e Profundidade Cartográfica**:
   - Banido `shadow-2xl` genérico. Use sombreamento nítido com bordas de precisão: `border border-slate-700/80` com `shadow-[0_8px_24px_rgba(0,0,0,0.55)]`.
4. **Texturas Educativas e Agradáveis**:
   - Elimine preenchimentos chapados monótonos. As texturas devem cumprir sua função pedagógica e estética integrada ao modo ativo.
5. **Nomenclatura Semântica Obrigatória ("classe-para-humanos")**:
   - Todos os containers, painéis, modais, botões e pins DEVEM conter classes CSS semânticas descritivas (ex: `container-mapa-clima`, `painel-fenomenos-4x2`, `pin-censo-ibge`, `btn-toggle-dial-radio`).

---

## Regra Arquitetural da Engine do Oceano: Shader Cartográfico Procedural Contínuo
1. **Camada Topo - Mapa do Brasil e América do Sul (Z >= 0)**:
   - Agrupa estados, relevo, fronteiras, cidades, nuvens, balões e HUD.
   - O shader do oceano possui canal alfa contínuo com anti-aliasing na terra (`oceanAlpha = 1.0 - smoothstep(0.0, 0.10, landMask)`), preservando a massa continental e as 27 UFs 100% nítidas sem interferência.
2. **Camada WebGL2 - Simulação Procedural de Água (`CoastalWavesCanvas` / `OceanShaderCanvas`)**:
   - **Campo Contínuo**: A água não é dividida em blocos isolados nem cortada com descontinuidades artificiais.
   - **Oceano Profundo Vivo (Alto-Mar)**: Swell de grande escala em direções cruzadas, Domain Warping de duas etapas, Flow Field de correntezas e Cáusticas Líquidas Fractais em todo o mar aberto.
   - **Mar Raso e Costa**: Transição batimétrica contínua e gradual (`deepAbyss` -> `midOcean` -> `shallowWater` -> `beachSand`).
   - **Zero Bounding Box no Zoom Out**: Nas margens extremas do canvas (2560x1440), atenuação suave (`edgeFeather`) funde o shader imperceptivelmente com o fundo infinito.
3. **Camada Base - Fundo Infinito (`ProceduralOceanCanvas`)**:
   - Dimensão de 14.000 x 10.000px com gradiente radial abissal e grão fino de papel neutro (`FINE_PAPER_NOISE_SVG`), garantindo cobertura total e suave em qualquer nível de zoom out.

---

## Regra de Definição Rigorosa de "Done" (DoD - Definition of Done)
Nenhuma tarefa ou modificação é considerada concluída ("Done") sem satisfazer cumulativamente o checklist de 5 portas:
1. **Porta 1 - Testes Automatizados 100% Verdes**: `npm test` (`vitest run`) deve rodar com todas as suítes e testes aprovados.
2. **Porta 2 - Tipagem e Lint Estritos com Zero Erros**: `npm run lint` (`tsc --noEmit`) deve passar limpo sem nenhum erro ou cast arbitrário `any`.
3. **Porta 3 - Validação de Não-Regressão**: Garantir que as funcionalidades pré-existentes não foram quebradas ou degradadas.
4. **Porta 4 - Não-Interferência Hermética dos 7 Modos**: Confirmar que estilos, handlers, shaders e estados de um modo não vazaram para nenhum outro modo.
5. **Porta 5 - Baixo Acoplamento e Alta Coesão**: Verificar se arquivos criados/editados respeitam a regra de $\le 270$ linhas e se dependências foram adequadamente desacopladas em subcomponentes ou hooks dedicados.

---

## Regra Anti-Hardcode & Limpeza de Legados
1. **Zero Hardcoded Improvisado**: É terminantemente proibido inserir dados fictícios, constantes soltas no meio de componentes ou estruturas inventadas. Todos os dados devem emanar dos catálogos estruturados (`/src/data/`) ou dos serviços de API oficiais.
2. **Zero Nomenclaturas e Imports Legados**: Todo componente e arquivo deve refletir sua real função na arquitetura atual (ex: `SidebarGlobalNavMenu` em vez do legado `TopGlobalNavMenu`). Ao renomear, todas as referências no código devem ser atualizadas imediatamente.
3. **Zero Lógica Redundante**: Se uma função ou cálculo já existe em um utilitário ou serviço (ex: `centralizarZoomMapa`, `calculateResponsiveDefaultZoom`, `formatBrasiliaTimeDynamic`), é obrigatório reutilizá-la em vez de reimplementar lógica similar.

---

## Regra de Governança de Fontes de Dados e APIs (Vigência Temporal)
1. **Consolidação de Provedores**: Não utilizar múltiplas APIs externas para o mesmo propósito. Priorizar batching centralizado (ex: Open-Meteo consultando os 27 estados em 1 requisição única em vez de 27 requisições individuais).
2. **Atualização e Vigência Científica**:
   - **IBGE**: Trabalhar com a base do Censo Demográfico 2022 integrada às Projeções Oficiais e Estimativas Populacionais vigentes (2024/2025 - Portaria IBGE nº 1.041).
   - **Clima**: Padrão ECMWF / NOAA via Open-Meteo v1 com cache local de 15 minutos e fallback local calibrado em caso de offline.
   - **Biodiversidade**: Catálogo local de alta fidelidade como fonte primária; GBIF / Wikipedia consultados exclusivamente via lazy-loading sob demanda com cache de 24h a 14 dias.

---

## Catálogo de "Classes CSS para Humanos" (Referência Rápida)
Todo elemento essencial deve conter uma classe semântica humanamente legível para inspeção e testes:
- **Containers Globais**: `container-app-brquest`, `container-canva-mapa-br`, `container-globo-3d`, `container-dock-direita`
- **Sidebar & Menus**: `sidebar-global-container`, `menu-lateral-modos`, `btn-toggle-modo-clima`, `btn-toggle-modo-biomas`, `btn-toggle-modo-geopolitica`, `btn-toggle-modo-territorio`, `btn-toggle-modo-musica`, `btn-toggle-modo-aventura`, `btn-toggle-modo-globo`
- **Apps Laterais**: `painel-dialog-clima`, `painel-dialog-biodiversidade`, `painel-dialog-geopolitica`, `painel-app-lateral-estado`, `painel-applateral-musical`, `painel-applateral-aventura`
- **Ferramentas & HUD**: `toolbar-ferramentas-territoriais-geopolitica`, `painel-gizmo-compass-hud`, `painel-observatorio-clima`, `painel-telemetria-estacao`
- **SVG & Canvas**: `poligono-estado-interativo`, `understroke-contraste`, `textura-shader-procedural`, `hit-target-estado-expandido`, `beacon-circulo-pulso`



