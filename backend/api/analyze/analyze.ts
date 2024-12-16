import { Context, Middleware, Router } from "@oak/oak";
import { analyzeText, generateResumeFeedback } from "../openai/openai.ts";
import { SessionData } from "../../in_memory/in_memory.ts";

export default function (router: Router, sessionMiddleware: Middleware) {
	router.post("/api/analyze", sessionMiddleware, analyzeHandler);
}

export async function analyzeHandler(ctx: Context) {
	// Retrieve session data
	const sessionData = ctx.state.sessionData as SessionData | null;

	// Validate session data
	if (!sessionData || !sessionData.resumeText || !sessionData.jobDescription) {
		ctx.response.status = 400;
		ctx.response.body = {
			isError: true,
			message: "You must upload a resume and job description.",
		};
		return;
	}

	try {
		// Analyze the resume
		const resumeAnalysis = await analyzeText(sessionData.resumeText, "resume");

		// Analyze the job description
		const jobDescriptionAnalysis = await analyzeText(
			sessionData.jobDescription,
			"jobDescription",
		);

		const feedback = await generateResumeFeedback(
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
