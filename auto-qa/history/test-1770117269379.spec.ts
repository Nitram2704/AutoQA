import { test, expect } from '@playwright/test';

test('Search for DeepMind on Google', async ({ page }) => {
  await page.goto('https://www.google.com');

  // Locate the search input using aria-label.
  const searchInput = page.getByRole('textbox', { name: 'Buscar' });
  await expect(searchInput).toBeVisible();

  // Type 'DeepMind' into the search input.
  await searchInput.fill('DeepMind');

  // Press Enter to trigger the search.  Using keyboard is more reliable than clicking the search button.
  await searchInput.press('Enter');

  // Wait for a result related to DeepMind to appear.  Using a more specific locator is best to avoid flakiness.
  const deepMindResult = page.locator('text=DeepMind');
  await expect(deepMindResult).toBeVisible();

  // Optional: Verify the title of the page contains the search query.
  await expect(page).toHaveTitle(/DeepMind/);
});