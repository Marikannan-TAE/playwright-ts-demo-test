import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MedlinePlusHomePage extends BasePage {
  // Home Page Locators
  private readonly searchTextbox: Locator;
  private readonly searchButton: Locator;
  private readonly drugsAndSupplementsLink: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.searchTextbox = page.getByRole('textbox', { name: 'Search MedlinePlus' });
    this.searchButton = page.getByRole('button', { name: 'GO' });
    this.drugsAndSupplementsLink = page.getByRole('link', { name: 'Drugs & Supplements', exact: true });
  }

  // ==================== NAVIGATION METHODS ====================

  async navigateToHomePage() {
    await this.page.goto(process.env.MEDLINEPLUS_URL!);
    await this.waitForNetworkIdle();
  }

  async navigateToDrugsAndSupplements() {
    await this.drugsAndSupplementsLink.click();
    await this.waitForNetworkIdle();
  }

  // ==================== SEARCH INITIATION METHODS ====================

  async locateSearchTextbox() {
    await expect(this.searchTextbox).toBeVisible({ timeout: this.VISIBILITY_TIMEOUT });
  }

  async enterTextInSearchBox(text: string) {
    await this.searchTextbox.fill(text);
  }

  async clickSearchButton() {
    await expect(this.searchButton).toBeVisible({ timeout: this.VISIBILITY_TIMEOUT });
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
  }

  async pressEnterInSearchBox() {
    await this.searchTextbox.press('Enter');
  }
}
