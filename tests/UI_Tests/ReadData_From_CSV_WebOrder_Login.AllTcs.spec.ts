import { readFileSync } from 'fs';
import { join } from 'path';
import { test, expect, Page, Locator } from '@playwright/test';
import { parse } from 'csv-parse/sync';

interface LoginRecord {
  test_case: string;
  uname: string;
  pass: string;
  Exp_Result: string;
}

const csvFilePath = join('./tests/TestData', 'WebOrder_Login All_TC.csv');
const records: LoginRecord[] = parse(readFileSync(csvFilePath, 'utf-8'), {
  columns: true,
  skip_empty_lines: true,
});

test.describe('WebOrder All Test Scenarios (CSV-based)', () => {

  for (const record of records) {
    test(`WebOrder Login: ${record.test_case}`, async ({ page }: { page: Page }) => {

      await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
      await page.getByLabel('Username:').fill(record.uname);
      await page.getByLabel('Password:').fill(record.pass);
      await page.getByRole('button', { name: 'Login' }).click();

      if (record.Exp_Result === 'List of All Orders') {
        await expect(page.locator("div.content h2")).toContainText(record.Exp_Result);
        await page.getByRole('link', { name: 'Logout' }).click();
        await page.waitForLoadState('domcontentloaded');
      } else {
        const errorMessage: Locator = page.locator("span#ctl00_MainContent_status");
        await expect(errorMessage).toHaveText(record.Exp_Result);
      }
    });
  }
});
