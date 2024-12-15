import { test, expect } from "@playwright/test";

test.describe("Dashboard Page Tests", () => {
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
		await page.goto("http://localhost:3000/dashboard");
	});

	test("All dashboard components are displayed", async ({ page }) => {
		await expect(page.locator("text=Resume Fit Score")).toBeVisible();
		// FitScoreChart's Rating component
		await expect(page.locator(".MuiRating-root")).toBeVisible();
		// Skills and Keywords Matched
		await expect(
			page.locator("text=Skills and Keywords Matched"),
		).toBeVisible();

		// Improvement Suggestions
		await expect(
			page.locator("text=Improvement Suggestions"),
		).toBeVisible();

		// Checkboxes
		await expect(page.locator('label:has-text("All")')).toBeVisible();
		await expect(page.locator('label:has-text("skills")')).toBeVisible();
		await expect(
			page.locator('label:has-text("experience")'),
		).toBeVisible();
	});
});
