import { test, expect, APIRequestContext, APIResponse } from "@playwright/test";
import { Creating_notes_and_generating_id } from "./BaseTest"; // Must return { token: string; noteId: string; }

test.describe("Delete Notes API Testing", () => {
  let token: string;
  let noteId: string;
  const baseUrl: string = process.env.API_BASE_URL || "https://practice.expandtesting.com";

  test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
    const result = await Creating_notes_and_generating_id(request);

    token = result.token;
    noteId = result.noteId;

    expect(token).toBeTruthy();
    expect(noteId).toBeTruthy();

    console.log("Access Token:", token);
    console.log("Note ID:", noteId);
  });


  test("DELETE Request - Delete Note", async ({ request }: { request: APIRequestContext }) => {
    const response: APIResponse = await request.delete(
      `${baseUrl}/notes/api/notes/${noteId}`,
      {
        headers: {
          "x-auth-token": token,
          Accept: "application/json",
        },
      }
    );

    expect(response.status(), "Expected 200 status for successful deletion").toBe(200);

    interface DeleteNoteResponse {
      message: string;
      data?: { id?: string };
    }

    const responseBody: DeleteNoteResponse = await response.json();
    console.log("Delete Note Response:", responseBody);
    expect(responseBody.message).toBe("Note successfully deleted");
  });
});
