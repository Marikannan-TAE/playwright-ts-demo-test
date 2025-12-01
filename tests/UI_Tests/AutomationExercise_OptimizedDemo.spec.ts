import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../Page_Objects/AutomationExercise/AutomationExercisePage';

test.describe('Automation Exercise - Optimized Product Search Tests', () => {
  let automationExercisePage: AutomationExercisePage;

  test.beforeEach(async ({ page }) => {
    automationExercisePage = new AutomationExercisePage(page);
  });

  test(' Enhanced search workflow with detailed analysis', async ({ page }) => {
    const searchTerm = 'top';

    // Use the optimized complete workflow method
    const result = await automationExercisePage.executeCompleteSearchWorkflow(searchTerm);

    // Verify results using the new analysis structure
    expect(result.total).toBeGreaterThan(0);
    expect(result.matching).toBeGreaterThan(0);
    expect(result.percentage).toBeGreaterThan(0);
    
    // Additional assertions
    expect(result.productNames.length).toBe(result.total);
    expect(result.matching).toBeLessThanOrEqual(result.total);
  });

  test(' Multiple search terms comparison', async ({ page }) => {
    const searchTerms = ['top', 'dress', 'jeans'];

    // Navigate once to the products page
    await automationExercisePage.navigateToProductsPageFromHome();

    // Search multiple terms and get comprehensive results
    const results = await automationExercisePage.searchMultipleTerms(searchTerms);

    // Verify each search term has results
    for (const [term, result] of results) {
      expect(result.total).toBeGreaterThan(0);
      expect(result.matching).toBeGreaterThan(0);
      
      // Log results for analysis (only in this demo test)
      console.log(`Search term: "${term}"`);
      console.log(`- Total products: ${result.total}`);
      console.log(`- Matching products: ${result.matching}`);
      console.log(`- Match percentage: ${result.percentage}%`);
    }
  });

  test(' Flexible search verification with custom threshold', async ({ page }) => {
    const searchTerm = 'top';

    await automationExercisePage.navigateToProductsPageFromHome();
    await automationExercisePage.searchForProduct(searchTerm);
    await automationExercisePage.verifySearchedProductsIsVisible();

    // Use the new flexible verification with custom threshold
    await automationExercisePage.verifyMajorityProductsContainSearchTerm(searchTerm, 30); // 30% threshold
    
    // Verify we have search results
    await automationExercisePage.verifySearchHasResults();
  });

  test(' Quick search verification', async ({ page }) => {
    await automationExercisePage.navigateToHomePage();
    await automationExercisePage.verifyHomePageIsVisible();
    await automationExercisePage.clickProductsButton();
    await automationExercisePage.verifyAllProductsPageIsVisible();
    
    // Quick search with simple verification
    await automationExercisePage.searchForProduct('top');
    await automationExercisePage.verifySearchedProductsIsVisible();
    await automationExercisePage.verifySearchHasResults();
  });

  test('Error handling for empty search term', async ({ page }) => {
    await automationExercisePage.navigateToProductsPageFromHome();

    // Test error handling for empty search term
    await expect(async () => {
      await automationExercisePage.searchForProduct('');
    }).rejects.toThrow('Search term cannot be empty');

    await expect(async () => {
      await automationExercisePage.searchForProduct('   ');
    }).rejects.toThrow('Search term cannot be empty');
  });
});

test.describe('Automation Exercise - Backward Compatibility Tests', () => {
  let automationExercisePage: AutomationExercisePage;

  test.beforeEach(async ({ page }) => {
    automationExercisePage = new AutomationExercisePage(page);
  });

  test('Deprecated methods still work for backward compatibility', async ({ page }) => {
    const searchTerm = 'top';

    // Test deprecated methods still work
    const oldResult = await automationExercisePage.completeProductSearchWorkflow(searchTerm);
    expect(oldResult.length).toBeGreaterThan(0);

    // Navigate to products again for second test
    await automationExercisePage.navigateToProductsPageFromHome();
    await automationExercisePage.searchForProduct(searchTerm);
    
    const matchingCount = await automationExercisePage.getMatchingProductsCount(searchTerm);
    expect(matchingCount.total).toBeGreaterThan(0);
    expect(matchingCount.matching).toBeGreaterThan(0);
  });
});
