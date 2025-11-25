import { expect, Locator, Page } from "@playwright/test";

export class AddNewPayeePage {
  readonly page: Page;
  readonly payeeNameInput: Locator;
  readonly payeeAddressInput: Locator;
  readonly accountInput: Locator;
  readonly payeeDetailsInput: Locator;
  readonly addButton: Locator;
  readonly addNewPayeeTitle: Locator;
  readonly addPayeeConfirmAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.payeeNameInput = page.getByRole('textbox', {name: 'Payee Name'});
    this.payeeAddressInput = page.getByRole('textbox', {name: 'Payee Address'});
    this.accountInput = page.getByRole('textbox', {name: 'Account'});
    this.payeeDetailsInput = page.getByRole('textbox', {name: 'Payee Details'});
    this.addButton = page.getByRole('button', {name: 'Add'})
    this.addNewPayeeTitle = page.getByRole('heading', {name: 'Who are you paying?'})
    this.addPayeeConfirmAlert = page.locator("#alert_content");
  }

  async createNewPayee(
    payeeName: string,
    payeeAddress: string,
    account: string,
    payeeDetails: string
  ) {
    await this.payeeNameInput.fill(payeeName);
    await this.payeeAddressInput.fill(payeeAddress);
    await this.accountInput.fill(account);
    await this.payeeDetailsInput.fill(payeeDetails);
  }

  async addPayeeButton() {
    await this.addButton.click();
  }

  async assertAddNewPayeeTitle() {
    await expect(this.addNewPayeeTitle).toBeVisible();
  }

  async assertSuccessMessage() {
    await expect(this.addPayeeConfirmAlert).toBeVisible();
    await expect(this.addPayeeConfirmAlert).toContainText("successfully created");
  }
}
