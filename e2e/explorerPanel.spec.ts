import { test, expect, Page } from '@playwright/test';

test.describe.serial('Painel do Explorador - Testes E2E (UI/UX, Abas, SpecimenAvatar e Boas-Vindas)', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });

    page.on('pageerror', (err) => {
      console.error('Page error in Explorer Panel test:', err.message);
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#btn-perfil-usuario-sidebar', { state: 'attached', timeout: 40000 });
  });

  test.afterAll(async () => {
    // Teardown automático do contexto pelo runner do Playwright
  });

  test('1. deve abrir o modal do explorador com dimensões ampliadas e classes semânticas', async () => {
    const profileBtn = page.locator('#btn-perfil-usuario-sidebar');
    await expect(profileBtn).toBeVisible();
    await profileBtn.click({ force: true });

    // Verifica montagem do container do modal
    const modalContainer = page.locator('#modal-auth-container');
    await expect(modalContainer).toBeVisible({ timeout: 10000 });
    await expect(modalContainer).toHaveClass(/painel-explorador-unificado/);

    // Verifica banner de boas-vindas
    const welcomeBanner = page.locator('.banner-boas-vindas-explorador');
    await expect(welcomeBanner).toBeVisible();

    // Verifica que o banner contém saudação e nível
    const bannerText = await welcomeBanner.textContent();
    expect(bannerText).toMatch(/Bom dia|Boa tarde|Boa noite/);
    expect(bannerText).toContain('XP');
  });

  test('2. deve exibir a aba Visão Geral com destino recomendado e resumo', async () => {
    const tabOverviewBtn = page.locator('.btn-aba-visao-geral');
    await expect(tabOverviewBtn).toBeVisible();

    const overviewPanel = page.locator('.painel-aba-visao-geral');
    await expect(overviewPanel).toBeVisible();

    // Verifica card de expedição recomendada
    const expeditionCard = page.locator('.card-expedicao-destaque');
    await expect(expeditionCard).toBeVisible();
    await expect(expeditionCard).toContainText('Destino Recomendado');
  });

  test('3. deve alternar para a aba Fauna, Flora & UFs e verificar SpecimenAvatar anti-quebra', async () => {
    const tabFavoritesBtn = page.locator('.btn-aba-favoritos');
    await expect(tabFavoritesBtn).toBeVisible();
    await tabFavoritesBtn.click({ force: true });

    const favoritesPanel = page.locator('.painel-aba-favoritos');
    await expect(favoritesPanel).toBeVisible();

    // Verifica renderização de biomas com ícones
    const biomesSection = page.locator('.secao-biomas-favoritos');
    await expect(biomesSection).toBeVisible();
    const biomeCards = page.locator('.btn-favoritar-bioma');
    expect(await biomeCards.count()).toBe(7);

    // Verifica catálogo de espécies com SpecimenAvatar
    const speciesSection = page.locator('.secao-especies-favoritas');
    await expect(speciesSection).toBeVisible();

    const specimenAvatars = page.locator('.avatar-especie-biodiversidade');
    expect(await specimenAvatars.count()).toBeGreaterThan(0);

    // Verifica filtro de busca
    const searchInput = favoritesPanel.locator('input[placeholder*="Buscar animal"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Onça');
    await page.waitForTimeout(300);

    // Deve conter Onça-Pintada no resultado filtrado
    const filteredText = await favoritesPanel.textContent();
    expect(filteredText).toContain('Onça-Pintada');
    await searchInput.clear();
  });

  test('4. deve alternar para a aba Jornada & XP e verificar métricas', async () => {
    const tabHistoryBtn = page.locator('.btn-aba-historico');
    await expect(tabHistoryBtn).toBeVisible();
    await tabHistoryBtn.click({ force: true });

    const historyPanel = page.locator('.painel-aba-historico');
    await expect(historyPanel).toBeVisible();
    await expect(historyPanel).toContainText('Exploração Territorial');
  });

  test('5. deve alternar para Ajustes e Minha Conta sem falhas', async () => {
    // Aba Ajustes
    const tabPreferencesBtn = page.locator('.btn-aba-preferencias');
    await expect(tabPreferencesBtn).toBeVisible();
    await tabPreferencesBtn.click({ force: true });
    await expect(page.locator('.painel-aba-preferencias')).toBeVisible();

    // Aba Minha Conta
    const tabIdentityBtn = page.locator('.btn-aba-identidade');
    await expect(tabIdentityBtn).toBeVisible();
    await tabIdentityBtn.click({ force: true });
    await expect(page.locator('.painel-aba-identidade')).toBeVisible();
  });

  test('6. deve fechar o modal corretamente e retornar ao mapa', async () => {
    const closeBtn = page.locator('#btn-fechar-modal-auth');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click({ force: true });

    const modalContainer = page.locator('#modal-auth-container');
    await expect(modalContainer).not.toBeVisible();
  });
});
