import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('home page loads and shows navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('nav, header').first()).toBeVisible();
  });

  test('jobs page renders', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page).toHaveURL(/\/jobs/);
  });

  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('button, input')).toBeVisible();
  });
});
