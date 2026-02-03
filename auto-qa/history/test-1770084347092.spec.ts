on
{
  "testName": "Verify app title and add expense button",
  "imports": "import { test, expect } from '@playwright/test';",
  "testCode": `
  test('Verify app title and add expense button', async ({ page }) => {
    await page.goto('http://localhost:8081');

    // Verify the app title
    await expect(page.getByRole('heading', { name: /gastos/i })).toBeVisible();

    // Verify the add expense button is visible
    await expect(page.getByRole('button', { name: /agregar gasto/i })).toBeVisible();
  });
  `,
  "fullScript": "import { test, expect } from '@playwright/test';\n\ntest('Verify app title and add expense button', async ({ page }) => {\n  await page.goto('http://localhost:8081');\n\n  // Verify the app title\n  await expect(page.getByRole('heading', { name: /gastos/i })).toBeVisible();\n\n  // Verify the add expense button is visible\n  await expect(page.getByRole('button', { name: /agregar gasto/i })).toBeVisible();\n});"
}