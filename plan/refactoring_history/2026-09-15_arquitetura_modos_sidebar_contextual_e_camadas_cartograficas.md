# Arquitetura de Modos, Sidebar Contextual Especializada e Camadas Cartográficas
**Data:** 15 de Setembro de 2026  
**Status:** Aprovado para Implementação  
**Autor:** Senior Software Engineer & Solutions Architect  
**Alinhamento:** Diretrizes de Engenharia, Regras AGENTS.md / GEMINI.md e Requisitos de UX/UI

---

## 1. Visão Geral Executiva & Filosofia Arquitetural

Este documento estabelece a especificação técnica para a evolução estrutural do **BR Quest**, consolidando o modelo de **Sidebar Contextual por Mundo (2D / 3D)**, a introdução das **Camadas Cartográficas Vivas (Território & Redes)** e a preservação rigorosa dos padrões consolidados da aplicação:

1. **Desacoplamento Inegociável de Modos**:
   * O ecossistema do **Mapa 2D Isométrico** e o do **Globo 3D Orbital** operam com ciclo de vida, estado e ferramentas 100% independentes.
   * Não há vazamento de flags, filtros ou estados entre os modos. Ao alternar, o modo de destino inicializa ou restaura seu contexto próprio sem interferências.

2. **Preservação da Identidade Visual & O "Xodó" da Sidebar**:
   * O **Toggle Principal `[ Mapa 2D ⟷ Globo 3D ]`** no topo da sidebar é mantido como o seletor mestre de mundo.
   * A mecânica tátil de **Gaveta Retrátil com Setas (`ChevronUp` / `ChevronDown`)** estabelecida em *Ambiente & Sistema* torna-se a linguagem oficial e consistente da barra lateral.

3. **Padrão de Layout Lateral ("AppLateral 50% de Tela Útil")**:
   * Quando qualquer painel/app lateral abre (ex: Diálogo de Clima, Biodiversidade, Geopolítica, Detalhe de Bacia ou Rádio Vintage), o canvas isométrico ou a câmera 3D reajusta seu centro focando o território brasileiro nos **50% restantes da tela**, conforme equações de projeção de `src/lib/mapProjections.ts`.

4. **Rodapé Dinâmico Contextual (`DynamicAppFooter`)**:
   * O rodapé adapta seu conteúdo de forma cirúrgica ao modo ativo (tickers contextuais de aventura, clima, biodiversidade, música, geopolítica no 2D; telemetria orbital limpa no 3D).

5. **Performance Extrema & 60 FPS Contínuos**:
   * Resolução analítica nos fragment shaders WebGL2, limites de frame pacing de 10.5ms (zero descarte de frames em 60Hz), vetores otimizados e zero trabalho desnecessário na *Main Thread*.

---

## 2. Estrutura da Sidebar Contextual Especializada

A sidebar adapta-se dinamicamente conforme o modo selecionado no alternador mestre:

### 2.1. Estado A: Modo Mapa 2D Isométrico

No mapa 2D, a barra é dedicada à cartografia e fenômenos do Brasil, apresentando **duas gavetas simétricas**:

```text
+--------------------------------------------------------------------+
| SIDEBAR 2D: CARTOGRAFIA DO BRASIL                                  |
|                                                                    |
|  [B] Logo BR Quest                                                 |
|  [ MAPA 2D (Ativo) ] | Globo 3D                                    |
|  (Paleta de Estilos: Padrão, Aquarela, Satélite, Noturno)          |
|                                                                    |
|  ------------------------- [Divisor] ----------------------------  |
|                                                                    |
|  +==============================================================+  |
|  | GAVETA 1: AMBIENTE & SISTEMA                                 |  |
|  | [ ^ / v ] Botão Chevron Retrátil                             |  |
|  +--------------------------------------------------------------+  |
|  | (Itens quando expandida):                                    |  |
|  |   [*] Chuva Convectiva / Frontal                             |  |
|  |   [*] Nuvens Volumétricas Atmosféricas                       |  |
|  |   [*] Ondas Costeiras & Swell (Shader WebGL2)                |  |
|  |   [*] Ciclo Solar (Dia / Noite / Horário de Brasília)        |  |
|  |   [*] Configurações Gerais (SFX, Volume, Diagnósticos)       |  |
|  +==============================================================+  |
|                                                                    |
|  ------------------------- [Divisor] ----------------------------  |
|                                                                    |
|  +==============================================================+  |
|  | GAVETA 2: TERRITÓRIO & CAMADAS                               |  |
|  | [ ^ / v ] Botão Chevron Retrátil                             |  |
|  +--------------------------------------------------------------+  |
|  | (Itens quando expandida):                                    |  |
|  |   [~] Bacias Hidrográficas (Rios Principais & Malha Fluvial) |  |
|  |   [#] Biomas & Relevo (Amazônia, Cerrado, Caatinga, etc.)    |  |
|  |   [=] Rotas & Integração (Ferrovias, Rodovias e Portos)      |  |
|  |   [o] Dados Coropléticos (População IBGE, PIB, IDH)          |  |
|  +==============================================================+  |
+--------------------------------------------------------------------+
```

### 2.2. Estado B: Modo Globo 3D Orbital

Ao alternar para o Globo 3D, a sidebar substitui as ferramentas 2D por um **Cockpit Orbital Exclusivo**, resgatando controles que antes ficavam dispersos ou ocultos:

```text
+--------------------------------------------------------------------+
| SIDEBAR 3D: COCKPIT ORBITAL                                        |
|                                                                    |
|  [B] Logo BR Quest                                                 |
|  Mapa 2D | [ GLOBO 3D (Ativo) ]                                    |
|                                                                    |
|  ------------------------- [Divisor] ----------------------------  |
|                                                                    |
|  +==============================================================+  |
|  | GAVETA ORBITAL: CONTROLES 3D                                 |  |
|  | [ ^ / v ] Botão Chevron Retrátil                             |  |
|  +--------------------------------------------------------------+  |
|  | (Itens exclusivos quando expandida):                         |  |
|  |   [🛰️] Textura da Terra (Satélite NASA / Noite / Natural)    |  |
|  |   [☁️] Atmosfera & Nuvens 3D em Órbita                       |  |
|  |   [🔄] Auto-Rotação Planetária (Play / Pause)                 |  |
|  |   [🇧🇷] Travar Câmera no Brasil (Foco Instantâneo)            |  |
|  |   [☀️] Terminador Solar Orbital                              |  |
|  |   [⚙️] Configurações Visuais do Globo                        |  |
|  +==============================================================+  |
+--------------------------------------------------------------------+
```

---

## 3. Padrão "AppLateral 50%" e Centralização do Canvas

Seguindo o design system já estabelecido no projeto:

1. **Abertura de Diálogos Laterais**:
   * O diálogo ou painel abre fixado à esquerda ocupando 50% da largura útil da viewport (ou até 640px em telas ultrawide).
2. **Cálculo da Câmera / Projeção**:
   * A função correspondente em `src/lib/mapProjections.ts` calcula o offset horizontal exato:
     $$\Delta X = +25\% \times \text{largura da tela}$$
   * O mapa translada suavemente com animação cúbica (`cubic-bezier(0.16, 1, 0.3, 1)`), mantendo o centro do Brasil ou a UF selecionada perfeitamente no ponto focal dos 50% restantes à direita.
3. **Fechamento do Diálogo**:
   * Ao fechar o painel lateral, a câmera retorna com inércia para o centro global (`ΔX = 0`).

---

## 4. Unificação do HUD: Legenda Ancorada na Bússola

Para eliminar elementos soltos pela interface:
* A **Bússola Náutica / Isométrica** (canto inferior direito) serve como **âncora vertical única**.
* Quando uma camada temática com legenda estiver ativa (ex: *Bacias Hidrográficas* ou *Biomas*), a mini-legenda cartográfica surge **acoplada diretamente no topo da bússola**, formando uma coluna única.
* O canto inferior esquerdo permanece **100% desobstruído**, garantindo clareza e amplitude visual.

---

## 5. Rodapé Dinâmico por Modo (`DynamicAppFooter`)

* **No Modo 2D**:
  * Exibe o ticker especializado conforme o submenu selecionado (Aventura, Clima, Biodiversidade, Rádio ou Geopolítica).
  * Exibe o medidor de FPS otimizado à direita quando ativado.
* **No Modo 3D**:
  * O rodapé exibe telemetria orbital enxuta (coordenadas sub-satélite, velocidade de rotação, indicador de foco no Brasil) ou cede espaço para máxima imersão planetária.

---

## 6. Camadas Cartográficas: Especificação Técnica

### 6.1. Bacias Hidrográficas & Malha Fluvial Viva
* **Componente**: `src/components/map/layers/HydrologyMapLayer.tsx` (desacoplado, < 240 linhas).
* **Dados Geoespaciais**: Traçado vetorial dos eixos fluviais principais:
  * Bacia Amazônica (Amazonas, Negro, Solimões, Madeira, Tapajós).
  * Bacia do Tocantins-Araguaia.
  * Bacia do São Francisco ("Velho Chico").
  * Bacia do Paraná / Paraguai / Prata.
  * Bacia do Atlântico Sul / Parnaíba.
* **Estética**: Linhas fluidas com espessuras proporcionais à vazão, cor ciano-abissal integrada ao shader oceânico e glow sutil.

### 6.2. Infraestrutura & Rotas de Integração
* **Componente**: `src/components/map/layers/InfrastructureMapLayer.tsx` (desacoplado, < 240 linhas).
* **Dados**:
  * Estradas históricas (Estrada Real, Linhas Rondon).
  * Principais rodovias de integração (BR-101 costeira, BR-116, Transamazônica).
  * Conexões portuárias de cabotagem no Atlântico.

---

## 7. Diretrizes Técnicas de Qualidade & Padrões Rígidos

1. **Limite Estrito de Linhas por Arquivo**:
   * Nenhum arquivo criado ou refatorado ultrapassará **250 a 270 linhas**.
   * Funções auxiliares, dados brutos e shaders ficam em módulos dedicados (`/src/data/`, `/src/lib/`, `/src/services/`).
2. **Prática "classe-para-humanos" (MANDATÓRIO)**:
   * Todos os novos containers, gavetas, botões e painéis devem conter classes semânticas descritivas (ex: `secao-gaveta-territorio-sidebar`, `btn-toggle-expansao-territorio`, `btn-camada-hidrografia`, `painel-legenda-bussola`).
3. **TypeScript Estrito & Zero Valores Mágicos**:
   * Enums e interfaces centralizados em `src/types/cartography.ts`.
   * Cores, tempos de transição e raios de curvatura baseados em constantes declarativas.
4. **Testes Unitários & Playwright E2E**:
   * Testes automatizados em `e2e/sidebarContextual.spec.ts` validando:
     * Alternância 2D ⟷ 3D e renderização contextual correta da sidebar.
     * Expansão/recolhimento das gavetas com as setas.
     * Ausência de vazamento de estado entre modos.
     * Recálculo de viewport nos 50% de tela quando painéis laterais são abertos.

---

## 8. Cronograma de Execução por Fases

1. **Fase 1: Estrutura da Sidebar Contextual e Gavetas (Acordeão)**
   * Refatoração modular do `TopGlobalNavMenu.tsx` em subcomponentes:
     * `Sidebar2DContainer.tsx` (Gaveta 1 Ambiente + Gaveta 2 Território).
     * `Sidebar3DContainer.tsx` (Gaveta Orbital 3D).
   * Validação de testes e linter.

2. **Fase 2: Camada de Bacias Hidrográficas & Legenda Unificada na Bússola**
   * Criação do serviço e dados hidrográficos (`brazilHydrologyData.ts`).
   * Componente `HydrologyMapLayer.tsx` integrado ao canvas 2D.
   * Acoplamento da legenda contextual diretamente no topo da bússola.

3. **Fase 3: Refinamento de Integração com os 50% de Tela & Testes E2E Playwright**
   * Garantia de foco nos 50% restantes ao abrir detalhamento de rios ou biomas.
   * Execução da suíte completa de testes no Playwright.
