import { test, expect } from '@playwright/test';

test('Google Search DeepMind', async ({ page }) => {
  await page.goto('https://www.google.com');

  // Locate the search input using its accessible role and label, or placeholder if needed.
  const searchInput = page.getByRole('combobox', { name: 'Search' });
  await expect(searchInput).toBeVisible();

  // Type the search query.
  await searchInput.fill('Google DeepMind');

  // Press Enter to trigger the search. Consider clicking a search button if a Enter does not work.
  await searchInput.press('Enter');

  // Wait for the search results to load.  Use a specific element to assert that results are visible
  await page.getByText('Google DeepMind').first().waitFor({state: 'visible'});

  // Assert that search results are displayed.  Check for a common element in result.
  const results = page.getByText('Google DeepMind');
  await expect(results).toBeVisible();

  // Optional: Verify the title of the page to confirm search happened.
  await expect(page).toHaveTitle(/Google DeepMind/i);
});