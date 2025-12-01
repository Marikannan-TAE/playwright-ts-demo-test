import { test, expect } from '@playwright/test';
import { MedlinePlusSearchPage } from '../../Page_Objects/MedPlus/MedPlusSearchPage';
import { BasePage } from '../../Page_Objects/MedPlus/BasePage';

// ==================== TEST DATA ====================

const testData = (() => {
  try {
    return BasePage.readDataFromJSONFile('tests/TestData/MedPlus/searchKeywords.json');
  } catch (error) {
    console.warn('Failed to load searchKeywords.json, using fallback data:', error);
    return {
      //fall back data
      validKeywords: ['diabetes', 'heart disease', 'cancer'],
      invalidKeywords: ['xyzabc123', 'randomword999'],
      edgeCaseKeywords: ['', '!@#$%']
    };
  }
})();

// ==================== SEARCH HELPERS ====================

/**
 * Unified search helper
 * @param searchPage - MedlinePlusSearchPage instance
 * @param keyword - Search keyword
 * @param method - 'click' to use button, 'enter' to use keyboard, 'none' for just entering text
 */
async function performSearch(
  searchPage: MedlinePlusSearchPage,
  keyword: string,
  method: 'click' | 'enter' | 'none' = 'click'
): Promise<void> {
  await searchPage.locateSearchTextbox();
  await searchPage.enterSearchKeyword(keyword);
  
  if (method === 'click') {
    await searchPage.clickSearchButton();
  } else if (method === 'enter') {
    await searchPage.pressEnterToSearch();
  }
  // else: method === 'none', no search action (for suggestions check)
}

// ==================== TEST SUITE 1: INVALID KEYWORDS -> NO RESULTS ====================
// Scenario 004: Search Functionality – Invalid/No Results Keyword
// Purpose: Validate behaviour when a search yields no matching results.
// 
// Precondition: On homepage.
// 
// Steps:
//   1. Locate the search textbox.
//   2. Enter an invalid/random keyword such as xyzabc123.
//   3. Click search or press Enter.
//   4. Wait for results page to load.
//   5. Verify that a "No results found" message or equivalent is displayed.
//   6. Optionally verify that suggestions or alternate search prompt is given.
// 
// Expected Result: The search returns a "no results" state appropriately and handles it gracefully.
//
// Test#1: Verify that a "No results found" message or equivalent is displayed

test.describe('@sanity Test#1 - Invalid Keywords -> No Results Message Displayed', () => {
  let searchPage: MedlinePlusSearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new MedlinePlusSearchPage(page);
  });

  // Test with click button
  for (const keyword of testData.invalidKeywords) {
    test(`Click Search: "${keyword}" -> Expect "No results" message`, async () => {
      await performSearch(searchPage, keyword, 'click');
      await searchPage.verifyInvalidSearchResults(keyword);
    });
  }

  // Test with enter key (sample - first 2 keywords)
  for (const keyword of testData.invalidKeywords.slice(0, 2)) {
    test(`Enter Key Search: "${keyword}" -> Expect "No results" message`, async () => {
      await performSearch(searchPage, keyword, 'enter');
      await searchPage.verifyInvalidSearchResults(keyword);
    });
  }
});

// ==================== TEST SUITE 2: Auto SUGGESTIONS BEHAVIOR ====================
// Test#2: Verify suggestions container visibility (appears for valid, NOT for invalid)
// NOTE: Suggestions appear WHILE TYPING (after entering keyword), BEFORE clicking search

test.describe('@sanity Test#2 - Auto Suggestions Behavior', () => {
  let searchPage: MedlinePlusSearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new MedlinePlusSearchPage(page);
  });

  // Test#2a: For VALID keywords -> Autocomplete suggestions SHOULD appear while typing
  for (const keyword of testData.validKeywords.slice(0, 1)) {  // Test first valid keyword
    test(`Valid keyword: "${keyword}" -> Suggestions appear while typing`, async () => {
      await performSearch(searchPage, keyword, 'none');
      // Check suggestions AFTER entering keyword, BEFORE clicking search
      await searchPage.verifySuggestionsDisplayed();
      // Now click search to complete the flow
      await searchPage.clickSearchButton();
    });
  }

  // Test#2b: For INVALID keywords -> Autocomplete suggestions SHOULD NOT appear
  for (const keyword of testData.invalidKeywords.slice(0, 1)) {  // Test first invalid keyword
    test(`Invalid keyword: "${keyword}" -> Suggestions do NOT appear while typing`, async () => {
      await performSearch(searchPage, keyword, 'none');
      // Check suggestions AFTER entering keyword, BEFORE clicking search
      const suggestionsVisible = await searchPage.areSuggestionsVisible();
      expect(suggestionsVisible).toBe(false);
      // Now click search to complete the flow
      await searchPage.clickSearchButton();
    });
  }
});

// ==================== TEST SUITE 3: VALID KEYWORDS -> RESULTS DISPLAYED ====================
// Test#3: Verify valid test results

test.describe('@sanity Test#3 - Valid Keywords -> Search Results Displayed', () => {
  let searchPage: MedlinePlusSearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new MedlinePlusSearchPage(page);
  });

  // Test each valid keyword
  for (const keyword of testData.validKeywords) {
    test(`Click Search: "${keyword}" -> Expect results found`, async () => {
      await performSearch(searchPage, keyword, 'click');
      await searchPage.verifyValidSearchResults(keyword);
    });
  }
});

// ==================== TEST SUITE 4: EDGE CASES ====================
// Test#4: Edge case test

test.describe('@sanity Test#4 - Edge Cases -> No Results/Validation', () => {
  let searchPage: MedlinePlusSearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new MedlinePlusSearchPage(page);
  });

  // Test each edge case
  for (const keyword of testData.edgeCaseKeywords) {
    test(`Click Search: "${keyword || '(empty string)'}" -> Expect search intro element visible`, async () => {
      await performSearch(searchPage, keyword, 'click');
      
      // For empty string and blank space, verify #search-intro.clearfix element visibility
      if (keyword === '' || keyword === ' ') {
        await searchPage.verifyBlankSpaceSearchResults();
      } else {
        // For other edge cases (single char, long string, special chars), verify "no results" message
        await searchPage.verifyInvalidSearchResults(keyword);
      }
    });
  }
});


