import { test, expect, Page, Locator } from '@playwright/test';

test('@smoke File Upload', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/upload');
  await page.waitForLoadState('domcontentloaded');

  const filePath = 'tests/TestData/Images/Sample.jpg';
  const uploadInput = page.locator('#file-upload');
  await uploadInput.setInputFiles(filePath);
  await page.locator('#file-submit').click();
  const successHeader = page.locator("//h3[normalize-space()='File Uploaded!']");
  await expect(successHeader).toBeVisible();

  const uploadedFileName = page.locator('#uploaded-files');
  await expect(uploadedFileName).toContainText('Sample.jpg');
  console.log('File uploaded successfully and verified.');
  await page.waitForTimeout(5000);
});