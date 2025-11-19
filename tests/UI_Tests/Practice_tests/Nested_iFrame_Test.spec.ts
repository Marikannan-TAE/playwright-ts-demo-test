import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://demoqa.com/nestedframes');

  //page.locator('#frame1').contentFrame().locator('iframe').contentFrame().getByText('Child Iframe').click();
  
const parentFrame = await page.frameLocator('#frame1');

const childFrame = await parentFrame.frameLocator('iframe');

// Get text inside the child frame
const text = await childFrame.locator('text=Child Iframe').innerText();

await page.waitForTimeout(2000);
console.log('Child frame text:', text);
  
});