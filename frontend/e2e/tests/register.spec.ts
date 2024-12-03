import { test, expect } from "@playwright/test";
test.describe("Registration Page Tests", () => {
	/*
	test.beforeAll(async () => {
		// Make sure your Deno backend is running before the tests.
		console.log("Ensure Deno backend is running on http://localhost:3001");
	});
	*/
	test.beforeEach(async ({ page }) => {
		// Navigate to the registration page before each test
		await page.goto("http://localhost:3000/register");
	});

	test("Successful registration redirects to login", async ({ page }) => {
		// Fill out the registration form
		await page.fill('input[name="email"]', "test@example.com");
		await page.fill('input[name="username"]', "testuser");
		await page.fill('input[name="password"]', "TestPassword123");
		await page.fill('input[name="confirm_password"]', "TestPassword123");

		// Log before clicking submit
		console.log("Filled out registration form, clicking submit...");

		await page.click('button[type="submit"]');

		// Wait for the redirect to the login page
		await page.waitForURL("**/login");
		expect(page.url()).toContain("/login");
	});

	test("Shows error for empty fields", async ({ page }) => {
		await page.click('button[type="submit"]');
		const blankMessage = await page.locator(
			'[data-testid="blank-message"]',
		);
		await expect(blankMessage).toHaveText(
			"Please make sure you didn't leave any of the fields blank.",
		);
	});

	test("Shows error for password mismatch", async ({ page }) => {
		await page.fill('input[name="email"]', "test@example.com");
		await page.fill('input[name="username"]', "testuser");
		await page.fill('input[name="password"]', "TestPassword123");
		await page.fill(
			'input[name="confirm_password"]',
			"DifferentPassword123",
		);
		await page.click('button[type="submit"]');

		const passMessage = await page.locator('[data-testid="pass-message"]');
		await expect(passMessage).toHaveText(
			"Please make sure passwords match.",
		);
	});
});
