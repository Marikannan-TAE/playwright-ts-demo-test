import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://sit2.semarchy.eph.elsevier.net/semarchy/login.do');
  await page.getByRole('textbox', { name: 'User name' }).fill('sureshkumard');
  await page.getByRole('textbox', { name: 'Password' }).fill('Dinukavi2137');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('link', { name: 'EPH V5 Business' }).click();
  await page.getByRole('textbox', { name: 'Search text' }).click();
  await page.getByRole('textbox', { name: 'Search text' }).fill('Suresh');
  await page.getByRole('button', { name: 'Search for' }).click();
  await page.locator('#select_option_33 > .md-container').click();
  await page.locator('md-backdrop').click();
  await page.locator('#sem-shell__ui-view').getByRole('button', { name: 'Search', exact: true }).click();
  await page.getByRole('button', { name: 'Show more results' }).click();
 await page.getByText('Dinesh Sureshkumar').click();
const container = page.locator('.ag-pinned-left-cols-container');  
await container.evaluate(el => el.scrollTop = el.scrollHeight);
// Then locate and interact with the cell
const cell = page.locator("card-cell-renderer[aria-label='Dinesh SureshKumar']");
await cell.scrollIntoViewIfNeeded();
await page.waitForTimeout(2000);
cell.hover();
await page.waitForTimeout(2000);
await cell.click();
  await page.waitForTimeout(2000);
});