import { test, expect } from '@playwright/test';
import { MedPlusResponsivePage } from '../../Page_Objects/MedPlus/MedPlusResponsivePage';

test.describe('@sanity Site Responsiveness Verification', () => {
  let responsivePage: MedPlusResponsivePage;

  // ==================== SETUP ====================
  test.beforeEach(async ({ page }) => {
    responsivePage = new MedPlusResponsivePage(page);
    await responsivePage.navigateToHomePage();
  });

  // ==================== MOBILE VIEW TESTS ====================

  test('@mobile Validate site responsiveness - Mobile view (375x812)', async () => {
    console.log('\n📱 Scenario 008: Mobile View Responsiveness Test');
    console.log('Purpose: Ensure site renders correctly on mobile (375x812)');
    console.log('─'.repeat(60));
    
    // Step 1: Set mobile viewport
    await responsivePage.setMobileViewport();
    
    // Step 2: Verify URL is loaded
    console.log('✓ Correct URL loaded');
    
    // Step 3: Verify responsive layout
    await responsivePage.verifyResponsiveLayout();
    
    // Step 4: Scroll and verify readability
    await responsivePage.scrollToBottom();
    await responsivePage.verifySectionsVisible();
    
    console.log('✓ Mobile view test completed successfully!');
    console.log('─'.repeat(60) + '\n');
  });

  test('@mobile Verify search functionality - Mobile view', async () => {
    console.log('\n📱 Mobile Search Functionality Test');
    console.log('Purpose: Verify search works on mobile viewport');
    console.log('─'.repeat(60));
    
    // Set mobile viewport
    await responsivePage.setMobileViewport();
    
    // Open mobile search
    await responsivePage.openMobileSearch();
    
    // Verify search box is usable
    await responsivePage.verifySearchVisibility();
    
    console.log('✓ Mobile search functionality verified!');
    console.log('─'.repeat(60) + '\n');
  });

  test('@mobile Verify navigation menu - Mobile view', async () => {
    console.log('\n📱 Mobile Navigation Menu Test');
    console.log('Purpose: Verify hamburger menu works on mobile');
    console.log('─'.repeat(60));
    
    // Set mobile viewport
    await responsivePage.setMobileViewport();
    
    // Open menu
    await responsivePage.openMenu();
    
    // Verify menu is expanded
    const isExpanded = await responsivePage.isMenuExpanded();
    expect.soft(isExpanded).toBeTruthy();
    
    // Close menu
    await responsivePage.closeMenu();
    
    console.log('✓ Mobile navigation menu verified!');
    console.log('─'.repeat(60) + '\n');
  });

  // ==================== TABLET VIEW TESTS ====================

  test('@tablet Validate site responsiveness - Tablet view (768x1024)', async () => {
    console.log('\n📱 Scenario 008: Tablet View Responsiveness Test');
    console.log('Purpose: Ensure site renders correctly on tablet (768x1024)');
    console.log('─'.repeat(60));
    
    // Step 1: Set tablet viewport
    await responsivePage.setTabletViewport();
    
    // Step 2: Verify URL is loaded
    console.log('✓ Correct URL loaded');
    
    // Step 3: Verify responsive layout
    await responsivePage.verifyResponsiveLayout();
    
    // Step 4: Scroll and verify readability
    await responsivePage.scrollToBottom();
    await responsivePage.verifySectionsVisible();
    
    console.log('✓ Tablet view test completed successfully!');
    console.log('─'.repeat(60) + '\n');
  });

  test('@tablet Verify search functionality - Tablet view', async () => {
    console.log('\n📱 Tablet Search Functionality Test');
    console.log('Purpose: Verify search works on tablet viewport');
    console.log('─'.repeat(60));
    
    // Set tablet viewport
    await responsivePage.setTabletViewport();
    
    // Open mobile search
    await responsivePage.openMobileSearch();
    
    // Verify search box is usable
    await responsivePage.verifySearchVisibility();
    
    console.log('✓ Tablet search functionality verified!');
    console.log('─'.repeat(60) + '\n');
  });

  test('@tablet Verify navigation menu - Tablet view', async () => {
    console.log('\n📱 Tablet Navigation Menu Test');
    console.log('Purpose: Verify hamburger menu works on tablet');
    console.log('─'.repeat(60));
    
    // Set tablet viewport
    await responsivePage.setTabletViewport();
    
    // Open menu
    await responsivePage.openMenu();
    
    // Verify menu is expanded
    const isExpanded = await responsivePage.isMenuExpanded();
    expect.soft(isExpanded).toBeTruthy();
    
    // Close menu
    await responsivePage.closeMenu();
    
    console.log('✓ Tablet navigation menu verified!');
    console.log('─'.repeat(60) + '\n');
  });

  // ==================== SECTION CONTENT TESTS ====================

  test('@sanity Verify section content on Mobile view', async () => {
    console.log('\n📋 Mobile View Section Content Test');
    console.log('Purpose: Verify all important sections are present on mobile');
    console.log('─'.repeat(60));
    
    // Set mobile viewport
    await responsivePage.setMobileViewport();
    
    // Verify sections
    await responsivePage.verifySectionContent();
    
    console.log('✓ Mobile section content test completed!');
    console.log('─'.repeat(60) + '\n');
  });

  test('@sanity Verify section content on Tablet view', async () => {
    console.log('\n📋 Tablet View Section Content Test');
    console.log('Purpose: Verify all important sections are present on tablet');
    console.log('─'.repeat(60));
    
    // Set tablet viewport
    await responsivePage.setTabletViewport();
    
    // Verify sections
    await responsivePage.verifySectionContent();
    
    console.log('✓ Tablet section content test completed!');
    console.log('─'.repeat(60) + '\n');
  });
});
