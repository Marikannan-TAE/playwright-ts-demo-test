import fs from 'fs';
import xlsx from 'xlsx';
import { parse } from 'csv-parse/sync';
import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  // ==================== CONSTANTS ====================
  protected readonly VISIBILITY_TIMEOUT = 6000;
  protected readonly QUICK_CHECK_TIMEOUT = 2000;

  // ==================== PAGE INSTANCE ====================
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

  // Wait for ANY ONE of multiple locators to be visible (uses Promise.race with isVisible)
  async waitForVisible(locators: Locator[], timeout: number = 10000): Promise<void> {
    const startTime = Date.now();
    
    // Keep checking until timeout or one element is visible
    while (Date.now() - startTime < timeout) {
      for (const locator of locators) {
        try {
          if (await locator.isVisible({ timeout: 500 })) {
            return; // Found a visible element, success!
          }
        } catch {
          // Element not visible, continue checking next one
          continue;
        }
      }
      // Wait a bit before checking again
      await this.page.waitForTimeout(100);
    }
    
    // Timeout reached, throw error
    throw new Error(
      `None of the ${locators.length} locators became visible within ${timeout}ms`
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
