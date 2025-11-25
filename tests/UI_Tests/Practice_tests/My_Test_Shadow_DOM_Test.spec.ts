import {test,Locator, expect, Page} from '@playwright/test';

test('@smoke My Test Shadow DOM Test', async ({page}: {page: Page}) => {
  await page.goto('https://books-pwakit.appspot.com/');
  await page.locator('book-app[apptitle="BOOKS"] #input').click();
  await page.locator('book-app[apptitle="BOOKS"] #input').fill('JavaScript');

});