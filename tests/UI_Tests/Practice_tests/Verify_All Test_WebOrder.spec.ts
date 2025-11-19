import { readFileSync } from 'fs';
import { test, expect, Page } from '@playwright/test';

interface OrderRecord {
  TestCaseID: string;
  Product: string;
  Quantity: string;
  Customer: string;
  Street: string;
  City: string;
  Zip: string;
  Card: string;
  Expire: string;
  Result: string;
}

const rawData: string = readFileSync('./tests/TestData/create_order_all_scenario.json', 'utf-8');
const orderTestData: OrderRecord[] = JSON.parse(rawData);

test.describe('WebOrder Form Validation Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login once before each test
    await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
    await page.getByLabel('Username:').fill('Tester');
    await page.getByLabel('Password:').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('List of All Orders')).toHaveText('List of All Orders');
    await page.getByRole('link', { name: 'Order', exact: true }).click();
  });

  
  for (const record of orderTestData) {
    test(`${record.TestCaseID}: Validate order form with Product ${record.Product}`, async ({ page }: { page: Page }) => {
      console.log(`Running ${record.TestCaseID}...`);
      
      // Fill order form with  parametrized test data from 'create_order_all_scenario.json'
      await page.getByLabel('Product').selectOption(record.Product);
      await page.getByLabel('Quantity').fill(record.Quantity);
      await page.getByLabel('Customer name:*').fill(record.Customer);
      await page.getByLabel('Street:*').fill(record.Street);
      await page.getByLabel('City:*').fill(record.City);
      await page.getByLabel('Zip:*').fill(record.Zip);
      await page.getByLabel('Visa').check();
      await page.getByLabel('Card Nr:*').fill(record.Card);
      await page.getByLabel('Expire date (mm/yy):*').fill(record.Expire);
      await page.waitForTimeout(3000);
      // Submitting order
      await page.getByRole('link', { name: 'Process' }).click();
      
      // Print the result message from create_order_all_scenario.json
      console.log(`${record.TestCaseID}: ${record.Result.trim()}`);
    });
  }

  test.afterEach(async ({ page }) => {
    // Logout after each test
    await page.getByRole('link', { name: 'Logout' }).click();
  });
});
