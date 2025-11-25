import { expect, Locator, Page } from '@playwright/test';

export class PaymentPage {
  readonly page: Page;
  readonly payeeSelectbox: Locator;
  readonly payeeDetailButton: Locator;
  readonly payeeDetail: Locator;
  readonly accountSelectbox: Locator;
  readonly amountInput: Locator;
  readonly dateInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitPaymentButton: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.payeeSelectbox = page.getByLabel('Payee');
    this.payeeDetailButton = page.locator('#sp_get_payee_details');
    this.payeeDetail = page.locator('#sp_payee_details');
    this.accountSelectbox = page.getByLabel('Account');
    this.amountInput = page.getByRole('textbox', {name: 'Amount'});
    this.dateInput = page.getByRole('textbox', {name: 'Date'});
    this.descriptionInput = page.getByRole('textbox', {name: 'Description'});
    this.submitPaymentButton = page.locator('#pay_saved_payees');
    this.message = page.locator('#alert_content > span');
  }

  async createPayment(
    payee: string, account: string, amount: string, date: string, description: string) {
    await this.payeeSelectbox.selectOption(payee);
    await this.payeeDetailButton.click();
    await expect(this.payeeDetail).toBeVisible();
    await this.accountSelectbox.selectOption(account);
    await this.amountInput.fill(amount);
    await this.dateInput.fill(date);
    await this.descriptionInput.fill(description);
    await this.submitPaymentButton.click();
  }

  async assertSuccessMessage() {
    await expect(this.message).toBeVisible();
    await expect(this.message).toContainText('The payment was successfully submitted');
  }
}
