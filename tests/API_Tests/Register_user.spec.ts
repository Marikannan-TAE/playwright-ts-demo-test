import { test, expect, APIRequestContext, APIResponse } from "@playwright/test";

test.describe("Register an User - API Testing", () => {
  const baseUrl: string = "https://practice.expandtesting.com";

  interface RegisterResponse {
    message: string;
    data: {
      name: string;
      userId?: string;
    };
  }

  test("Register an user", async ({ request }: { request: APIRequestContext }) => {
    const response: APIResponse = await request.post(`${baseUrl}/notes/api/users/register`, {
      headers: { "Content-Type": "application/json" },
      data: {
        name: `Test_${Date.now()}`,
        email: `Test_${Date.now()}@gmail.com`,
        password: "password",
      },
    });

    expect(response.status()).toBe(201);
    const responseBody: RegisterResponse = await response.json();
    expect(responseBody.data.name).toBeTruthy();
    expect(responseBody.message).toBe("User account created successfully");
    const Name: string = responseBody.data.name;
    console.log("Created user Name is:", Name);
    console.log("Response Body:", responseBody);
  });
});
