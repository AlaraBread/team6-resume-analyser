import { Context, Router } from "@oak/oak";
import { analyzeTextHelper } from "../huggingface/huggingface.ts";
import {
	AnalyzeRequest,
	AnalyzeResponse,
	ErrorResponse,
} from "../../interfaces/analyze.ts";

const MAX_CHAR_LIMIT = 10000;

export default function (router: Router) {
	router.post("/api/analyze", createAnalyzeHandler({ analyzeTextHelper }));
}

// Dependency-injected handler factory
export function createAnalyzeHandler(
	dependencies: { analyzeTextHelper: typeof analyzeTextHelper },
) {
	return async function analyzeHandler(ctx: Context) {
		try {
			const { resumeText, jobDescription }: AnalyzeRequest = await ctx.request
				.body.json();

			// Validate input
			if (!resumeText || !jobDescription) {
				ctx.response.status = 400;
				ctx.response.body = <ErrorResponse> {
					isError: true,
					message: "Both resumeText and jobDescription are required.",
				};
				return;
			}

			if (
				typeof resumeText !== "string" ||
				typeof jobDescription !== "string" ||
				resumeText.length > MAX_CHAR_LIMIT ||
				jobDescription.length > MAX_CHAR_LIMIT
			) {
				ctx.response.status = 400;
				ctx.response.body = <ErrorResponse> {
					isError: true,
					message:
						`Inputs must be strings and under ${MAX_CHAR_LIMIT} characters.`,
				};
				return;
			}

			// Call analyzeTextHelper
			const result = await dependencies.analyzeTextHelper(
				resumeText,
				jobDescription,
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
		} catch (error) {
			console.error("Error in analyzeHandler:", error);

			// Respond with error
			ctx.response.status = 500;
			ctx.response.body = <ErrorResponse> {
				isError: true,
				message: "Failed to analyze the text. Please try again later.",
				errorDetails: error instanceof Error ? error.message : undefined,
			};
		}
	};
}
