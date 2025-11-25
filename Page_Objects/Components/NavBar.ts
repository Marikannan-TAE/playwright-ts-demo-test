import { Page, Locator } from '@playwright/test';

export class NavBar {
  private readonly page: Page;
  private readonly accountSummary: Locator;
  private readonly accountActivity: Locator;
  private readonly transferFunds: Locator;
  private readonly payBills: Locator;
  private readonly myMoneyMap: Locator;
  private readonly onlineStatements: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountSummary = page.getByRole('link', { name: 'Account Summary' });
    this.accountActivity = page.getByRole('link', { name: 'Account Activity' });
    this.transferFunds = page.getByRole('link', { name: 'Transfer Funds' });
    this.payBills = page.getByRole('link', { name: 'Pay Bills' });
    this.myMoneyMap = page.getByRole('link', { name: 'My Money Map' });
    this.onlineStatements = page.getByRole('link', { name: 'Online Statements' });
  }

  async clickOnTab(tabName: string): Promise<void> {
    switch (tabName) {
      case 'Account Summary':
        await this.accountSummary.click();
        break;
      case 'Account Activity':
        await this.accountActivity.click();
        break;
      case 'Transfer Funds':
        await this.transferFunds.click();
        break;
      case 'Pay Bills':
        await this.payBills.click();
        break;
      case 'My Money Map':
        await this.myMoneyMap.click();
        break;
      case 'Online Statements':
        await this.onlineStatements.click();
        break;
      default:
        throw new Error(`This tab does not exist: ${tabName}`);
    }
  }
}
