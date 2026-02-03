import { test, expect } from '@playwright/test';

test('Verify Dashboard Loads', async ({ page }) => {
  await page.goto('http://localhost:8081');

  // Wait for the dashboard content to load.  Adjust the selector/strategy as needed for your specific dashboard.
  // This example waits for a heading with text "Dashboard".  Modify as appropriate.
  await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible({ timeout: 10000 });

  // You can add more assertions here to check the presence of other dashboard elements.
  // Example: Check for a table
  // await expect(page.getByRole('table')).toBeVisible();

  // Example: Check for a specific text
  // await expect(page.getByText(/Welcome to the Dashboard/i)).toBeVisible();
});