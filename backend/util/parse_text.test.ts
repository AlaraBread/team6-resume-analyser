import { assert, assertEquals } from "@std/assert";
import { processAndCleanFile } from "./parse_text.ts";
import { officeparser } from "./deps.ts";
import { restore, stub } from "@std/testing/mock";

Deno.test("processAndCleanFile - Stockholm Resume (with whitespace)", async () => {
	restore();
	const fileContent = "    this      is the pdf file's\ncontent";
	stub(officeparser, "parseOfficeAsync", () => {
		return Promise.resolve(fileContent);
	});

	const result = await processAndCleanFile(new File([fileContent], ""));

	assertEquals(
		result,
		"this is the pdf file's content",
		"The cleaned text should match the expected output.",
	);
});

Deno.test("processAndCleanFile - failed to process file", async () => {
	restore();
	stub(officeparser, "parseOfficeAsync", () => {
		return Promise.reject("Error occurred during processing.");
	});

	await processAndCleanFile(new File([""], "")).then(() => {
		assert(false);
	}).catch(
		(reason) => {
			assertEquals(
				reason,
				"Error occurred during processing.",
			);
		},
	);
});
