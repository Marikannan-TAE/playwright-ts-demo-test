import { test, expect, Page } from '@playwright/test';

test('Handle Multiple Windows - LambdaTest Example', async ({ page }: { page: Page }) => {
  await page.goto('https://www.lambdatest.com/selenium-playground/window-popup-modal-demo');
  console.log('Main Page URL:', page.url());

  const [popupPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('#followboth'),
  ]);

  await popupPage.waitForLoadState('domcontentloaded');
  const allPages = popupPage.context().pages();

  console.log(`Total opened pages: ${allPages.length}`);
  for(const p of allPages) {
    console.log('Page URL:', p.url());
  }

  let facebookPage: Page | undefined;
  for (const p of allPages) {
    const url = p.url();
    console.log('Opened Page URL:', url);
    if (url.includes('facebook.com/lambdatest')) {
      facebookPage = p;
      break;
    }
  }

  if (facebookPage) {
    const headingText: string | null = await facebookPage.textContent('h1');
    console.log('Facebook Page Heading:', headingText);
    expect(facebookPage.url()).toContain('facebook.com');
  } else {
    throw new Error('Facebook page not found!');
  }
});


test.only('Handle Multiple Windows - OrangeHRM Example', async ({ page }: { page: Page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  console.log('Main Page URL:', page.url());

  const [popupPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.click("a[href='http://www.orangehrm.com']"),
  ]);

  await popupPage.waitForLoadState('networkidle');
  const allPages: any = popupPage.context().pages();

  let orangeHRMPage: Page | undefined;
  for (const p of allPages) {
    const url = p.url();
    console.log('Opened Page URL:', url);
    if (url.includes('orangehrm.com')) {
      orangeHRMPage = p;
      break;
    }
  }

  if (orangeHRMPage) {
    const headingText = await orangeHRMPage.textContent('h1');
    console.log('OrangeHRM Official Page URL:', orangeHRMPage.url());
    console.log('Page Heading:', headingText);
    await orangeHRMPage.close();
  } else {
    throw new Error('OrangeHRM page not found!');
  }
  await page.waitForTimeout(3000);
});












