import { expect, Locator, Page } from '@playwright/test';

export class ForgetPasswordPage {
  readonly page: Page;
  readonly forgottenPasswordHeader: Locator;
  readonly emailInput: Locator;
  readonly sendPasswordButton: Locator;
  readonly confirmMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.forgottenPasswordHeader = page.getByRole('heading', {name:'Forgotten Password'});
    this.emailInput = page.getByRole('textbox', {name:'Email'});
    this.sendPasswordButton = page.getByRole('button', {name: 'Send Password'});
    this.confirmMessage = page.locator("//div[@class='page-header']/parent::div");
  }

  async assertForgotPasswordTitle() {
    await expect(this.forgottenPasswordHeader).toContainText("Forgotten Password");
  }
  
  async enterEmailAndSendRequest(email: string): Promise<string> {
    await this.emailInput.fill(email);
    await this.sendPasswordButton.click();

    const message : string | null = await this.confirmMessage.textContent();
    if (!message) {
      throw new Error('Confirmation message not found');
    }

    const emailID = message.split(':')[1].trim();
    return emailID;
}

  async assertConfirmationMessage(email: string) {
    await expect(this.confirmMessage).toBeVisible();
    await expect(this.confirmMessage).toContainText(
      `Your password will be sent to the following email: ${email}`
    );
  }
}
