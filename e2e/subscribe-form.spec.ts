import { test, expect } from '@playwright/test';

test.describe('Subscription inquiry form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/subscribe');
  });

  test('renders all required fields', async ({ page }) => {
    await expect(page.locator('#sub-purchaser-name')).toBeVisible();
    await expect(page.locator('#sub-purchaser-email')).toBeVisible();
    await expect(page.locator('#sub-purchaser-phone')).toBeVisible();
    await expect(page.locator('input[name="sub-fulfillment"][value="pickup"]')).toBeVisible();
    await expect(page.locator('input[name="frequency"][value="weekly"]')).toBeVisible();
    await expect(page.locator('input[name="frequency"][value="biweekly"]')).toBeVisible();
    await expect(page.locator('input[name="frequency"][value="monthly"]')).toBeVisible();
    await expect(page.locator('#sub-recipient-name')).toBeVisible();
    await expect(page.locator('#start-date')).toBeVisible();
    await expect(page.locator('#special-requests')).toBeVisible();
    await expect(page.locator('#sub-budget')).toBeVisible();
    await expect(page.locator('#style-preferences')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('delivery address is hidden by default', async ({ page }) => {
    await expect(page.locator('#sub-delivery-address-field')).toBeHidden();
  });

  test('delivery address shows when delivery is selected', async ({ page }) => {
    await page.click('input[name="sub-fulfillment"][value="delivery"]');
    await expect(page.locator('#sub-delivery-address-field')).toBeVisible();
  });

  test('disclaimer text is present', async ({ page }) => {
    await expect(page.locator('.form-disclaimer')).toContainText("We'll follow up");
  });
});
