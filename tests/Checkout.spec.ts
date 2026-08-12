import { test, expect } from '@playwright/test';
import { ShopPage } from '../tests/ShopPage';

test('E2E: Buying', async ({ page }) => {
  const shopPage = new ShopPage(page);

  await shopPage.goto();

  await shopPage.addItemsMultipleTimes(20);

  await shopPage.fillForm('Bober', 'Boberski', 'Bobrowicz');

  await shopPage.submitOrder();

  await expect(shopPage.successMessage).toBeVisible();
});