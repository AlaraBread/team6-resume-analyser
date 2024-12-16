import { assert, assertEquals, assertRejects } from "@std/assert";
import { assertSpyCalls, restore, stub } from "@std/testing/mock";
import { analyzeText, generateResumeFeedback } from "./openai.ts";
import { OpenAIResponse } from "../../interfaces/openai_interface.ts";

// -------------------- Live tests to connect to the OpenAI API -----------------------------------
Deno.test.ignore(
	"analyzeText - Live API Call with Job Description",
	async () => {
		const apiKey = Deno.env.get("OPENAI_API_KEY");

		// Assert that the API key exists
		if (!apiKey || apiKey.trim() === "") {
			throw new Error("OPENAI_API_KEY is not set or is empty.");
		}

		// Test job description
		const jobDescription = `
      We are looking for a results-driven Data Scientist with a strong background in machine learning, statistical analysis, and data visualization. The role involves building predictive models, analyzing large datasets, and providing actionable insights to support business decisions. Proficiency in Python, R, SQL, and tools like Tableau or Power BI is required. Experience with big data frameworks such as Hadoop or Spark is a plus.
    `;

		// Call the actual function
		const result = await analyzeText(jobDescription, "jobDescription");

		// Assertions: Validate the response contains expected formatting
		assert(
			result.mustHave.includes("machine learning"),
			"Expected the must have response to include machine learning",
		);
		assert(
			result.niceToHave.includes("Spark"),
			"Expected the nice to have response to include spark",
		);
	},
);

// Live tests to connect to the OpenAI API
Deno.test.ignore("analyzeText - Live API Call with Resume", async () => {
	const apiKey = Deno.env.get("OPENAI_API_KEY");

	// Assert that the API key exists
	if (!apiKey || apiKey.trim() === "") {
		throw new Error("OPENAI_API_KEY is not set or is empty.");
	}

	// Test resume content
	const resumeText = `
      Experienced Data Scientist with a strong foundation in predictive modeling, statistical analysis, and machine learning techniques. Proficient in Python, R, and SQL, with hands-on experience creating dashboards in Tableau. Skilled in analyzing complex datasets to derive actionable insights, leading to successful project outcomes.
    `;

	// Call the actual function
	const result = await analyzeText(resumeText, "resume");
	console.log(result);

	// Assertions: Validate the response contains expected formatting
	assert(
		result.includes("machine learning"),
		"Expected the response to include machine learning",
	);
});

Deno.test.ignore("generateResumeFeedback - Live API Call", async () => {
	const apiKey = Deno.env.get("OPENAI_API_KEY");

	// Assert that the API key exists
	if (!apiKey || apiKey.trim() === "") {
		throw new Error("OPENAI_API_KEY is not set or is empty.");
	}

	const resumeText = `
      Experienced Data Scientist with expertise in predictive modeling, data analysis, and machine learning. Proficient in Python, R, and SQL, with experience using Tableau for visualization.
    `;
	const jobDescription = `
      We are seeking a Data Scientist skilled in machine learning, data analysis, and statistical modeling. Experience with Python, R, SQL, and data visualization tools like Tableau is required.
    `;

	// Call the actual function
	const result = await generateResumeFeedback(resumeText, jobDescription);

	//console.log("API Response:\n", result.feedback);

	// Assertions: Validate the response contains feedback
	assertEquals(
		Array.isArray(result),
		true,
		"Feedback should be an array.",
	);
	assertEquals(
		result.length > 0,
		true,
		"Feedback array should not be empty.",
	);
});
// -------------------- Live tests to connect to the OpenAI API -----------------------------------

// Mocked tests to verify function logic without live API
Deno.test("analyzeText - Valid Input for Job Description (Mocked)", async () => {
	restore();
	stub(Deno.env, "get", () => "api-key");

	// Mock the fetch API for a successful response
	const mockFetch = stub(globalThis, "fetch", () =>
		Promise.resolve(
			new Response(
				JSON.stringify({
					choices: [
						{
							message: {
								role: "assistant",
								content: "Must-have: Python, AWS; Nice-to-have: Docker",
							},
						},
					],
				} as OpenAIResponse),
				{ status: 200 },
			),
		));

	const jobDescription = "Looking for a Python developer with AWS expertise.";
	const result = await analyzeText(jobDescription, "jobDescription");

	// Assertions
	assertEquals(result, { mustHave: ["Python", "AWS"], niceToHave: ["Docker"] });
	assertSpyCalls(mockFetch, 1);

	// Clean up
	mockFetch.restore();
});

Deno.test("analyzeText - Valid Input for Job Description (Mocked)", async () => {
	restore();
	stub(Deno.env, "get", () => "api-key");

	// Mock the fetch API for a successful response
	const mockFetch = stub(globalThis, "fetch", () =>
		Promise.resolve(
			new Response(
				JSON.stringify({
					choices: [
						{
							message: {
								role: "assistant",
								content: "Python, AWS, Docker",
							},
						},
					],
				} as OpenAIResponse),
				{ status: 200 },
			),
		));

	const jobDescription = "Looking for a Python developer with AWS expertise.";
	const result = await analyzeText(jobDescription, "resume");

	// Assertions
	assertEquals(result, ["Python", "AWS", "Docker"]);
	assertSpyCalls(mockFetch, 1);

	// Clean up
	mockFetch.restore();
});

Deno.test("analyzeText - API Key Missing (Mocked)", async () => {
	restore();

	// Mock environment variable to simulate missing API key
	const mockEnvGet = stub(Deno.env, "get", () => undefined);

	const jobDescription = "Looking for a Python developer with AWS expertise.";

	await assertRejects(
		() => analyzeText(jobDescription, "jobDescription"),
		Error,
		"OpenAI API key is not set in the environment.",
	);

	assertSpyCalls(mockEnvGet, 1);

	// Clean up
	mockEnvGet.restore();
});

Deno.test("analyzeText - Invalid Input (Mocked)", async () => {
	restore();
	stub(Deno.env, "get", () => "api-key");
	const longInput = "a".repeat(10001); // Exceeds the character limit

	await assertRejects(
		() => analyzeText(longInput, "resume"),
		Error,
		"Character limit exceeded or invalid input.",
	);
});

Deno.test("analyzeText - API Error Response (Mocked)", async () => {
	restore();
	stub(Deno.env, "get", () => "api-key");

	// Mock the fetch API for an API error response
	const mockFetch = stub(globalThis, "fetch", () =>
		Promise.resolve(
			new Response("Internal Server Error", {
				status: 500,
				statusText: "Internal Server Error",
			}),
		));

	const resumeText = "Experienced software engineer proficient in Python.";
	await assertRejects(
		() => analyzeText(resumeText, "resume"),
		Error,
		"OpenAI API Error: 500 Internal Server Error",
	);

	assertSpyCalls(mockFetch, 1);

	// Clean up
	mockFetch.restore();
});
