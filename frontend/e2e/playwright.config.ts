import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests", // Test directory
	timeout: 20000, // Timeout for each test
	use: {
		baseURL: "http://localhost:3000", // Base URL for app
		headless: true, // Run in headless mode
	},
	webServer: {
		command: "npm run dev",
		url: "http://localhost:3000",
		reuseExistingServer: true,
	},
});
