import { Server } from "https://deno.land/std@0.114.0/http/server.ts";
import { JobDescriptionHandler, ResumeUploadHandler } from "./routes/routes.ts";

const server = new Server({
	addr: ":8000",
	handler: async (req) => {
		if (req.method === "POST" && req.url === "/api/resume-upload") {
			return ResumeUploadHandler(req);
		}
		if (req.method === "POST" && req.url === "/api/job-description") {
			return JobDescriptionHandler(req);
		}

		return new Response("Not Found", { status: 404 });
	},
});

console.log("Server running on http://localhost:8000");
await server.listenAndServe();
