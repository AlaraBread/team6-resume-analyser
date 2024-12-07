import { test, expect } from "@playwright/test";

test.describe("Form Page Tests", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000/form");
	});

	test("Show error when job description is empty", async ({ page }) => {
		// Locate the job description field
		const jobDescriptionInput = page.locator(
			'textarea[placeholder="Enter job description"]',
		);
		const submitButton = page.locator(
			'button:has-text("Submit Job Description")',
		);
		const errorMessage = page.locator(
			"text=Job description cannot be empty.",
		);
		// Ensures empty job description
		await jobDescriptionInput.fill("");
		await submitButton.click();

		await expect(errorMessage).toBeVisible();
	});

	test("Show error when job description exceeds max length", async ({
		page,
	}) => {
		const jobDescriptionInput = page.locator(
			'textarea[placeholder="Enter job description"]',
		);
		const submitButton = page.locator(
			'button:has-text("Submit Job Description")',
		);
		const errorMessage = page.locator(
			"text=Job description must be under 5000 characters.",
		);
		// Generates a job description with 5001 characters
		const longDescription = "A".repeat(5001);

		// Fill with long string
		await jobDescriptionInput.fill(longDescription);
		await submitButton.click();
		await expect(errorMessage).toBeVisible();
	});
});
