import "jsr:@std/dotenv/load";
import { OpenAIResponse } from "../../interfaces/openai_interface.ts";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MAX_CHAR_LIMIT = 10000;

// Define content templates for different input types
const CONTENT_TEMPLATES: Record<string, string> = {
	jobDescription:
		"You are an assistant that extracts keywords from job descriptions. Provide only the keywords, separated by commas. Classify the keywords into two categories: must-have and nice-to-have.",
	resume:
		"You are an assistant that extracts keywords from resumes. Provide only the keywords, separated by commas. Classify the keywords into two categories: must-have and nice-to-have.",
};

/**
 * Sends a request to the OpenAI API for analysis and extracts the assistant's message content.
 * @param inputText The text to analyze (resume or job description content).
 * @param type The type of input ("resume" | "jobDescription").
 * @returns The assistant's response content as a string.
 */
export async function analyzeText(
	inputText: string,
	type: "resume" | "jobDescription",
): Promise<string> {
	const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

	if (!OPENAI_API_KEY) {
		throw new Error("OpenAI API key is not set in the environment.");
	}

	if (typeof inputText !== "string" || inputText.length > MAX_CHAR_LIMIT) {
		throw new Error("Character limit exceeded or invalid input.");
	}

	const content = CONTENT_TEMPLATES[type];

	const payload = {
		model: "gpt-3.5-turbo",
		messages: [
			{ role: "system", content },
			{ role: "user", content: inputText },
		],
		max_tokens: 200,
	};

	const response = await fetch(OPENAI_API_URL, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${OPENAI_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error(
			`OpenAI API Error: ${response.status} ${response.statusText}`,
		);
	}

	const result: OpenAIResponse = await response.json();

	// Extract and return the assistant's message content
	const messageContent = result.choices[0]?.message.content;
	if (!messageContent) {
		throw new Error("Unexpected API response format: missing message content.");
	}

	return messageContent;
}

/**
 * Generates actionable feedback for a resume based on a job description.
 * @param resumeText The content of the resume.
 * @param jobDescription The content of the job description.
 * @returns An object containing an array of feedback strings.
 */
export async function generateResumeFeedback(
	resumeText: string,
	jobDescription: string,
): Promise<{ feedback: string[] }> {
	const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

	if (!OPENAI_API_KEY) {
		throw new Error("OpenAI API key is not set in the environment.");
	}

	if (
		typeof resumeText !== "string" ||
		typeof jobDescription !== "string" ||
		resumeText.length > MAX_CHAR_LIMIT ||
		jobDescription.length > MAX_CHAR_LIMIT
	) {
		throw new Error("Inputs must be strings and under 10,000 characters.");
	}

	const payload = {
		model: "gpt-3.5-turbo",
		messages: [
			{
				role: "system",
				content:
					"You are an expert career advisor who provides actionable feedback to improve resumes for specific job descriptions. Respond in a JSON array of feedback strings.",
			},
			{
				role: "user",
				content: `
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
                `,
			},
		],
		temperature: 0.7,
		max_tokens: 300,
	};

	const response = await fetch(OPENAI_API_URL, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${OPENAI_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error(
			`OpenAI API Error: ${response.status} ${response.statusText}`,
		);
	}

	const result: OpenAIResponse = await response.json();

	// Extract and parse feedback from the response
	const feedback = parseFeedback(result);

	return { feedback };
}

/**
 * Parses the OpenAI response to extract feedback as an array of strings.
 * @param response The raw response from the OpenAI API.
 * @returns An array of feedback strings.
 */
function parseFeedback(response: OpenAIResponse): string[] {
	const content = response.choices[0]?.message.content;

	if (!content) {
		throw new Error(
			"Unexpected API response format: missing feedback content.",
		);
	}

	try {
		const feedback = JSON.parse(content);
		if (Array.isArray(feedback)) {
			return feedback;
		} else {
			throw new Error("Unexpected response format: Feedback is not an array.");
		}
	} catch (error) {
		console.error("Error parsing OpenAI response:", error);
		throw new Error("Failed to parse feedback from the response.");
	}
}
