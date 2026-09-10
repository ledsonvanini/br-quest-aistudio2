# Visão de Negócio e Estratégia de Mercado
**BR Quest — Plataforma Gamificada de Inteligência Geográfica e Patrimônio Nacional**  
*Documento Estratégico:* `/plan/visao_de_negocio.md` | *Versão:* 1.4.0 (Setembro de 2026)

---

## 1. Sumário Executivo e Tese de Valor

O **BR Quest** nasceu para solucionar um gargalo estrutural da educação e do turismo no Brasil: a desconexão profunda entre o cidadão e a imensidão territorial, ecológica e cultural do seu país. Enquanto os mapas comerciais existentes priorizam rotas de trânsito e publicidade local, e os materiais didáticos continuam presos a formatos impressos estáticos e obsoletos, o BR Quest cria uma nova categoria: **a Cartografia Viva Gamificada**.

A plataforma integra dados governamentais abertos (IBGE, INMET, ICMBio, GBIF) a um motor gráfico procedural tridimensional leve e a uma narrativa épica de RPG tático, gerando alto engajamento em estudantes, professores e entusiastas.

```
                  ┌───────────────────────────────────────────────┐
                  │              TESE DE VALOR CENTRAL            │
                  │  Rigor Científico + Identidade Nacional       │
                  │  + Gamificação RPG + Performance Extrema       │
                  └───────────────────────┬───────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     [EdTech: Escolas & Vestibulares]              [Turismo, Cultura & Museus]
     Aulas interativas alinhadas à BNCC            Totens imersivos e valorização
     com telemetria e quizzes dinâmicos            do patrimônio de cada estado
```

---

## 2. Análise de Mercado (TAM, SAM, SOM)

### 2.1. Tamanho de Mercado
- **TAM (Total Addressable Market)**: Mercado de Tecnologia Educacional (EdTech) no Brasil, estimado em mais de **R$ 14 bilhões**, somado aos investimentos governamentais em digitalização escolar e turismo cultural.
- **SAM (Serviceable Addressable Market)**: Segmento de Ensino Fundamental II e Ensino Médio de redes públicas e privadas de ensino, composto por mais de **180.000 escolas de educação básica** e **47 milhões de estudantes**, além de centros de visitantes de Parques Nacionais e museus.
- **SOM (Serviceable Obtainable Market)**: Redes privadas de ensino com programas de inovação pedagógica (objetivo de atingir 350.000 alunos nos primeiros 24 meses) e 5 secretarias estaduais de educação via editais de inovação e PNLD.

---

## 3. Modelos de Receita e Monetização

O modelo de negócios do BR Quest é diversificado e fundamentado em canais de receita sustentáveis e de alta margem:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MATRIZ DE RECEITA BR QUEST                      │
├─────────────────────────┬──────────────────────────┬───────────────────┤
│ Canal                   │ Modelo de Cobrança       │ Público-Alvo      │
├─────────────────────────┼──────────────────────────┼───────────────────┤
│ 1. B2G (Governo)        │ Contrato Anual / Edital  │ Secretarias Est.  │
│ 2. B2B EdTech (Escolas) │ Assinatura SaaS / Aluno  │ Redes Privadas    │
│ 3. B2B Cultural / Museu │ Licença White-Label      │ Parques & Museus  │
│ 4. B2C Freemium         │ Assinatura Mensal/Anual  │ Famílias/Curiosos │
└─────────────────────────┴──────────────────────────┴───────────────────┘
```

### 3.1. B2G — Governos Estaduais e Municipais (Pilar Principal)
- **Modalidade**: Licenciamento institucional anual por rede de ensino (contratação por dispensa para inovação tecnológica ou adesão a editais do MEC/FNDE).
- **Proposta de Valor para o Gestor Público**:
  - Alinhamento integral às diretrizes curriculares da Base Nacional Comum Curricular (BNCC).
  - Capacidade de rodar em laboratórios de informática legados e tablets escolares de baixo custo sem GPU dedicada.
  - Painel de métricas pedagógicas com índice de retenção de conteúdo por escola/município.

### 3.2. B2B EdTech — Redes e Sistemas de Ensino Privados
- **Modalidade**: Cobrança por aluno ativo ($R\$ 2,50$ a $R\$ 5,00$/mês por licença integrada ao sistema de gestão escolar).
- **Diferencial Competitivo**: Integração com módulos de avaliação diagnóstica para ENEM e vestibulares estaduais (UFRGS, FUVEST, UNICAMP, UEA, UFPE).

### 3.3. B2B Turismo, Museus e Aeroportos (Edições Especiais)
- **Modalidade**: Licenciamento de estações interativas (*kiosks* e totens *touchscreen*) para centros de recepção turística da Embratur, secretarias estaduais de turismo e centros de visitantes do ICMBio.
- **Conteúdo Personalizado**: Foco em trilhas ecológicas, unidades de conservação e patrimônio histórico local.

### 3.4. B2C Freemium ("Clube do Guardião")
- **Plano Gratuito**: Acesso integral ao mapa 2D, globo 3D, telemetria climática em tempo real e modo exploração dos 27 estados.
- **Plano Premium (R$ 9,90/mês ou R$ 69,90/ano)**:
  - Módulos avançados de expedição histórica (ex: Expedição Rondon, Ciclo do Ouro, Caminhos do Peabiru).
  - Duelos de quizzes multiplayer em tempo real com ranking nacional.
  - Cartas colecionáveis digitais de alta resolução dos 27 Guardiões e brasões em vetor.

---

## 4. Estrutura de Custos e Margem Operacional

| Linha de Custo | Natureza | Nível de Despesa | Justificativa Técnica |
| :--- | :--- | :--- | :--- |
| **Infraestrutura Cloud** | Operacional | Muito Baixo | A arquitetura é majoritariamente client-side (WebGL2/Canvas local). Servidores apenas para roteamento e cache leve de APIs. |
| **Consumo de APIs** | Operacional | Baixo | Uso de camadas de cache em 3 níveis (L1 memória, L2 SessionStorage, L3 IndexedDB), minimizando chamadas externas. |
| **Conteúdo e Curadoria** | Investimento | Moderado | Atualização contínua de pesquisas taxonômicas, históricas e dados geográficos do IBGE. |
| **Desenvolvimento e QA** | Fixo | Alto no início | Foco em excelência de engenharia, arquitetura desacoplada e testes automatizados. |

*Margem bruta estimada superior a 82% em contratos SaaS B2G/B2B.*

---

## 5. Vantagens Competitivas Sustentáveis (Moats)

1. **Eficiência Gráfica Proprietária**: Microengines procedurais em WebGL2 e Three.js que dispensam texturas pesadas e servidores de streaming de vídeo, garantindo custo de hospedagem próximo de zero.
2. **Propriedade Intelectual e Narrativa**: O universo dos **27 Guardiões Territoriais** cria um vínculo afetivo e pedagógico impossível de ser replicado por aplicativos utilitários genéricos de mapas.
3. **Imparcialidade e Soberania dos Dados**: Dados estritamente fundamentados em fontes oficiais públicas e científicas, sem vieses comerciais ou publicidade abusiva.

---

## 6. Roadmap Estratégico de Expansão

- **Fase 1 (Atual - Q3/2026)**: Estabilização do Globo 3D, simulação solar 24h, rotas geodésicas interativas e telemetria climática unificada.
- **Fase 2 (Q4/2026)**: Lançamento do Portal do Professor com relatórios de turmas e exportação de atividades pedagógicas.
- **Fase 3 (Q1/2027)**: Pilotos em secretarias de educação e lançamento do aplicativo PWA para lojas oficiais (Google Play / App Store).
- **Fase 4 (Q2/2027+)**: Módulo "Guardiões da América do Sul" expandindo a cartografia para os países vizinhos e bacias compartilhadas.
