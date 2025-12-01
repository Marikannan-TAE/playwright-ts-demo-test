import { test, expect } from '@playwright/test';
import path from 'path';

test('Open Shadow DOM text', async ({ page }) => {
   await page.goto('https://the-internet.herokuapp.com/shadowdom')
   await page.waitForLoadState()
   const textLocator = page.locator('div#content li'); //page.locator('pierce=li'); :shadow
   const items = await textLocator.allTextContents();
   console.log("Shadow DOM Texts:", items);
   await page.waitForTimeout(5000)
})

test('Cannot access closed shadow DOM text', async ({ page }) => {
   const filePath = path.resolve('./tests/Testdata/Shadow_DOM.html');
   const fileUrl = `file://${filePath}`;
   await page.goto(fileUrl, { waitUntil: 'load' });
   await page.waitForTimeout(2000);

   const shadowHost = page.locator('secret-box');
   await expect(shadowHost).toBeVisible();
   const items = await shadowHost.allTextContents();
   console.log("Shadow DOM Texts:", items);

   const textLocator = page.locator('secret-box p');
   await expect(textLocator).not.toBeVisible();
   await page.waitForTimeout(5000)
});
