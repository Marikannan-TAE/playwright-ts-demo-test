import { test, expect, Locator, Page, BrowserContext } from '@playwright/test';

let page: Page
let context: BrowserContext

test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    context = await browser.newContext();
    await page.goto("https://selectorshub.com/iframe-in-shadow-dom/");
});

test('Shadow DOM Test1 flow Page--> DOM  --> Shadow DOM --> elements', async () => {
    //Page--> DOM --> Shadow DOM --> elements
    await page.locator("#userName #kils").click();
    await page.locator("#userName #kils").fill("Type Script");
});


test('Shadow DOM Test2 Page --> DOM --> iFrame --> Shadow DOM --> elements', async () => {
    //Page --> DOM --> iFrame --> Shadow DOM --> elements
    //contentFrame() is used to access an element which is inside the <iframe>
    await page.locator('#pact1').contentFrame().getByPlaceholder('Current Crush Name').fill('Playwright');
    await page.waitForTimeout(2000);
});