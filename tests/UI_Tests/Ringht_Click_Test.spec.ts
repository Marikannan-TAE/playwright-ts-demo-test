import { test, expect, Page, Locator } from '@playwright/test';

test('Right Click Context Menu Example', async ({ page }: { page: Page }) => {
  await page.goto('https://swisnl.github.io/jQuery-contextMenu/demo.html');
  await page.waitForLoadState('domcontentloaded');

  const rightClickButton = page.locator("//span[text()='right click me']");
  await rightClickButton.click({ button: 'right' });

  const copyOption: Locator = page.locator("//span[text()='Copy']");
  await expect(copyOption).toBeVisible();
  await page.waitForTimeout(5000);
});