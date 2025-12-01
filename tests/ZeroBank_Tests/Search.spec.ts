import { test, expect, Page, Locator } from '@playwright/test';
import { HomePage } from '../../Page_Objects/HomePage';
import { SearchPage } from '../../Page_Objects/SearchPage';

 
test.describe('Search Results ', () => {
  let homePage: HomePage;
  let searchPage: SearchPage;

  test('Should find search results', async ({ page }: { page: Page }) => {
    homePage = new HomePage(page);
    await homePage.visit();
    await homePage.searchFor('Zero');
    
    searchPage = new SearchPage(page);
    let result = await searchPage.getNumberOfResults();
    expect(result).toBe(12);
  
    console.log('Search results found:', result);
  });
});
 
 