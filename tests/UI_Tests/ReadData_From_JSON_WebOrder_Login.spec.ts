import { readFileSync } from 'fs';
import { test, expect, Page, Locator } from '@playwright/test';

interface UserRecord {
  test_case: string;
  name: string;
  password: string;
  exp_result: string;
}

const rawData : string = readFileSync('./tests/TestData/WebOrder_Login.json', 'utf-8');
const users: UserRecord[] = JSON.parse(rawData);

for (const record of users) {
  test(`WebOrder Login: ${record.test_case}`, async ({ page }: { page: Page }) => {
    await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
    
    await page.getByLabel('Username:').fill(record.name);
    await page.getByLabel('Password:').fill(record.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/default.aspx');
    await expect(page.locator('h2')).toContainText(record.exp_result);

    await page.getByRole('link', { name: 'Logout' }).click();
    const loginButton : Locator = page.locator('#ctl00_MainContent_login_button');
    await expect(loginButton).toBeVisible();
  });
}
