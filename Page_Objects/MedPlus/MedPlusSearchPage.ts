import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { MedlinePlusHomePage } from './MedPlusHomePage';

export class MedlinePlusSearchPage extends BasePage {
  // ==================== LOCATORS ====================
  private readonly homePage: MedlinePlusHomePage;
  private readonly keywordSearchResult: Locator;
  private readonly noResultsIndicator: Locator;
  private readonly noResultsIndicatorAlt: Locator;
  private readonly totalNumberOfSearchItems: Locator;
  private readonly searchSuggestionsContainer: Locator;
  private readonly blankSpaceLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.homePage = new MedlinePlusHomePage(page);
    this.keywordSearchResult = page.locator('#search-details .introquery');
    this.noResultsIndicator = page.locator('#document-list>.no-results');
    this.noResultsIndicatorAlt = page.locator('#search-details>.introquery');
    this.totalNumberOfSearchItems = page.locator('#search-details span.intronum');
    this.searchSuggestionsContainer = page.locator('ul.autocomplete-dropdown');
    this.blankSpaceLocator = page.locator('#search-intro.clearfix');
  }

  // ==================== SEARCH EXECUTION ====================

  async locateSearchTextbox(): Promise<void> {
    await this.homePage.navigateToHomePage();
    await this.homePage.locateSearchTextbox();
  }

  async enterSearchKeyword(keyword: string): Promise<void> {
    await this.homePage.enterTextInSearchBox(keyword);
  }

  async clickSearchButton(): Promise<void> {
    await this.homePage.clickSearchButton();
    await this.homePage.waitForNetworkIdle();
  }

  async pressEnterToSearch(): Promise<void> {
    await this.homePage.pressEnterInSearchBox();
    await this.homePage.waitForNetworkIdle();
  }

  // ==================== RESULTS VERIFICATION ====================

  async verifyValidSearchResults(keyword: string): Promise<void> {
    // Verify keyword appears in search results for valid keywords
    const resultLocator = this.page.locator('#search-details').getByText(keyword, { exact: false });
    await expect(resultLocator).toBeVisible({ timeout: this.VISIBILITY_TIMEOUT });
  }

  async verifyInvalidSearchResults(keyword: string): Promise<void> {
    // Verify "no results" message is displayed for invalid keywords
    // Try primary locator first, if not found try alternative locator
    const isPrimaryVisible = await this.noResultsIndicator.isVisible({ timeout: this.VISIBILITY_TIMEOUT }).catch(() => false);
    
    if (isPrimaryVisible) {
      // Primary locator found
      await expect(this.noResultsIndicator).toBeVisible({ timeout: this.VISIBILITY_TIMEOUT });
    } else {
      // Primary not found, check alternative locator
      await expect(this.noResultsIndicatorAlt).toBeVisible({ timeout: this.VISIBILITY_TIMEOUT });
    }
  }

  // ==================== SUGGESTIONS VERIFICATION ====================

  async verifySuggestionsDisplayed(): Promise<void> {
    await expect(this.searchSuggestionsContainer).toBeVisible({
      timeout: this.VISIBILITY_TIMEOUT,
    });
  }

  async areSuggestionsVisible(): Promise<boolean> {
    try {
      const isVisible = await this.searchSuggestionsContainer.isVisible({
        timeout: this.QUICK_CHECK_TIMEOUT,
      });
      console.log(`Suggestions container visible: ${isVisible}`);
      return isVisible;
    } catch (error) {
      console.log(`Suggestions container NOT visible:`, error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  // ==================== BLANK SPACE SEARCH VERIFICATION ====================

  /**
   * Verify blank space search results
   * When searching with only spaces, #search-intro.clearfix element should be visible
   */
  async verifyBlankSpaceSearchResults(): Promise<void> {
    await expect(this.blankSpaceLocator).toBeVisible({ timeout: this.VISIBILITY_TIMEOUT });
  }

}
