on
{
  "testName": "Google DeepMind Search",
  "imports": "import { test, expect } from '@playwright/test';",
  "testCode": `
  test('Search for Google DeepMind', async ({ page }) => {
    await page.goto('https://www.google.com');

    // Accept cookies if the button exists
    const acceptCookiesButton = page.getByRole('button', { name: 'Accept all' });
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
    }

    // Type in the search box
    await page.getByRole('combobox', { name: 'Search' }).fill('Google DeepMind');

    // Click the search button (using name for resilience)
    await page.getByRole('button', { name: 'Google Search' }).click();

    // Assert that the search results contain DeepMind
    await expect(page.getByText('DeepMind')).toBeVisible();

    // Optionally assert the URL contains the search query.  This is a good check for search page.
    await expect(page).toHaveURL(/.*search.*q=Google DeepMind/);
  });`,
  "fullScript": "import { test, expect } from '@playwright/test';\n\ntest('Search for Google DeepMind', async ({ page }) => {\n  await page.goto('https://www.google.com');\n\n  // Accept cookies if the button exists\n  const acceptCookiesButton = page.getByRole('button', { name: 'Accept all' });\n  if (await acceptCookiesButton.isVisible()) {\n    await acceptCookiesButton.click();\n  }\n\n  // Type in the search box\n  await page.getByRole('combobox', { name: 'Search' }).fill('Google DeepMind');\n\n  // Click the search button (using name for resilience)\n  await page.getByRole('button', { name: 'Google Search' }).click();\n\n  // Assert that the search results contain DeepMind\n  await expect(page.getByText('DeepMind')).toBeVisible();\n\n  // Optionally assert the URL contains the search query.  This is a good check for search page.\n  await expect(page).toHaveURL(/.*search.*q=Google DeepMind/);\n});"
}