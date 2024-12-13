import { Context, Router } from "@oak/oak";
import { analyzeTextHelper } from "../huggingface/huggingface.ts";
import { AnalyzeResponse, ErrorResponse } from "../../interfaces/analyze.ts";
import { SessionData } from "../../in_memory/in_memory.ts";

export default function (router: Router) {
	router.post(
		"/api/analyze",
		analyzeHandler.bind(undefined, analyzeTextHelper),
	);
}

export async function analyzeHandler(
	analyzeText: typeof analyzeTextHelper,
	ctx: Context,
) {
	const sessionData = ctx.state.sessionData as SessionData | null;
	// Validate input
	if (
		!sessionData || !sessionData.jobDescription || !sessionData.resumeText
	) {
		ctx.response.status = 400;
		ctx.response.body = <ErrorResponse> {
			isError: true,
			message: "You must upload a resume and job description.",
		};
		return;
	}

	// Call analyzeText
	const result = await analyzeText(
		sessionData.resumeText,
		sessionData.jobDescription,
	);

	// Respond with result
	ctx.response.status = 200;
	ctx.response.body = <AnalyzeResponse> {
		isError: false,
		message: "Analysis successful.",
		data: {
			fitScore: result.fitScore,
			feedback: result.feedback,
		},
	};
}
