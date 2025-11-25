import { test, expect, APIRequestContext, APIResponse } from "@playwright/test";

interface LoginResponse {
  data: {
    token: string;
  };
}

interface NoteData {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
}

interface NoteResponse {
  message: string;
  data: NoteData;
}

test.describe.serial("Create and Update Notes API Testing", () => {
  const baseUrl: string = "https://practice.expandtesting.com";
  let token: string;
  let noteId: string;

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

  test("POST Request - Create Note", async ({ request }: { request: APIRequestContext }) => {
    const response: APIResponse = await request.post(`${baseUrl}/notes/api/notes`, {
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
      data: {
        title: "Playwright_Notes_API",
        description: "Created via Playwright API test",
        category: "Work",
      },
    });

    expect(response.status()).toBe(200);
    const responseBody: NoteResponse = await response.json();
    console.log("Create Note Response:", responseBody);

    expect(responseBody.message).toBe("Note successfully created");
    expect(responseBody.data.title).toBe("Playwright_Notes_API");
    noteId = responseBody.data.id;
  });

  test("PUT Request - Update Note", async ({ request }: { request: APIRequestContext }) => {
    const response: APIResponse = await request.put(`${baseUrl}/notes/api/notes/${noteId}`, {
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
      data: {
        title: "Playwright_Notes_API_Updated",
        description: "Updated via Playwright API",
        category: "Personal",
        completed: true,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody: NoteResponse = await response.json();
    console.log("Update Note Response:", responseBody);
    expect(responseBody.message).toBe("Note successfully Updated");
    expect(responseBody.data.title).toBe("Playwright_Notes_API_Updated");
    expect(responseBody.data.completed).toBe(true);
  });
});
