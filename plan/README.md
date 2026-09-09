# Diretório de Planos de Arquitetura e Engenharia

Este diretório contém os planos formais de arquitetura, refatoração, governança de código e saúde de APIs do projeto.

## Planos e Regras Ativas:
- [Diretrizes Arquiteturais, Boas Práticas e Governança de Modos](./MODES_ARCHITECTURE_AND_CODE_GUIDELINES.md)
  - **Foco:** Princípio da independência absoluta de cada Modo ('clima', 'biodiversidade', 'geopolitica', 'musicalidades', 'globo3d', 'aventura', 'brquest'), zero vazamento de efeitos colaterais, reuso parametrizado por modo (`centralizarZoomMapa`), limites de 250 a 270 linhas, desacoplamento em hooks e services.
- [Plano Mestre de Refatoração - 02 de Setembro de 2026](./REFACTORING_PLAN_2026_09_02.md)
  - **Foco:** Decomposição dos arquivos extensos, arquitetura coesa em camadas, eliminação de redundâncias de dados, funções parametrizadas compartilhadas, cache multi-nível (L1/L2/L3), resiliência de APIs e governança com rastreabilidade total.
