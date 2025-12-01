import { readFileSync } from 'fs';
import { test, expect, Page } from '@playwright/test';

type UserRecord  = {
  test_case: string;
  uname: string;
  password: string;
  exp_res: string;
}

const rawData: string = readFileSync('./tests/TestData/WebOrder_Login All_Tcs.json', 'utf-8');
const users: UserRecord[] = JSON.parse(rawData);

test.describe('WebOrder Login Functionality ', () => {
  test('Validate multiple login scenarios from JSON', async ({ page }: { page: Page }) => {
    for (const record of users) {
      console.log(`Running ${record.test_case}...`);

      await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
      await page.getByLabel('Username:').fill(record.uname);
      await page.getByLabel('Password:').fill(record.password);
      await page.getByRole('button', { name: 'Login' }).click();

      if (record.exp_res === 'Logout') {
        await expect(page.locator('a#ctl00_logout')).toHaveText(record.exp_res);
        await page.getByRole('link', { name: 'Logout' }).click();
        await page.waitForLoadState('domcontentloaded');
        console.log(`${record.test_case}: Login successful and logout done.`);
      } else {
        await expect(page.locator('span#ctl00_MainContent_status')).toHaveText(record.exp_res);
        console.log(`${record.test_case}: Error message verified.`);
      }
    }
  });

});
