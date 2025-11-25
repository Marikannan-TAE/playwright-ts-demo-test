import { test, expect, APIRequestContext, APIResponse } from "@playwright/test";

interface LoginResponse {
  data: {
    token: string;
  };
}

interface Note {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
}

interface NotesResponse {
  message: string;
  data: Note[];
}

test.describe("GET ALL Notes API Testing", () => {
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

  test("GET Request - Retrieve All Notes", async ({ request }: { request: APIRequestContext }) => {
    const response: APIResponse = await request.get(`${baseUrl}/notes/api/notes`, {
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
    });

    expect(response.status()).toBe(200);
    const responseBody: NotesResponse = await response.json();
    console.log("Notes Response:", responseBody);
    expect(responseBody.message).toBe("Notes successfully retrieved");
    expect(Array.isArray(responseBody.data)).toBe(true);

    // Optional: verify note structure if data exists
    if (responseBody.data.length > 0) {
      const firstNote: Note = responseBody.data[0];
      expect(firstNote).toHaveProperty("id");
      expect(firstNote).toHaveProperty("title");
      expect(firstNote).toHaveProperty("description");
      expect(firstNote).toHaveProperty("category");
      expect(typeof firstNote.completed).toBe("boolean");
    }
  });
});
