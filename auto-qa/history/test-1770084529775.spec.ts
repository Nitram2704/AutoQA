import { test, expect } from '@playwright/test';

test('Verify dashboard loads', async ({ page }) => {
  await page.goto('http://localhost:8081');
  // Assuming the dashboard has a heading, e.g., 'Dashboard'
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  // You can add more assertions here to check other elements that indicate the dashboard is loaded.
  // For example, if there's a button, a table, or any other visible element.
  // await expect(page.getByRole('button', { name: 'Some Button' })).toBeVisible();
  // await expect(page.getByRole('table')).toBeVisible();
});