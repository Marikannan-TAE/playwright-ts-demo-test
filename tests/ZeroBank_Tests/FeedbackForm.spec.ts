import { test, Page } from '@playwright/test';
import { HomePage } from '../../Page_Objects/HomePage';
import { FeedbackPage } from '../../Page_Objects/FeedbackPage';

test.describe('Feedback Form E2E Functionality', () => {
  let homePage: HomePage;
  let feedbackPage: FeedbackPage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    homePage = new HomePage(page);
    feedbackPage = new FeedbackPage(page);

    await homePage.visit();
    await homePage.clickOnFeedbackLink();
  });

  test('Reset feedback form', async () => {
    await feedbackPage.fillForm(
      'Megha','email@mail.com','Welcome to Zero Bank','Transfer Amount');
    await feedbackPage.resetForm();
    await feedbackPage.assertReset();
  });

  test('Submit feedback form', async () => {
    await feedbackPage.fillForm(
      'Megha','email@mail.com','Subject','My awesome message');
    await feedbackPage.submitForm();
    await feedbackPage.verifyFeedbackSubmission('Megha');
  });
});
