import { Router } from "@oak/oak/router";
import hello from "./hello.ts";
import { register } from "./api/register.ts";
import userLogin from "./api/userLogin.ts";

export const router = new Router();

hello(router);
register(router);
userLogin(router);
