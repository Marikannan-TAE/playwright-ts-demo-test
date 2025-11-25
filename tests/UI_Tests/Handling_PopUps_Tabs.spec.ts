import { test, expect, Page, Locator } from '@playwright/test';

test('Single Window Handling - Follow on Twitter', async ({ page }: { page: Page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/window-popup-modal-demo');
  console.log('Main page URL:', page.url());

  const [newWindow] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByTitle("Follow @Lambdatesting on Twitter").click(),
  ]);
  await newWindow.setViewportSize({ width: 1536, height: 864 });

  console.log('New Window URL:', newWindow.url());
  await newWindow.waitForLoadState('domcontentloaded');

  const signUpButton: Locator = newWindow.getByRole('link', { name: 'Sign up' });
  await signUpButton.click();
  const createAccountButton: Locator = newWindow.getByRole('button', { name: 'Create account' });
  await createAccountButton.click();
  
  const emailInput: Locator= newWindow.locator("input[name='name']");
  await emailInput.fill('test@gmail.com');
  await newWindow.waitForTimeout(3000);
  console.log('Actions completed on Twitter popup.');
  await newWindow.close();
});