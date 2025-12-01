import { test, expect, APIRequestContext, APIResponse } from "@playwright/test";
import testData from "../TestData/Create_Token.json"; 

interface TestCase {
  TestCase_ID: string;
  email: string;
  password: string;
  exp_status_code: number;
  exp_res: string;
}

interface LoginResponse {
  message: string;
  data?: {
    token?: string;
    [key: string]: any;
  };
}

const { testCases } = testData as { testCases: TestCase[] };

for (const testCase of testCases) {
  test(`Login API Test - ${testCase.TestCase_ID}`, async ({ request }: { request: APIRequestContext }) => {
    const loginUrl = "https://practice.expandtesting.com/notes/api/users/login";

    const requestBody: { email: string; password: string } = {
      email: testCase.email,
      password: testCase.password,
    };

    const response: APIResponse = await request.post(loginUrl, {
      data: requestBody,
      headers: { "Content-Type": "application/json" },
    });

    expect(response.status(), `Expected ${testCase.exp_status_code}`).toBe(testCase.exp_status_code);
    const responseBody: LoginResponse = await response.json();
    expect(responseBody.message).toBe(testCase.exp_res);
    console.log(`${testCase.TestCase_ID} completed — ${responseBody.message}`);

    if (testCase.exp_status_code === 200 && responseBody.data?.token) {
      console.log(`Auth Token: ${responseBody.data.token}`);
    } else if (response.status() !== 200) {
      console.warn(`${testCase.TestCase_ID} failed — Status: ${response.status()}`);
    }
  });
}
