import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly searchBox: Locator;
  readonly linkFeedback: Locator;
  readonly linkHome: Locator;
  readonly linkOnlineBanking: Locator;
  readonly usernameDropdown: Locator;
  readonly logoutButton: Locator;
  readonly accountActivityLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInButton =  page.locator('#signin_button');
    this.searchBox = page.getByPlaceholder('Search');
    this.linkHome = page.getByText('Home');
    this.linkOnlineBanking = page.locator("//strong[normalize-space()='Online Banking']");
    this.linkFeedback = page.locator('#feedback');
    this.usernameDropdown = page.getByText('username');
    this.logoutButton = page.locator('#logout_link');
    this.accountActivityLink = page.locator('#account_activity_link');
  }

  /* The exclamation mark tells the TypeScript compiler only:
  Trust me — this variable is not undefined or null. Don’t complain */
  async visit() {
    await this.page.goto(process.env.urlZeroBank!);
  }

  async clickOnSignIn() {
    await this.signInButton.click();
  }

  async clickOnFeedbackLink() {
    await this.linkFeedback.click();
  }

  async clickOnOnlineBankingLink() {
    await this.linkOnlineBanking.click();
  }

  async searchFor(phrase: string) {
    await this.searchBox.fill(phrase);
    await this.page.keyboard.press('Enter');
  }

  async logout() {
    await this.usernameDropdown.click({ timeout: 30000 });
    await this.logoutButton.click();
  }

  async verifyURL(url: string) {
    await this.page.waitForURL(url);
    await expect(this.page).toHaveURL(url);
  }
}
