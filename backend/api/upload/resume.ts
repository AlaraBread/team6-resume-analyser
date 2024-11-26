import { Context, Middleware, Router } from "@oak/oak";
import { processAndCleanFile } from "../../util/parse_text.ts";

export default function (router: Router, sessionMiddleware: Middleware) {
	router.post("/api/resume-upload", sessionMiddleware, resumeUpload);
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = [
	"application/pdf",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function resumeUpload(ctx: Context) {
	const formData = await ctx.request.body.formData();
	ctx.response.headers = new Headers({ "Content-Type": "application/json" });

	if (!formData) {
		ctx.response.status = 400;
		ctx.response.body = JSON.stringify({
			isError: true,
			message: "Failed to parse form data.",
		});
		return;
	}

	const formFile = formData.get("file");
	const file = typeof formFile == "string" || !formFile ? undefined : formFile;

	if (!file) {
		ctx.response.status = 400;
		ctx.response.body = JSON.stringify({
			isError: true,
			message: "No resume file uploaded.",
		});
		return;
	}

	// Normalize content type and validate
	const contentType = file.type.split("\n")[0].trim();
	if (!ALLOWED_MIME_TYPES.includes(contentType)) {
		ctx.response.status = 400;
		ctx.response.body = JSON.stringify({
			isError: true,
			message: "Invalid file type. Only PDF and DOCX files are allowed.",
		});
		return;
	}

	// Validate file size
	if (file.size > MAX_FILE_SIZE) {
		ctx.response.status = 400;
		ctx.response.body = JSON.stringify({
			isError: true,
			message: "File size exceeds 2MB.",
		});
		return;
	}

	ctx.state.sessionData.resumeText = await processAndCleanFile(file);
	// Success response
	ctx.response.status = 200;
	ctx.response.body = JSON.stringify({
		isError: false,
		message: "Resume uploaded successfully.",
	});
}
