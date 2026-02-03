import { test, expect } from '@playwright/test';

test('Search for DeepMind on Google', async ({ page }) => {
  await page.goto('https://www.google.com');

  // Locate the search input using aria-label.
  const searchInput = page.getByRole('textbox', { name: 'Buscar' });
  await searchInput.fill('DeepMind');

  // Press Enter to submit the search.
  await searchInput.press('Enter');

  // Wait for the search results to load (adjust selector if needed).
  await page.locator('#search').waitFor({ state: 'visible' });

  // Verify that the search results contain "DeepMind".
  await expect(page.locator('#search')).toContainText('DeepMind');
});