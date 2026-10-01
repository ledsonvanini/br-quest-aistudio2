# PRD — Símbolos BR: Sistema Gamificado de Símbolos e Culturas Brasileiras

## 1. Visão Geral do Produto
**Símbolos BR** é uma aplicação gamificada estilo RPG em **visão isométrica (câmera ortográfica topo-diagonal)** ambientada em um universo pós-apocalíptico e futurista. 

Após um evento pós-guerra que isolou nações globais, os 26 estados brasileiros e o Distrito Federal resistiram unindo tecnologia, tradições ancestrais e patriotismo real. Cada unidade federativa é protegida por um **Guardião (ã) Guerreiro (a)** sábio (a), responsável por guardar a memória cultural, hinos, símbolos, fauna, flora e manifestações artísticas do seu povo.

O usuário navega por um mapa tático e dinâmico do Brasil em câmera isométrica, deslocando seu avatar entre as fortalezas regionais, interagindo com os guardiões, realizando testes de conhecimento (quizzes), lendo pergaminhos históricos e conquistando **Insígnias Culturais** e **Pontos de Experiência (XP)** para reconstruir a identidade da nação.

---

## 2. Personas e Público-Alvo
- **Estudantes e Educadores:** Buscam aprender geografia, história, literatura e cultura brasileira de forma imersiva e memorável.
- **Entusiastas de Gamificação e RPG:** Apreciam jogos de exploração isométrica estilo *Diablo*, *Final Fantasy Tactics* ou *Age of Empires*, com progressão por XP, conquistas e lore rica.
- **Público Geral / Patriotas Culturais:** Desejam redescobrir os símbolos oficiais (hinos, bandeiras, fauna, flora, pratos e ritmos) de todos os cantos do Brasil.

---

## 3. Arquitetura e Tecnologias
- **Frontend Core:** React 18, TypeScript, Vite
- **Motor Gráfico e Câmera:** Three.js / Canvas 2D Isometric Engine com Projeção Ortográfica ($30^\circ$ pitch, $45^\circ$ yaw)
- **Animações e Física de Transição:** GSAP (GreenSock) & Framer Motion
- **Estilização e HUD:** Tailwind CSS com paleta tática/dourada cyberpunk-cultural
- **Efeitos Sonoros & Música:** Web Audio API Procedural Synthesizer para notas dos Hinos Estaduais e feedback tátil
- **Persistência de Dados:** LocalStorage API para salvamento de progresso do jogador (XP, Nível, Insígnias Desbloqueadas, Quizzes Concluídos)
- **Documentação do Sistema:** `PRD_SIMBOLOS_BR.md` integrado nativamente à interface do usuário

---

## 4. Requisitos Funcionais

### 4.1. Mapa Isométrico e Navegação RPG
- **Câmera Ortográfica Isométrica:** Visão superior em ângulo diagonal cobrindo as 5 macrorregiões do Brasil (Norte, Nordeste, Centro-Oeste, Sudeste, Sul).
- **Controle do Avatar:** Movimentação do personagem via teclas **WASD**, **Setas Direcionais** ou **Clique no Tile / Guardião**.
- **Terreno e Biomas:** Texturas e variações de altitude representando a Amazônia, Caatinga, Cerrado, Mata Atlântica, Pantanal e Pampa.
- **Indicadores Visuais:** Linhas de fronteira brilhantes, marcadores de capital e ícones de status sobre os guardiões (Pendente, Ativo, Concluído).

### 4.2. Sistema de Guardiões da Cultura (27 Unidades Federativas)
Cada estado possui um Guardião exclusivo com:
- **Identidade e Traje Típico:** Vestimentas de guerreiro adaptadas à cultura local (ex: Guardiã da Floresta no AM, Cavaleiro dos Pampas no RS, Guardião dos Sertões na BA, Sábio das Geraes em MG, Guardiã do Frevo em PE).
- **Animações de Postura (States):**
  - `Idle`: Animação de respiração viva e pulsação em repouso.
  - `Guard`: Postura solene de defesa da fortaleza.
  - `Presentation`: Apresentação ostensiva dos elementos do estado.
  - `Reading`: Leitura cerimonial de pergaminhos sagrados.
  - `Unlocked`: Postura de reverência e concessão da insígnia após aprovação no desafio.

### 4.3. Dossiê de Símbolos Estaduais
Ao abrir o diálogo do Guardião, o jogador acessa:
1. **Hino do Estado:** Letra completa e executor sintético de áudio dos arranjos característicos.
2. **Bandeira e Brasão:** Origem e significado das cores e formas.
3. **Fauna e Flora Emblemáticas:** Animais e plantas nativas preservadas.
4. **Culinária Tradicional:** Pratos típicos e hábitos alimentares.
5. **Ritmos & Músicas:** Estilos musicais e artistas célebres.
6. **Pergaminho Sagrado:** Trecho poético ou histórico literário de autores do estado (ex: Machado de Assis, Cora Coralina, Erico Verissimo, Castro Alves, Mário de Andrade, Thiago de Mello, etc.).

### 4.4. Mecânica de Gamificação (Quizzes & Insígnias)
- **Desafio do Guardião:** Quizzes com questões inéditas sobre os símbolos do estado.
- **Concessão de Insígnias:** Acerte os desafios para receber a Insígnia Sagrada do Estado (27 insígnias no total).
- **Barra de XP e Níveis de Patriota:** Progresso acumulativo que libera novas regiões e títulos na ordem dos Guardiões.

---

## 5. Requisitos Não-Funcionais e Performance
- **High FPS Canvas:** Renderização mantida em 60 FPS com ciclo `requestAnimationFrame` otimizado.
- **Responsividade:** Canvas ajustável com `ResizeObserver` para telas mobile, tablet e desktop.
- **Sem Dependência de Servidor Externo:** Funcionalidade total offline/client-side garantida.
- **Acessibilidade:** Suporte a comandos de teclado, controles na tela e contraste elevado conforme WCAG AA.

---

## 6. Cronograma de Conquistas e Níveis
1. **Recruta da Pátria:** 0 - 250 XP
2. **Explorador das Fronteiras:** 251 - 750 XP
3. **Guardião Aprendiz:** 751 - 1500 XP
4. **Mestre dos Símbolos:** 1501 - 3000 XP
5. **Supremo Protetor do Brasil:** 3000+ XP (Todos os 27 estados dominados)

---
*Documento PRD gerado e atualizado para a versão 1.0 de Símbolos BR.*
