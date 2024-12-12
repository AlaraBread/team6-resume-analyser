import "jsr:@std/dotenv/load";

const HUGGINGFACE_API_URL =
	"https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";

/**
 * Sends a resume and job description to Hugging Face API for analysis.
 * @param resumeText The resume content as a string.
 * @param jobDescription The job description content as a string.
 * @returns The API response as JSON.
 */
export async function analyzeText(
	resumeText: string,
	jobDescription: string,
): Promise<{ similarity_score: number }> {
	const HUGGINGFACE_API_KEY = Deno.env.get("HUGGINGFACE_API_KEY");

	if (!HUGGINGFACE_API_KEY) {
		throw new Error("Hugging Face API key is not set in the environment.");
	}

	const payload = {
		inputs: {
			source_sentence: resumeText,
			sentences: [jobDescription],
		},
	};

	try {
		const response = await fetch(HUGGINGFACE_API_URL, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			throw new Error(
				`Hugging Face API Error: ${response.status} ${response.statusText}`,
			);
		}

		return await response.json();
	} catch (error) {
		console.error("Error interacting with Hugging Face API:", error);
		throw error;
	}
}

/**
 * Helper function for testing and external use, wrapping analyzeText.
 * @param resumeText The resume content as a string.
 * @param jobDescription The job description content as a string.
 * @returns The API response as JSON.
 */
export async function analyzeTextHelper(
	resumeText: string,
	jobDescription: string,
): Promise<{ similarity_score: number }> {
	return await analyzeText(resumeText, jobDescription);
}
