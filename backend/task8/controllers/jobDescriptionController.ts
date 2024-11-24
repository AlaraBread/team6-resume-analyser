export async function JobDescriptionHandler(req: Request): Promise<Response> {
	const body = await req.json();
	const jobDescription = body.job_description;

	// Validate job description
	if (!jobDescription || jobDescription.length > 5000) {
		return new Response(
			JSON.stringify({
				error: "Job description exceeds character limit.",
			}),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	// Return success if validation passes
	return new Response(
		JSON.stringify({ message: "Job description submitted successfully." }),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);
}
