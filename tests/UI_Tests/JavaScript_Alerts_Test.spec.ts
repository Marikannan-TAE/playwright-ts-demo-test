import { test, expect, Page, Dialog } from '@playwright/test';

test.describe('Handle JavaScript Alert, Confirm, and Prompt in Playwright', () => {

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  });


  test('Handle JS Alert - Validate Alert Text and Click OK', async ({ page }: { page: Page }) => {
    page.once('dialog', async (dialog: Dialog) => {
      expect(dialog.message()).toBe('I am a JS Alert');
      await dialog.accept();
    });

    await page.locator('text=Click for JS Alert').click();
    await page.waitForTimeout(2000);
    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
  });

 
  test('Handle JS Confirm - Validate Confirm Text and Click OK', async ({ page }: { page: Page }) => {
    page.once('dialog', async (dialog: Dialog) => {
      expect(dialog.message()).toBe('I am a JS Confirm');
      await dialog.accept(); 
    });

    await page.locator('text=Click for JS Confirm').click();
    await page.waitForTimeout(2000);
    await expect(page.locator('#result')).toHaveText('You clicked: Ok');
  });

 
  test('Handle JS Confirm - Validate Confirm Text and Click Cancel', async ({ page }: { page: Page }) => {
    page.once('dialog', async (dialog: Dialog) => {
      expect(dialog.message()).toBe('I am a JS Confirm');
      await dialog.dismiss();
    });

    await page.locator('text=Click for JS Confirm').click();
    await page.waitForTimeout(2000);
    await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
  });


  test('Handle JS Prompt - Input text and Click OK', async ({ page }: { page: Page }) => {
    page.once('dialog', async (dialog: Dialog) => {
      expect(dialog.message()).toBe('I am a JS prompt');
      await page.waitForTimeout(2000);
      await dialog.accept('Abhi');
    });

    await page.locator('text=Click for JS Prompt').click();
    await expect(page.locator('#result')).toHaveText('You entered: Abhi');
  });

});