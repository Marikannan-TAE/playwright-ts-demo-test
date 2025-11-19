import { test, expect, Page, FrameLocator } from '@playwright/test';

test('HDFC NetBanking Login Frame Handling @smoke', async ({ page }: { page: Page }) => {
  await page.goto('https://netbanking.hdfcbank.com/netbanking/');
  // await page.fill('input[name="fldLoginUserId"]', '1000');
  // await page.click('text=CONTINUE');

//   await page.frame({name: 'login_page'}).locator('input[name="fldLoginUserId"]').fill('1000');
//   await page.frameLocator() -- this is another way to identify frame

  const loginFrame: FrameLocator = page.frameLocator('frame[name="login_page"]');
  await loginFrame.locator('input[name="fldLoginUserId"]').fill('1000');
  await loginFrame.getByRole('link', { name: 'CONTINUE' }).click();

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL('https://netportal.hdfcbank.com/nb-login/login.jsp');
  await page.waitForTimeout(2000); // optional for observation
});