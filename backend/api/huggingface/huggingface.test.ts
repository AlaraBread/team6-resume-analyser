import { assertEquals, assertRejects } from "@std/assert";
import { assertSpyCalls, restore, stub } from "@std/testing/mock";
import { analyzeText } from "./huggingface.ts";

// Test: API returns an error response
Deno.test("analyzeText - API Error Response", async () => {
	restore();

	// Mock fetch for an API error response
	const mockFetch = stub(globalThis, "fetch", () => {
		return Promise.resolve(
			new Response("Internal Server Error", {
				status: 500,
				statusText: "Internal Server Error",
			}),
		);
	});

	// Mock environment variable
	const mockEnvGet = stub(Deno.env, "get", (key: string) => {
		if (key === "HUGGINGFACE_API_KEY") return "mock_api_key";
		return undefined;
	});

	// Define inputs
	const resumeText =
		"Experienced software engineer with Python and AWS skills.";
	const jobDescription = "Looking for a Python developer with AWS expertise.";

	// Expect rejection with specific error message
	await assertRejects(
		async () => await analyzeText(resumeText, jobDescription),
		Error,
		"Hugging Face API Error: 500 Internal Server Error",
	);

	// Assertions
	assertSpyCalls(mockFetch, 1); // Ensure fetch was called
	assertSpyCalls(mockEnvGet, 1); // Ensure env variable was accessed

	// Clean up
	mockFetch.restore();
	mockEnvGet.restore();
});

// Test: Missing API key in environment variables
Deno.test("analyzeText - Missing API Key", async () => {
	restore();

	// Mock environment to simulate missing API key
	const mockEnvGet = stub(Deno.env, "get", () => undefined);

	// Define inputs
	const resumeText =
		"Experienced software engineer with Python and AWS skills.";
	const jobDescription = "Looking for a Python developer with AWS expertise.";

	// Expect rejection with specific error message
	await assertRejects(
		async () => await analyzeText(resumeText, jobDescription),
		Error,
		"Hugging Face API key is not set in the environment.",
	);

	// Assertions
	assertSpyCalls(mockEnvGet, 1); // Ensure env variable was accessed

	// Clean up
	mockEnvGet.restore();
});

Deno.test("analyzeText - Valid Response with Custom Payload", async () => {
	restore();

	// Mock fetch for a successful API call
	const mockFetch = stub(
		globalThis,
		"fetch",
		(input: string | URL | Request, init?: RequestInit) => {
			// Ensure input is processed if needed (e.g., handle URL or Request objects)
			if (typeof input === "string") {
				// Simplified Fix: Use a direct type assertion for `init.body`
				const requestBody = JSON.parse((init?.body as string) || "{}");
				assertEquals(requestBody.inputs.source_sentence, "Custom Resume Text");
				assertEquals(requestBody.inputs.sentences[0], "Custom Job Description");
			}

			return Promise.resolve(
				new Response(
					JSON.stringify({ similarity_score: 0.92 }),
					{ status: 200 },
				),
			);
		},
	);

	// Mock environment variable
	const mockEnvGet = stub(Deno.env, "get", (key: string) => {
		if (key === "HUGGINGFACE_API_KEY") return "mock_api_key";
		return undefined;
	});

	// Define inputs
	const resumeText = "Custom Resume Text";
	const jobDescription = "Custom Job Description";

	// Call the function
	const result = await analyzeText(resumeText, jobDescription);

	// Assertions
	assertEquals(result.similarity_score, 0.92); // Check API response
	assertSpyCalls(mockFetch, 1); // Ensure fetch was called
	assertSpyCalls(mockEnvGet, 1); // Ensure env variable was accessed

	// Clean up
	mockFetch.restore();
	mockEnvGet.restore();
});

// Test: Empty input for resumeText or jobDescription
Deno.test("analyzeText - Empty Input", async () => {
	restore();

	// Mock fetch for a successful API call
	const mockFetch = stub(globalThis, "fetch", () => {
		return Promise.resolve(
			new Response(
				JSON.stringify({ similarity_score: 0.0 }),
				{ status: 200 },
			),
		);
	});

	// Mock environment variable
	const mockEnvGet = stub(Deno.env, "get", (key: string) => {
		if (key === "HUGGINGFACE_API_KEY") return "mock_api_key";
		return undefined;
	});

	// Define empty inputs
	const resumeText = "";
	const jobDescription = "";

	// Call the function
	const result = await analyzeText(resumeText, jobDescription);

	// Assertions
	assertEquals(result.similarity_score, 0.0); // Check that similarity is 0 for empty inputs
	assertSpyCalls(mockFetch, 1); // Ensure fetch was called
	assertSpyCalls(mockEnvGet, 1); // Ensure env variable was accessed

	// Clean up
	mockFetch.restore();
	mockEnvGet.restore();
});
