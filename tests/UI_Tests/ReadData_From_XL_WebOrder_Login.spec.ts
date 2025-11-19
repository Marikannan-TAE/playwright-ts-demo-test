import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { readFile, utils } from 'xlsx';

interface TestRecord {
  uname?: string;   // can be string or undefined
  pass?: string; 
  Exp_Result: string;
}

const workbook = readFile('./tests/TestData/WebOrder_Login All_TC_xl.xlsx');
const sheetNames = workbook.SheetNames;
let records: TestRecord[] = utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

// var records = utils.sheet_to_json(workbook.Sheets["Sheet1"]);
// sheet_name_list = 10 sheets, for condition and loop through one by one

test.describe('WebOrder All Test Scenarios', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
  });

  test('Execute Login Tests from Excel', async () => {
    for (const record of records) {
      console.log(`Running test for user: ${record.uname}`);
      const username = record.uname?.trim() ?? '';  // handle undefined → '' 
      const password = record.pass?.trim() ?? ''; 

      await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
      await page.getByLabel('Username:').fill(username);
      await page.getByLabel('Password:').fill(password);
      await page.getByRole('button', { name: 'Login' }).click();

      if (record.Exp_Result === 'List of All Orders') {
        await expect(page.locator("div[class='content'] h2")).toContainText(record.Exp_Result);
        await page.getByRole('link', { name: 'Logout' }).click();
        await page.waitForLoadState('domcontentloaded');
        console.log(`Login successful for ${record.uname}`);
      } 
      else if (record.Exp_Result === 'Invalid Login or Password.') {
        const errorText = await page.locator('#ctl00_MainContent_status').textContent();
        expect(errorText?.trim()).toBe(record.Exp_Result);
        console.log(`Invalid login verified for ${record.uname}`);
      }
    }
  });

  test.afterAll(async () => {
    await context.close();
  });
});
