import { assertEquals } from "@std/assert";
import { createMockContext } from "@oak/oak/testing";
import { Router } from "@oak/oak";
import analyze, { analyzeHandler } from "./analyze.ts";
import { createBody } from "../../util/util.test.ts";
import { restore } from "@std/testing/mock";
import {
	AnalyzeResponse,
	ErrorResponse,
} from "../../interfaces/openai_interface.ts";
import { SessionData } from "../../in_memory/in_memory.ts";

Deno.test("POST /api/analyze - Valid Input", async () => {
	restore();
	const mockAnalyzeTextHelper = () =>
		Promise.resolve({
			fitScore: 85,
			feedback: ["Great alignment with job reqierments."],
		});

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
		state: {
			sessionData: {
				resumeText: "my resume",
				jobDescription: "my job description",
			} as SessionData,
		},
	});

	const router = new Router();
	router.post(
		"/api/analyze",
		analyzeHandler.bind(undefined, mockAnalyzeTextHelper),
	);

	const next = async () => {};

	await router.routes()(ctx, next);

	// Assertions
	const responseBody = ctx.response.body as AnalyzeResponse;
	assertEquals(ctx.response.status, 200);
	assertEquals(responseBody.isError, false);
	assertEquals(responseBody.message, "Analysis successful.");
	assertEquals(responseBody.data?.fitScore, 85);
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
		"You must upload a resume and job description.",
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
		"You must upload a resume and job description.",
	);
});
