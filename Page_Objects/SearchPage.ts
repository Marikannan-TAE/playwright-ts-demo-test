import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';


export class SearchPage extends BasePage {
    readonly searchInput: Locator;
    readonly numberOfLinks: Locator;

  constructor(protected page: Page) {
    super(page);
    this.searchInput = page.locator('input[name="search"]');
    this.numberOfLinks = page.locator('li > a');
  }

  async searchFor(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async getNumberOfResults(): Promise<number> {
    await this.waitForNetworkIdle();
    //await this.captureScreenshot('search-results.png');
    return this.numberOfLinks.count();
  }
  }

