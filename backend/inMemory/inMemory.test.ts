import {
	clearAllData,
	deleteData,
	generateSessionId,
	retrieveData,
	storeData,
	tempStorage,
} from "./inMemory.ts";

import {
	assertEquals,
	assertNotEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("Generate session ID", () => {
	const sessionId = generateSessionId();

	assertEquals(sessionId, "session_id_1");
});

Deno.test("storeData and retrieveData are successful", () => {
	const sessionId = generateSessionId();
	storeData(
		sessionId,
		"Extracted resume text here...",
		"Submitted job description here...",
	);

	const storedData = retrieveData(sessionId);
	assertNotEquals(storedData, null);
	assertEquals(storedData?.resume_text, "Extracted resume text here...");
	assertEquals(
		storedData?.job_description,
		"Submitted job description here...",
	);
});

Deno.test("storeData retrieves null for non-existent sessionId", () => {
	const sessionId = "session_id_nonexist";
	const storedData = retrieveData(sessionId);
	assertEquals(storedData, null);
});

Deno.test("deleteData removes data correctly", () => {
	const sessionId = "session_id_123";
	storeData(sessionId, "Some resume text", "Some job description");

	deleteData(sessionId);
	const data = retrieveData(sessionId);
	assertEquals(data, null);
});

Deno.test("clearAllData removes all session data", () => {
	storeData("session_id_55", "Resume 1", "Job Desc 1");
	storeData("session_id_56", "Resume 2", "Job Desc 2");

	clearAllData();

	assertEquals(Object.keys(tempStorage).length, 0);
	assertEquals(retrieveData("session_id_55"), null);
	assertEquals(retrieveData("session_id_56"), null);
});
