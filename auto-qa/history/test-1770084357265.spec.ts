import { test, expect } from '@playwright/test';

test('Verify app title and add expense button', async ({ page }) => {
  await page.goto('http://localhost:8081');

  // Verify the app title is visible.
  await expect(page.getByRole('heading', { name: /expense tracker/i })).toBeVisible();

  // Verify the 'Add Expense' button is visible.
  await expect(page.getByRole('button', { name: /add expense/i })).toBeVisible();
});