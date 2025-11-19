import { test, expect, Page, Locator } from '@playwright/test';

test.describe('Visual Regression Testing Example', () => {
  
  test('Full Page Snapshot', async ({ page }: { page: Page }) => {
   // await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.waitForTimeout(3000);
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot('OrangeHRM_Login_Page.png');
  });

  test('Single Element Snapshot', async ({ page }: { page: Page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.waitForTimeout(3000);
    const loginButton: Locator = page.getByRole('button', { name: 'Login' });
    const buttonImage = await loginButton.screenshot();
    expect(buttonImage).toMatchSnapshot('LoginButton.png');
  });
});




