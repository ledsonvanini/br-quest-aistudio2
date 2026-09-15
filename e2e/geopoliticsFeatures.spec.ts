import { test, expect } from '@playwright/test';

test.describe('Observatório Geopolítico & Ferramentas Territoriais - Testes E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
  });

  test('1. deve acessar o modo Geopolítica e verificar a Toolbar de Ferramentas Territoriais', async ({ page }) => {
    // Alterna para o modo geopolitica através do botão de modo
    const btnGeopolitica = page.locator('#btn-modo-geopolitica');
    if (await btnGeopolitica.count() > 0) {
      await btnGeopolitica.first().evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(1000);
    }

    // Verifica presença da toolbar de ferramentas territoriais no painel lateral
    const toolbar = page.locator('#toolbar-ferramentas-territoriais-geopolitica');
    await expect(toolbar).toBeVisible();

    // Botões esperados
    const btnVizinhos = page.locator('#btn-geopolitica-vizinhos-sul-americanos');
    await expect(btnVizinhos).toBeVisible();

    const btnComparar = page.locator('#btn-geopolitica-comparador-estados');
    await expect(btnComparar).toBeVisible();
  });

  test('2. deve acionar o toggle da América do Sul e manter painel geopolítico sincronizado', async ({ page }) => {
    const btnGeopolitica = page.locator('#btn-modo-geopolitica');
    if (await btnGeopolitica.count() > 0) {
      await btnGeopolitica.first().evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(1000);
    }

    const btnVizinhos = page.locator('#btn-geopolitica-vizinhos-sul-americanos');
    await expect(btnVizinhos).toBeVisible();

    // Ativa países vizinhos via toolbar do painel
    await btnVizinhos.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(600);

    // Deve estar com aria-pressed = true
    await expect(btnVizinhos).toHaveAttribute('aria-pressed', 'true');

    // Desativa países vizinhos
    await btnVizinhos.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(600);
    await expect(btnVizinhos).toHaveAttribute('aria-pressed', 'false');
  });

  test('3. deve abrir o Comparador Interestadual, inverter estados e fechar modal', async ({ page }) => {
    const btnGeopolitica = page.locator('#btn-modo-geopolitica');
    if (await btnGeopolitica.count() > 0) {
      await btnGeopolitica.first().evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(1000);
    }

    const btnComparar = page.locator('#btn-geopolitica-comparador-estados');
    await expect(btnComparar).toBeVisible();
    await btnComparar.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(500);

    // Modal visível
    const modal = page.locator('#modal-comparador-geopolitica');
    await expect(modal).toBeVisible();

    // Inverte estados
    const btnSwap = page.locator('#btn-inverter-estados-comparador');
    await expect(btnSwap).toBeVisible();
    await btnSwap.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(300);

    // Fecha o modal
    const btnFechar = page.locator('#btn-fechar-comparador');
    await expect(btnFechar).toBeVisible();
    await btnFechar.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(400);

    await expect(modal).not.toBeVisible();
  });
});
