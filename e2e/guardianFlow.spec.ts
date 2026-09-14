import { test, expect, Page } from '@playwright/test';

test.describe.serial('Fluxo do Guardião e Desafios Territoriais - Testes E2E', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });

    page.on('pageerror', (err) => {
      console.error('Page error in Guardian Flow test:', err.message);
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Seleciona o modo Aventura se necessário para ativar o standee do guardião
    const btnAventura = page.locator('#btn-modo-aventura, button[title*="Aventura e Exploração"]').first();
    if (await btnAventura.isVisible()) {
      await btnAventura.click({ force: true });
      await page.waitForTimeout(600);
    }
  });

  test.afterAll(async () => {
    // Teardown automático do contexto pelo runner do Playwright
  });

  test('1. deve verificar a presença do Standee do Guardião ativo na tela', async () => {
    const standee = page.locator('#standee-guardiao-direita, .painel-guardiao-isolado-direita').first();
    await expect(standee).toBeVisible({ timeout: 10000 });

    const guardianBanner = page.locator('.banner-nome-guardiao-direita').first();
    await expect(guardianBanner).toBeVisible();
    const bannerText = await guardianBanner.textContent();
    expect(bannerText).toBeTruthy();
  });

  test('2. deve clicar no Guardião e navegar para a Cena RPG do Estado', async () => {
    const guardianBanner = page.locator('.banner-nome-guardiao-direita').first();
    await expect(guardianBanner).toBeVisible();
    await guardianBanner.click({ force: true });

    // Aguarda montagem da cena do guardião
    await page.waitForTimeout(1000);

    // Verifica que o botão de voltar ao mapa e elementos da cena RPG estão visíveis
    const backBtn = page.locator('.btn-acao-voltar-mapa, button:has-text("Voltar ao Mapa")').first();
    await expect(backBtn).toBeVisible({ timeout: 15000 });
  });

  test('3. deve clicar em Voltar ao Mapa e restaurar a cartografia panorâmica', async () => {
    const backBtn = page.locator('.btn-acao-voltar-mapa, button:has-text("Voltar ao Mapa")').first();
    await expect(backBtn).toBeVisible();
    await backBtn.click({ force: true });

    // Confirma retorno ao mapa
    await page.waitForTimeout(800);
    const dock = page.locator('#dock-navegacao-zoom-topo-direita');
    await expect(dock).toBeAttached();
  });
});
