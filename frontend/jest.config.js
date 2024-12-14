const nextJest = require("next/jest");

module.exports = nextJest({
	dir: "./",
})({
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	testEnvironment: "jsdom",
	testPathIgnorePatterns: ["e2e/.*"],
});
