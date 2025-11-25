import { expect, Locator, Page } from '@playwright/test';

export class FeedbackPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly commentInput: Locator;
  readonly clearButton: Locator;
  readonly submitButton: Locator;
  readonly feedbackConfirm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByPlaceholder('Your Name');
    this.emailInput = page.getByRole('textbox', {name:'Your email address'});
    this.subjectInput = page.locator('#subject');
    this.commentInput = page.getByPlaceholder('Type your questions here...');
    this.clearButton = page.locator("input[type='reset']");
    this.submitButton = page.locator("input[type='submit']");
    this.feedbackConfirm = page.locator(".offset3")
  }

  async fillForm(name: string, email: string, subject: string, comment: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.commentInput.fill(comment);
  }

  async resetForm() {
    await this.clearButton.click();
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async assertReset() {
    await expect(this.nameInput).toBeEmpty();
    await expect(this.commentInput).toBeEmpty();
    await expect(this.emailInput).toBeEmpty();
    await expect(this.subjectInput).toBeEmpty();
  }

  async verifyFeedbackSubmission(name: string): Promise<void> {
  const expectedText = `Thank you for your comments, ${name}`;
  await expect(this.feedbackConfirm).toContainText(expectedText);
}
}
