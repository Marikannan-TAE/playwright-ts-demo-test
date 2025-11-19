import {test, expect, Page, Locator} from '@playwright/test';
import { faker } from '@faker-js/faker';

let ExpUserName: string;
let street: string;
let city: string;
let zip: string;
let cardNumber: string;
let page: Page;

   ExpUserName = faker.person.fullName();
     street = faker.location.streetAddress();
     city= faker.location.city();
     zip= faker.location.zipCode('######'); // 6-digit zip
     cardNumber = faker.finance.creditCardNumber('################');

test.describe('Web Order Flow',()=>{

    test.beforeAll('Login Test Case',async ({browser}) => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
        await page.getByLabel('Username').fill('Tester');
        await page.getByLabel('Password').fill('test');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('List of All Orders')).toHaveText('List of All Orders');
    })

    test('Create Order Test Case',async () => {
    await page.getByRole('link',{name: 'Order',exact:true}).click();
    await expect(page.locator("//h2[normalize-space()='Order']")).toBeVisible();
    await page.getByLabel('Product').selectOption('FamilyAlbum');
    await page.getByLabel('Quantity').fill('1');
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
    await page.waitForTimeout(3000);
    })

    test('Update Order Test case',async () => {
    await page.getByRole('link', { name: 'View all orders' }).click();
    const createdUserCell : Locator = page.locator(`//td[normalize-space()='${ExpUserName}']`);
    await expect(createdUserCell).toHaveText(ExpUserName);

    await page.locator('#ctl00_MainContent_orderGrid tr')
            .filter({ hasText: ExpUserName })
            .getByAltText('Edit')
            .click();

    await page.locator('#ctl00_MainContent_fmwOrder_TextBox3').clear();
    await page.locator('#ctl00_MainContent_fmwOrder_TextBox3').fill('Delhi');
    await page.getByRole('link',{name:'Update'}).click();
    await page.waitForTimeout(2000);       

    const updatedCityCell : Locator = page.locator('table#ctl00_MainContent_orderGrid tr')
                              .filter({ has: page.locator('td', { hasText: ExpUserName }) })
                              .locator('td', { hasText: 'Delhi' });
    await expect(updatedCityCell).toHaveText('Delhi');
    await page.waitForTimeout(2000);
    })

    test('Delete Order Test Case',async () => {
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
    })

    test.afterAll('Logout Test Case',async () => {
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/Login\.aspx/i);
    })
})
