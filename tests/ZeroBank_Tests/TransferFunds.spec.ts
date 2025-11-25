import { test, BrowserContext, Page } from '@playwright/test';
import { SignInPage } from '../../Page_Objects/SignInPage';
import { HomePage } from '../../Page_Objects/HomePage';
import { NavBar } from '../../Page_Objects/Components/NavBar';
import { TransferFundsPage } from '../../Page_Objects/TransferFundsPage';
import transferFunds from '../TestData/TransferFund.json';

let page: Page;
let context: BrowserContext;
let homePage: HomePage;
let signInPage: SignInPage;
let navBar: NavBar;
let transferFundsPage: TransferFundsPage;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();

  homePage = new HomePage(page);
  signInPage = new SignInPage(page);
  navBar = new NavBar(page);
  transferFundsPage = new TransferFundsPage(page);

  await homePage.visit();
  await homePage.clickOnSignIn();
  await signInPage.login(
    process.env.zeroBankUserName as string,
    process.env.zeroBankPassword as string);

  // Bypass SSL issue / go directly to transfer page
  await page.goto('http://zero.webappsecurity.com/bank/transfer-funds.html');
  await page.waitForLoadState('networkidle');
});

test.afterAll(async () => {
  await context.close();
});

test.describe('Transfer Funds and Make Payment', () => {
  for (const funds of transferFunds) {
    test(`Transfer Funds - ${funds.TC} | From: ${funds.fromAccount} To: ${funds.toAccount}`, async () => {
        try {
          console.log(`Running ${funds.TC}`);
          await navBar.clickOnTab('Transfer Funds');

          await transferFundsPage.makePayment(
            funds.fromAccount, funds.toAccount, funds.amount, funds.description);

          await transferFundsPage.verifyAndSubmit();
          await transferFundsPage.assertSuccessMessage();
          console.log(`${funds.TC} passed`);
        } catch (error) {
          console.error(`${funds.TC} failed`, error);
          await page.screenshot({ path: `error-${funds.TC}.png`, fullPage: true });
          throw error;
        }
      }
    );
  }
});
