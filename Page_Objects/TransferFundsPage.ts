import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class TransferFundsPage extends BasePage {
  readonly page: Page;
  readonly fromAccount: Locator;
  readonly toAccount: Locator;
  readonly amount: Locator;
  readonly descriptionInput: Locator;
  readonly continueButton: Locator;
  readonly submitPaymentButton: Locator;
  readonly cancelButton: Locator;
  readonly confirmationHeader: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);  
    this.page = page;
    this.fromAccount = page.getByLabel('From Account');
    this.toAccount = page.getByLabel('To Account');
    this.amount =  page.getByRole('textbox', {name: 'Amount'});
    this.descriptionInput = page.getByRole('textbox', {name: 'Description'});
    this.continueButton = page.getByRole('button', {name: 'Continue'});
    this.submitPaymentButton = page.getByRole('button', { name: 'Submit' });
    this.cancelButton = page.getByRole('link', {name: 'Cancel'});
    this.confirmationHeader = page.locator(".board-header");
    this.successMessage = page.locator(".alert-success");
  }

  async makePayment(selectFromAccount: string, toAccount: string, amount: string, description: string) {
    // await expect(this.fromAccount).toBeVisible({ timeout: 10000 });
    // await expect(this.toAccount).toBeVisible({ timeout: 10000 });
    await this.waitForVisible([this.fromAccount, this.toAccount]);
    
    await this.fromAccount.selectOption(selectFromAccount);
    await this.toAccount.selectOption(toAccount);

    await this.amount.fill(amount);
    await this.descriptionInput.fill(description);

    await this.continueButton.click();
  }

  async verifyAndSubmit() {
    await this.waitForNetworkIdle();
    await expect(this.confirmationHeader).toBeVisible();
    await this.submitPaymentButton.click();
  }

  async verifyAndCancel() {
    await expect(this.confirmationHeader).toBeVisible();
    await this.cancelButton.click();
  }

  async assertSuccessMessage() {
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toContainText("You successfully submitted your transaction.");
  }

  async assertSamePage() {
    await expect(this.confirmationHeader).toBeVisible();
    await expect(this.confirmationHeader).toContainText("Transfer Money & Make Payments");
  }
}
