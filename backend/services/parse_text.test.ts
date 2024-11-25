import { assertEquals } from "@std/assert";
import { processAndCleanFile } from "./parse_text.ts";

Deno.test("processAndCleanFile - Stockholm Resume (with whitespace)", async () => {
    const filePath = './pdf_files/Stockholm-Resume-Template-Simple.pdf';
    const expectedFilePath = './pdf_files/stochholm_expected_text.txt'; 

    let expectedOutput: string;
    try {
        expectedOutput = await Deno.readTextFile(expectedFilePath);

        const result = await processAndCleanFile(filePath);

        assertEquals(result, expectedOutput, "The cleaned text should match the expected output.");
    } catch (error) {
        console.error("Error during test execution:", error);
        throw error; 
    }
});

Deno.test("processAndCleanFile - Non-existent file", async () => {
    const filePath = './pdf_files/NonExistentFile.pdf';

    const result = await processAndCleanFile(filePath);

    assertEquals(result, "Error occurred during processing.", "Should handle missing files gracefully.");
});
