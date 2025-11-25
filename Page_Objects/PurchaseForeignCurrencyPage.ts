import { expect, Locator, Page } from "@playwright/test";

export class PurchaseForeignCurrencyPage {
  readonly page: Page;
  readonly currency: Locator;
  readonly todaysSellRate: Locator;
  readonly amount: Locator;
  readonly currencyRadioButtonUSD: Locator;
  readonly currencyRadioButtonSelectedCurrency: Locator;
  readonly calculateCostsButton: Locator;
  readonly conversionAmount: Locator;
  readonly purchaseButton: Locator;
  readonly purchaseConfirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.currency = page.getByLabel('Currency', {exact: true});
    this.todaysSellRate = page.getByText('Today\'s Sell Rate:');
    this.amount = page.locator('#pc_purchase_currency_form').getByText('Amount', {exact: true});
    this.currencyRadioButtonUSD = page.getByLabel("U.S. dollar (USD)");
    this.currencyRadioButtonSelectedCurrency = page.getByText("Selected currency");
    this.calculateCostsButton = page.getByRole("button", {name: "Calculate Costs"});
    this.conversionAmount = page.getByText('Conversion Amount', {exact: true});
    this.purchaseButton = page.getByRole('button', {name: 'Purchase'});
    this.purchaseConfirmation = page.locator("#alert_content");
  }

  async selectCurrency(selectCurrencyValue: string) {
    await this.currency.selectOption(selectCurrencyValue);
  }

  async enterAmount(enterAmountValue: string) {
    await this.amount.fill(enterAmountValue);
  }

  async selectRadioButton(radioButtonValue: string) {
    if (radioButtonValue === 'Selected currency') {
      await this.currencyRadioButtonSelectedCurrency.check();
    } else {
      await this.currencyRadioButtonUSD.check();
    }
  }

  async clickCalculateCostsButton() {
    await this.calculateCostsButton.click();
  }

  async assertConversionAmount() {
    await expect(this.conversionAmount).toBeVisible();
  }

  async clickPurchaseButton() {
    await this.purchaseButton.click();
  }

  async assertTodaysSellRate() {
    await expect(this.todaysSellRate).toBeVisible();
  }

  async assertSuccessMessage(expResult: string) {
    await expect(this.purchaseConfirmation).toBeVisible();
    await expect(this.purchaseConfirmation).toContainText(expResult);
  }
}
