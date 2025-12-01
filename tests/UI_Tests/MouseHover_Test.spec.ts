import { test, expect, Page, Locator } from '@playwright/test';
import { clear } from 'console';

test('Flipkart Login Page Mouse Hover ', async ({ page }: { page: Page }) => {
  await page.goto('https://www.flipkart.com/');
  await page.waitForLoadState('networkidle'); 

  const loginMenu: Locator = page.locator("//span[normalize-space()='Login']");
  await loginMenu.hover();

  const myProfileOption: Locator = page.locator("//li[normalize-space()='My Profile']");
  await myProfileOption.click();

  const otpButton: Locator = page.locator("//button[normalize-space()='Request OTP']");
  await expect(otpButton).toBeVisible();
  await expect(otpButton).toHaveText('Request OTP');
  await page.waitForTimeout(3000);
});