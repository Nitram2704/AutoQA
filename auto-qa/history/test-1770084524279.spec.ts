import { test, expect } from '@playwright/test';

test('Verify Dashboard Loads', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
});