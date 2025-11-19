import { test, expect, Page } from '@playwright/test';

const testParameters: string[] = ['MyMoney', 'FamilyAlbum', 'ScreenSaver'];

for (const product of testParameters) {
  test(`Parameterize Playwright test for product: ${product}`, async ({ page }: { page: Page }) => {
    await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
    await page.getByLabel('Username:').fill('Tester');
    await page.getByLabel('Password:').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/default.aspx');
    await page.getByRole('link', { name: 'View all products' }).click();

    // const productText: string | null = await page
    //   .locator(`//td[normalize-space()='${product}']/following-sibling::td[1]`).textContent();

    const productText: string | null  = await page.locator('.ProductsTable tr')
                   .filter({has: page.locator('td', { hasText: product })})
                   .locator('td').nth(1).textContent();

    if (!productText) {
      throw new Error(`Product ${product} not found on 'View all products' page`);
    }

    const productValue: string = productText.replace('$', '').trim();
    console.log(`Expected product value for ${product}: ${productValue}`);

    await page.getByRole('link', { name: 'Order', exact: true }).click();
    await page.getByLabel('Product:*').selectOption(product);
    const newProductValue: string = await page.locator('#ctl00_MainContent_fmwOrder_txtUnitPrice').inputValue();
    console.log(`Actual product value for ${product}: ${newProductValue}`);

    expect(newProductValue, `Price mismatch for ${product}`).toBe(productValue);
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/Login\.aspx/);
  });
}
