import "jsr:@std/dotenv/load";
import { OpenAIResponse } from "../../interfaces/openai_interface.ts";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MAX_CHAR_LIMIT = 10000;

// Define content templates for different input types
const CONTENT_TEMPLATES: Record<string, string> = {
	jobDescription:
		"You are an assistant that extracts keywords from job descriptions. Provide only the keywords, separated by commas. Classify the keywords into two categories: must-have and nice-to-have.",
	resume:
		"You are an assistant that extracts keywords from resumes. Provide only the keywords, separated by commas.",
};

export type AnalyseResponse<Type> = Type extends "resume" ? string[]
	: Type extends "jobDescription" ? { mustHave: string[]; niceToHave: string[] }
	: never;

/**
 * Sends a request to the OpenAI API for analysis and extracts the assistant's message content.
 * @param inputText The text to analyze (resume or job description content).
 * @param type The type of input ("resume" | "jobDescription").
 * @returns The assistant's response content as a string.
 */
export async function analyzeText<Type extends "resume" | "jobDescription">(
	inputText: string,
	type: Type,
): Promise<AnalyseResponse<Type>> {
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
		console.log(messageContent);
		throw new Error(
			"Unexpected API response format: missing message content.",
		);
	}

	if (type == "jobDescription") {
		const mustHaveStr =
			/(?:\*\*)?Must[- ]have[^:]*(?:\*\*)?: ?(?<csv>[^\n;]*)/gi.exec(
				messageContent,
			)
				?.groups?.csv;
		if (mustHaveStr == undefined) {
			console.log(messageContent);
			throw new Error(
				"Unexpected API response format: missing must-haves.",
			);
		}
		const mustHave = mustHaveStr
			.split(",")
			.map((keyword) => keyword.trim())
			.filter((keyword) => keyword != "");

		const niceToHaveStr =
			/(?:\*\*)?Nice[- ]to[- ]have[^:]*(?:\*\*)?: ?(?<csv>[^\n;]*)/gi.exec(
				messageContent,
			)?.groups?.csv;
		if (niceToHaveStr == undefined) {
			console.log(messageContent);
			throw new Error(
				"Unexpected API response format: missing must-haves.",
			);
		}
		const niceToHave = niceToHaveStr
			.split(",")
			.map((keyword) => keyword.trim())
			.filter((keyword) => keyword != "");

		return { mustHave, niceToHave } as AnalyseResponse<Type>;
	} else {
		return messageContent
			.split(",")
			.map((keyword) => keyword.trim())
			.filter((keyword) => keyword != "") as AnalyseResponse<Type>;
	}
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
): Promise<{ feedback: string; category: string }[]> {
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
					"You are an expert career advisor who provides actionable feedback to improve resumes for specific job descriptions." +
					' You also categorize each point of feedback into categories such as "experience" or "education".' +
					' Respond in this json format: {"feedback": string, "category": string}[]',
			},
			{
				role: "user",
				content: `Resume:
${resumeText}

Job Description:
${jobDescription}`,
			},
		],
		temperature: 0.7,
		max_tokens: 2000,
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

	return feedback;
}

/**
 * Parses the OpenAI response to extract feedback as an array of strings.
 * @param response The raw response from the OpenAI API.
 * @returns An array of feedback strings.
 */
function parseFeedback(
	response: OpenAIResponse,
): { feedback: string; category: string }[] {
	let content = response.choices[0]?.message.content;

	if (!content) {
		throw new Error(
			"Unexpected API response format: missing feedback content.",
		);
	}

	content = content.replaceAll("```json", "").replaceAll("```", "");

	try {
		const feedback = JSON.parse(content);
		if (!Array.isArray(feedback)) {
			throw new Error(
				"Unexpected response format: Feedback is not an array.",
			);
		}
		feedback.forEach((feedback) => {
			if (!("category" in feedback)) {
				throw new Error("no category in feedback response");
			}
			if (!("feedback" in feedback)) {
				throw new Error("no feedback in feedback response");
			}
			if (typeof feedback.feedback !== "string") {
				throw new Error("feedback not a string");
			}
			if (typeof feedback.category !== "string") {
				throw new Error("category not a string");
			}
		});
		return feedback;
	} catch (error) {
		console.log(content);
		console.error("Error parsing OpenAI response:", error);
		throw new Error("Failed to parse feedback from the response.");
	}
}
