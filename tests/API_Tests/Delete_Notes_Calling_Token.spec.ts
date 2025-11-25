import { test, expect, APIRequestContext, APIResponse } from "@playwright/test";
import { AccessToken } from "./BaseTest";

interface NoteResponse {
  message: string;
  data: {
    id: string;
    title: string;
    description: string;
    category: string;
    completed?: boolean;
  };
}

test.describe.serial("Create, Update, and Delete Notes API Testing", () => {
  const baseUrl: string = "https://practice.expandtesting.com";
  let token: string;
  let noteId: string;
  let updatedNoteId: string;

  test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
    token = await AccessToken(process.env.API_USER_EMAIL as string, process.env.API_USER_PASSWORD as string, request);
    expect(token).toBeTruthy();
    console.log("Access Token:", token);
  });

  
  test("POST Request - Create Note", async ({ request }: { request: APIRequestContext }) => {
    const response: APIResponse = await request.post(`${baseUrl}/notes/api/notes`, {
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
      data: {
        title: "Playwright_Notes",
        description: "Created via API",
        category: "Work",
      },
    });

    expect(response.status()).toBe(200);
    const responseBody: NoteResponse = await response.json();
    console.log("Create Note Response:", responseBody);

    expect(responseBody.message).toBe("Note successfully created");
    expect(responseBody.data.title).toBe("Playwright_Notes");
    noteId = responseBody.data.id;
  });


  test("PUT Request - Update Note", async ({ request }: { request: APIRequestContext }) => {
    const response: APIResponse = await request.put(`${baseUrl}/notes/api/notes/${noteId}`, {
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
      data: {
        title: "Playwright_Notes_Updated",
        description: "Updated via PUT API request",
        category: "Personal",
        completed: true,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody: NoteResponse = await response.json();
    console.log("Update Note Response:", responseBody);

    expect(responseBody.message).toBe("Note successfully Updated");
    expect(responseBody.data.title).toBe("Playwright_Notes_Updated");
    updatedNoteId = responseBody.data.id;
  });


  test("DELETE Request - Delete Note", async ({ request }: { request: APIRequestContext }) => {
    const response: APIResponse = await request.delete(`${baseUrl}/notes/api/notes/${updatedNoteId}`, {
      headers: {
        "x-auth-token": token,
        Accept: "application/json",
      },
    });

    expect(response.status()).toBe(200);
    const responseBody: { message: string } = await response.json();
    console.log("Delete Note Response:", responseBody);
    expect(responseBody.message).toBe("Note successfully deleted");
  });
});
