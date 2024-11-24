import { assertEquals } from "@std/assert";
import { jobDescriptionUpload } from "./job_description_upload.ts";
import { createMockContext } from "@oak/oak/testing";

Deno.test("Job Description - Valid Input", async () => {
	const ctx = createMockContext({
		body: ReadableStream.from(
			JSON.stringify({
				job_description: "This is a valid job description.",
			}),
		),
		method: "POST",
		headers: [["Content-Type", "application/json"]],
	});

	const response = await jobDescriptionUpload(ctx);
	const responseBody = await response.json();

	assertEquals(response.status, 200);
	assertEquals(
		responseBody.message,
		"Job description submitted successfully.",
	);
});

Deno.test("Job Description - Exceeds Character Limit", async () => {
	const ctx = createMockContext({
		body: ReadableStream.from(
			JSON.stringify({
				job_description: "A".repeat(5001), // Exceeds 5,000 characters
			}),
		),
		method: "POST",
		headers: [["Content-Type", "application/json"]],
	});

	const response = await jobDescriptionUpload(ctx);
	const responseBody = await response.json();

	assertEquals(response.status, 400);
	assertEquals(
		responseBody.error,
		"Job description exceeds character limit.",
	);
});
