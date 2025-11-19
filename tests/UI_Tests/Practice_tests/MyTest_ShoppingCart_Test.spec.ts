import { test, expect, Locator } from '@playwright/test';

test('test shopping cart', async ({ page }) => {
  await page.goto('https://demowebshop.tricentis.com/');

  await page.locator('.top-menu [href="/computers"]').hover();

await page.getByRole('link',{name:'Notebooks'}).click();
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByText('The product has been added to').click();
  await expect(page.getByText('The product has been added to')).toBeVisible();
  //await expect(page.getByRole('cell', { name: '1', exact: true })).toBeVisible();

    await page.locator('#topcartlink').click();
    await expect(page.locator('input[class="qty-input"]')).toHaveValue('1');

    await page.locator('input[name="removefromcart"]').check();

    await page.getByRole('button', { name: 'Update shopping cart' }).click();
    await expect(page.getByText('Your Shopping Cart is empty!')).toBeVisible();
});