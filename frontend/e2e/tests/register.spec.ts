import { expect, test } from "@playwright/test";
test.describe("Registration Page Tests", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the registration page before each test
		await page.goto("http://localhost:3000/register");
	});

	// Combinations of fields to test
	const fieldCombinations = [
		{ field: 'input[name="email"]' },
		{ field: 'input[name="username"]' },
		{ field: 'input[name="password"]' },
		{ field: 'input[name="confirm_password"]' },
	];

	test("All registration components are displayed", async ({ page }) => {
		// Check for 'Registration'
		const registrationHeading = page.locator("h1");
		await expect(registrationHeading).toHaveText("Registration");
		await expect(registrationHeading).toBeVisible();

		// Check for 'Register'
		const registerCardHeader = page.locator("h2");
		await expect(registerCardHeader).toHaveText("Register");
		await expect(registerCardHeader).toBeVisible();

		// Verify the presence of each field
		await expect(page.locator('input[name="email"]')).toBeVisible();
		await expect(page.locator('input[name="username"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
		await expect(
			page.locator('input[name="confirm_password"]'),
		).toBeVisible();
		// Verify the submit button is present
		await expect(page.locator('button[type="submit"]')).toBeVisible();
	});

	test("Successful registration redirects to login", async ({ page }) => {
		await page.route("**/api/register", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify({
					email: "b@b.com",
					username: "b",
					password: "b",
				}),
			});
		});
		// Fill out the registration form
		await page.fill('input[name="email"]', "test@example.com");
		await page.fill('input[name="username"]', "testuser");
		await page.fill('input[name="password"]', "TestPassword123");
		await page.fill('input[name="confirm_password"]', "TestPassword123");
		await page.click('button[type="submit"]');

		// Wait for the redirect to the login page
		await page.waitForURL("**/login");
		expect(page.url()).toContain("/login");
	});

	test("Show error for an empty field", async ({ page }) => {
		const data = {
			'input[name="email"]': "test123@example.com",
			'input[name="username"]': "testuser123",
			'input[name="password"]': "TestPassword101",
			'input[name="confirm_password"]': "TestPassword101",
		};

		for (const combo of fieldCombinations) {
			for (const [field, value] of Object.entries(data)) {
				if (field !== combo.field) {
					await page.fill(field, value);
				}
			}
			// Leave current field blank and submit
			await page.fill(combo.field, "");
			await page.click('button[type="submit"]');
			const blankMessage = await page.locator(
				'[data-testid="blank-message"]',
			);
			await expect(blankMessage).toHaveText(
				"Please make sure you didn't leave any of the fields blank.",
			);
			// Reset the form for the next iteration
			await page.reload();
		}
	});

	test("Shows error for all empty fields", async ({ page }) => {
		await page.click('button[type="submit"]');
		const blankMessage = await page.locator(
			'[data-testid="blank-message"]',
		);
		await expect(blankMessage).toHaveText(
			"Please make sure you didn't leave any of the fields blank.",
		);
	});

	test("Shows error for email format", async ({ page }) => {
		await page.fill('input[name="email"]', "test12.com");
		await page.fill('input[name="username"]', "testuser123");
		await page.fill('input[name="password"]', "TestPassword101");
		await page.fill('input[name="confirm_password"]', "TestPassword101");
		await page.click('button[type="submit"]');

		const emailMessage = await page.locator(
			'[data-testid="email-message"]',
		);
		await expect(emailMessage).toHaveText(
			"Please enter a valid email address.",
		);
	});

	test("Shows error for password mismatch", async ({ page }) => {
		await page.fill('input[name="email"]', "test123@example.com");
		await page.fill('input[name="username"]', "testuser123");
		await page.fill('input[name="password"]', "TestPassword101");
		await page.fill(
			'input[name="confirm_password"]',
			"DifferentPassword101",
		);
		await page.click('button[type="submit"]');

		const passMessage = await page.locator('[data-testid="pass-message"]');
		await expect(passMessage).toHaveText(
			"Please make sure passwords match.",
		);
	});

	test("Shows error message for already registered email", async ({
		page,
	}) => {
		// Mock backend API call to indicate email is already registered
		await page.route("**/api/register", (route) => {
			route.fulfill({
				status: 400,
				body: JSON.stringify({
					message: "Email already registered",
				}),
			});
		});

		// Fill out the form with the registered email
		await page.fill('input[name="email"]', "test@example.com");
		await page.fill('input[name="username"]', "testuser123");
		await page.fill('input[name="password"]', "TestPassword101");
		await page.fill('input[name="confirm_password"]', "TestPassword101");

		// Click the login button
		await page.click('button[type="submit"]');

		// Verify the error message is displayed
		const backendMessage = await page.locator(
			'[data-testid="backend-register-post"]',
		);
		await expect(backendMessage).toHaveText("Email already registered");
	});
});
