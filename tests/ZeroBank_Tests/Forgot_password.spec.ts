import { test, Page } from '@playwright/test';
import { HomePage } from '../../Page_Objects/HomePage';
import { SignInPage } from '../../Page_Objects/SignInPage';
import { ForgetPasswordPage } from '../../Page_Objects/ForgetPasswordPage';

test.describe('Forget Password Flow', () => {
  let signInPage: SignInPage;
  let homePage: HomePage;
  let forgotPasswordPage: ForgetPasswordPage;

  const emailId: string = 'abc@gmail.com';

  test.beforeEach(async ({ page }: { page: Page }) => {
    signInPage = new SignInPage(page);
    homePage = new HomePage(page);
    forgotPasswordPage = new ForgetPasswordPage(page);

    await homePage.visit();
    await homePage.clickOnSignIn();
  });

  test('Send Request for Forgotten password', async () => {
    await signInPage.clickOnForgetPasswordLink();
    await forgotPasswordPage.assertForgotPasswordTitle();

    const enteredEmail: string = await forgotPasswordPage.enterEmailAndSendRequest(emailId);
    await forgotPasswordPage.assertConfirmationMessage(enteredEmail);
  });
});
