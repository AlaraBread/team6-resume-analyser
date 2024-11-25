import { parseOfficeAsync } from "@officeparser";

export async function processAndCleanFile(path: string): Promise<string> {
    try {
        // Extract text from the file
        const data = await parseOfficeAsync(path);

        // Ensure data is a string or convert it to a string
        let extractedText: string;
        if (typeof data === "string") {
            extractedText = data;
        } else if (data && typeof data === "object" && "toString" in data) {
            extractedText = (data as { toString: () => string }).toString();
        } else {
            throw new Error("Unexpected data type received from parseOfficeAsync");
        }

        // Normalize whitespace: replace multiple spaces and line breaks with a single space
        const cleanedText = extractedText.replace(/\s+/g, " ").trim();

        return cleanedText;
    } catch (error) {
        // Handle errors during processing
        if (error instanceof Error) {
            console.error(`Error extracting text: ${error.message}`);
        } else {
            console.error("Unknown error occurred while extracting text.");
        }
        return "Error occurred during processing.";
    }
}

const filePath = './pdf_files/Stockholm-Resume-Template-Simple.pdf';
const cleanedText = await processAndCleanFile(filePath);

console.log("Cleaned Output:");
console.log(cleanedText);
