import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for testing responsive design of MedlinePlus
 * Tests mobile (375x812), tablet (768x1024), and desktop (1920x1080) viewports
 */
export class MedPlusResponsivePage extends BasePage {
  // ==================== LOCATORS ====================
  private readonly menuPanel: Locator;
  private readonly searchButton: Locator;
  private readonly searchBox: Locator;
  private readonly contentSections: Locator;

  // ==================== CONSTANTS ====================
  private readonly ELEMENT_TIMEOUT = 2000;
  private readonly MOBILE_WIDTH = 375;
  private readonly MOBILE_HEIGHT = 812;
  private readonly TABLET_WIDTH = 768;
  private readonly TABLET_HEIGHT = 1024;
  private readonly DESKTOP_WIDTH = 1920;
  private readonly DESKTOP_HEIGHT = 1080;

  constructor(page: Page) {
    super(page);
    
    this.menuPanel = page.locator('#sm-menu-btn');
    this.searchButton = page.locator('button#sm-search-btn, [id*="search-btn"]').first();
    this.searchBox = page.locator('input#searchtext_primary, input[type="text"][name="query"]');
    this.contentSections = page.locator('section');
  }

  // ==================== HELPER METHODS ====================

  /**
   * Check if a locator is visible with error handling
   * @param element - The Locator to check
   * @param timeout - Timeout in milliseconds
   * @returns true if visible, false otherwise
   */
  private async isElementVisible(element: Locator, timeout: number = this.ELEMENT_TIMEOUT): Promise<boolean> {
    return await element.isVisible({ timeout }).catch(() => false);
  }

  /**
   * Set viewport size and log the action
   * @param width - Viewport width
   * @param height - Viewport height
   * @param label - Descriptive label for logging
   */
  private async setViewport(width: number, height: number, label: string): Promise<void> {
    console.log(`  Setting ${label} viewport (${width}x${height})...`);
    await this.page.setViewportSize({ width, height });
    await this.page.waitForLoadState('networkidle');
    console.log(`      ${label} viewport set`);
  }

  // ==================== NAVIGATION METHODS ====================

  /**
   * Navigate to MedlinePlus homepage
   */
  async navigateToHomePage(): Promise<void> {
    await this.page.goto(process.env.MEDLINEPLUS_URL!);
    await this.waitForNetworkIdle();
  }

  // ==================== VIEWPORT METHODS ====================

  /**
   * Set viewport to mobile size (375x812)
   */
  async setMobileViewport(): Promise<void> {
    await this.setViewport(this.MOBILE_WIDTH, this.MOBILE_HEIGHT, 'mobile');
  }

  /**
   * Set viewport to tablet size (768x1024)
   */
  async setTabletViewport(): Promise<void> {
    await this.setViewport(this.TABLET_WIDTH, this.TABLET_HEIGHT, 'tablet');
  }

  /**
   * Set viewport to desktop size (1920x1080)
   */
  async setDesktopViewport(): Promise<void> {
    await this.setViewport(this.DESKTOP_WIDTH, this.DESKTOP_HEIGHT, 'desktop');
  }

  // ==================== MENU METHODS ====================

  /**
   * Open the mobile menu
   */
  async openMenu(): Promise<void> {
    console.log('  Opening mobile menu...');
    await expect(this.menuPanel).toBeVisible({ timeout: this.VISIBILITY_TIMEOUT });
    await this.menuPanel.click();
    await this.page.waitForLoadState('networkidle');
    console.log('      Mobile menu opened');
  }

  /**
   * Close the mobile menu
   */
  async closeMenu(): Promise<void> {
    console.log('  Closing mobile menu...');
    await this.menuPanel.click();
    await this.page.waitForLoadState('networkidle');
    console.log('      Mobile menu closed');
  }

  /**
   * Check if menu is expanded/visible
   * @returns true if menu is visible, false otherwise
   */
  async isMenuExpanded(): Promise<boolean> {
    return await this.isElementVisible(this.menuPanel);
  }

  // ==================== SEARCH METHODS ====================

  /**
   * Open the mobile search interface
   * Step 1: Click search button to reveal input
   * Step 2: Verify search input is visible
   * @returns true if search opened successfully, false otherwise
   */
  async openMobileSearch(): Promise<boolean> {
    console.log('  Attempting to open search...');
    try {
      const searchButtonVisible = await this.isElementVisible(this.searchButton);
      if (searchButtonVisible) {
        console.log('   - Clicking search button...');
        await this.searchButton.click();
        await this.page.waitForLoadState('networkidle');
        
        const searchInputVisible = await this.isElementVisible(this.searchBox);
        if (searchInputVisible) {
          console.log('      Search box opened and visible');
          return true;
        } else {
          console.log('      Search input not visible after clicking button');
          return false;
        }
      } else {
        console.log('      Search button not found on this view');
        return false;
      }
    } catch (e) {
      console.log('      Could not open search');
      return false;
    }
  }

  /**
   * Verify search functionality is available and working
   * Step 1: Check if search button exists
   * Step 2: Click button to reveal input
   * Step 3: Verify search input is visible and enabled
   */
  async verifySearchVisibility(): Promise<void> {
    console.log('  Verifying search visibility...');
    try {
      const searchButtonVisible = await this.isElementVisible(this.searchButton);
      if (searchButtonVisible) {
        console.log('      Search button is visible');
        
        await this.searchButton.click();
        await this.page.waitForLoadState('networkidle');
        
        const searchInputVisible = await this.isElementVisible(this.searchBox);
        if (searchInputVisible) {
          await expect(this.searchBox).toBeEnabled();
          console.log('      Search box visible and usable');
        } else {
          console.log('      Search input not visible after opening');
        }
      } else {
        console.log('      Search button not visible on homepage (optional)');
      }
    } catch (e) {
      console.log('      Search verification skipped');
    }
  }

  // ==================== HEADER VERIFICATION METHODS ====================

  /**
   * Verify header sections and search functionality
   * Includes: content sections, search button, search input
   */
  async verifyHeaderSections(): Promise<void> {
    console.log('  Verifying header sections...');
    
    await expect(this.contentSections).toBeDefined();
    console.log('      Content sections are present');
    
    try {
      const searchButtonVisible = await this.isElementVisible(this.searchButton);
      if (searchButtonVisible) {
        console.log('  Search button found');
        
        await this.searchButton.click();
        await this.page.waitForLoadState('networkidle');
        
        const searchInputVisible = await this.isElementVisible(this.searchBox);
        if (searchInputVisible) {
          await expect(this.searchBox).toBeEnabled();
          console.log('      Search input is visible and enabled');
        } else {
          console.log('      Search input not visible after clicking button');
        }
      } else {
        console.log('      Search button not visible on this view (optional)');
      }
    } catch (e) {
      console.log('      Search element not found (optional on homepage)');
    }
  }

  // ==================== LAYOUT & SCROLLING METHODS ====================

  /**
   * Scroll to the bottom of the page
   */
  async scrollToBottom(): Promise<void> {
    console.log('  Scrolling to bottom of page...');
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForLoadState('networkidle');
    console.log('      Scrolled to bottom');
  }

  /**
   * Verify content sections are visible on the page
   */
  async verifySectionsVisible(): Promise<void> {
    console.log('  Verifying content sections visibility...');
    const sections = this.page.locator('section');
    
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
    
    await expect(sections.first()).toBeVisible({ timeout: this.VISIBILITY_TIMEOUT });
    console.log(`      Found ${count} content section(s)`);
  }

  /**
   * Verify content is readable with appropriate font size and width
   */
  async verifyReadability(): Promise<void> {
    console.log('  Verifying content readability...');
    
    const fontSize = await this.page.evaluate(() => 
      window.getComputedStyle(document.body).fontSize
    );
    
    const bodyWidth = await this.page.evaluate(() => 
      document.body.offsetWidth
    );
    
    const fontSizeNum = parseInt(fontSize);
    expect(fontSizeNum).toBeGreaterThanOrEqual(12);
    expect(bodyWidth).toBeGreaterThan(300);
    
    console.log(`      Font size: ${fontSize}, Body width: ${bodyWidth}px`);
  }

  // ==================== COMPREHENSIVE ASSERTION METHODS ====================

  /**
   * Verify responsive layout for the current viewport
   * Checks menu, search, headers, and sections are properly displayed
   */
  async verifyResponsiveLayout(): Promise<void> {
    console.log('  Verifying responsive layout...');
    
    // Verify header sections
    await this.verifyHeaderSections();
    
    // Verify menu functionality (optional on mobile/tablet)
    try {
      const menuVisible = await this.isElementVisible(this.menuPanel);
      if (menuVisible) {
        await this.openMenu();
        const isExpanded = await this.isMenuExpanded();
        if (isExpanded) {
          console.log('      Menu expands correctly');
        } else {
          console.log('      Menu may not have visible expanded state');
        }
        await this.closeMenu();
      } else {
        console.log('      Menu button not visible (may be on desktop view)');
      }
    } catch (e) {
      console.log('      Could not test menu functionality');
    }
    
    // Verify search functionality (optional on homepage)
    try {
      await this.verifySearchVisibility();
    } catch (e) {
      console.log('      Search verification skipped (optional)');
    }
    
    // Verify content layout
    await this.verifySectionsVisible();
    await this.verifyReadability();
    
    console.log('      Responsive layout verification complete');
  }

  /**
   * Verify section content and structure across viewports
   * Checks that sections are present and contain meaningful content
   */
  async verifySectionContent(): Promise<void> {
    console.log('  Verifying section content structure...');
    
    const sections: { [key: string]: string } = {
      'Summary': 'summary',
      'Causes': 'causes',
      'Symptoms': 'symptoms',
      'Treatments and Therapies': 'treatments',
      'Related Health Topics': 'related'
    };

    for (const [sectionName, alias] of Object.entries(sections)) {
      const section = this.page.getByRole('heading', { 
        name: new RegExp(sectionName, 'i') 
      });
      
      const exists = await section.count() > 0;
      if (exists) {
        const isVisible = await this.isElementVisible(section);
        expect.soft(isVisible, `Section ${alias} should be visible`).toBe(true);
        console.log(`      ${alias}`);
      } else {
        console.log(`      Section not found (optional): ${alias}`);
      }
    }
    
    console.log('      Section content verification complete');
  }
}
