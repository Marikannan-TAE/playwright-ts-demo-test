import { test, expect, APIRequestContext, APIResponse } from "@playwright/test";

interface LoginResponse {
  data: {
    token: string;
    userId?: string;
  };
}

interface CreateNoteResponse {
  message: string;
  data: {
    id: string;
    title: string;
    description: string;
    category: string;
  };
}

test.describe("Create Notes API Testing", () => {
  const baseUrl: string = "https://practice.expandtesting.com";
  let token: string;

  test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
    const response: APIResponse = await request.post(`${baseUrl}/notes/api/users/login`, {
      headers: { "Content-Type": "application/json" },
      data: {
        email: process.env.email as string,
        password: process.env.password as string,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody: LoginResponse = await response.json();
    expect(responseBody.data.token).toBeTruthy();
    token = responseBody.data.token;
    console.log("Access Token:", token);
  });


  test("POST Request - Create Notes", async ({ request }: { request: APIRequestContext }) => {
    const response: APIResponse = await request.post(`${baseUrl}/notes/api/notes`, {
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
      data: {
        title: `Playwright_Notes_API 3_${Date.now()}`,
        description: `Done via API 3_${Date.now()}`,
        category: "Home",
        completed: "true",
      },
    });

    expect(response.status()).toBe(200);
    const responseBody: CreateNoteResponse = await response.json();
    console.log("Note Created Response:", responseBody);
    expect(responseBody.message).toBe("Note successfully created");
    expect(responseBody.data.title).toBe("Playwright_Notes_API 3");
  });
});
