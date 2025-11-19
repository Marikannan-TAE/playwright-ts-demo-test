import { test, expect, Page } from '@playwright/test';
import mysql from 'mysql2/promise';

async function getLoginDetails(): Promise<{ uname: string; password: string }> {
  const connection = await mysql.createConnection({
    host: 'localhost', 
    user: 'root',            
    password: 'root', 
    database: 'web_orders_db'
  });

  const [rows] = await connection.execute('SELECT uname, password FROM users WHERE id = 1;');
  await connection.end();
  const result = rows as { uname: string; password: string }[];

  if (!result.length) throw new Error('No user found in database!');
  return result[0];
}

test('WebOrder login with DB credentials', async ({ page }: { page: Page }) => {
  const { uname, password } = await getLoginDetails();

  await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx?ReturnUrl=%2fsamples%2fTestComplete11%2fWebOrders%2fDefault.aspx');
  await page.getByRole('textbox', { name: 'Username:' }).fill(uname);
  await page.getByRole('textbox', { name: 'Password:' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('heading', { name: 'List of All Orders' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Web Orders' })).toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
