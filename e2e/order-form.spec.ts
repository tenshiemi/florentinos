import { test, expect } from '@playwright/test';

test.describe('Order inquiry form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/order');
  });

  test('renders all required fields', async ({ page }) => {
    await expect(page.locator('#date-needed')).toBeVisible();
    await expect(page.locator('input[name="fulfillment"][value="pickup"]')).toBeVisible();
    await expect(page.locator('input[name="fulfillment"][value="delivery"]')).toBeVisible();
    await expect(page.locator('#recipient-name')).toBeVisible();
    await expect(page.locator('#card-message')).toBeVisible();
    await expect(page.locator('#order-request')).toBeVisible();
    await expect(page.locator('#budget')).toBeVisible();
    await expect(page.locator('#purchaser-name')).toBeVisible();
    await expect(page.locator('#purchaser-email')).toBeVisible();
    await expect(page.locator('#purchaser-phone')).toBeVisible();
    await expect(page.locator('#today-date')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('delivery address field is hidden by default', async ({ page }) => {
    await expect(page.locator('#delivery-address-field')).toBeHidden();
  });

  test('delivery address field shows when delivery is selected', async ({ page }) => {
    await page.click('input[name="fulfillment"][value="delivery"]');
    await expect(page.locator('#delivery-address-field')).toBeVisible();
  });

  test('delivery address field hides when pickup is re-selected', async ({ page }) => {
    await page.click('input[name="fulfillment"][value="delivery"]');
    await page.click('input[name="fulfillment"][value="pickup"]');
    await expect(page.locator('#delivery-address-field')).toBeHidden();
  });

  test('budget dropdown has correct options', async ({ page }) => {
    const options = await page.locator('#budget option:not([disabled])').allTextContents();
    expect(options[0]).toBe('$75');
    expect(options[options.length - 1]).toBe('$400+');
    expect(options.length).toBe(15); // $75 to $400 in $25 increments (14) + $400+
  });

  test('disclaimer text is present', async ({ page }) => {
    await expect(page.locator('.form-disclaimer')).toContainText('not a confirmed order');
  });
});
