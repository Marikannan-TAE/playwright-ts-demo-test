import { test, expect, Page, Locator, FrameLocator } from '@playwright/test';

test('Select a custom date in Date Picker', async ({ page }: { page: Page }) => {
  await page.goto('https://jqueryui.com/datepicker/');
  const frame: FrameLocator = page.frameLocator('.demo-frame');
  const dateInput: Locator = frame.locator('#datepicker');
  await dateInput.click();

  const today: Locator = frame.locator('.ui-datepicker-today > a');
  await today.click();
  await page.waitForTimeout(2000);
  await dateInput.click();

  const currentDateValue: string | null = await today.getAttribute('data-date');
  if (!currentDateValue) throw new Error('Unable to fetch today\'s date');

  const customDate: number = parseInt(currentDateValue) + 3;
  const customDateSelector = `a[data-date='${customDate}']`;

  const customDateLocator: Locator = frame.locator(customDateSelector);
  await customDateLocator.click();

  await page.waitForTimeout(2000);
  const selectedValue = await dateInput.inputValue();
  console.log(`Selected date value: ${selectedValue}`);
  expect(selectedValue).not.toBe('');
});