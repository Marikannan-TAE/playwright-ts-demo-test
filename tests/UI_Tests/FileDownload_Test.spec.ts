import { test, expect, Page, Download } from '@playwright/test';
import { mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

test('Download and verify content of sample_upload.txt', async ({ page }: { page: Page }) => {
  const downloadDir = join(process.cwd(), 'tests', 'TestData', 'Downloads');
  mkdirSync(downloadDir, { recursive: true });

  await page.goto('https://the-internet.herokuapp.com/download');
  const [download]: any = await Promise.all([
    page.waitForEvent('download'),
    page.locator("//a[text()='ProjectDoc.txt']").click(),
  ]);

  const fileName: string = download.suggestedFilename();
  const filePath: string = join(downloadDir, fileName);
  await download.saveAs(filePath);
  const fileContent: string = readFileSync(filePath, 'utf-8');
  console.log(`Downloaded file content:\n${fileContent}`);

  expect(fileContent).toContain('This is ProjectDocument');
});