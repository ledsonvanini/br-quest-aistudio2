# Próximos Passos Estratégicos e Evolução do Produto
**BR Quest — O Super App da Geografia Viva, Clima e Identidade Nacional**  
*Documento Estratégico:* `/plan/proximos_passos_estrategicos.md` | *Versão:* 2.0.0 (Setembro de 2026)

---

## 1. Contexto e Status Atual da Plataforma

A plataforma atingiu um patamar excepcional de maturidade técnica, gráfica e pedagógica. Foram consolidados os seguintes módulos essenciais:

1. **Engine Gráfica & Cartografia**:
   - Shader de Oceano Procedural Contínuo (WebGL2 com batimetria FBM e cáusticas vivas).
   - Engine do Globo 3D R3F desacoplada em hooks (`useGlobeCameraRig`, `useGlobeSolarCycle`, etc.).
   - Modularização da malha vetorial do Brasil (`SouthAmericaLandmassLayer`, `StatePolygonRenderer`, `StateFillStyler`).
2. **Inteligência Artificial & Diálogo**:
   - Oráculo IA dos 27 Guardiões Estaduais (@google/genai server-side com personas autênticas).
3. **Engajamento, Gamificação & Retenção**:
   - "5 Dicas do Dia: Você Sabia?" com teletransporte e streak diário.
   - Sistema de Insígnias e Árvore de Habilidades dos 27 estados.
   - Painel do Explorador reformulado (Área expandida 96vw×92vh, saudação dinâmica, SpecimenAvatar com fallback de ícones para fauna/flora, biomas com contexto e atalhos rápidos).
4. **Infraestrutura, Persistência & B2B**:
   - Arquitetura Híbrida: Firebase Firestore Cloud + SQLite Local (`node:sqlite`).
   - Buffer & Cache Central de APIs climáticas e biológicas.
   - PWA (Service Worker Cache-First e Manifest offline).
   - Portal do Educador ("BR Quest Edu" com trilhas BNCC e gestão de turmas).

---

## 2. Matriz Atualizada de Horizontes e Status

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MATRIZ DE HORIZONTES E EVOLUÇÃO ESTRATÉGICA                     │
├───────────────┬──────────────────────────────────┬───────────────────────────┬────────┤
│ Horizonte     │ Iniciativa                       │ Pilar de Valor            │ Status │
├───────────────┼──────────────────────────────────┼───────────────────────────┼────────┤
│ H1: Imediato  │ "5 Dicas do Dia: Você Sabia?"    │ Retenção & DAU (Alavanca) │Concluído
│ H1: Imediato  │ SQLite Local (Dados & Prefs)     │ Persistência Leve e Rápida│Concluído
│ H1: Imediato  │ Arquitetura de Auth Desacoplada  │ Flexibilidade de Vendors  │Concluído
│ H1: Imediato  │ Buffer & Cache Central de APIs   │ Resiliência & Custo Zero  │Concluído
│ H1: Imediato  │ Painel do Explorador (UX & Ícones│ Identidade & Personaliz.  │Concluído
│ H1: Imediato  │ Firebase Firestore Provisionado  │ Sincronização em Nuvem    │Concluído
│ H1: Imediato  │ Modularização de `MapStatesLayer`│ Governança de Código      │Concluído
├───────────────┼──────────────────────────────────┼───────────────────────────┼────────┤
│ H2: Médio     │ Portal do Educador (BR Quest Edu)│ B2B Escolas & BNCC        │Concluído
│ H2: Médio     │ PWA & Cache L3 (Offline)         │ Acesso Escolar & PWA      │Concluído
│ H2: Médio     │ Streaming de IA no Chat Guardiões│ Conversação Fluida        │PRÓXIMO 
│ H2: Médio     │ Bateria de Testes E2E Playwright │ Confiabilidade Beta       │PRÓXIMO 
├───────────────┼──────────────────────────────────┼───────────────────────────┼────────┤
│ H3: Expansão  │ Guardiões da América do Sul      │ Geopolítica Continental   │Backlog 
│ H3: Expansão  │ Internacionalização (i18n)       │ Turismo ("Discover Brazil)│Backlog 
│ H3: Expansão  │ Trilhas ESG & Patrocínio B2G     │ Sustentabilidade & Edital │Backlog 
└───────────────┴──────────────────────────────────┴───────────────────────────┴────────┘
```

---

## 3. Onde Estamos Exatamente?

Neste exato momento:
- **Horizonte 1 (Fundação de Produto e Infraestrutura)**: **100% Concluído**.
- **Painel do Explorador**: Concluído com sucesso na última iteração (ícones de fauna/flora com fallback anti-quebra, biomas informativos, bandeiras de todas as UFs, área visual ampliada de 96vw×92vh e saudação pessoal dinâmica).
- **Compilação e Linter**: 100% limpos e validados (`npm run build` e `npm run lint` passando com zero erros).

---

## 4. Quais São os Próximos Passos Candidatos?

Para consolidar o caminho até o lançamento da **Versão Beta**, temos três caminhos estratégicos prioritários:

### Opção 1: Streaming Reativo de IA no Oráculo dos Guardiões (UX Conversacional de Ponta)
- **O que é**: Implementar resposta em fluxo contínuo (Server-Sent Events / ReadableStream) na rota `/api/guardian-chat`.
- **Benefício**: Elimina o tempo de espera percebido pelo usuário ao conversar com qualquer um dos 27 Guardiões estaduais; o texto começa a surgir instantaneamente em efeito "máquina de escrever" fluida com voz sintetizada sincronizada.

### Opção 2: Bateria de Testes Automatizados E2E com Playwright (Blindagem da Versão Beta)
- **O que é**: Estruturar e executar a suíte Playwright cobrindo os fluxos críticos:
  1. Carregamento do mapa 2D e alternância para o Globo 3D.
  2. Abertura do Painel do Explorador e navegação pelas 5 abas.
  3. Desafio de quiz e concessão de XP com desbloqueio de insígnias.
  4. Interação com as 5 Dicas do Dia e teletransporte de câmera.
- **Benefício**: Garante imunidade a regressões e estabilidade absoluta antes do envio a usuários beta.

### Opção 3: Geopolítica da América do Sul & Bacias Transfronteiriças (Imersão Territorial)
- **O que é**: Tornar clicáveis os 10 países vizinhos da América do Sul no mapa e no Globo 3D, exibindo relações diplomáticas, tratados de fronteira, bacias compartilhadas (Prata e Amazonas) e tratados energéticos (Itaipu).
- **Benefício**: Expande o alcance educacional para o Ensino Médio e vestibulares/ENEM na temática de geopolítica internacional.
