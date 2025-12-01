import { test, expect, Page, Locator } from '@playwright/test';

test('Create Order → Update Order → Verify Order ', async ({ page }: { page: Page }) => {
  await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');

  await page.getByLabel('Username:').fill('Tester');
  await page.getByLabel('Password:').fill('test');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/.*WebOrders\/default\.aspx/);

  await page.getByRole('link', { name: 'Order', exact: true }).click();
  await expect(page).toHaveURL(/.*Process\.aspx/);
  await page.getByRole('combobox', { name: 'Product:*' }).selectOption('FamilyAlbum');
  await page.getByLabel('Quantity:*').fill('5');

  const ExpUserName : string = `Abhi${Math.floor(Math.random() * 1000000)}`;

  await page.getByLabel('Customer name:*').fill(ExpUserName);
  await page.getByLabel('Street:*').fill('BTM');
  await page.getByLabel('City:*').fill('Bangalore');
  await page.getByLabel('Zip:*').fill('560076');
  await page.getByLabel('Visa').check();
  await page.getByLabel('Card Nr:*').fill('1234567891');
  await page.getByLabel('Expire date (mm/yy):*').fill('12/23');
  await page.getByRole('link', { name: 'Process' }).click();

  const newOrderMessage : Locator = page.locator("//strong[normalize-space()='New order has been successfully added.']");
  await expect(newOrderMessage).toContainText('New order has been successfully added');

  await page.getByRole('link', { name: 'View all orders' }).click();
  const createdUserCell : Locator = page.locator(`//td[normalize-space()='${ExpUserName}']`);
  await expect(createdUserCell).toHaveText(ExpUserName);

//  await page.locator(`//td[normalize-space()='${ExpUserName}']//following-sibling::td/input`).click();
  await page.locator('#ctl00_MainContent_orderGrid tr')
            .filter({ hasText: ExpUserName })
            .getByAltText('Edit')
            .click();

  await page.locator('#ctl00_MainContent_fmwOrder_TextBox3').clear();
  await page.locator('#ctl00_MainContent_fmwOrder_TextBox3').fill('Delhi');
  await page.locator('#ctl00_MainContent_fmwOrder_UpdateButton').click();
  await page.waitForTimeout(2000);

//  const updatedCityCell = page.locator(`//td[normalize-space()='${ExpUserName}']//following-sibling::td[text()='Delhi']`);
//  await expect(updatedCityCell).toHaveText('Delhi');

  const updatedCityCell : Locator = page.locator('table#ctl00_MainContent_orderGrid tr')
                              .filter({ has: page.locator('td', { hasText: ExpUserName }) })
                              .locator('td', { hasText: 'Delhi' });
  await expect(updatedCityCell).toHaveText('Delhi');
  await page.waitForTimeout(2000);

  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/Login\.aspx/i);
});
