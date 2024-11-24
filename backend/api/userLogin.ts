import { Context, createJWT, crypto, encodeHex, Router } from "./deps.ts";
import { users } from "./register.ts";

export default function userLogin(router: Router) {
	router.post("/api/userLogin", async (ctx: Context) => {
		try {
			const body = await ctx.request.body.json();

			// Extract email and password
			const { email, password } = await body;

			if (!email || !password) {
				ctx.response.status = 400;
				ctx.response.body = "Email and password are required";
				return;
			}

			const user = users[email];
			// Hash the password
			const messageBuffer = new TextEncoder().encode(password);
			const hashBuffer = await crypto.subtle.digest(
				"SHA-256",
				messageBuffer,
			);
			const hashedPassword = encodeHex(new Uint8Array(hashBuffer));

			if (user.email !== email || user.password !== hashedPassword) {
				ctx.response.status = 401;
				ctx.response.body = "Invalid email or password";
				return;
			}

			// Generate JWT
			const token = createJWT(email, password);

			// Send the token
			ctx.response.status = 200;
			ctx.response.body = { token };
		} catch (error) {
			console.error(error);
			ctx.response.status = 500;
			ctx.response.body = "Internal Server Error";
		}
	});
}
