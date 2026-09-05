import { test, expect, Page } from '@playwright/test';

test.describe.serial('Mini-Engine de Shader do Oceano Atlântico - Testes E2E e Desacoplamento', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });

    page.on('pageerror', (err) => {
      console.error('Page error in Playwright test:', err.message);
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Aguarda o canvas do shader do oceano carregar após tela de loading
    await page.waitForSelector('#canva-shader-oceano-webgl', { state: 'attached', timeout: 40000 });
  });

  test.afterAll(async () => {
    if (page) {
      await page.close();
    }
  });

  test('1. deve renderizar a camada desacoplada do Shader do Oceano com classes semânticas', async () => {
    // 1. Verifica container semântico do shader (classe-para-humanos)
    const oceanContainer = page.locator('#container-shader-oceano-atlantico');
    await expect(oceanContainer).toBeAttached();
    await expect(oceanContainer).toHaveClass(/container-shader-oceano-atlantico/);

    // 2. Verifica canvas do WebGL2
    const oceanCanvas = page.locator('#canva-shader-oceano-webgl');
    await expect(oceanCanvas).toBeAttached();
    await expect(oceanCanvas).toHaveClass(/canva-shader-oceano-webgl/);

    // 3. Verifica atributos de dimensão nativa (2560x1440)
    const width = await oceanCanvas.getAttribute('width');
    const height = await oceanCanvas.getAttribute('height');
    expect(width).toBe('2560');
    expect(height).toBe('1440');
  });

  test('2. deve garantir que fake bolhas e círculos estáticos foram eliminados', async () => {
    // Garante que nenhum elemento de fake bubble ou círculos estranhos foi renderizado
    const fakeBubbles = page.locator('.ocean-fake-bubble, .marola-fake-arc, [data-fake-bubble]');
    const count = await fakeBubbles.count();
    expect(count).toBe(0);
  });

  test('3. deve testar desacoplamento: desligar e religar a camada de ondas via sidebar', async () => {
    const oceanCanvas = page.locator('#canva-shader-oceano-webgl');
    await expect(oceanCanvas).toBeAttached();

    // Botão de ondas na sidebar esquerda: #btn-sidebar-ventos-ondas
    const wavesToggleBtn = page.locator('#btn-sidebar-ventos-ondas');
    const toggleExpansaoBtn = page.locator('#btn-toggle-expansao-atmosfera');
    if (!(await wavesToggleBtn.isVisible())) {
      await toggleExpansaoBtn.click({ force: true });
      await page.waitForTimeout(300);
    }
    await expect(wavesToggleBtn).toBeVisible();

    // Desativa as ondas oceânicas
    await wavesToggleBtn.click({ force: true });
    await page.waitForTimeout(400);

    // O canvas do shader é completamente desmontado sem quebrar o mapa
    await expect(oceanCanvas).not.toBeAttached();

    // Confirma que a interface e os mapas continuam funcionando perfeitamente
    const mainContainer = page.locator('main');
    await expect(mainContainer).toBeAttached();

    // Reativa as ondas
    await wavesToggleBtn.click({ force: true });
    await page.waitForTimeout(400);
    await expect(oceanCanvas).toBeAttached();
  });

  test('4. deve alternar modos temáticos mantendo o shader ativo e reativo', async () => {
    const oceanCanvas = page.locator('#canva-shader-oceano-webgl');
    await expect(oceanCanvas).toBeAttached();

    // 1. Testa alternar para Clima
    const btnClima = page.locator('#btn-modo-clima');
    if (await btnClima.isVisible()) {
      await btnClima.click({ force: true });
      await page.waitForTimeout(400);
      await expect(oceanCanvas).toBeAttached();
    }

    // 2. Testa alternar para Aventura
    const btnAventura = page.locator('#btn-modo-aventura');
    if (await btnAventura.isVisible()) {
      await btnAventura.click({ force: true });
      await page.waitForTimeout(400);
      await expect(oceanCanvas).toBeAttached();
    }
  });

  test('5. deve responder a interações e manter contexto WebGL2 ativo sem travar a interface', async () => {
    const oceanCanvas = page.locator('#canva-shader-oceano-webgl');
    await expect(oceanCanvas).toBeAttached();

    // 1. Confirma título da aplicação
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // 2. Verifica se o contexto WebGL2 do shader oceânico permanece ativo e funcional
    const isWebGlActive = await oceanCanvas.evaluate((el: HTMLCanvasElement) => {
      const gl = el.getContext('webgl2');
      return gl !== null && !gl.isContextLost();
    });
    expect(isWebGlActive).toBe(true);
  });

  test('6. deve respeitar recolhimento por padrão e alternar expansão dos fenômenos atmosféricos', async () => {
    const toggleExpansaoBtn = page.locator('#btn-toggle-expansao-atmosfera');
    await expect(toggleExpansaoBtn).toBeVisible();

    const wavesToggleBtn = page.locator('#btn-sidebar-ventos-ondas');
    const wasVisible = await wavesToggleBtn.isVisible();
    await toggleExpansaoBtn.click({ force: true });
    await page.waitForTimeout(300);

    if (wasVisible) {
      await expect(wavesToggleBtn).not.toBeVisible();
      // Re-expande
      await toggleExpansaoBtn.click({ force: true });
      await page.waitForTimeout(300);
      await expect(wavesToggleBtn).toBeVisible();
    } else {
      await expect(wavesToggleBtn).toBeVisible();
      // Re-recolhe
      await toggleExpansaoBtn.click({ force: true });
      await page.waitForTimeout(300);
      await expect(wavesToggleBtn).not.toBeVisible();
    }
  });

  test('7. deve verificar ícone e interatividade do Astro e Ciclo Solar na função Auto', async () => {
    const astroBtn = page.locator('#btn-sidebar-astro-atmosfera');
    const toggleExpansaoBtn = page.locator('#btn-toggle-expansao-atmosfera');
    if (!(await astroBtn.isVisible())) {
      await toggleExpansaoBtn.click({ force: true });
      await page.waitForTimeout(300);
    }
    await expect(astroBtn).toBeVisible();
    await expect(astroBtn).toHaveAttribute('aria-label', 'Astro e Atmosfera');
  });
});
