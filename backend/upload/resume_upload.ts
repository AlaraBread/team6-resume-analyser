import { Context, Router } from "@oak/oak";

export default function (router: Router) {
	router.post("/api/resume-upload", resumeUpload);
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = [
	"application/pdf",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function resumeUpload(ctx: Context): Promise<Response> {
	const formData = await ctx.request.body.formData();

	if (!formData) {
		return new Response(
			JSON.stringify({ error: "Failed to parse form data." }),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	const formFile = formData.get("file");
	const file =
		typeof formFile == "string" || !formFile ? undefined : formFile;

	if (!file) {
		return new Response(
			JSON.stringify({ error: "No resume file uploaded." }),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	// Normalize content type and validate
	const contentType = file.type.split("\n")[0].trim();
	if (!ALLOWED_MIME_TYPES.includes(contentType)) {
		return new Response(
			JSON.stringify({
				error: "Invalid file type. Only PDF and DOCX files are allowed.",
			}),
			{ status: 400, headers: { "Content-Type": "application/json" } },
		);
	}

	// Validate file size
	if (file.size > MAX_FILE_SIZE) {
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
