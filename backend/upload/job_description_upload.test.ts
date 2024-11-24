import { assert, assertEquals } from "@std/assert";
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

	await jobDescriptionUpload(ctx);
	const responseBody = JSON.parse(ctx.response.body as string);

	assertEquals(ctx.response.status, 200);
	assert(!responseBody.isError);
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

	await jobDescriptionUpload(ctx);
	const responseBody = JSON.parse(ctx.response.body as string);

	assertEquals(ctx.response.status, 400);
	assert(responseBody.isError);
	assertEquals(
		responseBody.message,
		"Job description exceeds character limit.",
	);
});
