# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: oceanShader.spec.ts >> Mini-Engine de Shader do Oceano Atlântico - Testes E2E e Desacoplamento >> 4. deve alternar modos temáticos mantendo o shader ativo e reativo
- Location: e2e/oceanShader.spec.ts:81:3

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: expect(locator).toBeAttached() failed

Locator:  locator('#canva-shader-oceano-webgl')
Expected: attached
Received: undefined

Call log:
  - Expect "toBeAttached" with timeout 20000ms
  - waiting for locator('#canva-shader-oceano-webgl')

```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | test.describe.serial('Mini-Engine de Shader do Oceano Atlântico - Testes E2E e Desacoplamento', () => {
  4   |   let page: Page;
  5   | 
  6   |   test.beforeAll(async ({ browser }) => {
  7   |     page = await browser.newPage({
  8   |       viewport: { width: 1440, height: 900 },
  9   |     });
  10  | 
  11  |     page.on('pageerror', (err) => {
  12  |       console.error('Page error in Playwright test:', err.message);
  13  |     });
  14  | 
  15  |     await page.goto('/', { waitUntil: 'domcontentloaded' });
  16  |     // Aguarda o canvas do shader do oceano carregar após tela de loading
  17  |     await page.waitForSelector('#canva-shader-oceano-webgl', { state: 'attached', timeout: 40000 });
  18  |   });
  19  | 
  20  |   test.afterAll(async () => {
  21  |     if (page) {
  22  |       await page.close();
  23  |     }
  24  |   });
  25  | 
  26  |   test('1. deve renderizar a camada desacoplada do Shader do Oceano com classes semânticas', async () => {
  27  |     // 1. Verifica container semântico do shader (classe-para-humanos)
  28  |     const oceanContainer = page.locator('#container-shader-oceano-atlantico');
  29  |     await expect(oceanContainer).toBeAttached();
  30  |     await expect(oceanContainer).toHaveClass(/container-shader-oceano-atlantico/);
  31  | 
  32  |     // 2. Verifica canvas do WebGL2
  33  |     const oceanCanvas = page.locator('#canva-shader-oceano-webgl');
  34  |     await expect(oceanCanvas).toBeAttached();
  35  |     await expect(oceanCanvas).toHaveClass(/canva-shader-oceano-webgl/);
  36  | 
  37  |     // 3. Verifica atributos de dimensão nativa (2560x1440)
  38  |     const width = await oceanCanvas.getAttribute('width');
  39  |     const height = await oceanCanvas.getAttribute('height');
  40  |     expect(width).toBe('2560');
  41  |     expect(height).toBe('1440');
  42  |   });
  43  | 
  44  |   test('2. deve garantir que fake bolhas e círculos estáticos foram eliminados', async () => {
  45  |     // Garante que nenhum elemento de fake bubble ou círculos estranhos foi renderizado
  46  |     const fakeBubbles = page.locator('.ocean-fake-bubble, .marola-fake-arc, [data-fake-bubble]');
  47  |     const count = await fakeBubbles.count();
  48  |     expect(count).toBe(0);
  49  |   });
  50  | 
  51  |   test('3. deve testar desacoplamento: desligar e religar a camada de ondas via sidebar', async () => {
  52  |     const oceanCanvas = page.locator('#canva-shader-oceano-webgl');
  53  |     await expect(oceanCanvas).toBeAttached();
  54  | 
  55  |     // Botão de ondas na sidebar esquerda: #btn-sidebar-ventos-ondas
  56  |     const wavesToggleBtn = page.locator('#btn-sidebar-ventos-ondas');
  57  |     const toggleExpansaoBtn = page.locator('#btn-toggle-expansao-atmosfera');
  58  |     if (!(await wavesToggleBtn.isVisible())) {
  59  |       await toggleExpansaoBtn.click({ force: true });
  60  |       await page.waitForTimeout(300);
  61  |     }
  62  |     await expect(wavesToggleBtn).toBeVisible();
  63  | 
  64  |     // Desativa as ondas oceânicas
  65  |     await wavesToggleBtn.click({ force: true });
  66  |     await page.waitForTimeout(400);
  67  | 
  68  |     // O canvas do shader é completamente desmontado sem quebrar o mapa
  69  |     await expect(oceanCanvas).not.toBeAttached();
  70  | 
  71  |     // Confirma que a interface e os mapas continuam funcionando perfeitamente
  72  |     const mainContainer = page.locator('main');
  73  |     await expect(mainContainer).toBeAttached();
  74  | 
  75  |     // Reativa as ondas
  76  |     await wavesToggleBtn.click({ force: true });
  77  |     await page.waitForTimeout(400);
  78  |     await expect(oceanCanvas).toBeAttached();
  79  |   });
  80  | 
  81  |   test('4. deve alternar modos temáticos mantendo o shader ativo e reativo', async () => {
  82  |     const oceanCanvas = page.locator('#canva-shader-oceano-webgl');
  83  |     await expect(oceanCanvas).toBeAttached();
  84  | 
  85  |     // 1. Testa alternar para Clima
  86  |     const btnClima = page.locator('#btn-modo-clima');
  87  |     if (await btnClima.isVisible()) {
  88  |       await btnClima.click({ force: true });
  89  |       await page.waitForTimeout(400);
  90  |       await expect(oceanCanvas).toBeAttached();
  91  |     }
  92  | 
  93  |     // 2. Testa alternar para Aventura
  94  |     const btnAventura = page.locator('#btn-modo-aventura');
  95  |     if (await btnAventura.isVisible()) {
  96  |       await btnAventura.click({ force: true });
  97  |       await page.waitForTimeout(400);
> 98  |       await expect(oceanCanvas).toBeAttached();
      |                                 ^ Error: expect(locator).toBeAttached() failed
  99  |     }
  100 |   });
  101 | 
  102 |   test('5. deve responder a interações e manter contexto WebGL2 ativo sem travar a interface', async () => {
  103 |     const oceanCanvas = page.locator('#canva-shader-oceano-webgl');
  104 |     await expect(oceanCanvas).toBeAttached();
  105 | 
  106 |     // 1. Confirma título da aplicação
  107 |     const title = await page.title();
  108 |     expect(title.length).toBeGreaterThan(0);
  109 | 
  110 |     // 2. Verifica se o contexto WebGL2 do shader oceânico permanece ativo e funcional
  111 |     const isWebGlActive = await oceanCanvas.evaluate((el: HTMLCanvasElement) => {
  112 |       const gl = el.getContext('webgl2');
  113 |       return gl !== null && !gl.isContextLost();
  114 |     });
  115 |     expect(isWebGlActive).toBe(true);
  116 |   });
  117 | 
  118 |   test('6. deve respeitar recolhimento por padrão e alternar expansão dos fenômenos atmosféricos', async () => {
  119 |     const toggleExpansaoBtn = page.locator('#btn-toggle-expansao-atmosfera');
  120 |     await expect(toggleExpansaoBtn).toBeVisible();
  121 | 
  122 |     const wavesToggleBtn = page.locator('#btn-sidebar-ventos-ondas');
  123 |     const wasVisible = await wavesToggleBtn.isVisible();
  124 |     await toggleExpansaoBtn.click({ force: true });
  125 |     await page.waitForTimeout(300);
  126 | 
  127 |     if (wasVisible) {
  128 |       await expect(wavesToggleBtn).not.toBeVisible();
  129 |       // Re-expande
  130 |       await toggleExpansaoBtn.click({ force: true });
  131 |       await page.waitForTimeout(300);
  132 |       await expect(wavesToggleBtn).toBeVisible();
  133 |     } else {
  134 |       await expect(wavesToggleBtn).toBeVisible();
  135 |       // Re-recolhe
  136 |       await toggleExpansaoBtn.click({ force: true });
  137 |       await page.waitForTimeout(300);
  138 |       await expect(wavesToggleBtn).not.toBeVisible();
  139 |     }
  140 |   });
  141 | 
  142 |   test('7. deve verificar ícone e interatividade do Astro e Ciclo Solar na função Auto', async () => {
  143 |     const astroBtn = page.locator('#btn-sidebar-astro-atmosfera');
  144 |     const toggleExpansaoBtn = page.locator('#btn-toggle-expansao-atmosfera');
  145 |     if (!(await astroBtn.isVisible())) {
  146 |       await toggleExpansaoBtn.click({ force: true });
  147 |       await page.waitForTimeout(300);
  148 |     }
  149 |     await expect(astroBtn).toBeVisible();
  150 |     await expect(astroBtn).toHaveAttribute('aria-label', 'Astro e Atmosfera');
  151 |   });
  152 | });
  153 | 
```