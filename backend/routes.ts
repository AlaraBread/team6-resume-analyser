import { Router } from "@oak/oak/router";
import hello from "./hello.ts";

import jobDescription from "./upload/job_description_upload.ts";
import resumeUpload from "./upload/resume_upload.ts";
import { userRegistration } from "./api/register_component/user_registration.ts";
import { userLogin } from "./api/user_login_component/user_login.ts";

export const router = new Router();

hello(router);
jobDescription(router);
resumeUpload(router);
userRegistration(router);
userLogin(router);
