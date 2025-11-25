import { test, expect, Page, Locator } from '@playwright/test';

test.describe('WebTable Pagination - Name and Salary Check', () => {

  const targetName = 'Paul';
  const expectedSalary = '$725,000';

  async function waitForTableData(page: Page): Promise<void> {
    try {
      await page.waitForSelector('#example_processing', { state: 'visible', timeout: 2000 });
    } catch {
      // Spinner didn't appear, likely data loaded instantly — safe to ignore
    }
    await page.waitForSelector('#example_processing', { state: 'hidden', timeout: 5000 });
  }

  test(`Verify salary for ${targetName} across paginated table`, async ({ page }: { page: Page }) => {
    await page.goto('https://datatables.net/examples/data_sources/server_side');
    let found = false;

    while (true) {
      await waitForTableData(page);

      const rows: Locator = page.locator('#example tbody tr');
      const rowCount: number = await rows.count();

      for (let i = 0; i < rowCount; i++) {
        const name = (await rows.nth(i).locator('td:nth-child(1)').textContent())?.trim();

        if (name === targetName) {
          const actualSalary = (await rows.nth(i).locator('td:nth-child(6)').textContent())?.trim();
          console.log(`Found ${targetName} with salary: ${actualSalary}`);
          expect(actualSalary).toBe(expectedSalary);
          found = true;
          break;
        }
      }

      if (found) break;

      const nextButton: Locator = page.locator('button[aria-label="Next"]');
      const nextDisabled: boolean = await nextButton.evaluate(el => el.classList.contains('disabled'));

      if (nextDisabled) {
        console.log(`Reached last page — "${targetName}" not found.`);
        break;
      }
      await nextButton.click();
    }

    expect(found, `Could not find "${targetName}" with expected salary ${expectedSalary}`).toBe(true);
  });
});