# Diretrizes do Projeto & Regras Personalizadas (AGENTS.md)

## Regra: Prática "classe-para-humanos" (Nomes Semânticos para Elementos)
Todos os elementos relevantes da interface — como containers principais, componentes, menus, painéis, modais, toolbars, cabeçalhos, barras laterais e seções interativas — **DEVEM** incluir classes CSS semânticas descritivas e legíveis por humanos (que não afetam o visual nem entram em conflito com o Tailwind, servindo como âncoras identificadoras para o usuário e o desenvolvedor).

### Convenções de Nomenclatura:
- **Containers e Telas**: `container-app-principal`, `container-mapa-br`, `container-canva-mapa-br`, `container-palco-globo-3d`, `container-carrossel-estados`
- **Painéis e Toolbars**: `painel-toolbar-relevo`, `painel-hud-controles`, `painel-legenda-coropletica`, `painel-guardiao-detalhes`
- **Menus e Navegação**: `menu-superior-status`, `menu-filtro-biomas`, `menu-seletor-estilos`
- **Modais e Diálogos**: `modal-quiz-guardiao`, `modal-arvore-habilidades`, `modal-configuracoes`
- **Botões e Ações Principais**: `btn-acao-viajar-estado`, `btn-zoom-in`, `btn-zoom-out`, `btn-toggle-globo-3d`, `btn-fechar-painel`
- **Cartões e Itens**: `card-guardiao-estado`, `card-insignia-conquista`, `pin-brasao-estado`

Essas classes facilitam a identificação rápida e a comunicação direta de elementos durante o desenvolvimento.

## Regra Arquitetural da Engine do Oceano: Shader Cartográfico Procedural Contínuo
A engine do oceano segue a especificação técnica cartográfica procedural:

1. **Camada Topo - Mapa do Brasil e América do Sul (Z >= 0)**:
   - Agrupa estados, relevo, fronteiras, cidades, nuvens, balões e HUD.
   - O shader do oceano possui canal alfa contínuo com anti-aliasing na terra (`oceanAlpha = 1.0 - smoothstep(0.0, 0.10, landMask)`), preservando a massa continental e as 27 UFs 100% nítidas sem interferência.

2. **Camada WebGL2 - Simulação Procedural de Água (`CoastalWavesCanvas` / `OceanShaderCanvas`)**:
   - **Campo Contínuo**: A água não é dividida em blocos isolados nem cortada com descontinuidades artificiais.
   - **Oceano Profundo Vivo (Alto-Mar)**: Swell de grande escala em direções cruzadas, Domain Warping de duas etapas, Flow Field de correntezas e Cáusticas Líquidas Fractais em todo o mar aberto.
   - **Mar Raso e Costa**: Transição batimétrica contínua e gradual (`deepAbyss` -> `midOcean` -> `shallowWater` -> `beachSand`). A profundidade é modulada com ruído orgânico (FBM), eliminando anéis circulares ao redor de ilhas ou da costa.
   - **Espuma e Marolas Orgânicas**: Espuma viva que nasce de ruído + tempo + costa, e marolas que viajam e se dissolvem de forma natural.
   - **Zero Bounding Box no Zoom Out**: Nas margens extremas do canvas (2560x1440), atenuação suave (`edgeFeather`) funde o shader imperceptivelmente com o fundo infinito.

3. **Camada Base - Fundo Infinito (`ProceduralOceanCanvas`)**:
   - Dimensão de 14.000 x 10.000px com gradiente radial abissal e grão fino de papel neutro (`FINE_PAPER_NOISE_SVG`), garantindo cobertura total e suave em qualquer nível de zoom out.

## Regra Arquitetural: Precisão Cartográfica Orgânica e Isolamento do Módulo Território
1. **Contornos Orgânicos Precisos**:
   - Bacias Hidrográficas (ANA) e Biomas (IBGE) devem ser traçados com caminhos orgânicos contínuos fiéis aos divisores orográficos de água e às fronteiras reais do Brasil, banindo formas geométricas arbitrárias (como elipses ou bolhas sintéticas).
2. **Diagramação e Balões de Dados**:
   - Balões e selos de dados devem possuir dimensões amplas (>= 340px largura), tipografia legível, padding generoso e hierarquia clara para evitar quebra, corte ou sobreposição de textos.
3. **Estados Muted Elegantes**:
   - Estados não selecionados recebem atenuação cartográfica em ardósia/índigo suave (`#0e1726`, opacidade 0.80, bordas `#223249`), preservando as divisas e a geografia sem pintar o mapa com preto sólido.
4. **Isolamento Estrito de Módulos**:
   - O módulo de Território é 100% técnico e cartográfico. Fotos, avatares, standees e textos do módulo dos Guardiões são terminantemente proibidos na visualização de Território.


