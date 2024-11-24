import { Router } from "@oak/oak";
import { generateHash } from "../../services/generate_hash.ts";

export const users: Record<
	string,
	{ email: string; username: string; password: string }
> = {}; // In-memory store for simplicity

export function userRegistration(router: Router) {
	router.post("/api/register", async (context) => {
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

		const hashedPassword = await generateHash(password);
		// // Save the user to the store
		users[email] = { email, username, password: hashedPassword };

		// Respond with success
		context.response.status = 201;
		context.response.body = "User registered";
	});
}
