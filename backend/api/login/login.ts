import { Context, Router } from "@oak/oak";
import { createJWT } from "../../util/jwt.ts";
import { generateHash } from "../../util/generate_hash.ts";
import { users } from "../register/register.ts";

export default function (router: Router) {
	router.post("/api/login", login);
}

async function login(ctx: Context) {
	const { email, password } = await ctx.request.body.json();

	if (!email || !password) {
		ctx.response.status = 400;
		ctx.response.body = JSON.stringify({
			isError: true,
			message: "Email and password are required",
		});
		return;
	}

	const user = users[email];

	const hashedPassword = await generateHash(email, password);

	if (!user || user.password !== hashedPassword) {
		ctx.response.status = 401;
		ctx.response.body = JSON.stringify({
			isError: true,
			message: "Invalid email or password",
		});
		return;
	}

	// Generate JWT
	const token = await createJWT(email);

	// Send the token
	ctx.response.status = 200;
	ctx.response.body = JSON.stringify({
		isError: false,
		message: "Logged in",
		token,
	});
}
