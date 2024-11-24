import { multiParser } from "https://deno.land/x/multiparser@0.114.0/mod.ts";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = [
	"application/pdf",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function ResumeUploadHandler(req: Request): Promise<Response> {
	const parsed = await multiParser(req);

	if (!parsed) {
		return new Response(
			JSON.stringify({ error: "Failed to parse form data." }),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	const resumeFile = Array.isArray(parsed.files)
		? parsed.files.find((file: any) => file.name === "resume_file")
		: parsed.files?.resume_file;

	if (!resumeFile) {
		return new Response(
			JSON.stringify({ error: "No resume file uploaded." }),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	const { contentType, size } = resumeFile;

	// Normalize content type and validate
	const normalizedContentType = (contentType || "").split("\n")[0].trim();
	if (!ALLOWED_MIME_TYPES.includes(normalizedContentType)) {
		return new Response(
			JSON.stringify({
				error: "Invalid file type. Only PDF and DOCX files are allowed.",
			}),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	// Validate file size
	if (size > MAX_FILE_SIZE) {
		return new Response(
			JSON.stringify({ error: "File size exceeds 2MB." }),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	// Success response
	return new Response(
		JSON.stringify({ message: "Resume uploaded successfully." }),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);
}
