import { Router } from "@oak/oak/router";

import jobDescription from "./api/upload/job_description.ts";
import resumeUpload from "./api/upload/resume.ts";
import userRegistration from "./api/register/register.ts";
import userLogin from "./api/login/login.ts";
import { sessionMiddleware } from "./middleware/session_middleware.ts";

export const router = new Router();

// Apply middleware to routes requiring session management
resumeUpload(router, sessionMiddleware);
jobDescription(router, sessionMiddleware);

// Keep other routes without session management
userRegistration(router);
userLogin(router);
