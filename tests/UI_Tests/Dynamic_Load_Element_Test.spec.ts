import { test, expect, Page } from '@playwright/test';

test.describe('Dynamic Loading Examples', () => {

  test('Dynamic Load Element - Wait for Selector', async ({ page }: { page: Page }) => {
    await page.goto('https://practice.expandtesting.com/dynamic-loading/2');
    await page.getByRole('button', { name: 'Start' }).click();
    await page.waitForSelector("#finish > h4");
    await expect(page.locator("#finish > h4")).toHaveText("Hello World!");
  });

  test.only('Dynamic Load Element - Wait for Page to Load', async ({ page }: { page: Page }) => {
    await page.goto('https://practice.expandtesting.com/dynamic-loading/2');
    await page.getByRole('button', { name: 'Start' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator("#finish > h4")).toHaveText("Hello World!");
  });

  test('Dynamic Load Element - Wait with Specific Timeout', async ({ page }: { page: Page }) => {
    await page.goto('https://practice.expandtesting.com/slow');
    await page.waitForTimeout(10000);
    await expect(page.locator("//strong[normalize-space()='The slow task has finished. Thanks for waiting!']"))
      .toBeVisible();
  });
  
});