import { test, expect, Page, Locator } from '@playwright/test';

test.describe('Drag and Drop Tests', () => {

  test('Drag and Drop Example 1', async ({ page }: { page: Page }) => {
    await page.goto('https://www.lambdatest.com/selenium-playground/drag-and-drop-demo');
    await page.dragAndDrop("//span[normalize-space()='Draggable 1']", "#mydropzone");
    await page.waitForTimeout(5000);
  });

  test('Drag and Drop Example 2', async ({ page }: { page: Page }) => {
    await page.goto('https://www.lambdatest.com/selenium-playground/drag-and-drop-demo');

    const draggable: Locator = page.locator("div#draggable p");
    const droppable: Locator = page.locator("#droppable");
    await draggable.dragTo(droppable);
    await page.waitForTimeout(3000);
  });

});