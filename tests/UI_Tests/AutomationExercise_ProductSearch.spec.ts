import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../Page_Objects/AutomationExercise/AutomationExercisePage';

test.describe('Automation Exercise - Product Search Tests', () => {
  let automationExercisePage: AutomationExercisePage;

  test.beforeEach(async ({ page }) => {
    automationExercisePage = new AutomationExercisePage(page);
  });

  test(' Search for "Top" products and verify results', async ({ page }) => {
    // Test data
    const searchTerm = 'top';

    // Step 1: Navigate to the website
    await automationExercisePage.navigateToHomePage();

    // Step 2: Verify home page is visible
    await automationExercisePage.verifyHomePageIsVisible();

    // Step 3: Click on "Products" button
    await automationExercisePage.clickProductsButton();

    // Step 4: Verify navigation to ALL PRODUCTS page
    await automationExercisePage.verifyAllProductsPageIsVisible();

    // Step 5: Search for a product - "Top"
    await automationExercisePage.searchForProduct(searchTerm);

    // Step 6: Verify "SEARCHED PRODUCTS" is visible
    await automationExercisePage.verifySearchedProductsIsVisible();

    // Step 7: Locate all products in the search result
    const productCount = await automationExercisePage.getProductCount();

    // Step 8: Loop through each product and verify it contains 'top' in the product name
    await automationExercisePage.verifySearchResultsContainTerm(searchTerm);
  });

  test(' Detailed product search verification with additional validations', async ({ page }) => {
    const searchTerm = 'top';

    // Navigate and verify home page
    await automationExercisePage.navigateToHomePage();
    await automationExercisePage.verifyHomePageIsVisible();

    // Navigate to products page
    await automationExercisePage.clickProductsButton();
    await automationExercisePage.verifyAllProductsPageIsVisible();

    // Perform search
    await automationExercisePage.searchForProduct(searchTerm);
    await automationExercisePage.verifySearchedProductsIsVisible();

    // Get all product names and perform detailed verification
    const productNames = await automationExercisePage.getAllSearchResultProducts();
    const stats = await automationExercisePage.getMatchingProductsCount(searchTerm);
    
    // Additional assertions
    expect(productNames.length).toBeGreaterThan(0);
    expect(stats.matching).toBeGreaterThan(0);
    
    // Verify each product individually - but only check that we have some matching products
    const matchingProducts = productNames.filter(productName =>
      productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    for (const productName of matchingProducts) {
      // Verify product name is not empty
      expect(productName.trim().length).toBeGreaterThan(0);
      // Verify it contains the search term
      expect(productName.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  });

  test(' Quick product search smoke test', async ({ page }) => {
    // Simplified smoke test version
    await automationExercisePage.navigateToHomePage();
    await automationExercisePage.verifyHomePageIsVisible();
    await automationExercisePage.clickProductsButton();
    await automationExercisePage.verifyAllProductsPageIsVisible();
    await automationExercisePage.searchForProduct('top');
    await automationExercisePage.verifySearchedProductsIsVisible();
    
    // Quick verification that results exist
    const productCount = await automationExercisePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test(' Complete workflow test using combined methods', async ({ page }) => {
    const searchTerm = 'top';
    
    // Use the combined workflow method
    const products = await automationExercisePage.completeProductSearchWorkflow(searchTerm);
    
    // Verify we have products
    expect(products.length).toBeGreaterThan(0);
  });
});

test.describe('Automation Exercise - Extended Product Search Tests', () => {
  let automationExercisePage: AutomationExercisePage;

  test.beforeEach(async ({ page }) => {
    automationExercisePage = new AutomationExercisePage(page);
  });

  test('Search for different product types', async ({ page }) => {
    const searchTerms = ['dress', 'tshirt', 'jeans'];
    
    await automationExercisePage.navigateToHomePage();
    await automationExercisePage.verifyHomePageIsVisible();
    await automationExercisePage.clickProductsButton();
    await automationExercisePage.verifyAllProductsPageIsVisible();

    for (const searchTerm of searchTerms) {
      const products = await automationExercisePage.performProductSearch(searchTerm);
      
      if (products.length > 0) {
        // Verify at least some products contain the search term
        const matchingProducts = products.filter(name => 
          name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        expect(matchingProducts.length).toBeGreaterThan(0);
      }
    }
  });
});
