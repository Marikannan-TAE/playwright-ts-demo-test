import { test, Page } from '@playwright/test';
import { SignInPage } from '../../Page_Objects/SignInPage';
import { HomePage } from '../../Page_Objects/HomePage';


 //dotenv.config();

test.describe('Login / Logout Flow @sanity', () => {
  let signInPage: SignInPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    homePage = new HomePage(page);
    signInPage = new SignInPage(page);
    await homePage.visit();
  });

  test('Negative login should show error', async () => {
    await homePage.clickOnSignIn();
    await signInPage.login('invalid username', 'invalid password');
    await signInPage.assertErrorMessage();
  });

  test('Successful login and logout', async ({ page }: { page: Page }) => {
    await homePage.clickOnSignIn();
    await signInPage.login(
      process.env.zeroBankUserName as string,
      process.env.zeroBankPassword as string
    );

    // Bypass SSL / go directly to Transfer Funds page
    await page.goto('http://zero.webappsecurity.com/bank/transfer-funds.html', { waitUntil: 'networkidle' });
    
    await homePage.logout();
    await homePage.verifyURL('http://zero.webappsecurity.com/index.html');
  });
});
