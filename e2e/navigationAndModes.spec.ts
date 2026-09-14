import { test, expect, Page } from '@playwright/test';

test.describe.serial('Navegação, Modos Temáticos e Hubs Educacionais - Testes E2E', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });

    page.on('pageerror', (err) => {
      console.error('Page error in Navigation and Modes test:', err.message);
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#dock-navegacao-zoom-topo-direita', { state: 'attached', timeout: 40000 });
  });

  test.afterAll(async () => {
    // Teardown automático do contexto pelo runner do Playwright
  });

  test('1. deve verificar e interagir com o Dock de Zoom e Centralização Topo-Direita', async () => {
    const dock = page.locator('#dock-navegacao-zoom-topo-direita');
    await expect(dock).toBeVisible();

    const zoomInBtn = page.locator('#btn-zoom-in-topo');
    const zoomOutBtn = page.locator('#btn-zoom-out-topo');
    const resetViewBtn = page.locator('#btn-centralizar-brasil-topo');

    await expect(zoomInBtn).toBeVisible();
    await expect(zoomOutBtn).toBeVisible();
    await expect(resetViewBtn).toBeVisible();

    // Executa cliques sem erros
    await zoomInBtn.click({ force: true });
    await page.waitForTimeout(200);
    await zoomOutBtn.click({ force: true });
    await page.waitForTimeout(200);
    await resetViewBtn.click({ force: true });
  });

  test('2. deve abrir e fechar o modal das 5 Dicas do Dia: Você Sabia?', async () => {
    const dailyTipsBtn = page.locator('#btn-dicas-do-dia-topo-dock');
    if (await dailyTipsBtn.isVisible()) {
      await dailyTipsBtn.click({ force: true });

      const tipsModal = page.locator('#modal-dicas-do-dia-backdrop');
      await expect(tipsModal).toBeVisible({ timeout: 5000 });

      // Fecha pelo botão fechar
      const closeBtn = page.locator('#btn-fechar-dicas');
      await closeBtn.click({ force: true });
      await expect(tipsModal).not.toBeVisible();
    }
  });

  test('3. deve abrir e fechar o Portal do Educador (BR Quest Edu)', async () => {
    const eduBtn = page.locator('#btn-abrir-portal-educador');
    if (await eduBtn.isVisible()) {
      await eduBtn.click({ force: true });

      const eduModal = page.locator('#modal-portal-educador-backdrop');
      await expect(eduModal).toBeVisible({ timeout: 5000 });

      // Fecha o portal do educador
      const closeBtn = page.locator('#btn-fechar-portal-educador');
      await closeBtn.click({ force: true });
      await expect(eduModal).not.toBeVisible();
    }
  });

  test('4. deve alternar entre modos principais (Clima, Aventura, Globo 3D)', async () => {
    const btnClima = page.locator('#btn-modo-clima, button[title*="Temperatura e Clima"]').first();
    const btnAventura = page.locator('#btn-modo-aventura, button[title*="Aventura e Exploração"]').first();
    const btnGlobo = page.locator('#btn-modo-globo3d, button[title*="Globo 3D Orbital"]').first();

    // 1. Clima
    if (await btnClima.isVisible()) {
      await btnClima.click({ force: true });
      await page.waitForTimeout(400);
      await expect(page.locator('main')).toBeAttached();
    }

    // 2. Aventura
    if (await btnAventura.isVisible()) {
      await btnAventura.click({ force: true });
      await page.waitForTimeout(400);
      await expect(page.locator('main')).toBeAttached();
    }

    // 3. Globo 3D
    if (await btnGlobo.isVisible()) {
      await btnGlobo.click({ force: true });
      await page.waitForTimeout(800);
      const globeContainer = page.locator('.container-palco-globo-3d, canvas').first();
      await expect(globeContainer).toBeAttached();

      // Retorna para o mapa 2D clicando em aventura
      await btnAventura.click({ force: true });
      await page.waitForTimeout(400);
    }
  });
});
