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
