import { Context, Router } from "@oak/oak";
import { analyzeTextHelper } from "../huggingface/huggingface.ts";

const MAX_CHAR_LIMIT = 10000;

export default function (router: Router) {
  router.post("/api/analyze", analyzeHandler);
}

async function analyzeHandler(ctx: Context) {
  try {
    const { resumeText, jobDescription } = await ctx.request.body.json();

    // Validate input
    if (!resumeText || !jobDescription) {
      ctx.response.status = 400;
      ctx.response.body = {
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
      ctx.response.body = {
        isError: true,
        message: `Inputs must be strings and under ${MAX_CHAR_LIMIT} characters.`,
      };
      return;
    }

    // Call analyzeTextHelper
    const result = await analyzeTextHelper(resumeText, jobDescription);

    // Respond with result
    ctx.response.status = 200;
    ctx.response.body = {
      isError: false,
      message: "Analysis successful.",
      data: result,
    };
  } catch (error) {
    console.error("Error in analyzeHandler:", error);

    // Respond with error
    ctx.response.status = 500;
    ctx.response.body = {
      isError: true,
      message: "Failed to analyze the text. Please try again later.",
    };
  }
}
