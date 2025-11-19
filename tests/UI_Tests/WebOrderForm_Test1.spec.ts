import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.getByRole('link', { name: 'My Info' }).click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('button', { name: 'Timesheets' }).click();
  await expect(page.getByText(') Records Found')).toBeVisible();
  await page.getByRole('textbox', { name: 'Search' }).fill('PIM');
  await page.getByRole('link', { name: 'PIM' }).click();
  await expect(page.getByRole('heading', { name: 'PIM' })).toBeVisible();
  await page.getByRole('link', { name: 'Reports' }).click();
  await page.getByPlaceholder('Type for hints...').fill('Report');
  await page.getByRole('option').filter({ hasText: 'PIM Sample Report' }).click();
  await page.getByAltText('profile picture').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});