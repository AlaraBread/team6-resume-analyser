import { Router } from "@oak/oak/router";
import hello from "./hello.ts";

import jobDescription from "./upload/job_description_upload.ts";
import resumeUpload from "./upload/resume_upload.ts";
import { userRegistration } from "./api/register_component/user_registration.ts";
import { userLogin } from "./api/user_login_component/user_login.ts";

import { sessionMiddleware } from "./middleware/session_middleware.ts"; // Import the middleware

export const router = new Router();

// Apply middleware to routes requiring session management
resumeUpload(router, sessionMiddleware);
jobDescription(router, sessionMiddleware);

// Keep other routes without session management
hello(router);
userRegistration(router);
userLogin(router);
