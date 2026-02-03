on
{
  "testName": "Google DeepMind Search",
  "imports": "import { test, expect } from '@playwright/test';",
  "testCode": `
  test('Search for Google DeepMind', async ({ page }) => {
    await page.goto('https://www.google.com');

    // Accept cookies if the dialog exists. This is a resilient pattern.
    const acceptCookiesButton = page.getByRole('button', { name: 'Accept all' });
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
    }

    // Type 'Google DeepMind' into the search box. Prioritize aria-label if possible.  Fallback to name or placeholder.
    await page.getByRole('combobox', { name: 'Search' }).fill('Google DeepMind');

    // Press Enter to trigger the search.  Using keyboard is often more robust than clicking on a specific element.
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');

    // Assert that the search results contain 'Google DeepMind'.
    await expect(page.getByText('Google DeepMind')).toBeVisible();

    //Additional assertion. Check for the DeepMind website in the results.
    await expect(page.getByRole('link', { name: 'Google DeepMind' })).toBeVisible();

  });
`,
  "fullScript": "import { test, expect } from '@playwright/test';\n\ntest('Search for Google DeepMind', async ({ page }) => {\n  await page.goto('https://www.google.com');\n\n  // Accept cookies if the dialog exists. This is a resilient pattern.\n  const acceptCookiesButton = page.getByRole('button', { name: 'Accept all' });\n  if (await acceptCookiesButton.isVisible()) {\n    await acceptCookiesButton.click();\n  }\n\n  // Type 'Google DeepMind' into the search box. Prioritize aria-label if possible.  Fallback to name or placeholder.\n  await page.getByRole('combobox', { name: 'Search' }).fill('Google DeepMind');\n\n  // Press Enter to trigger the search.  Using keyboard is often more robust than clicking on a specific element.\n  await page.getByRole('combobox', { name: 'Search' }).press('Enter');\n\n  // Assert that the search results contain 'Google DeepMind'.\n  await expect(page.getByText('Google DeepMind')).toBeVisible();\n\n  //Additional assertion. Check for the DeepMind website in the results.\n  await expect(page.getByRole('link', { name: 'Google DeepMind' })).toBeVisible();\n\n});"
}