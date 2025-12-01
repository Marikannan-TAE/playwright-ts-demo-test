import { test, expect, Page, Locator } from '@playwright/test';

test.describe('Automation Exercise - Product Search Tests', () => {
  
  test(' Search for "Top" products and verify results', async ({ page }) => {
    // Test data
    const searchTerm = 'top';
    
    console.log('Starting Automation Exercise product search test...');

    // Step 1: Navigate to the website - https://automationexercise.com
    console.log('1. Navigating to https://automationexercise.com');
    await page.goto('https://automationexercise.com');
    await page.waitForLoadState('networkidle');

    // Step 2: Verify home page is visible
    console.log('2. Verifying home page is visible');
    
    // Verify multiple elements to ensure home page is loaded
    const homePageLogo = page.locator('.logo img');
    const featuresItems = page.locator('.features_items');
    
    await expect(homePageLogo).toBeVisible();
    await expect(featuresItems).toBeVisible();
    
    // Verify URL contains the expected domain
    expect(page.url()).toContain('automationexercise.com');
    
    // Verify page title
    await expect(page).toHaveTitle(/Automation Exercise/);
    console.log('✓ Home page is visible and verified');

    // Step 3: Click on "Products" button
    console.log('3. Clicking on Products button');
    const productsButton = page.locator('a[href="/products"]');
    await expect(productsButton).toBeVisible();
    await productsButton.click();
    await page.waitForLoadState('networkidle');

    // Step 4: Verify navigation to ALL PRODUCTS page
    console.log('4. Verifying navigation to ALL PRODUCTS page');
    
    // Verify URL contains products
    expect(page.url()).toContain('/products');
    
    // Verify "ALL PRODUCTS" title is visible
    const allProductsTitle = page.locator('.title.text-center').filter({ hasText: 'All Products' });
    await expect(allProductsTitle).toBeVisible();
    
    // Verify products list is visible
    const productsList = page.locator('.features_items');
    await expect(productsList).toBeVisible();
    console.log('✓ Successfully navigated to ALL PRODUCTS page');

    // Step 5: Search for a product - Top
    console.log(`5. Searching for product: "${searchTerm}"`);
    const searchInput = page.locator('#search_product');
    const searchButton = page.locator('#submit_search');
    
    await expect(searchInput).toBeVisible();
    await searchInput.clear();
    await searchInput.fill(searchTerm);
    await searchButton.click();
    await page.waitForLoadState('networkidle');
    console.log('✓ Search completed');

    // Step 6: Verify "SEARCHED PRODUCTS" is visible
    console.log('6. Verifying "SEARCHED PRODUCTS" is visible');
    const searchedProductsTitle = page.locator('.title.text-center').filter({ hasText: 'Searched Products' });
    await expect(searchedProductsTitle).toBeVisible();
    console.log('✓ "SEARCHED PRODUCTS" title is visible');

    // Step 7: Locate all products in the search result
    console.log('7. Locating all products in search results');
    await page.waitForTimeout(2000); // Wait for search results to load
    
    const productItems = page.locator('.features_items .product-image-wrapper');
    const productNames = page.locator('.features_items .product-image-wrapper p');
    
    const productCount = await productItems.count();
    console.log(`Found ${productCount} products in search results`);
    
    // Verify that we have at least one product
    expect(productCount).toBeGreaterThan(0);

    // Step 8: Loop through each product and verify it contains 'top' in the product name
    console.log('8. Verifying all products contain "top" in their names');
    
    const productNamesList: string[] = [];
    
    for (let i = 0; i < productCount; i++) {
      const productName = await productNames.nth(i).textContent();
      if (productName) {
        const trimmedName = productName.trim();
        productNamesList.push(trimmedName);
        
        // Verify each product name contains the search term (case-insensitive)
        const containsSearchTerm = trimmedName.toLowerCase().includes(searchTerm.toLowerCase());
        expect(containsSearchTerm).toBeTruthy();
        
        console.log(`✓ Product ${i + 1}: "${trimmedName}" contains "${searchTerm}"`);
      }
    }
    
    console.log(`\nSummary:`);
    console.log(`- Total products found: ${productNamesList.length}`);
    console.log(`- All products contain "${searchTerm}": ✓`);
    console.log(`\nProduct list:`);
    productNamesList.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });

    console.log('\n✅ All test steps completed successfully!');
  });

  test(' Detailed product search verification with additional validations', async ({ page }) => {
    const searchTerm = 'top';
    
    console.log('Starting detailed product search test...');

    // Navigate and verify home page
    await page.goto('https://automationexercise.com');
    await page.waitForLoadState('networkidle');
    
    // Verify home page elements
    await expect(page.locator('.logo img')).toBeVisible();
    await expect(page.locator('.features_items')).toBeVisible();
    await expect(page).toHaveTitle(/Automation Exercise/);

    // Navigate to products page
    await page.locator('a[href="/products"]').click();
    await page.waitForLoadState('networkidle');
    
    // Verify products page
    expect(page.url()).toContain('/products');
    await expect(page.locator('.title.text-center').filter({ hasText: 'All Products' })).toBeVisible();

    // Perform search
    await page.locator('#search_product').fill(searchTerm);
    await page.locator('#submit_search').click();
    await page.waitForLoadState('networkidle');
    
    // Verify search results page
    await expect(page.locator('.title.text-center').filter({ hasText: 'Searched Products' })).toBeVisible();

    // Get all product names and perform detailed verification
    await page.waitForTimeout(2000);
    const productNames = page.locator('.features_items .product-image-wrapper p');
    const productCount = await productNames.count();
    
    // Additional assertions
    expect(productCount).toBeGreaterThan(0);
    
    // Verify each product individually with detailed checks
    const allProductNames: string[] = [];
    
    for (let i = 0; i < productCount; i++) {
      const productName = await productNames.nth(i).textContent();
      
      if (productName) {
        const trimmedName = productName.trim();
        allProductNames.push(trimmedName);
        
        console.log(`Verifying product ${i + 1}: "${trimmedName}"`);
        
        // Case-insensitive check
        const containsSearchTerm = trimmedName.toLowerCase().includes(searchTerm.toLowerCase());
        expect(containsSearchTerm).toBeTruthy();
        
        // Verify product name is not empty
        expect(trimmedName.length).toBeGreaterThan(0);
        
        // Additional validation - check if the product name is meaningful
        expect(trimmedName).toMatch(/[a-zA-Z]/); // Contains at least one letter
      }
    }

    console.log(`✅ Successfully verified ${allProductNames.length} products containing "${searchTerm}"`);
    
    // Print summary
    console.log('\nDetailed Test Summary:');
    console.log(`- Search term: "${searchTerm}"`);
    console.log(`- Products found: ${allProductNames.length}`);
    console.log(`- All validations passed: ✓`);
  });

  test(' Quick product search smoke test', async ({ page }) => {
    console.log('Starting smoke test...');
    
    // Simplified smoke test version - quick validation
    await page.goto('https://automationexercise.com');
    await page.waitForLoadState('domcontentloaded');
    
    // Quick home page verification
    await expect(page.locator('.logo img')).toBeVisible();
    
    // Navigate to products
    await page.locator('a[href="/products"]').click();
    await page.waitForLoadState('domcontentloaded');
    
    // Quick products page verification
    expect(page.url()).toContain('/products');
    
    // Perform search
    await page.locator('#search_product').fill('top');
    await page.locator('#submit_search').click();
    await page.waitForLoadState('domcontentloaded');
    
    // Quick verification that results exist
    await page.waitForTimeout(1000);
    const productCount = await page.locator('.features_items .product-image-wrapper').count();
    expect(productCount).toBeGreaterThan(0);
    
    console.log(`✅ Smoke test passed - found ${productCount} products`);
  });

  test('Search for different product types in single test', async ({ page }) => {
    const searchTerms = ['dress', 'top', 'jeans'];
    
    console.log('Starting multi-search test...');
    
    // Navigate to site once
    await page.goto('https://automationexercise.com');
    await page.waitForLoadState('networkidle');
    
    // Verify home page
    await expect(page.locator('.logo img')).toBeVisible();
    
    // Go to products page
    await page.locator('a[href="/products"]').click();
    await page.waitForLoadState('networkidle');
    
    // Verify products page
    expect(page.url()).toContain('/products');
    await expect(page.locator('.title.text-center').filter({ hasText: 'All Products' })).toBeVisible();

    // Test multiple search terms
    for (let i = 0; i < searchTerms.length; i++) {
      const searchTerm = searchTerms[i];
      console.log(`\nTesting search ${i + 1}/${searchTerms.length}: "${searchTerm}"`);
      
      // Clear and perform search
      await page.locator('#search_product').clear();
      await page.locator('#search_product').fill(searchTerm);
      await page.locator('#submit_search').click();
      await page.waitForLoadState('networkidle');
      
      // Verify search results page
      await expect(page.locator('.title.text-center').filter({ hasText: 'Searched Products' })).toBeVisible();
      
      // Check results
      await page.waitForTimeout(1500);
      const productNames = page.locator('.features_items .product-image-wrapper p');
      const productCount = await productNames.count();
      
      if (productCount > 0) {
        console.log(`  Found ${productCount} products for "${searchTerm}"`);
        
        // Verify at least some products contain the search term
        let matchingCount = 0;
        for (let j = 0; j < Math.min(productCount, 5); j++) { // Check first 5 products
          const productName = await productNames.nth(j).textContent();
          if (productName && productName.toLowerCase().includes(searchTerm.toLowerCase())) {
            matchingCount++;
          }
        }
        
        console.log(`  ${matchingCount} products contain "${searchTerm}" in name`);
        expect(matchingCount).toBeGreaterThan(0);
      } else {
        console.log(`  No products found for "${searchTerm}"`);
      }
    }
    
    console.log('\n✅ Multi-search test completed successfully!');
  });
});

test.describe('Automation Exercise - Edge Cases and Error Handling', () => {
  
  test('Search with empty string', async ({ page }) => {
    await page.goto('https://automationexercise.com');
    await page.waitForLoadState('networkidle');
    
    await page.locator('a[href="/products"]').click();
    await page.waitForLoadState('networkidle');
    
    // Search with empty string
    await page.locator('#search_product').clear();
    await page.locator('#submit_search').click();
    await page.waitForLoadState('networkidle');
    
    // Should still show some results or handle gracefully
    const hasResults = await page.locator('.features_items .product-image-wrapper').count() > 0;
    console.log(`Empty search results: ${hasResults ? 'Products shown' : 'No products'}`);
  });

  test('Search with special characters', async ({ page }) => {
    await page.goto('https://automationexercise.com');
    await page.waitForLoadState('networkidle');
    
    await page.locator('a[href="/products"]').click();
    await page.waitForLoadState('networkidle');
    
    // Search with special characters
    const specialSearchTerm = '@#$%';
    await page.locator('#search_product').fill(specialSearchTerm);
    await page.locator('#submit_search').click();
    await page.waitForLoadState('networkidle');
    
    // Verify the page handles special characters gracefully
    const searchedTitle = page.locator('.title.text-center').filter({ hasText: 'Searched Products' });
    await expect(searchedTitle).toBeVisible();
    
    console.log(`Special character search handled gracefully`);
  });
});
