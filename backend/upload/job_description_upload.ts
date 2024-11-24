import { Context, Router } from "@oak/oak";

export default function (router: Router) {
	router.post("/api/job-description", jobDescriptionUpload);
}

export async function jobDescriptionUpload(ctx: Context) {
	const body = await ctx.request.body.json();
	const jobDescription = body.job_description;
	ctx.response.headers = new Headers({ "Content-Type": "application/json" });

	// Validate job description
	if (!jobDescription || jobDescription.length > 5000) {
		ctx.response.status = 400;
		ctx.response.body = JSON.stringify({
			error: "Job description exceeds character limit.",
		});
		return;
	}

	ctx.response.status = 200;
	// Return success if validation passes
	ctx.response.body = JSON.stringify({
		message: "Job description submitted successfully.",
	});
}
