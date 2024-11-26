import { assert, assertEquals } from "@std/assert";
import { jobDescriptionUpload } from "./job_description.ts";
import { createMockContext } from "@oak/oak/testing";
import { createBody } from "../../util/util.test.ts";

Deno.test("Job Description - Valid Input", async () => {
	const ctx = createMockContext({
		body: createBody(
			JSON.stringify({
				jobDescription: "This is a valid job description.",
			}),
		),
		method: "POST",
		headers: [["Content-Type", "application/json"]],
		state: { sessionData: {} },
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
		body: createBody(
			JSON.stringify({
				jobDescription: "A".repeat(5001), // Exceeds 5,000 characters
			}),
		),
		method: "POST",
		headers: [["Content-Type", "application/json"]],
		state: { sessionData: {} },
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
