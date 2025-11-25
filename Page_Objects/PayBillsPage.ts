import { expect, Locator, Page } from "@playwright/test";

export class PayBillsPage {
  readonly page: Page;
  readonly paySavedPayeeTab: Locator;
  readonly addNewPayeeTab: Locator;
  readonly purchaseForeignCurrencyTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paySavedPayeeTab = page.getByRole('link', {name: 'Pay Saved Payee'});
    this.addNewPayeeTab = page.getByRole('link', {name: 'Add New Payee'});
    this.purchaseForeignCurrencyTab = page.getByRole('link', {name: 'Purchase Foreign Currency'});
  }

  async clickOnPayBillsTab(tabName: string) {
    switch (tabName) {
      case "Pay Saved Payee":
        await this.paySavedPayeeTab.click();
        break;
      case "Add New Payee":
        await this.addNewPayeeTab.click();
        break;
      case "Purchase Foreign Currency":
        await this.purchaseForeignCurrencyTab.click();
        break;
      default:
        throw new Error(`Tab "${tabName}" does not exist.`);
    }
  }

  async assertPaySavedPayeeTitle() {
    await expect(this.paySavedPayeeTab).toContainText("Pay Saved Payee");
  }

  async assertAddNewPayeeTitle() {
    await expect(this.addNewPayeeTab).toContainText("Add New Payee");
  }

  async assertPurchaseForeignCurrencyTitle() {
    await expect(this.purchaseForeignCurrencyTab).toContainText("Purchase Foreign Currency");
  }
}
