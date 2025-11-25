import fs from 'fs';
import xlsx from 'xlsx';
import { parse } from 'csv-parse/sync';
import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async wait(timeout: number = 5000): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }

  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // Wait for multiple locators to be visible
  async waitForVisible(locators: Locator[], timeout: number = 10000): Promise<void> {
    await Promise.all(
      locators.map(locator => expect(locator).toBeVisible({ timeout }))
    );
  }

  async captureScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ path: name });
  }

  static readDataFromJSONFile<T = any>(fileName: string): T {
    const data = fs.readFileSync(fileName, 'utf-8');
    return JSON.parse(data) as T;
  }

  async readDataFromExcelFile(fileName: string, sheetIndex: number = 0): Promise<any[]> {
    const workbook = xlsx.readFile(fileName);
    const sheetNameList = workbook.SheetNames;
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[sheetIndex]]);
  }

  async readDataFromCSVFile(fileName: string): Promise<any[]> {
    const fileContent = fs.readFileSync(fileName, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    return records;
  }
}
