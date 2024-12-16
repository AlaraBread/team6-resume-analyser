import { Context, Middleware, Router } from "@oak/oak";
import { analyzeText, generateResumeFeedback } from "../openai/openai.ts";
import { SessionData } from "../../in_memory/in_memory.ts";

export default function (router: Router, sessionMiddleware: Middleware) {
	router.post(
		"/api/analyze",
		sessionMiddleware,
		analyzeHandler.bind(undefined, analyzeText, generateResumeFeedback),
	);
}

export const MAX_TEXT_LENGTH = 10000;

export async function analyzeHandler(
	analyze: typeof analyzeText,
	getFeedback: typeof generateResumeFeedback,
	ctx: Context,
) {
	// Retrieve session data
	const sessionData = ctx.state.sessionData as SessionData | null;

	// Validate session data
	if (
		!sessionData ||
		sessionData.resumeText == undefined ||
		sessionData.jobDescription == undefined
	) {
		console.log(sessionData);
		ctx.response.status = 400;
		ctx.response.body = {
			isError: true,
			message: "You must upload a resume and job description.",
		};
		return;
	}

	if (
		sessionData.resumeText.length > MAX_TEXT_LENGTH ||
		sessionData.jobDescription.length > MAX_TEXT_LENGTH
	) {
		ctx.response.status = 400;
		ctx.response.body = {
			isError: true,
			message: "Resume or Job description too long.",
		};
		return;
	}

	try {
		// Analyze the resume
		const resumeAnalysis = await analyze(sessionData.resumeText, "resume");

		// Analyze the job description
		const jobDescriptionAnalysis = await analyze(
			sessionData.jobDescription,
			"jobDescription",
		);

		const feedback = await getFeedback(
			sessionData.resumeText,
			sessionData.jobDescription,
		);

		// Combine results
		const analysisResult = {
			resumeAnalysis,
			jobDescriptionAnalysis,
			feedback,
		};

		// Return success response
		ctx.response.status = 200;
		ctx.response.body = {
			isError: false,
			message: "Analysis successful.",
			data: analysisResult,
		};
	} catch (error) {
		console.error("Error during analysis:", error);

		// Return error response
		ctx.response.status = 500;
		ctx.response.body = {
			isError: true,
			message: "Failed to analyze the text. Please try again later.",
		};
	}
}
