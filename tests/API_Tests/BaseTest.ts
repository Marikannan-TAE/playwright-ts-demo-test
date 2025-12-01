import { APIRequestContext, APIResponse } from "@playwright/test";

interface LoginResponse {
  message: string;
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

export type NoteCreationResult = { token: string; noteId: string };
const BASE_URL = process.env.API_BASE_URL;

/**
 * Fetch access token using user credentials
 */
export async function AccessToken(
  email: string,
  password: string,
  request: APIRequestContext
): Promise<string> {
  console.log("Getting Access Token...");

  const response: APIResponse = await request.post(`${BASE_URL}/notes/api/users/login`, {
    headers: { "Content-Type": "application/json" },
    data: { email, password },
  });

  /*
    const response: APIResponse = await request.post(`${baseUrl}/notes/api/users/login`, {
      headers: { "Content-Type": "application/json" },
      data: {
        email: process.env.API_USER_EMAIL as string,
        password: process.env.API_USER_PASSWORD as string,
      },
  */
  if (response.status() !== 200) {
    throw new Error(`Failed to get token: ${response.status()} - ${response.statusText()}`);
  }

  const body: LoginResponse = await response.json();
  if (!body?.data?.token) {
    throw new Error("No token found in login response");
  }

  console.log("Access Token Retrieved");
  return body.data.token;
}

/**
 * Create a new note and return both token + note ID
 */
export async function Creating_notes_and_generating_id(
  request: APIRequestContext
): Promise<NoteCreationResult> {
  const email = process.env.API_USER_EMAIL;
  const password = process.env.API_USER_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing API_USER_EMAIL or API_USER_PASSWORD in environment variables");
  }

  const token = await AccessToken(email, password, request);

  console.log("Creating a new note and generating an ID...");

  const response: APIResponse = await request.post(`${BASE_URL}/notes/api/notes`, {
    headers: {
      "x-auth-token": token,
      "Content-Type": "application/json",
    },
    data: {
      title: `Playwright_Notes_${Date.now()}`,
      description: "Created via API automation",
      category: "Work",
    },
  });

  if (response.status() !== 200) {
    throw new Error(`Failed to create note: ${response.status()} - ${response.statusText()}`);
  }

  const body: CreateNoteResponse = await response.json();
  if (!body?.data?.id) {
    throw new Error("Note ID not found in create note response");
  }

  console.log(`Note created successfully with ID: ${body.data.id}`);
  return { token, noteId: body.data.id };
}
