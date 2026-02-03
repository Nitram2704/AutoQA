on
{
  "testName": "Google Search DeepMind",
  "imports": "import { test, expect } from '@playwright/test';",
  "testCode": `
  test('Search Google for DeepMind', async ({ page }) => {
    await page.goto('https://www.google.com');

    // Accept cookies if the button exists.  Using a timeout to handle scenarios where the dialog might not appear.
    try {
      await page.getByRole('button', { name: 'Accept all' }).click({ timeout: 5000 });
    } catch (e) {
      // Ignore if the button doesn't exist.
    }

    await page.getByRole('combobox', { name: 'Search' }).fill('DeepMind');
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');

    // Assert that the search results page contains the term "DeepMind"
    await expect(page.getByText('DeepMind')).toBeVisible();

    //Further validation - Check for a specific result that's likely to be present
    await expect(page.getByRole('link', { name: 'DeepMind' })).toBeVisible(); // Check for a link with "DeepMind"
  });
  `,
  "fullScript": "import { test, expect } from '@playwright/test';\n\ntest('Search Google for DeepMind', async ({ page }) => {\n  await page.goto('https://www.google.com');\n\n  // Accept cookies if the button exists.  Using a timeout to handle scenarios where the dialog might not appear.\n  try {\n    await page.getByRole('button', { name: 'Accept all' }).click({ timeout: 5000 });\n  } catch (e) {\n    // Ignore if the button doesn't exist.\n  }\n\n  await page.getByRole('combobox', { name: 'Search' }).fill('DeepMind');\n  await page.getByRole('combobox', { name: 'Search' }).press('Enter');\n\n  // Assert that the search results page contains the term \"DeepMind\"\n  await expect(page.getByText('DeepMind')).toBeVisible();\n\n  //Further validation - Check for a specific result that's likely to be present\n  await expect(page.getByRole('link', { name: 'DeepMind' })).toBeVisible(); // Check for a link with \"DeepMind\"\n});\n"
}