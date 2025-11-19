import {test, expect, Page} from '@playwright/test';

test('OrangeHRM - Search User and Verify Update', async ({page}: {page: Page}) => {
await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');  //await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByPlaceholder('username').fill('Admin');
await page.getByPlaceholder('password').fill('admin123');
await page.getByRole('button', { name: 'Login' }).click();
await page.getByRole('link', { name: 'Admin' }).click();

// await page.locator('.oxd-input-group__label-wrapper')
//   .filter({ hasText: 'Username' })
//   .getByRole('textbox', { class: '.oxd-input' })
//   .fill('Admin');
await page.locator('.oxd-grid-4').filter({ hasText: 'Username' }).locator('.oxd-input').fill('Admin');
await page.waitForTimeout(2000);
await page.locator('.oxd-input-group').filter({hasText: 'User Role'}).locator('i').getByText('Admin').click();
await page.waitForTimeout(3000);
});