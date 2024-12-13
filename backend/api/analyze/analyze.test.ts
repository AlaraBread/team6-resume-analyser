import { assertEquals } from "@std/assert";
import { createMockContext } from "@oak/oak/testing";
import { Router } from "@oak/oak";
import analyze from "./analyze.ts";
import { createBody } from "../../util/util.test.ts";
import { restore, stub } from "@std/testing/mock";
import * as huggingface from "../huggingface/huggingface.ts";
import { createAnalyzeHandler } from "./analyze.ts";
import { AnalyzeResponse, ErrorResponse } from "../../interfaces/analyze.ts";

// FIXME: Fix "Cannot stub: non-configurable instance method"
Deno.test.ignore("POST /api/analyze - Valid Input", async () => {
	const mockAnalyzeTextHelper = stub(
		huggingface,
		"analyzeTextHelper",
		() =>
			Promise.resolve({
				fitScore: 85,
				feedback: ["Great alignment with job reqierments."],
			}),
	);

	const ctx = createMockContext({
		method: "POST",
		path: "/api/analyze",
		headers: [["Content-Type", "application/json"]],
		body: createBody(
			JSON.stringify({
				resumeText: "Resume content",
				jobDescription: "Job content",
			}),
		),
	});

	const router = new Router();
	router.post(
		"/api/analyze",
		createAnalyzeHandler({ analyzeTextHelper: mockAnalyzeTextHelper }),
	);

	const next = async () => {};

	await router.routes()(ctx, next);

	// Assertions
	const responseBody = ctx.response.body as AnalyzeResponse;
	assertEquals(ctx.response.status, 200);
	assertEquals(responseBody.isError, false);
	assertEquals(responseBody.message, "Analysis successful.");
	assertEquals(responseBody.data?.fitScore, 85);

	mockAnalyzeTextHelper.restore();
});

Deno.test("POST /api/analyze - Missing Input", async () => {
	restore();

	const ctx = createMockContext({
		method: "POST",
		path: "/api/analyze",
		headers: [["Content-Type", "application/json"]],
		body: createBody(
			JSON.stringify({
				jobDescription: "Job content", // Missing resumeText
			}),
		),
	});

	const router = new Router();
	analyze(router);

	const next = async () => {};

	await router.routes()(ctx, next);

	// Assertions
	const responseBody = ctx.response.body as ErrorResponse;
	assertEquals(ctx.response.status, 400);
	assertEquals(responseBody.isError, true);
	assertEquals(
		responseBody.message,
		"Both resumeText and jobDescription are required.",
	);
});

Deno.test("POST /api/analyze - Input Too Long", async () => {
	restore();

	const longText = "a".repeat(10001);

	const ctx = createMockContext({
		method: "POST",
		path: "/api/analyze",
		headers: [["Content-Type", "application/json"]],
		body: createBody(
			JSON.stringify({
				resumeText: longText,
				jobDescription: "Job content",
			}),
		),
	});

	const router = new Router();
	analyze(router);

	const next = async () => {};

	await router.routes()(ctx, next);

	// Assertions
	const responseBody = ctx.response.body as ErrorResponse;
	assertEquals(ctx.response.status, 400);
	assertEquals(responseBody.isError, true);
	assertEquals(
		responseBody.message,
		"Inputs must be strings and under 10000 characters.",
	);
});
