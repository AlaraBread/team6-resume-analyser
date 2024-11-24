import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import {
	JobDescriptionHandler,
	ResumeUploadHandler,
} from "../routes/routes.ts";

Deno.test("Resume Upload - Valid PDF", async () => {
	const body = `--boundary
Content-Disposition: form-data; name="resume_file"; filename="resume.pdf"
Content-Type: application/pdf

Valid PDF content
--boundary--`;

	const request = new Request("http://localhost/api/resume-upload", {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data; boundary=boundary",
		},
		body,
	});

	const response = await ResumeUploadHandler(request);
	const responseBody = await response.json();

	assertEquals(response.status, 200);
	assertEquals(responseBody.message, "Resume uploaded successfully.");
});

Deno.test("Resume Upload - Invalid File Type", async () => {
	const body = `--boundary
Content-Disposition: form-data; name="resume_file"; filename="resume.txt"
Content-Type: text/plain

Invalid file content
--boundary--`;

	const request = new Request("http://localhost/api/resume-upload", {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data; boundary=boundary",
		},
		body,
	});

	const response = await ResumeUploadHandler(request);
	const responseBody = await response.json();

	assertEquals(response.status, 400);
	assertEquals(
		responseBody.error,
		"Invalid file type. Only PDF and DOCX files are allowed.",
	);
});

Deno.test("Resume Upload - Oversized File", async () => {
	const largeFileContent = "A".repeat(2 * 1024 * 1024 + 1); // 2MB + 1 byte

	const body = `--boundary
Content-Disposition: form-data; name="resume_file"; filename="resume.pdf"
Content-Type: application/pdf

${largeFileContent}
--boundary--`;

	const request = new Request("http://localhost/api/resume-upload", {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data; boundary=boundary",
		},
		body,
	});

	const response = await ResumeUploadHandler(request);
	const responseBody = await response.json();

	assertEquals(response.status, 400);
	assertEquals(responseBody.error, "File size exceeds 2MB.");
});

Deno.test("Job Description - Valid Input", async () => {
	const request = new Request("http://localhost/api/job-description", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			job_description: "This is a valid job description.",
		}),
	});

	const response = await JobDescriptionHandler(request);
	const responseBody = await response.json();

	assertEquals(response.status, 200);
	assertEquals(responseBody.message, "Job description submitted successfully.");
});

Deno.test("Job Description - Exceeds Character Limit", async () => {
	const request = new Request("http://localhost/api/job-description", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			job_description: "A".repeat(5001), // Exceeds 5,000 characters
		}),
	});

	const response = await JobDescriptionHandler(request);
	const responseBody = await response.json();

	assertEquals(response.status, 400);
	assertEquals(responseBody.error, "Job description exceeds character limit.");
});
