# Plano de Implementação: Modo Geopolítica (BR Quest)

## 1. Visão Geral
Adicionar o novo modo imersivo e analítico **"Geopolítica"**, seguindo rigorosamente os padrões de layout, design system e interação consolidados no modo *Biodiversidade*. O modo apresentará radiografias demográficas, étnicas, socioeducacionais e políticas do Brasil por Estado (UF), por Região (Norte, Nordeste, Centro-Oeste, Sudeste, Sul) e em escala Nacional consolidada.

---

## 2. Reorganização da Barra Superior (Top Navigation Bar)
Ordem dos botões no `TopGlobalNavMenu.tsx`:
1. **Clima** (`clima`)
2. **Biodiversidade** (`biodiversidade`)
3. **Geopolítica** (`geopolitica`) — *Novo Modo Integrado*
4. **Globo 3D** (`globo3d`)
5. **Navegação** (Reset de Câmera / Modo de Exploração Padrão)

---

## 3. Estrutura de Tipos e Dados
- **Arquivo de Tipos**: `/src/types/geopolitica.ts`
- **Base de Dados**: `/src/data/geopoliticaData.ts` (Dados oficiais IBGE Censo 2022, TSE, DataSUS e PNAD)

### Indicadores Principais por Estado e Região:
1. **Etnia & Miscigenação (IBGE Censo 2022)**:
   - Pardos, Brancos, Pretos, Indígenas, Amarelos (percentuais e absolutos).
2. **Gênero & Demografia**:
   - Mulheres (%) vs. Homens (%), Razão de Sexo (homens por 100 mulheres).
   - População total residente e grau de urbanização.
3. **Densidade Demográfica**:
   - Habitantes por km² e área territorial total.
4. **Dinâmica Populacional & Saúde**:
   - Taxa de Natalidade (por 1.000 hab.) e Taxa de Fecundidade.
   - Taxa de Mortalidade Geral (por 1.000 hab.) e Mortalidade Infantil (por 1.000 nascidos vivos).
5. **Educação & Letramento**:
   - Taxa de Analfabetismo (15 anos ou mais) e anos médios de estudo.
6. **Quadro Político & Eleitoral (TSE / Governança)**:
   - Governador(a) atual, Partido, Sigla, Espectro Político, Vice-Governador(a), Capital e histórico de mandatos.

---

## 4. Camada de Mapa Interativa (`GeopoliticsMapLayer.tsx`)
- Pins estilizados no mapa com emblemas visuais com base no indicador ativo (ex: gráfico de rosca de miscigenação, sigla partidária com cor de legenda, indicador numérico com cor temática).
- Sombra natural sem artefatos ou elementos drop-shadow artificiais.
- Animação de esmaecimento suave em loop na borda (`anim-border-fade`).
- Suporte a hover com popover informativo e clique para abrir os detalhes do estado.
- Compatibilidade total com projeção 2D e visão 3D isométrica inclinada.

---

## 5. Painel Lateral de Controle & Análise (`GeopoliticsControlPanel.tsx`)
- Posição lateral esquerda (expandido 50% de largura por padrão em desktops, recolhível para modo mini).
- Ao abrir o painel, a câmera do mapa centraliza o território brasileiro na metade direita da tela automaticamente via cálculo de offset de pan.
- Abas de filtros rápidos:
  - *Todas as Métricas*, *Miscigenação & Etnias*, *Gênero*, *Densidade Demográfica*, *Natalidade & Mortalidade*, *Educação / Analfabetismo*, *Partidos & Gestão*.
- Seletores de escopo:
  - Brasil (Consolidado Nacional), Filtro por Regiões e Busca instantânea de Estados.
- Cards informativos de ranking com visualização gráfica dos líderes e destaques em cada índice.

---

## 6. Modal de Detalhes do Estado (`StateGeopoliticsDialog.tsx`)
- Visão completa com brasão oficial, governador(a), partido, capital, pirâmides, rankings e comparações em relação à média nacional do Brasil.
