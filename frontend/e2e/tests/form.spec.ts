import { expect, test } from "@playwright/test";

test.describe("Form Page Tests", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000/login");

		// Mock backend API call for successful login
		await page.route("**/api/login", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify({
					message: "Login successful",
					token: "jwt-token",
				}),
			});
		});

		// Fill out the form with valid credentials
		await page.fill('input[name="email"]', "test@example.com");
		await page.fill('input[name="password"]', "TestPassword123");
		// Click the login button
		await page.click('button[type="submit"]');

		await page.waitForURL("**/form");
	});

	test("All form components are displayed", async ({ page }) => {
		const registrationHeading = page.locator("h1");
		await expect(registrationHeading).toHaveText(
			"Resume and Job Description",
		);
		await expect(registrationHeading).toBeVisible();

		await expect(page.locator("text=Resume Upload")).toBeVisible();
		const jobDescriptionLocator = page.locator(
			'.MuiTypography-root.MuiTypography-h5.MuiCardHeader-title.css-16xl4zq-MuiTypography-root:has-text("Job Description")',
		);
		await expect(jobDescriptionLocator).toBeVisible();

		// Textarea for job description
		const jobDescriptionInput = page.locator(
			'textarea[placeholder="Enter job description"]',
		);

		await expect(jobDescriptionInput).toBeVisible();

		// Submit button for job description
		const submitButtonDescription = page.locator(
			'button:has-text("Submit Job Description")',
		);

		await expect(submitButtonDescription).toBeVisible();

		// Submit button for Resume
		const submitButtonResume = page.locator(
			'button:has-text("Submit Resume")',
		);

		await expect(submitButtonResume).toBeVisible();

		// Upload Resume Button ("UPLOAD RESUME")

		const uploadResumeButton = page.getByRole("button", {
			name: "UPLOAD RESUME",
		});
		await expect(uploadResumeButton).toBeVisible();
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
		await jobDescriptionInput.fill("");
		// Generates a job description with 5001 characters
		const longDescription = "A".repeat(5001);

		// Fill with long string
		await jobDescriptionInput.fill(longDescription);
		await submitButton.click();
		await expect(errorMessage).toBeVisible();
	});

	test("File name is displayed when selected", async ({ page }) => {
		// Locate the file input directly
		const fileInput = page.locator('input[type="file"][name="file"]');

		// Simulate selecting a file by setting input files
		await fileInput.setInputFiles({
			name: "resume.pdf",
			mimeType: "application/pdf",
			// Content within file
			buffer: Buffer.from("This is a test PDF file content."),
		});

		// Verify the file name is displayed in the UI
		const selectedFileMessage = page.locator(
			"text=Selected File: resume.pdf",
		);
		await expect(selectedFileMessage).toBeVisible();
	});

	test("File size error is displayed for files over 2MB", async ({
		page,
	}) => {
		const fileInput = page.locator('input[type="file"][name="file"]');

		// Simulate a large file (2.1 MB)
		const largeFileBuffer = Buffer.alloc(2.1 * 1024 * 1024, "a");
		await fileInput.setInputFiles({
			name: "largefile.pdf",
			mimeType: "application/pdf",
			buffer: largeFileBuffer,
		});

		const submitButtonResume = page.locator(
			'button:has-text("Submit Resume")',
		);

		await submitButtonResume.click();
		// Check for the error message
		const errorMessage = page.locator("text=File size must be under 2MB");
		await expect(errorMessage).toBeVisible();
	});

	test("Shows error for no file uploaded", async ({ page }) => {
		// Locate the file input and submit button
		const fileInput = page.locator('input[type="file"][name="file"]');
		const submitButtonResume = page.locator(
			'button:has-text("Submit Resume")',
		);

		// Ensure no file is uploaded
		await fileInput.setInputFiles([]); // Clears any selected file

		await submitButtonResume.click();

		// Check if the error message appears
		const errorMessage = page.locator("text=Please select a file");
		await expect(errorMessage).toBeVisible();
	});

	/*
	const submitButtonResume = page.locator(
			'button:has-text("Submit Resume")',
		);

		await submitButtonResume.click();
	*/
	/*
	TODO: Edit successMessage or the alike when form is completed
	test("Test for valid job description", async ({ page }) => {
		const jobDescriptionInput = page.locator(
			'textarea[placeholder="Enter job description"]',
		);
		const submitButton = page.locator(
			'button:has-text("Submit Job Description")',
		);
		const successMessage = page.locator("");
		await jobDescriptionInput.fill("");
		// Generates a job description with valid length
		const validDescription = "A".repeat(300);

		// Fill with description
		await jobDescriptionInput.fill(validDescription);
		await submitButton.click();
		await expect(successMessage).toBeVisible();
	});
	*/
});
