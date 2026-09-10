# Especificação de Requisitos Funcionais e Não-Funcionais
**BR Quest — Plataforma Gamificada de Inteligência Geográfica, Biodiversidade e Globo 3D**  
*Documento de Engenharia:* `/plan/requisitos_funcionais_e_nao_funcionais.md`  
*Versão do Sistema:* 1.4.0 | *Data de Revisão:* Setembro de 2026

---

## 1. Requisitos Funcionais (RF)

### 1.1. Cartografia Multidimensional e Modos de Exibição
- **[RF01] Alternância de Modos Cartográficos**: O sistema deve permitir alternar instantaneamente e sem recarregar a página entre os modos:
  1. *2D Flat*: Projeção cartográfica plana de alta precisão via D3.js.
  2. *2.5D Isométrico*: Mapa em projeção isométrica com relevo escalonado e estética tática.
  3. *Globo 3D*: Renderização esférica completa com shaders atmosféricos, relevo e espaço cósmico.
- **[RF02] Seleção e Detalhamento Territorial**: Ao selecionar qualquer uma das 27 Unidades Federativas (26 estados + DF):
  - Exibir brasão oficial em vetor, bandeira com proporções legais, capital e dados demográficos do IBGE.
  - Disponibilizar áudio do hino histórico oficial com controle de reprodução/pausa.
  - Carregar espécies nativas e ameaçadas do bioma correspondente (catálogo GBIF/ICMBio).

### 1.2. Astrometria 3D, Sistema Solar e Espaço Cósmico
- **[RF03] Sistema Solar Kepleriano Tridimensional**:
  - Renderizar o Sol em posição heliocêntrica com shader de corona e turbulência cromosférica procedural.
  - Renderizar a Lua com textura albedo da NASA e fases físicas derivadas do vetor de iluminação solar.
  - Renderizar os planetas clássicos (Mercúrio, Vênus, Marte, Júpiter e Saturno com anéis) em órbitas eclípticas.
- **[RF04] Feixe Cósmico e Telemetria Espacial**:
  - Traçar vetor emissivo tridimensional (`CosmicLaserBeam`) entre o estado selecionado e o astro focalizado (Sol ou Lua).
  - Exibir telemetria em tempo real contendo distância topocêntrica em quilômetros e tempo de propagação da luz (tempo-luz).
- **[RF05] Arcos Geodésicos e Rotas Inter-Capitais**:
  - Calcular e traçar rotas ortodrômicas de Grande Círculo conectando pares de capitais brasileiras.
  - Aplicar elevação senoidal à rota para atingir altura na mesosfera proporcional à distância na superfície.
  - Exibir animação de partículas de pulso luminoso e distância calculada via fórmula de Haversine ($R = 6371 \text{ km}$).
- **[RF06] Simulador Solar e Ciclo Dia/Noite 24h**:
  - Permitir emular qualquer hora do dia (0h às 24h) com transição suave da luz e acendimento das luzes urbanas (NASA VIIRS).
  - Permitir simular o dia do ano (1 a 365) com inclinação do eixo terrestre de $23,44^\circ$, refletindo solstícios e equinócios.

### 1.3. Arquitetura de Interface, Câmera e Diagramação
- **[RF07] Exclusividade Mútua Estrita de Painéis de UI**:
  - O sistema deve assegurar que **sempre que um painel abrir, todos os outros fecham imediatamente**.
  - A regra aplica-se estritamente entre: Painel de Telemetria/Guardião, Simulador Solar & Dia/Noite, Card de Trajetória Cósmica e Painel de Texturas do Globo.
- **[RF08] Recálculo Dinâmico do Ponto Focal de Câmera (`camera.setViewOffset`)**:
  - O sistema deve recalcular dinamicamente a projeção da câmera Three.js para que o astro focalizado, planeta ou estado fique centralizado no espaço útil livre, impedindo que seja sobreposto por painéis laterais.
- **[RF09] Modos de Textura da Terra**:
  - Permitir alternar entre texturas fotorrealistas: Mapa Físico/Relevo, Cobertura Vegetal/Biomas, Mapa Climático e Luzes Noturnas.

### 1.4. Climatologia, Biodiversidade e Gamificação
- **[RF10] Telemetria Climática em Tempo Real**:
  - Coletar dados da Open-Meteo para a capital selecionada: temperatura, umidade, vento, pressão e radiação solar.
  - Simular visualmente fenômenos atmosféricos: ZCAS, correntes de jato e rios voadores amazônicos.
- **[RF11] Quizzes dos Guardiões e Progressão**:
  - Disponibilizar desafios com perguntas históricas e geográficas para cada estado, concedendo insígnias ao jogador.

---

## 2. Requisitos Não-Funcionais (RNF)

### 2.1. Desempenho e Eficiência Gráfica
- **[RNF01] Taxa de Quadros Mínima (60 FPS)**: A renderização dos motores Three.js, Canvas 2D e WebGL2 deve operar a 60 FPS estáveis em computadores de uso padrão sem placa gráfica dedicada.
- **[RNF02] Consumo Máximo de Recursos**:
  - Consumo de CPU inferior a 5% quando a cena estiver em repouso (sem interação contínua do usuário).
  - Consumo de memória heap do navegador inferior a 140 MB.
  - Tempo de primeiro carregamento interativo (Time to Interactive - TTI) inferior a 1.5 segundos.

### 2.2. Acessibilidade, Semântica e Usabilidade
- **[RNF03] Conformidade com WCAG 2.1 Nível AA**:
  - Contraste de cores mínimo de 4.5:1 para textos normais e 3:1 para elementos de interface e gráficos.
  - Foco visível e navegabilidade completa por teclado em todos os botões e painéis.
  - Suporte a leitores de tela com atributos ARIA em botões de controle e sliders de telemetria.
- **[RNF04] Nomenclatura Semântica Obrigatória (`classe-para-humanos`)**:
  - Todos os containers, painéis, botões e modais relevantes **devem** incluir classes descritivas legíveis (ex: `container-mapa-br`, `painel-toolbar-relevo`, `painel-guardiao-detalhes`, `btn-acao-viajar-estado`).
- **[RNF05] Design Responsivo Mobile-First**:
  - Alvos de toque (touch targets) com dimensão mínima de 44x44px em telas menores que 768px.
  - Adaptação dinâmica de HUDs laterais para gavetas deslizantes em smartphones.

### 2.3. Arquitetura, Manutenibilidade e Confiabilidade
- **[RNF06] Limite Modular de Linhas de Código**:
  - Nenhum arquivo de código TypeScript/React deve exceder o limite estrito de **250 a 270 linhas**. Lógicas complexas devem ser decompostas em hooks, services ou subcomponentes.
- **[RNF07] Resiliência de Rede e Cache Multi-Nível**:
  - Implementar cache L1 (memória), L2 (SessionStorage) e L3 (IndexedDB) para dados climáticos e texturas.
  - Em caso de falha de conexão com a Open-Meteo, apresentar dados históricos de fallback sem travar a interface.
- **[RNF08] Cobertura de Testes Automatizados**:
  - Testes unitários com Vitest para funções puras de astrometria e rotas geodésicas.
  - Testes end-to-end (E2E) estruturados com Playwright cobrindo fluxos críticos de seleção de estados e alternância de modos.
