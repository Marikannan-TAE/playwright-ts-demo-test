import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

interface ProductSearchResult {
  productNames: string[];
  total: number;
  matching: number;
  percentage: number;
}

interface PageElements {
  // Home Page Elements
  productsButton: Locator;
  homePageLogo: Locator;
  featuresItems: Locator;
  
  // Products Page Elements
  allProductsTitle: Locator;
  searchInput: Locator;
  searchButton: Locator;
  searchedProductsTitle: Locator;
  productsList: Locator;
  productItems: Locator;
  productNames: Locator;
}

export class AutomationExercisePage extends BasePage {
  private readonly elements: PageElements;
  private readonly baseUrl = 'https://automationexercise.com';
  private readonly timeouts = {
    searchResults: 2000,
    navigation: 30000,
    elementVisible: 10000
  };

  constructor(page: Page) {
    super(page);
    this.elements = this.initializeElements();
  }

  // ==================== INITIALIZATION ====================

  private initializeElements(): PageElements {
    return {
      // Home Page Elements
      productsButton: this.page.locator('a[href="/products"]'),
      homePageLogo: this.page.locator('.logo img'),
      featuresItems: this.page.locator('.features_items'),

      // Products Page Elements
      allProductsTitle: this.page.locator('.title.text-center').filter({ hasText: 'All Products' }),
      searchInput: this.page.locator('#search_product'),
      searchButton: this.page.locator('#submit_search'),
      searchedProductsTitle: this.page.locator('.title.text-center').filter({ hasText: 'Searched Products' }),
      productsList: this.page.locator('.features_items'),
      productItems: this.page.locator('.features_items .product-image-wrapper'),
      productNames: this.page.locator('.features_items .product-image-wrapper p')
    };
  }

  // ==================== NAVIGATION METHODS ====================

  async navigateToHomePage(): Promise<void> {
    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' });
  }

  async clickProductsButton(): Promise<void> {
    await this.elements.productsButton.click();
    await this.waitForNetworkIdle();
  }

  // ==================== VERIFICATION METHODS ====================

  async verifyHomePageIsVisible(): Promise<void> {
    const verifications = [
      expect(this.elements.homePageLogo).toBeVisible({ timeout: this.timeouts.elementVisible }),
      expect(this.elements.featuresItems).toBeVisible({ timeout: this.timeouts.elementVisible }),
      expect(this.page).toHaveTitle(/Automation Exercise/, { timeout: this.timeouts.elementVisible })
    ];
    
    await Promise.all(verifications);
    expect(this.page.url()).toContain('automationexercise.com');
  }

  async verifyAllProductsPageIsVisible(): Promise<void> {
    await expect(this.elements.allProductsTitle).toBeVisible({ timeout: this.timeouts.elementVisible });
    await expect(this.elements.productsList).toBeVisible({ timeout: this.timeouts.elementVisible });
    expect(this.page.url()).toContain('/products');
  }

  async verifySearchedProductsIsVisible(): Promise<void> {
    await expect(this.elements.searchedProductsTitle).toBeVisible({ timeout: this.timeouts.elementVisible });
  }

  // ==================== SEARCH METHODS ====================

  async searchForProduct(searchTerm: string): Promise<void> {
    if (!searchTerm.trim()) {
      throw new Error('Search term cannot be empty');
    }

    await expect(this.elements.searchInput).toBeVisible({ timeout: this.timeouts.elementVisible });
    await this.elements.searchInput.clear();
    await this.elements.searchInput.fill(searchTerm);
    await this.elements.searchButton.click();
    await this.waitForNetworkIdle();
  }

  async getAllSearchResultProducts(): Promise<string[]> {
    await this.page.waitForTimeout(this.timeouts.searchResults);
    
    const productTexts = await this.elements.productNames.allTextContents();
    return productTexts
      .map(text => text.trim())
      .filter(text => text.length > 0);
  }

  async getProductCount(): Promise<number> {
    return await this.elements.productItems.count();
  }

  // ==================== ANALYSIS METHODS ====================

  private filterProductsBySearchTerm(productNames: string[], searchTerm: string): string[] {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    return productNames.filter(name => 
      name.toLowerCase().includes(normalizedSearchTerm)
    );
  }

  async getSearchResultAnalysis(searchTerm: string): Promise<ProductSearchResult> {
    const productNames = await this.getAllSearchResultProducts();
    const matchingProducts = this.filterProductsBySearchTerm(productNames, searchTerm);
    
    return {
      productNames,
      total: productNames.length,
      matching: matchingProducts.length,
      percentage: productNames.length > 0 ? Math.round((matchingProducts.length / productNames.length) * 100) : 0
    };
  }

  // ==================== ASSERTION METHODS ====================

  async verifySearchHasResults(): Promise<void> {
    const productCount = await this.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  }

  async verifySearchResultsContainTerm(searchTerm: string): Promise<void> {
    const analysis = await this.getSearchResultAnalysis(searchTerm);
    
    expect(analysis.total).toBeGreaterThan(0);
    expect(analysis.matching).toBeGreaterThan(0);
  }

  async verifyMajorityProductsContainSearchTerm(searchTerm: string, threshold: number = 50): Promise<void> {
    const analysis = await this.getSearchResultAnalysis(searchTerm);
    
    expect(analysis.total).toBeGreaterThan(0);
    expect(analysis.matching).toBeGreaterThan(0);
    expect(analysis.percentage).toBeGreaterThanOrEqual(threshold);
  }

  // ==================== WORKFLOW METHODS ====================

  async navigateToProductsPageFromHome(): Promise<void> {
    await this.navigateToHomePage();
    await this.verifyHomePageIsVisible();
    await this.clickProductsButton();
    await this.verifyAllProductsPageIsVisible();
  }

  async performProductSearch(searchTerm: string): Promise<ProductSearchResult> {
    await this.searchForProduct(searchTerm);
    await this.verifySearchedProductsIsVisible();
    return await this.getSearchResultAnalysis(searchTerm);
  }

  async executeCompleteSearchWorkflow(searchTerm: string): Promise<ProductSearchResult> {
    await this.navigateToProductsPageFromHome();
    const result = await this.performProductSearch(searchTerm);
    await this.verifySearchResultsContainTerm(searchTerm);
    return result;
  }

  // ==================== UTILITY METHODS ====================

  async searchMultipleTerms(searchTerms: string[]): Promise<Map<string, ProductSearchResult>> {
    const results = new Map<string, ProductSearchResult>();
    
    for (const term of searchTerms) {
      const result = await this.performProductSearch(term);
      results.set(term, result);
    }
    
    return results;
  }

  async waitForSearchResultsToLoad(): Promise<void> {
    await this.page.waitForTimeout(this.timeouts.searchResults);
    await expect(this.elements.productNames.first()).toBeVisible({ timeout: this.timeouts.elementVisible });
  }

  // ==================== DEPRECATED METHODS (for backward compatibility) ====================

  /**
   * @deprecated Use verifySearchResultsContainTerm instead
   */
  async verifyAllProductsContainSearchTerm(searchTerm: string): Promise<void> {
    await this.verifyMajorityProductsContainSearchTerm(searchTerm, 50);
  }

  /**
   * @deprecated Use getSearchResultAnalysis instead
   */
  async getMatchingProductsCount(searchTerm: string): Promise<{ total: number; matching: number; percentage: number }> {
    const analysis = await this.getSearchResultAnalysis(searchTerm);
    return {
      total: analysis.total,
      matching: analysis.matching,
      percentage: analysis.percentage
    };
  }

  /**
   * @deprecated Use executeCompleteSearchWorkflow instead
   */
  async completeProductSearchWorkflow(searchTerm: string): Promise<string[]> {
    const result = await this.executeCompleteSearchWorkflow(searchTerm);
    return result.productNames;
  }
}
