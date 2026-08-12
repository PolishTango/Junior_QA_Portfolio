import { Page, Locator } from '@playwright/test';

export class ShopPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('input-firstname');
    this.lastNameInput = page.getByTestId('input-lastname');
    this.addressInput = page.getByTestId('input-address');
    this.submitButton = page.getByTestId('submit-order');
    this.successMessage = page.locator('text=/success|placed successfully/i');
  }

  async goto() {
    await this.page.goto('https://daniel-fronczak.pl/');
  }

  async addItemsMultipleTimes(count: number) {
    for (let i = 0; i < count; i++) {
      await this.page.getByTestId('add-to-cart-1').click();
    }
  }

  async addMultipleProductsInQuantity(productIds: number[], quantityPerProduct: number) {
    for (const id of productIds) {
      for (let i = 0; i < quantityPerProduct; i++) {
        await this.page.getByTestId(`add-to-cart-${id}`).click();
      }
    }
  }

  async clearCart() {
    const removeButtons = this.page.locator('.cartList .btnRed');
    
    while (await removeButtons.count() > 0) {
      await removeButtons.first().click();
    }
  }

  async fillForm(firstName: string, lastName: string, address: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.addressInput.fill(address);
  }

  async submitOrder() {
    await this.submitButton.click();
  }
}