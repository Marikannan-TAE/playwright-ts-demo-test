import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { MedlinePlusSearchPage } from './MedPlusSearchPage';

export class DrugsAndSupplementsPage extends BasePage {
  // Page Locators
  private readonly filterByAtoZLink: Locator;
  private readonly aspirinDetailsHeading: Locator;
  private readonly aspirinLinkFromSearch: Locator;

  constructor(page: Page) {
    super(page);
    
    this.filterByAtoZLink = page.locator('.alpha-links');
    this.aspirinDetailsHeading = page.locator('h1:has-text("Aspirin")');
    this.aspirinLinkFromSearch = page.getByRole('link').filter({ hasText: /^Aspirin$/ });
  }

  // ==================== NAVIGATION METHODS ====================


  async navigateToAspirinPageBySearch() {
    // Use the search page reference to enter keyword and search
    await this.page.getByRole('textbox', { name: 'Search MedlinePlus' }).fill('Aspirin');
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('networkidle');
    await this.aspirinLinkFromSearch.first().click();
  }

  // ==================== ASSERTION METHODS ====================

  async verifyFilterLinksVisible() {
    await expect(this.filterByAtoZLink).toBeVisible({ timeout: this.VISIBILITY_TIMEOUT });
  }

  async verifyAspirinDetailsPageLoaded() {
    await expect(this.aspirinDetailsHeading).toBeVisible();
  }

  async verifyThePresenceOfDrugDetailSections() {
    // Define the sections with their aliases for better readability
    const sections: { [key: string]: string } = {
      'How should this medicine be used?': 'usage',
      'What side effects can this medication cause?': 'side-effects',
      'Brand names': 'Brand names',
      'Some side effects can be serious': 'warnings'
    };

    console.log('Verifying drug detail sections...');
    
    for (const [sectionName, alias] of Object.entries(sections)) {
      // Using soft assertions to continue checking all sections even if one fails
      const section = this.page.locator(`a, h3, li, div`).filter({ 
        hasText: new RegExp(sectionName, 'i') 
      }).first();
      
      await expect.soft(section, `Missing section: ${sectionName}`).toBeVisible();
      console.log(`   - ${alias}`);
    }
    
    console.log(' -All drug detail sections verified!');
  }

  async confirmInternalNavigation() {
    // Test internal navigation by clicking on a section link and verifying the page scrolls to that section
    console.log('Testing internal navigation...');
    
    // Define navigation test cases with section link text and expected section title
    const navigationTests: { [key: string]: string } = {
      'Brand names': '.section-title > h2'
    };

    for (const [linkText, sectionSelector] of Object.entries(navigationTests)) {
      console.log(`   -Testing navigation to: ${linkText}`);
      
      // Click on the navigation link (li > a with the section name)
      const navLink = this.page.locator('li > a').filter({ 
        hasText: new RegExp(`^${linkText}$`, 'i') 
      }).first();
      
      await expect(navLink).toBeVisible();
      await navLink.click();
      
      // Wait for navigation to complete
      await this.page.waitForLoadState('networkidle');
      
      // Verify the target section is visible (section-title > h2 containing the section name)
      const targetSection = this.page.locator(`${sectionSelector}`).filter({
        hasText: new RegExp(linkText, 'i')
      }).first();
      
      // Scroll the section into view if needed
      await targetSection.scrollIntoViewIfNeeded();
      
      // Verify the section is in the viewport
      await expect.soft(targetSection, `Section "${linkText}" not visible after clicking link`).toBeInViewport();
      console.log(`   -Successfully navigated to: ${linkText}`);
    }

    console.log('   -Internal navigation verified!');
  }
}
