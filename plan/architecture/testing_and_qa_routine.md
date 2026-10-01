# Protocolo de Qualidade, Testes Contínuos e Gestão de Commits

Este protocolo define a rotina obrigatória de qualidade de código, execução de testes automatizados, validação de performance para Web e fluxo de commits para o projeto **Símbolos BR**.

---

## 1. Pilares da Rotina de Qualidade e Performance

1. **Validação Estática e Tipagem Forte**:
   - `npm run lint` (`tsc --noEmit`): Garante ausência total de tipagens quebradas, imports inválidos ou variáveis órfãs.
2. **Suíte de Testes Automatizados (Vitest)**:
   - `npm test` (`vitest run`): Validações matemáticas da projeção D3, centróides dos 27 estados, integridade das funções de coroplético, integridade dos Guardiões/Quizzes/Brasões e corretude do algoritmo de clamping anti-vazio.
3. **Auditoria de Performance Web e Zero Bloat**:
   - **Zero Dependências Supérfluas**: Sem importação de pacotes redundantes ou pesados.
   - **Zero Texturas Raster no Mapa**: O mapa de base não deve depender de arquivos `.png`/`.jpg` de fundo (como `bg-mapa-br.png` ou `mapa-br-estados.png`). Toda renderização de terreno, batimetria e oceano deve ser **vetorial e procedural**.
   - **Animações Eficientes**: Procedural loops de canvas limitados e otimizados com `requestAnimationFrame`, desligáveis caso o usuário prefira modo economia.
4. **Validação de Build de Produção**:
   - `npm run build` (`tsc && vite build`): Confirmação de que o bundle final compila perfeitamente para produção.
5. **Ciclo de Commit Estruturado**:
   - Ao concluir com sucesso qualquer feature ou refatoração estrutural (especialmente se envolver *breaking changes*), todos os testes são executados e uma proposta detalhada de commit no padrão *Conventional Commits* é registrada.

---

## 2. Matriz de Testes Automatizados

| Módulo / Camada | Arquivo de Teste | O que é testado e garantido |
| :--- | :--- | :--- |
| **Projeções D3 & Bounding Box** | `src/test/mapProjections.test.ts` | Projeção centralizada no Brasil, centróides válidos sem NaN, cálculo de limites de Pan & Zoom com garantia de tela preenchida (Zero-Void). |
| **Integridade de Dados (Guardiões & Estados)** | `src/test/guardiansData.test.ts` | Validação de que todos os 27 estados possuem Guardiões, 4 opções por quiz, brasões e hinos válidos. |
| **Escalas de Cores (Choropleth & Tiles)** | `src/test/mapColorScales.test.ts` | Mapeamento de cores por Região IBGE, Biomas e Conquista de XP/Insígnias sem exceções de valor indefinido. |
| **Efeitos Procedurais e Matemática** | `src/test/proceduralFX.test.ts` | Funções matemáticas de ondas, curvas Bézier de aves e limites de partículas calculados dentro dos intervalos esperados. |
| **Armazenamento e Gamificação** | `src/test/storage.test.ts` | Persistência de XP, desbloqueio de insígnias, estados completados e sincronização local segura. |

---

## 3. Fluxo de Trabalho por Feature / Refatoração

```
[Desenvolvimento da Feature Procedural / D3]
                    │
                    ▼
[Execução dos Testes Automatizados (Vitest)] ──▶ Se falhar ──▶ Correção imediata
                    │ (Passou 100%)
                    ▼
[Checagem de Tipagem e Linter (TypeScript)] ──▶ Se falhar ──▶ Ajuste de tipos
                    │ (Passou 100%)
                    ▼
[Compilação da Aplicação (compile_applet)]   ──▶ Se falhar ──▶ Correção de build
                    │ (Build Verde)
                    ▼
[Sugestão e Execução de Commit Semântico]
Exemplo: `feat(map): implement procedural D3-geo projection, ocean canvas and atmospheric FX`
```

---

## 4. Padrão de Mensagens de Commit

- `feat(map)`: Novas funcionalidades procedurais, camadas cartográficas ou interações do mapa.
- `refactor(map)`: Reestruturação interna e migração para D3 sem alterar o comportamento esperado.
- `fix(map)`: Correção de bugs de renderização, centróides ou cálculos de zoom.
- `perf(map)`: Otimizações de renderização Canvas/SVG, redução de bundle ou consumo de memória.
- `test(map)`: Adição ou expansão de testes automatizados.
