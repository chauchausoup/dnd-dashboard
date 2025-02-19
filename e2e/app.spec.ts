import { test, expect } from '@playwright/test';

test.describe('App Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display Home page on default route', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await expect(page.locator('body')).toContainText('dashboard');
  });

  test('should navigate to DashboardTable when clicking Spells link', async ({ page }) => {
    await page.click('a[href="/spells"]');
    await expect(page).toHaveURL('/spells');
    await expect(page.locator('body')).toContainText('NameLevelDescriptionCasting');
  });

  test('should navigate to About page', async ({ page }) => {
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('body')).toContainText('About');
  });

  test('should navigate to Profile page', async ({ page }) => {
    await page.click('a[href="/profile"]');
    await expect(page).toHaveURL('/profile');
    await expect(page.locator('body')).toContainText('Profile');
  });
});