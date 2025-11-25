import { test, expect, APIRequestContext, APIResponse } from "@playwright/test";

test.describe("Create Token - API Testing", () => {
  const baseUrl: string = "https://practice.expandtesting.com";

  interface LoginResponse {
    message: string;
    data: {
      token: string;
      userId?: string;
    };
  }

  test("Login as an existing user", async ({ request }: { request: APIRequestContext }) => {
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
    expect(responseBody.message).toBe("Login successful");
    const token: string = responseBody.data.token;
    console.log("Access Token:", token);
  });
});
