import { test, expect, APIRequestContext, Page, APIResponse, Locator } from "@playwright/test";
import { AccessToken } from "./BaseTest"; 

interface NoteResponse {
  message: string;
  data: {
    id: string;
    title: string;
    description: string;
    category: string;
  };
}

test.describe.serial("Create → Delete Notes API + UI", () => {
  let token: string;
  const randomTitle: string = `Playwright_Notes_${Math.floor(Math.random() * 1000)}`;
  const baseUrl: string = process.env.API_BASE_URL || "https://practice.expandtesting.com";

  test.beforeAll(async ({ playwright }) => {
    // Create API request context with SSL settings
    const request = await playwright.request.newContext({
      ignoreHTTPSErrors: true,
    });

    token = await AccessToken(
      process.env.API_USER_EMAIL!,
      process.env.API_USER_PASSWORD!,
      request
    );

    expect(token, "Auth token should be generated").toBeTruthy();
    console.log("Access Token:", token);
    
    // Don't forget to dispose the context
    await request.dispose();
  });

  test("POST Request - Create Note", async ({ playwright }) => {
    // Create API request context with SSL settings
    const request = await playwright.request.newContext({
      ignoreHTTPSErrors: true,
    });

    const response: APIResponse = await request.post(`${baseUrl}/notes/api/notes`, {
      headers: { "x-auth-token": token, "Content-Type": "application/json" },
      data: {
        title: randomTitle,
        description: "Created via API for UI deletion test",
        category: "Personal",
      },
    });

    expect(response.status(), "Create Note should return 200").toBe(200);
    const body: NoteResponse = await response.json();
    console.log("Create Note Response:", body);
    expect(body.message).toBe("Note successfully created");
    expect(body.data.title).toBe(randomTitle);
    
    // Dispose the request context
    await request.dispose();
  });

  test("UI Delete Note", async ({ page }: { page: Page }) => {
    await page.goto(`${baseUrl}/notes/app`, { waitUntil: "domcontentloaded" });
    await page.locator("a[href='/notes/app/login']").click();
    await page.locator("#email").fill(process.env.API_USER_EMAIL!);
    await page.locator("#password").fill(process.env.API_USER_PASSWORD!);
    await page.getByRole("button", { name: "Login" }).click();

    await page.waitForSelector(".container");
    const deleteButton: Locator = page.locator(
      `//div[text()='${randomTitle}']/following-sibling::div//button[@data-testid='note-delete']`);
    await expect(deleteButton, `Delete button for ${randomTitle} should exist`).toBeVisible();
    await deleteButton.click();

    const confirmButton: Locator = page.locator("//button[@data-testid='note-delete-confirm']");
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
    await page.waitForTimeout(2000);

    await expect(page.locator(`//div[text()='${randomTitle}']`)).toHaveCount(0, { timeout: 5000 });
    console.log(`Note '${randomTitle}' deleted successfully via UI`);
  });
});
