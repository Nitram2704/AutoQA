on
{
  "testName": "Google DeepMind Search",
  "imports": "import { test, expect } from '@playwright/test';",
  "testCode": `
  test('Search for Google DeepMind', async ({ page }) => {
    await page.goto('https://www.google.com');

    // Accept cookies if the button exists (handle potential cookie consent pop-ups)
    const acceptCookiesButton = page.getByRole('button', { name: 'Accept all' });
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
    }


    await page.getByRole('combobox', { name: 'Search' }).fill('Google DeepMind');
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');

    // Validate the search results.  Check for a general presence of DeepMind in the result content.
    await expect(page.getByText('DeepMind')).toBeVisible();

    // Optionally, check for a specific DeepMind link in results (more specific but may be brittle to changes in order).
    // await expect(page.getByRole('link', { name: 'DeepMind' })).toBeVisible();

  });
`,
  "fullScript": "import { test, expect } from '@playwright/test';\n\ntest('Search for Google DeepMind', async ({ page }) => {\n  await page.goto('https://www.google.com');\n\n  // Accept cookies if the button exists (handle potential cookie consent pop-ups)\n  const acceptCookiesButton = page.getByRole('button', { name: 'Accept all' });\n  if (await acceptCookiesButton.isVisible()) {\n    await acceptCookiesButton.click();\n  }\n\n\n  await page.getByRole('combobox', { name: 'Search' }).fill('Google DeepMind');\n  await page.getByRole('combobox', { name: 'Search' }).press('Enter');\n\n  // Validate the search results.  Check for a general presence of DeepMind in the result content.\n  await expect(page.getByText('DeepMind')).toBeVisible();\n\n  // Optionally, check for a specific DeepMind link in results (more specific but may be brittle to changes in order).\n  // await expect(page.getByRole('link', { name: 'DeepMind' })).toBeVisible();\n\n});"
}