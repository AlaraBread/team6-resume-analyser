import { Router } from "@oak/oak/router";
import hello from "./hello.ts";

import jobDescription from "./upload/job_description_upload.ts";
import resumeUpload from "./upload/resume_upload.ts";
import { register } from "./api/register.ts";
import userLogin from "./api/userLogin.ts";

export const router = new Router();

hello(router);
jobDescription(router);
resumeUpload(router);
register(router);
userLogin(router);