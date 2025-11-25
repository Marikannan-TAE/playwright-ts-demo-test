import {test, expect, Locator,Page} from '@playwright/test';
import { faker } from '@faker-js/faker';

test('@sanity WebOrder Form- Delete Order', async ({page}: {page: Page}) => {
    await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
    await page.getByLabel('Username').fill('Tester');
    await page.getByLabel('Password').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('List of All Orders')).toHaveText('List of All Orders');
    await page.getByRole('link',{name: 'Order',exact:true}).click();
    // await expect(page.getByText('Order')).toHaveText('Order');
    await expect(page.locator("//h2[normalize-space()='Order']")).toBeVisible();
    await page.getByLabel('Product').selectOption('FamilyAlbum');
    await page.getByLabel('Quantity').fill('1');
       

    // Generate fake user details
    const ExpUserName: string = faker.person.fullName();
    const street: string = faker.location.streetAddress();
    const city: string = faker.location.city();
    const zip: string = faker.location.zipCode('######'); // 6-digit zip
    const cardNumber: string = faker.finance.creditCardNumber('################');

    await page.getByLabel('Customer name:*').fill(ExpUserName);
    await page.getByLabel('Street:*').fill(street);
    await page.getByLabel('City:*').fill(city);
    await page.getByLabel('Zip:*').fill(zip);
    await page.getByLabel('Visa').check();
    await page.getByLabel('Card Nr:*').fill(cardNumber);
    await page.getByLabel('Expire date (mm/yy):*').fill('12/26');

    await page.getByRole('link', { name: 'Process' }).click();

    const newOrderMsg : Locator = page.locator("//strong[normalize-space()='New order has been successfully added.']");
    await expect(newOrderMsg).toContainText('New order has been successfully added.');
    
    await page.getByRole('link', { name: 'View all orders' }).click();
    const createdUserCell : Locator = page.locator(`//td[normalize-space()='${ExpUserName}']`);
    await expect(createdUserCell).toHaveText(ExpUserName);

    await page.locator('#ctl00_MainContent_orderGrid tr')
            .filter({ hasText: ExpUserName })
            .getByRole('checkbox')
            .click();  

    await page.locator('.btnDeleteSelected').click();
    await page.waitForTimeout(2000);
    await page.waitForSelector('#ctl00_MainContent_orderGrid');
    const table : Locator = page.locator('#ctl00_MainContent_orderGrid');
    await expect(table).not.toContainText(ExpUserName);

    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/Login\.aspx/i);
});