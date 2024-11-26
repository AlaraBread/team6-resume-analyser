import { officeparser } from "./deps.ts";
import { Buffer } from "node:buffer";

// Extract text from a file
export async function processAndCleanFile(file: File): Promise<string> {
	const data = await officeparser.parseOfficeAsync(
		Buffer.from(await file.arrayBuffer()),
	);

	// Ensure data is a string or convert it to a string
	let extractedText: string;
	if (typeof data === "string") {
		extractedText = data;
	} else if (data && typeof data === "object" && "toString" in data) {
		extractedText = (data as { toString: () => string }).toString();
	} else {
		return Promise.reject(
			"Unexpected data type received from parseOfficeAsync",
		);
	}

	// Normalize whitespace: replace multiple spaces and line breaks with a single space
	const cleanedText = extractedText.replace(/\s+/g, " ").trim();

	return cleanedText;
}
