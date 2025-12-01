import { test, expect } from '@playwright/test';
import { MedlinePlusHomePage } from '../../Page_Objects/MedPlus/MedPlusHomePage';
import { DrugsAndSupplementsPage } from '../../Page_Objects/MedPlus/MedPlusDrugsAndSupplementsPage';

test.describe('@sanity Test the search and detail view for the Drugs & Supplements section', () => {
  let homePage: MedlinePlusHomePage;
  let drugsPage: DrugsAndSupplementsPage;

  // ==================== SETUP ====================
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    homePage = new MedlinePlusHomePage(page);
    drugsPage = new DrugsAndSupplementsPage(page);
    
    // Navigate to Drugs & Supplements page (once for all tests)
    await homePage.navigateToHomePage();
    await homePage.navigateToDrugsAndSupplements();
    
  });

  // ==================== TESTS ====================

  test('@smoke Verify the Search filters are visible', async () => {
    await drugsPage.verifyFilterLinksVisible();
  });

  test('@sanity Verify navigation to Aspirin details page via search', async () => {
    // Drugs & Supplements page already loaded from beforeAll
    // Navigate to Aspirin details using search method
    await drugsPage.navigateToAspirinPageBySearch();
    await drugsPage.verifyAspirinDetailsPageLoaded();
  });

  test('@sanity Verify the presence of usage, side-effects, brand names, warnings sections', async () => {
    await drugsPage.verifyThePresenceOfDrugDetailSections();
  });

  test('@sanity Confirm internal navigation within that page works', async () => {
    await drugsPage.confirmInternalNavigation();
  });
});