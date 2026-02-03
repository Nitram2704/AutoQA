import { test, expect } from '@playwright/test';

test('Search for DeepMind', async ({ page }) => {
  await page.goto('https://www.google.com/');
  await page.getByRole('textarea', { name: 'Buscar' }).fill('DeepMind');
  await page.getByRole('input', { name: 'Buscar con Google' }).click();
  await expect(page).toHaveTitle(/DeepMind/);
});