import { expect, test } from "@playwright/test";

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
		// Mock backend API call for successful analyze
		await page.route("**/api/analyze", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify({
					isError: false,
					message: "Analysis successful.",
					data: {
						resumeAnalysis: ["hello", "world"],
						jobDescriptionAnalysis: {
							mustHave: ["useless"],
							niceToHave: ["hi", "hello"],
						},
						feedback: [
							{
								feedback: "do some stuff to it",
								category: "useless",
							},
						],
					},
				}),
			});
		});
		await page.route("**/api/fit-score", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify({
					isError: false,
					message: "success",
					fitScore: 50,
					matchedSkills: ["hello", "i matched skills"],
					feedback: [
						{
							category: "bad advice",
							feedback: "lie on your resume",
						},
					],
				}),
			});
		});
		await page.goto("http://localhost:3000/dashboard", {
			waitUntil: "networkidle",
		});
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
		await expect(page.locator('label:has-text("useless")')).toBeVisible();
		await expect(
			page.locator('span:has-text("lie on your resume")'),
		).toBeVisible();
		await expect(
			page.locator('span:has-text("do some stuff to it")'),
		).toBeVisible();
		await expect(
			page.locator('h2:has-text("Skills and Keywords Matched")'),
		).toBeVisible();
	});
});
