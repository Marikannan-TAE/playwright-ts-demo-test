import {test, expect, Locator } from '@playwright/test';
import { HomePage } from '../../Page_Objects/HomePage';
import {SignInPage} from '../../Page_Objects/SignInPage';
import {NavBar} from '../../Page_Objects/Components/NavBar';
import {AccountActivityPage} from '../../Page_Objects/AccountActivityPage';

test.describe('Verify Account Activity Transaction ', () => {
  let homePage: HomePage;
  let signInPage: SignInPage;
  let navBar: NavBar;
  let accountActivityPage: AccountActivityPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signInPage = new SignInPage(page);
    navBar = new NavBar(page);
    accountActivityPage = new AccountActivityPage(page);
  });

  test('Verify transaction details', async ({ page }) => {
    await homePage.visit();
    await homePage.clickOnSignIn();

    await signInPage.login(
      process.env.zeroBankUserName as string,
      process.env.zeroBankPassword as string
    );

    await homePage.accountActivityLink.click();
    await navBar.clickOnTab('Account Activity');

    const savingsCount = await accountActivityPage.getSavingsAccountTransactionCount();
    expect(savingsCount).toBe(3);
  
    const checkingCount = await accountActivityPage.getCheckingAccountTransactionCount();
    expect(checkingCount).toBe(3);

    const loanCount = await accountActivityPage.getLoanAccountTransactionCount();
    expect(loanCount).toBe(2);

    const creditCardCount = await accountActivityPage.getCreditCardAccountTransactionCount();
    expect(creditCardCount).toBe(0);

    const brokerageCount = await accountActivityPage.getBrokerageAccountTransactionCount();
    expect(brokerageCount).toBe(0);
  });
});
