import { faker } from '@faker-js/faker';
import { test, expect, Page } from '@playwright/test';

//   await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
//   await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
//   await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
//   await page.getByRole('button', { name: 'Login' }).click();

//   // Generate fake user details
  
//   const UserName: string = faker.person.fullName();
//   const passWord: string = faker.internet.password();

//   await page.getByRole('link', { name: 'Admin' }).click();
//   await page.getByRole('button', { name: ' Add' }).click();
//   await page.locator('div').filter({ hasText: /^-- Select --$/ }).nth(2).click();
//   await page.getByRole('option', { name: 'Admin' }).click();
//   await page.getByText('-- Select --').click();
//   await page.getByRole('option', { name: 'Enabled' }).click();
//   const uName= page.locator("//form[@class='oxd-form']//div[contains(@class,'oxd-input-group')]");
//   await page.getByRole('textbox', { name: 'Type for hints...' }).click();
//   await page.getByRole('textbox', { name: 'Type for hints...' }).fill('Te');
//   await page.getByText('Test 3').click();
//   await uName.click();
//   await uName.fill(UserName);
//   await page.getByRole('textbox').nth(3).click();
//   await page.getByRole('textbox').nth(3).fill('Test@123');
//   await page.getByRole('textbox').nth(4).click();
//   await page.getByRole('textbox').nth(4).fill('Test@123');
//   await page.getByRole('button', { name: 'Save' }).click();
//   await expect(page.getByText(UserName)).toBeVisible();
//   console.log(`User created: ${UserName}`);

test('OrangeHRM - Add User and Verify Update', async ({ page }: { page: Page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  const UserName: string = faker.person.fullName();

  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add' }).click();

  await page.locator('.oxd-input-group').filter({ hasText: 'User Role' }).locator('i').click();
  await page.getByRole('option', { name: 'Admin' }).click();
  await page.locator('.oxd-input-group').filter({ hasText: 'Status' }).locator('i').click();  
  await page.getByRole('option', { name: 'Enabled' }).click();

  await page.getByPlaceholder('Type for hints...').fill('Te');
  await page.waitForTimeout(2000);
 await page.locator('.oxd-autocomplete-option').nth(1).click();

  const ExpUserName = `Auto${Math.floor(Math.random() * 100000)}`;
  await page.locator('.oxd-input-group').filter({ hasText: 'Username' }).locator('input').fill(ExpUserName);
  await page.locator('.oxd-input-group').filter({ has: page.getByText('Password', {exact: true}) }).locator('input').fill('Admin@123');
  await page.locator('.oxd-input-group').filter({ has: page.getByText('Confirm Password', {exact: true}) }).locator('input').fill('Admin@123');
  await page.getByRole('button', { name: 'Save' }).click();
  
   const SuccessMsg = page.locator('.oxd-icon.bi-check2');
   SuccessMsg.isVisible();
   console.log(SuccessMsg.isVisible());

//    await page.waitForSelector(".oxd-table");
//   const userRow = page.locator('.oxd-table-row').filter({ hasText: ExpUserName });
//   await expect(userRow).toBeVisible();
//   console.log(`User created: ${ExpUserName}`);

   await page.locator('.oxd-userdropdown-tab').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/.*auth\/login/);
});


