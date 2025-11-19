import { test, expect, BrowserContext, Page } from '@playwright/test';

let context: BrowserContext;
let page: Page;
let ExpUserName: string;
let UpdatedUserName: string;

test.describe.serial('OrangeHRM Add / Update / Delete (reuse storageState)', () => {
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    await page.locator("span:has-text('Admin')").click();
    await page.waitForSelector('.orangehrm-header-container');
    // save cookies + storage
    await context.storageState({ path: 'storageState.json' });
    await context.close();
});

  test('Add User', async ({browser}) => {
    const context = await browser.newContext({ storageState: 'storageState.json' });
    const page = await context.newPage();
    // navigate to app so saved cookies/storage are applied
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers');
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: 'Add' }).click();
    await page.locator('.oxd-input-group').filter({ hasText: 'User Role' }).locator('i').click();
    await page.getByRole('option', { name: 'Admin' }).click();
    await page.locator('.oxd-input-group').filter({ hasText: 'Status' }).locator('i').click();  
    await page.getByRole('option', { name: 'Enabled' }).click();

    await page.getByPlaceholder('Type for hints...').fill('a');
    await page.waitForTimeout(2000);
    await page.locator('.oxd-autocomplete-option').nth(1).click();

    ExpUserName = `Abhi${Math.floor(Math.random() * 1000)}`;
    await page.locator('.oxd-input-group').filter({ hasText: 'Username' }).locator('input').fill(ExpUserName);
    await page.locator('.oxd-input-group').filter({ has: page.getByText('Password', {exact: true}) }).locator('input').fill('Admin@123');
    await page.locator('.oxd-input-group').filter({ has: page.getByText('Confirm Password', {exact: true}) }).locator('input').fill('Admin@123');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector(".oxd-table");

    const userRow = page.locator('.oxd-table-row').filter({ hasText: ExpUserName });
    await expect(userRow).toBeVisible();
    await context.close();
  });

  test('Update User', async ({browser}) => {
    const context = await browser.newContext({ storageState: 'storageState.json' });
    const page = await context.newPage();
    // navigate to app so saved cookies/storage are applied
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers');
    await page.waitForLoadState('networkidle') 

    const userRow = page.locator('.oxd-table-row').filter({ hasText: ExpUserName });
    await userRow.locator('i.oxd-icon.bi-pencil-fill').click();
    await page.locator('.oxd-input-group').filter({ hasText: 'User Role' }).locator('i').click();
    await page.getByRole('option', { name: 'ESS' }).click();
    UpdatedUserName = `Abhi${Math.floor(Math.random() * 100000)}`;
    await page.locator('.oxd-input-group').filter({ hasText: 'Username' }).locator('input').fill(UpdatedUserName);
    await page.getByRole('button', { name: 'Save' }).click();

    await page.waitForSelector('.oxd-table-row');
    const updatedRow = page.locator('.oxd-table-row').filter({ hasText: UpdatedUserName });
    await expect(updatedRow).toContainText('ESS');
    await context.close();
  });

  test('Delete User', async ({browser}) => {
    const context = await browser.newContext({ storageState: 'storageState.json' });
    const page = await context.newPage();

    // navigate to app so saved cookies/storage are applied
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers');
    await page.waitForLoadState('networkidle')

    await page.getByRole('link', { name: 'Admin' }).click();
    const rowToDelete = page.locator('.oxd-table-row').filter({ hasText: UpdatedUserName });
    await rowToDelete.locator('i.oxd-icon.bi-trash').click();
    await page.locator("i[class='oxd-icon bi-trash oxd-button-icon']").click();

    await page.waitForSelector(".oxd-table");
    await expect(page.locator('.oxd-table-row', { hasText: UpdatedUserName })).toHaveCount(0);
    await context.close();
  });
});
