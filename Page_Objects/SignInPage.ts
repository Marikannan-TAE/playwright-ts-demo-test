import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignInPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly keepMeSignedIn: Locator;
  readonly forgetPasswordLink: Locator;
  readonly loginTitle: Locator;
  readonly questionMarkIcon: Locator;
  readonly termsOfUseLink: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByLabel('Login'); 
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', {name: 'Sign in'});
    this.errorMessage = page.locator('.alert-error');
    this.keepMeSignedIn = page.locator('#user_remember_me');
    this.forgetPasswordLink = page.locator("a[href='/forgot-password.html']");
    this.loginTitle = page.getByRole('heading', {name: 'Log in to ZeroBank', level: 3});
    this.questionMarkIcon = page.locator('.icon-question-sign');
    this.termsOfUseLink = page.locator("#terms_of_use_link")
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    //await this.page.getByRole('button', {name: 'Back to safety'}).click().catch(() => {});
       // To bypass the SSL page
        await this.page.goto('http://zero.webappsecurity.com/bank/transfer-funds.html', { waitUntil: 'networkidle' });
  }

  async loginWithSignedIn(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.keepMeSignedIn.check();
    await this.submitButton.click();
  }

  async assertLoginTitleText() {
    await expect(this.loginTitle).toHaveText('Log in to ZeroBank');
  }

  async assertErrorMessage() {
    await expect(this.errorMessage).toContainText('Login and/or password are wrong');
  }

  async clickOnForgetPasswordLink() {
    await this.forgetPasswordLink.click();
  }
}
