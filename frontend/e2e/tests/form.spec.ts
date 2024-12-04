import { test, expect } from "@playwright/test";

test.describe("Form Page Tests", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000/form");
	});
});
