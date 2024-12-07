import { test, expect } from "@playwright/test";

test.describe("Login Page Tests", () => {
	// Navigate to the login page for every test
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000/login");
	});

	// Combinations of fields to test
	const fieldCombinations = [
		{ field: 'input[name="email"]' },
		{ field: 'input[name="password"]' },
	];

	test("Shows error for an empty field", async ({ page }) => {
		// Fill out the form with credentials (one field left blank)
		const data = {
			'input[name="email"]': "test@example.com",
			'input[name="password"]': "TestPassword123",
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

	test("Shows error for empty fields", async ({ page }) => {
		await page.click('button[type="submit"]');
		const blankMessage = await page.locator(
			'[data-testid="blank-message"]',
		);
		await expect(blankMessage).toHaveText(
			"Please make sure you didn't leave any of the fields blank.",
		);
	});

	test("Navigates on successful login", async ({ page }) => {
		// Mock backend API call for successful login
		await page.route("**/api/login", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify({ message: "Login successful" }),
			});
		});

		// Fill out the form with valid credentials
		await page.fill('input[name="email"]', "test@example.com");
		await page.fill('input[name="password"]', "TestPassword123");

		// Click the login button
		await page.click('button[type="submit"]');

		// TODO: Update so it redirects to dashboard (maybe?)
		await page.waitForURL("**/form");
		expect(page.url()).toContain("/form");
	});

	test("Displays error for login failure", async ({ page }) => {
		// Mock backend API call for failed login
		await page.route("**/api/login", (route) => {
			route.fulfill({
				status: 401,
				body: JSON.stringify({ message: "Invalid email or password" }),
			});
		});

		// Fill out the form with incorrect credentials
		await page.fill('input[name="email"]', "test@example.com");
		await page.fill('input[name="password"]', "WrongPassword123");

		// Click the login button
		await page.click('button[type="submit"]');

		// Verify error message is displayed
		const backendMessage = await page.locator(
			'[data-testid="backend-login-post"]',
		);
		await expect(backendMessage).toHaveText("Invalid email or password");
	});
});
