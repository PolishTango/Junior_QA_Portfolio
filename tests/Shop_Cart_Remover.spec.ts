import { test, expect } from '@playwright/test';
import { ShopPage } from '../tests/ShopPage';

test('Removing Objects from the Cart', async ({ page }) => {
  const shopPage = new ShopPage(page);

  await shopPage.goto();

  await shopPage.addMultipleProductsInQuantity([1, 2], 10);

  await shopPage.clearCart();

});