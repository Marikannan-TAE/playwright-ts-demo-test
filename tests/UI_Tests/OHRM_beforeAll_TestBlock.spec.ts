import { test, expect, BrowserContext, Page } from '@playwright/test';

let context: BrowserContext;
let page: Page;
let ExpUserName: string;
let UpdatedUserName: string;

test.describe('OrangeHRM - Add, Update, Delete User Flow', () => {

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
  });

  test.afterAll(async () => {
    await page.locator('.oxd-userdropdown-tab').click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/.*auth\/login/);
    await context.close();
  });

  test('Add User', async () => {
    await page.getByRole('link', { name: 'Admin' }).click();
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
    await page.locator('.oxd-input-group').filter({ has: page.getByText('Password', { exact: true }) }).locator('input').fill('Admin@123');
    await page.locator('.oxd-input-group').filter({ has: page.getByText('Confirm Password', { exact: true }) }).locator('input').fill('Admin@123');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForSelector(".oxd-table");

    const userRow = page.locator('.oxd-table-row').filter({ hasText: ExpUserName });
    await expect(userRow).toBeVisible();
  });

  test('Update User', async () => {
    await page.getByRole('link', { name: 'Admin' }).click();

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
  });

  test('Delete User', async () => {
    await page.getByRole('link', { name: 'Admin' }).click();
    const rowToDelete = page.locator('.oxd-table-row').filter({ hasText: UpdatedUserName });
    await rowToDelete.locator('i.oxd-icon.bi-trash').click();
    await page.locator("i[class='oxd-icon bi-trash oxd-button-icon']").click();

    await page.waitForSelector(".oxd-table");
    await expect(page.locator('.oxd-table-row', { hasText: UpdatedUserName })).toHaveCount(0);
  });

});
