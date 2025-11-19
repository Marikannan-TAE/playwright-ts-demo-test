import { test, expect, Page } from '@playwright/test';

test('Login → Create Order → Verify Order → Logout', async ({ page }: { page: Page }) => {
  await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');

  await page.getByLabel('Username:').fill('Tester');
  await page.getByLabel('Password:').fill('test');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/default.aspx');

  await page.getByRole('link', { name: 'Order', exact: true }).click();
  await expect(page).toHaveURL(/Process\.aspx/);
  await page.getByLabel('Product:*' ).selectOption('FamilyAlbum');
  await page.getByLabel('Quantity:*').fill('5');
  await page.getByLabel('Customer name:*').fill('Abhi');
  await page.getByLabel('Street:*').fill('BTM');
  await page.getByLabel('City:*').fill('Bangalore');
  await page.getByLabel('Zip:*').fill('560076');
  await page.getByLabel('Visa').check();
  await page.getByLabel('Card Nr:*').fill('1234567891');
  await page.getByLabel('Expire date (mm/yy):*').fill('12/23');

  await page.getByRole('link', { name: 'Process' }).click();
  await expect(page.locator('strong')).toHaveText('New order has been successfully added.');

  await page.getByRole('link', { name: 'View all orders' }).click();
  await expect(page.getByRole('cell', { name: 'Abhi', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/Login\.aspx/);
});