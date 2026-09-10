# Diretório de Documentação, Arquitetura e Engenharia (`/plan`)
**BR Quest — Plataforma Gamificada de Inteligência Geográfica, Biodiversidade e Globo 3D**  
*Última Revisão Completa:* Setembro de 2026

Este diretório centraliza a documentação técnica, planos formais de arquitetura, especificações de produto e diretrizes de governança de código da aplicação.

---

## 1. Documentos Principais e Estratégicos

- **[Ficha Técnica da Aplicação](./ficha_tecnica.md)**
  - *Conteúdo:* Stack tecnológico completo, especificações das microengines (`CelestialSystem`, `CameraOrbitController`, `CosmicLaserBeam`, `GeodesicEngine`, `OceanEngine`), APIs integradas (Open-Meteo, IBGE, GBIF, NASA), requisitos de hardware e compatibilidade de navegadores.
- **[Visão de Negócio e Estratégia de Mercado](./visao_de_negocio.md)**
  - *Conteúdo:* Tese de valor, análise de mercado (TAM, SAM, SOM), modelos de monetização (B2G Governamental, B2B EdTech, B2B Cultural/Museus, B2C Freemium), estrutura de custos e vantagens competitivas sustentáveis (*moats*).
- **[O Dossiê "Me Convença"](./me_convenca.md)**
  - *Conteúdo:* Proposta de valor central do "Google Earth Gamificado da Identidade Nacional", matriz comparativa contra soluções tradicionais, casos de uso práticos na educação e turismo, e justificativa estratégica de investimento.
- **[Requisitos Funcionais e Não-Funcionais](./requisitos_funcionais_e_nao_funcionais.md)**
  - *Conteúdo:* Especificação formal dos Requisitos Funcionais (RF01 a RF11: cartografia multidimensional, astrometria 3D, rotas geodésicas, simulador solar 24h, exclusividade mútua de painéis, recálculo dinâmico de câmera) e Requisitos Não-Funcionais (RNF01 a RNF08: 60 FPS, < 140MB heap, WCAG AA, regra `classe-para-humanos`, limites de 250 a 270 linhas por arquivo).

---

## 2. Engenharia Gráfica, Shaders e Arquitetura de Modos

- **[Refatoração do Globo 3D, Astronomia e Rotas](./2026-09-05_refatoracao_globo_3d_astronomia_rotas_shaders.md)**
  - *Conteúdo:* Arquitetura do motor esférico Three.js, coordenadas equatoriais/eclípticas, dispersão atmosférica, feixe cósmico volumétrico e arcos geodésicos inter-estaduais.
- **[Especificação do Shader Oceânico Cartográfico](./especificacao_shader_oceano_cartografico.md)**
  - *Conteúdo:* Shader procedural contínuo em WebGL2 com swell bidirecional, domain warping de 2 etapas, cáusticas fractais e batimetria suave sem descontinuidades (*Zero Bounding Box*).
- **[Diretrizes de Governança de Modos](./MODES_ARCHITECTURE_AND_CODE_GUIDELINES.md)**
  - *Conteúdo:* Princípio da independência estrita de cada modo ('clima', 'biodiversidade', 'geopolitica', 'globo3d', 'aventura'), desacoplamento em hooks e eliminação de efeitos colaterais.
- **[Plano Mestre de Refatoração](./REFACTORING_PLAN_2026_09_02.md)**
  - *Conteúdo:* Decomposição de arquivos volumosos, arquitetura em camadas e estratégia de cache multi-nível (L1/L2/L3).
- **[Arquitetura do Mapa Vetorial D3](./d3_geo_map_architecture.md)**
  - *Conteúdo:* Projeções geográficas personalizadas para o território brasileiro e renderização vetorial otimizada.
- **[Arquitetura do HUD da Bússola e Controles](./gizmo_compass_hud_architecture.md)**
  - *Conteúdo:* Gizmo 3D de orientação azimutal e sincronização com o ponto de vista da câmera.
- **[Especificação do Modo Geopolítico](./geopolitica-mode.md)**
  - *Conteúdo:* Divisões regionais do IBGE, filtros territoriais e fronteiras geopolíticas.
- **[Rotina de Testes e Garantia de Qualidade](./testing_and_qa_routine.md)**
  - *Conteúdo:* Diretrizes para testes unitários com Vitest e testes E2E com Playwright.
