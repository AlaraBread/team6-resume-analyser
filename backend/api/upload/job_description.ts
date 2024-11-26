import { Context, Middleware, Router } from "@oak/oak";

export default function (router: Router, sessionMiddleware: Middleware) {
	router.post("/api/job-description", sessionMiddleware, jobDescriptionUpload);
}

export async function jobDescriptionUpload(ctx: Context) {
	const body = await ctx.request.body.json();
	const jobDescription = body.jobDescription;
	ctx.response.headers = new Headers({ "Content-Type": "application/json" });

	// Validate job description
	if (!jobDescription || jobDescription.length > 5000) {
		ctx.response.status = 400;
		ctx.response.body = JSON.stringify({
			isError: true,
			message: "Job description exceeds character limit.",
		});
		return;
	}

	ctx.state.sessionData.jobDescription = jobDescription;
	ctx.response.status = 200;
	// Return success if validation passes
	ctx.response.body = JSON.stringify({
		isError: false,
		message: "Job description submitted successfully.",
	});
}
