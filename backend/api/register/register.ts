import { Context, Router } from "@oak/oak";
import { generateHash } from "../../util/generate_hash.ts";

export const users: Record<
	string,
	{ email: string; username: string; password: string }
> = {}; // In-memory store for simplicity

export default function (router: Router) {
	router.post("/api/register", register);
}

async function register(context: Context) {
	// Get the body object
	const body = await context.request.body.json();

	// Parse the JSON body
	const { email, password, username } = body;

	// Validate inputs
	if (!email || !password || !username) {
		context.response.status = 400;
		context.response.body = JSON.stringify({
			isError: true,
			message: "All fields are required",
		});
		return;
	}

	// Check for email uniqueness
	if (users[email]) {
		context.response.status = 400;
		context.response.body = JSON.stringify({
			isError: true,
			message: "Email already registered",
		});
		return;
	}

	const hashedPassword = await generateHash(email, password);
	// // Save the user to the store
	users[email] = { email, username, password: hashedPassword };

	// Respond with success
	context.response.status = 201;
	context.response.body = JSON.stringify({
		isError: false,
		message: "Registered successfully",
	});
}
