import { test, expect, Page, Locator } from '@playwright/test';

test('Create Order → Update Order → Verify Order → Delete Order', async ({ page }: { page: Page }) => {
  await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');

  await page.getByLabel('Username:').fill('Tester');
  await page.getByLabel('Password:').fill('test');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/.*WebOrders\/default\.aspx/);

  await page.getByRole('link', { name: 'Order', exact: true }).click();
  await expect(page).toHaveURL(/.*Process\.aspx/);

  await page.getByRole('combobox', { name: 'Product:*' }).selectOption('FamilyAlbum');
  await page.getByLabel('Quantity:*').fill('5');

  const ExpUserName : string = `MkTest${Math.floor(Math.random() * 1000000)}`;

  await page.getByLabel('Customer name:*').fill(ExpUserName);
  await page.getByLabel('Street:*').fill('MKM');
  await page.getByLabel('City:*').fill('Chennai');
  await page.getByLabel('Zip:*').fill('600026');
  await page.getByLabel('Visa').check();
  await page.getByLabel('Card Nr:*').fill('1234567891');
  await page.getByLabel('Expire date (mm/yy):*').fill('12/29');
  await page.getByRole('link', { name: 'Process' }).click();

  const newOrderMessage : Locator = page.locator("//strong[normalize-space()='New order has been successfully added.']");
  await expect(newOrderMessage).toHaveText('New order has been successfully added.');

  await page.getByRole('link', { name: 'View all orders' }).click();
  const createdUserCell : Locator = page.locator(`//td[normalize-space()='${ExpUserName}']`);
  await expect(createdUserCell).toHaveText(ExpUserName);

  await page.locator('#ctl00_MainContent_orderGrid tr')
            .filter({ hasText: ExpUserName })
            .locator('input[alt="Edit"]')
            .click();
  await page.locator('#ctl00_MainContent_fmwOrder_TextBox3').clear();
  await page.locator('#ctl00_MainContent_fmwOrder_TextBox3').fill('Chennai');
  await page.locator('#ctl00_MainContent_fmwOrder_UpdateButton').click();

  const updatedCityCell : Locator = page.locator('table#ctl00_MainContent_orderGrid tr')
                              .filter({ has: page.locator('td', { hasText: ExpUserName }) })
                              .locator('td', { hasText: 'Chennai' });
  await expect(updatedCityCell).toHaveText('Chennai');
  await page.waitForTimeout(3000);

  const userRow : Locator = page.locator('table#ctl00_MainContent_orderGrid tr')
                      .filter({ has: page.locator('td', { hasText: ExpUserName }) });
  await userRow.locator('input[type="checkbox"]').click();
  await page.locator('.btnDeleteSelected').click();
  await page.waitForSelector('#ctl00_MainContent_orderGrid');
  const table : Locator = page.locator('#ctl00_MainContent_orderGrid');
  await expect(table).not.toContainText(ExpUserName);

  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/Login\.aspx/i);
});
