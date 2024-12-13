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
				Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			throw new Error(
				`Hugging Face API Error: ${response.status} ${response.statusText}`,
			);
		}

		// Properly handle real and mocked responses
		const result = await response.json();

		if (Array.isArray(result)) {
			return { similarity_score: result[0] };
		}

		if (result.similarity_score !== undefined) {
			return { similarity_score: result.similarity_score };
		}

		throw new Error("Unexpected API response format.");
	} catch (error) {
		console.error("Error interacting with Hugging Face API:", error);
		throw error;
	}
}

/**
 * Parses the Hugging Face API response and generates fit scores and feedback.
 * @param response The raw response from Hugging Face API.
 * @returns A structured object containing fit score and feedback.
 */
function parseHuggingFaceResponse(response: {
	similarity_score: number;
}): { fitScore: number; feedback: string[] } {
	const fitScore = Math.round(response.similarity_score * 100);
	const feedback: string[] = [];

	if (fitScore < 80) {
		feedback.push(
			"Consider aligning your resume better with the job description.",
		);
	}
	if (fitScore < 50) {
		feedback.push(
			"Add more relevant keywords to increase the similarity score.",
		);
	}

	return { fitScore, feedback };
}

/**
 * Helper function for testing and external use, wrapping analyzeText.
 * @param resumeText The resume content as a string.
 * @param jobDescription The job description content as a string.
 * @returns A structured object containing fit score and feedback.
 */
export async function analyzeTextHelper(
	resumeText: string,
	jobDescription: string,
): Promise<{ fitScore: number; feedback: string[] }> {
	const response = await analyzeText(resumeText, jobDescription);
	return parseHuggingFaceResponse(response);
}
