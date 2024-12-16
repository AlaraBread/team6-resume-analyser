import { createMockContext } from "@oak/oak/testing";
import { fitScore } from "./fit_score.ts";
import { createBody } from "../../util/util.test.ts";
import { assert, assertAlmostEquals, assertEquals } from "@std/assert";

Deno.test("/api/fit-score - with keywords", async () => {
	const ctx = createMockContext({
		body: createBody(JSON.stringify({
			resumeKeywords: ["notmissing1", "unused1", "notmissing2", "unused2"],
			jobDescriptionKeywords: {
				niceToHave: ["notmissing1", "missing1", "missing2"],
				mustHave: ["missing3", "missing4", "notmissing2"],
			},
		})),
	});
	await fitScore(ctx);
	assertEquals(ctx.response.status, 200);
	const response = JSON.parse(ctx.response.body as string);
	assertEquals(response.isError, false);
	assertEquals(response.message, "success");
	type FeedbackType = { feedback: string; category: string };
	assert(
		response.feedback.find((feedback: FeedbackType) =>
			feedback.feedback.includes("missing1")
		) != undefined,
	);
	assert(
		response.feedback.find((feedback: FeedbackType) =>
			feedback.feedback.includes("missing2")
		) != undefined,
	);
	assert(
		response.feedback.find((feedback: FeedbackType) =>
			feedback.feedback.includes("missing3")
		) != undefined,
	);
	assert(
		response.feedback.find((feedback: FeedbackType) =>
			feedback.feedback.includes("missing4")
		) != undefined,
	);
	assert(
		response.feedback.find((feedback: FeedbackType) =>
			feedback.feedback.includes("notmissing1")
		) == undefined,
	);
	assert(
		response.feedback.find((feedback: FeedbackType) =>
			feedback.feedback.includes("notmissing2")
		) == undefined,
	);
	assert(
		response.feedback.find((feedback: FeedbackType) =>
			feedback.feedback.includes("unused1")
		) == undefined,
	);
	assert(
		response.feedback.find((feedback: FeedbackType) =>
			feedback.feedback.includes("unused2")
		) == undefined,
	);
	assertAlmostEquals(response.fitScore, 33.3333333);
	assert(response.matchedSkills.includes("notmissing1"));
	assert(response.matchedSkills.includes("notmissing2"));
});

Deno.test("/api/fit-score - with empty arrays", async () => {
	const ctx = createMockContext({
		body: createBody(JSON.stringify({
			resumeKeywords: [],
			jobDescriptionKeywords: {
				niceToHave: [],
				mustHave: [],
			},
		})),
	});
	await fitScore(ctx);
	assertEquals(ctx.response.status, 200);
	const response = JSON.parse(ctx.response.body as string);
	assertEquals(response.isError, false);
	assertEquals(response.message, "success");
});

Deno.test("/api/fit-score - malformed request", async () => {
	const ctx = createMockContext({
		body: createBody(JSON.stringify({
			resumeKeywords: 0.0,
			jobDescriptionKeywords: {
				niceToHave: [],
				mustHave: [],
			},
		})),
	});
	await fitScore(ctx);
	assertEquals(ctx.response.status, 400);
});
