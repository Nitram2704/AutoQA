import { test, expect } from '@playwright/test';

test('Search Google for DeepMind', async ({ page }) => {
  await page.goto('https://www.google.com');

  // Locate the search input and type the query.
  const searchInput = await page.getByRole('combobox', { name: 'Search' });
  await searchInput.fill('Google DeepMind');

  // Press Enter to trigger the search.  Alternative: Click search button
  await searchInput.press('Enter');

  // Wait for the search results to load.  Use a stable selector.  Consider checking for a specific element or text related to search results.
  await page.getByText('DeepMind').waitFor();

  // Assert that search results contain 'DeepMind'.  This checks that at least one result contains this.
  await expect(page.getByText('DeepMind')).toBeVisible();

  // Optional: Check the title to make sure the page is what we expected.
  await expect(page).toHaveTitle(/Google Search/);
});