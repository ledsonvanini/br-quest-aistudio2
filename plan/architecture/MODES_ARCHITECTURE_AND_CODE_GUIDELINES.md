# DIRETRIZES ARQUITETURAIS, BOAS PRÁTICAS E GOVERNANÇA DE MODOS

> **Status:** Regra Oficial Obrigatória e Permanente  
> **Escopo:** Toda a base de código do projeto BR-Quest / Mapa Interativo do Brasil  
> **Revisão:** Setembro de 2026  

---

## 1. PRINCÍPIO DA INDEPENDÊNCIA ABSOLUTA DE MODOS

Cada **Modo de Aplicação** do menu e da barra lateral é um subsistema conceitualmente **independente e autônomo**.

### Modos Oficiais da Plataforma:
1. **`clima` (Temperatura & Telemetria Climática)**: Foco em meteorologia em tempo real, frentes, estações e anomalias térmicas.
2. **`biodiversidade` (Fauna, Flora e Fungos dos Biomas)**: Foco em espécimes, conservação, endemismo e cobertura vegetal.
3. **`geopolitica` (Censo Demográfico & Estatísticas IBGE)**: Foco em dados geopolíticos, miscigenação, densidade e política.
4. **`musicalidades` (Patrimônio Musical & Rádio Vintage)**: Foco em hinos, gêneros regionais e acervo sonoro histórico.
5. **`globo3d` (Globo Terrestre Orbital Three.js / R3F)**: Foco na esfera planetária tridimensional, iluminação solar/lunar e rotas geodésicas.
6. **`aventura` (Exploração RPG & Guardiões Estaduais)**: Foco na jornada mítica, diálogos com guardiões e insígnias.
7. **`brquest` (Grande Prova & Desafios Multidisciplinares)**: Foco no quiz nacional unificado e desafios por pilares.

---

## 2. REGRAS DE DESACOPLAMENTO E ISOLAMENTO DE MODOS

### 2.1. Zero Efeito Colateral Cruzado (Zero Leakage)
- Alterações de cores, estilos, shaders, zoom, opacidades ou estados internos de um modo **JAMAIS** devem vazar para outro modo.
- **Proibido:** Inserir overlays, filtros ou preenchimentos globais sem condicioná-los estritamente ao modo ativo.
- Cada modo deve possuir suas próprias camadas (layers), painéis de controle e regras de renderização encapsuladas.

### 2.2. Reuso Parametrizado com Contexto Explícito
O reuso de código (projeções D3, malhas cartográficas, texturas, cálculos matemáticos) é incentivado, mas **deve ser sempre parametrizado pelo modo ativo**.

```typescript
// ✅ CORRETO: Função compartilhada com contexto explícito do modo
export function centralizarZoomMapa(
  modo: AppMainMode,
  params: {
    stateId?: string;
    containerWidth: number;
    containerHeight: number;
    is3D?: boolean;
    isPanelOpen?: boolean;
    customZoom?: number;
  }
): { targetZoom: number; targetPan: { x: number; y: number } };
```

- **Proibido:** `if (true)` ou lógica genérica que assume comportamento de um modo específico sem checar `modo === ...`.

---

## 3. PADRÕES ESTRITOS DE CÓDIGO E ENGENHARIA

### 3.1. Limite de Linhas por Arquivo (250 a 270 linhas)
- Arquivos de código devem se manter estritamente dentro do intervalo de **250 a 270 linhas no máximo**.
- Ao se aproximar de 270 linhas, o desenvolvedor deve decompor o arquivo em:
  - **Subcomponentes especializados** (`/src/components/...`)
  - **Custom Hooks** (`/src/hooks/...`)
  - **Serviços de Domínio/I/O** (`/src/services/...`)
  - **Utilitários Puros & Matemática** (`/src/lib/...`)
  - **Contratos e Tipos** (`/src/types/...`)

### 3.2. Separação Estrita de Responsabilidades (Layering)
1. **Camada de Apresentação (UI / JSX)**: Apenas composição, renderização visual e despacho de ações do usuário.
2. **Camada de Estado e Efeitos (Hooks)**: Gerenciamento de ciclo de vida, listeners, timers e reatividade (`useAppModes`, `useModalAccessibility`, etc.).
3. **Camada de Serviços (Services)**: Regras de negócio, I/O, chamadas de API, telemetria e persistência (`climateService`, `mapModeService`, `apiTracker`).
4. **Camada de Infraestrutura/Engine**: Shaders WebGL, projeções D3, Three.js, áudio sintético.

### 3.3. Fontes Únicas de Verdade e Sem Números Mágicos
- Proibido hardcodar valores numéricos de dimensões, cores hexadecimais arbitrárias ou URLs espalhadas.
- Utilizar constantes declarativas centralizadas e enums semânticos.

### 3.4. Prática Obrigatória "classe-para-humanos"
- Todo container estrutural, painel, toolbar, modal, botão principal ou cartão **DEVE** conter uma classe CSS descritiva legível por humanos (ex: `container-mapa-br`, `painel-clima-telemetria`, `btn-acao-viajar-estado`).

---

## 4. MATRIZ DE CONFIGURAÇÃO PADRÃO POR MODO

| Modo | Provedor de Terreno Padrão | Estilo Visual | Camadas Ativas | Painel Lateral Padrão |
| :--- | :--- | :--- | :--- | :--- |
| **Clima** | `muted_gray` | `tiles` | Telemetria ECMWF, Frentes, ZCAS, Estações | Fechado (abertura sob demanda) |
| **Biodiversidade** | `natural_earth` | `tiles` | Cobertura de Biomas, Espécimes, Pins ecológicos | Fechado (abertura sob demanda) |
| **Geopolítica** | `shaded_relief` | `tiles` + Coroplético IBGE | Métricas IBGE, Censo, Densidade, Partidos | Aberto em desktop |
| **Musicalidades** | `shaded_relief` | `tiles` | Pins Musicais, Rádio Vintage, Espectro Sonoro | Fechado (abertura sob demanda) |
| **Globo 3D** | `nasa_satellite` / R3F | Esfera 3D Shader | Atmosfera Rayleigh/Mie, Nuvens, Sol/Lua | Aberto (HUD orbital) |
| **Aventura** | `voyager_parchment` | `tiles` | Guardiões Estaduais, Pins Heráldicos, Rotas | Fechado (abertura por estado) |

---

## 5. PROTOCOLO DE QUALIDADE E TESTES
- Todas as alterações devem ser acompanhadas de testes unitários (`vitest`) e validação E2E (`playwright`).
- Executar `lint_applet` e `compile_applet` para assegurar zero quebras de build e tipagem rigorosa.
