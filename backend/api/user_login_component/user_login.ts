import { Context, Router } from "@oak/oak";
import { createJWT } from "../../services/jwt.ts";
import { generateHash } from "../../services/generate_hash.ts";
import { users } from "../register_component/user_registration.ts";

export function userLogin(router: Router) {
	router.post("/api/login", async (ctx: Context) => {
		const body = await ctx.request.body.json();

		// Extract email and password
		const { email, password } = await body;

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

		if (user.email !== email || user.password !== hashedPassword) {
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
	});
}
