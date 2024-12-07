import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e/tests", // Test directory
	timeout: 30000, // Timeout for each test
	use: {
		baseURL: "http://localhost:3000", // Base URL for app
		headless: true, // Run in headless mode
	},
});
