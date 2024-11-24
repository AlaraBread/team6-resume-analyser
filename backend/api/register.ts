import { crypto, encodeHex, Router } from "./deps.ts";

export const users: Record<
	string,
	{ email: string; username: string; password: string }
> = {}; // In-memory store for simplicity

export function register(router: Router) {
	router.post("/api/register", async (context) => {
		try {
			// Get the body object
			const body = await context.request.body.json();

			// Parse the JSON body
			const { email, password, username } = body;

			// Validate inputs
			if (!email || !password || !username) {
				context.response.status = 400;
				context.response.body = "All fields are required";
				return;
			}

			// Check for email uniqueness
			if (users[email]) {
				context.response.status = 400;
				context.response.body = "Email already registered";
				return;
			}

			// Hash the password
			const messageBuffer = new TextEncoder().encode(password);
			const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
			const hashedPassword = encodeHex(new Uint8Array(hashBuffer)); // Convert hash to hexadecimal string

			// // Save the user to the store
			users[email] = { email, username, password: hashedPassword };

			// Respond with success
			context.response.status = 201;
			context.response.body = "User registered";
		} catch (error) {
			console.error(error);
			context.response.status = 500;
			context.response.body = "Internal Server Error";
		}
	});
}
