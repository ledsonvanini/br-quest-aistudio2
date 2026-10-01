# Diretório de Documentação, Arquitetura e Engenharia (`/plan`)
**BR Quest — Plataforma Gamificada de Inteligência Geográfica, Biodiversidade e Globo 3D**  
*Última Revisão Completa:* Setembro de 2026

Este diretório centraliza a documentação técnica, planos formais de arquitetura, especificações de produto e diretrizes de governança de código da aplicação.

---

## 1. Documentos Principais e Estratégicos

## 1. Documentos de Negócio e PRDs (`/plan/business_and_prds/`)

- **[Plano de Negócio Executivo](./business_and_prds/plano_de_negocio.md)**: Monetização Freemium, parcerias escolares e unit economics.
- **[PRD Símbolos Nacionais e Estaduais](./business_and_prds/PRD_SIMBOLOS_BR.md)**: Brasões, hinos e heráldica oficial das 27 UFs.
- **[Próximos Passos Estratégicos](./business_and_prds/proximos_passos_estrategicos.md)**: Horizontes H1, H2 e H3 do produto.
- **[O Dossiê "Me Convença"](./business_and_prds/me_convenca.md)**: A tese do Cavalo de Troia da Curiosidade.
- **[Visão de Negócio](./business_and_prds/visao_de_negocio.md)**: TAM, SAM, SOM e moats do BR Quest.
- **[Requisitos Funcionais e Não-Funcionais](./business_and_prds/requisitos_funcionais_e_nao_funcionais.md)**: RF01 a RF11 e RNF01 a RNF08.

---

## 2. Engenharia e Arquitetura de Sistemas (`/plan/architecture/`)

- **[Especificação do Shader Oceânico Cartográfico](./architecture/especificacao_shader_oceano_cartografico.md)**: Swell, cáusticas, domain warping e zero bounding box.
- **[Diretrizes de Governança de Modos](./architecture/MODES_ARCHITECTURE_AND_CODE_GUIDELINES.md)**: Independência hermética dos modos.
- **[Arquitetura do Mapa D3 Mercator](./architecture/d3_geo_map_architecture.md)**: Projeções personalizadas para o Brasil.
- **[Arquitetura do HUD e Bússola 3D](./architecture/gizmo_compass_hud_architecture.md)**: Gizmo azimutal e sincronização de câmera.
- **[Especificação do Modo Geopolítico](./architecture/geopolitica-mode.md)**: Censo IBGE 2022 e recortes regionais.
- **[Ficha Técnica da Aplicação](./architecture/ficha_tecnica.md)**: Stack tecnológico, microengines e APIs.
- **[Fluxo do Usuário e Arquitetura do Sistema](./architecture/fluxo_e_arquitetura.md)**: Arquitetura em camadas e ciclo de vida dos modos.
- **[Registro Vivo de Dívidas Técnicas](./architecture/dividas_tecnicas.md)**: Mapeamento e quitação de dívidas técnicas.
- **[Rotina de Testes e Garantia de Qualidade](./architecture/testing_and_qa_routine.md)**: Diretrizes Vitest e Playwright.

---

## 3. Histórico de Refatorações Arquivadas (`/plan/refactoring_history/`)

- `2026-09-02_refactoring_plan.md`
- `2026-09-05_refatoracao_globo_3d_astronomia_rotas_shaders.md`
- `2026-09-15_arquitetura_modos_sidebar_contextual_e_camadas_cartograficas.md`
- `2026-09-22_arquitetura_texturas_shaders_apps_laterais_e_modos.md`
- `plano_implementacao_texturas_shaders_e_modos.md`

---

## 4. Plano Vigente Ativo

- **[Plano Consolidado Rumo à Versão Beta](./2026-09-30_plano_consolidado_refatoracao_caminho_beta.md)**: O documento ativo e aprovado para execução.
