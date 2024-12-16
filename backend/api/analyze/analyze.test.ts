import { assertEquals } from "@std/assert";
import { createMockContext } from "@oak/oak/testing";
import { Router } from "@oak/oak";
import { analyzeHandler } from "./analyze.ts";
import { restore } from "@std/testing/mock";
import { SessionData } from "../../in_memory/in_memory.ts";
import {
	AnalyseResponse,
	analyzeText,
	generateResumeFeedback,
} from "../openai/openai.ts";

const mockAnalyzeText: typeof analyzeText = <T>(
	_inputText: string,
	type: T,
) => {
	if (type == "resume") {
		return Promise.resolve(["1", "2"] as AnalyseResponse<
			T
		>);
	} else {
		return Promise.resolve({
			mustHave: ["a", "b", "c"],
			niceToHave: ["x", "y"],
		} as AnalyseResponse<
			T
		>);
	}
};

const mockGenerateFeedback: typeof generateResumeFeedback = (
	_resumeText: string,
	_jobDescription: string,
) => Promise.resolve([{ feedback: "a", category: "b" }]);

Deno.test("POST /api/analyze - Valid Input", async () => {
	restore();

	const ctx = createMockContext({
		method: "POST",
		path: "/api/analyze",
		headers: [["Content-Type", "application/json"]],
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
		analyzeHandler.bind(undefined, mockAnalyzeText, mockGenerateFeedback),
	);

	const next = async () => {};

	await router.routes()(ctx, next);

	// Assertions
	const responseBody = ctx.response.body as {
		isError: boolean;
		message: string;
		data: {
			resumeAnalysis: string[];
			jobDescriptionAnalysis: {
				mustHave: string[];
				niceToHave: string[];
			};
			feedback: {
				feedback: string;
				category: string;
			}[];
		};
	};
	assertEquals(ctx.response.status, 200);
	assertEquals(responseBody.isError, false);
	assertEquals(responseBody.message, "Analysis successful.");
	assertEquals(responseBody.data.resumeAnalysis, ["1", "2"]);
	assertEquals(responseBody.data.jobDescriptionAnalysis, {
		mustHave: ["a", "b", "c"],
		niceToHave: ["x", "y"],
	});
	assertEquals(responseBody.data.feedback, [{ feedback: "a", category: "b" }]);
});

Deno.test("POST /api/analyze - Missing Input", async () => {
	restore();

	const ctx = createMockContext({
		method: "POST",
		path: "/api/analyze",
		headers: [["Content-Type", "application/json"]],
		state: {
			sessionData: {
				jobDescription: "Job content", // Missing resumeText
			} as SessionData,
		},
	});

	const router = new Router();
	router.post(
		"/api/analyze",
		analyzeHandler.bind(undefined, mockAnalyzeText, mockGenerateFeedback),
	);

	const next = async () => {};

	await router.routes()(ctx, next);

	// Assertions
	const responseBody = ctx.response.body as {
		isError: boolean;
		message: string;
	};
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
		state: {
			sessionData: {
				jobDescription: "Job content",
				resumeText: longText,
			} as SessionData,
		},
	});

	const router = new Router();
	router.post(
		"/api/analyze",
		analyzeHandler.bind(undefined, mockAnalyzeText, mockGenerateFeedback),
	);

	const next = async () => {};

	await router.routes()(ctx, next);

	// Assertions
	const responseBody = ctx.response.body as {
		isError: boolean;
		message: string;
	};
	assertEquals(ctx.response.status, 400);
	assertEquals(responseBody.isError, true);
	assertEquals(
		responseBody.message,
		"Resume or Job description too long.",
	);
});
