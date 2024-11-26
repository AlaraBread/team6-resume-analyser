import { assertEquals } from "@std/assert";
import { createMockContext } from "@oak/oak/testing";
import { Router } from "@oak/oak";
import { userLogin } from "./user_login.ts";
import { users } from "../register_component/user_registration.ts";
import { createBody } from "../../util/util.test.ts";
import { generateHash } from "../../services/generate_hash.ts";

Deno.test("POST /api/login - Successful Login", async () => {
	// Generate the hashed password
	const hashedPassword = await generateHash(
		"user@example.com",
		"securePassword",
	);

	// Pre-populate the imported users object with a registered user
	users["user@example.com"] = {
		email: "user@example.com",
		username: "user123",
		password: hashedPassword, // SHA-256 hash for 'securePassword'
	};
	const ctx = createMockContext({
		method: "POST",
		path: "/api/login",
		headers: [["Content-Type", "application/json"]],
		body: createBody(
			JSON.stringify({
				email: "user@example.com",
				password: "securePassword",
			}),
		),
	});

	const router = new Router();
	userLogin(router);

	// Mock `next` function
	const next = async () => {};

	// Call the login handler
	await router.routes()(ctx, next);

	// Assertions
	assertEquals(ctx.response.status, 200);

	// Cleanup: Remove the user from the users object after the test
	delete users["user@example.com"];
});

Deno.test("POST /api/login - Missing User Email", async () => {
	// Generate the hashed password
	const hashedPassword = await generateHash(
		"user@example.com",
		"securePassword",
	);

	// Pre-populate the imported users object with a registered user
	users["user@example.com"] = {
		email: "user@example.com",
		username: "user123",
		password: hashedPassword, // SHA-256 hash for 'securePassword'
	};
	const ctx = createMockContext({
		method: "POST",
		path: "/api/login",
		headers: [["Content-Type", "application/json"]],
		body: createBody(
			JSON.stringify({
				password: "securePassword",
			}),
		),
	});

	const router = new Router();
	userLogin(router);

	// Mock `next` function
	const next = async () => {};

	// Call the login handler
	await router.routes()(ctx, next);

	// Assertions
	assertEquals(ctx.response.status, 400);
	assertEquals(
		ctx.response.body,
		JSON.stringify({
			isError: true,
			message: "Email and password are required",
		}),
	);

	// Cleanup: Remove the user from the users object after the test
	delete users["user@example.com"];
});

Deno.test("POST /api/login - Missing User Password", async () => {
	// Generate the hashed password
	const hashedPassword = await generateHash(
		"user@example.com",
		"securePassword",
	);

	// Pre-populate the imported users object with a registered user
	users["user@example.com"] = {
		email: "user@example.com",
		username: "user123",
		password: hashedPassword, // SHA-256 hash for 'securePassword'
	};
	const ctx = createMockContext({
		method: "POST",
		path: "/api/login",
		headers: [["Content-Type", "application/json"]],
		body: createBody(
			JSON.stringify({
				email: "user@example.com",
			}),
		),
	});

	const router = new Router();
	userLogin(router);

	// Mock `next` function
	const next = async () => {};

	// Call the login handler
	await router.routes()(ctx, next);

	// Assertions
	assertEquals(ctx.response.status, 400);
	assertEquals(
		ctx.response.body,
		JSON.stringify({
			isError: true,
			message: "Email and password are required",
		}),
	);

	// Cleanup: Remove the user from the users object after the test
	delete users["user@example.com"];
});

Deno.test("POST /api/login - Invalid password", async () => {
	// Generate the hashed password
	const hashedPassword = await generateHash(
		"user@example.com",
		"securePassword",
	);

	// Pre-populate the imported users object with a registered user
	users["user@example.com"] = {
		email: "user@example.com",
		username: "user123",
		password: hashedPassword, // SHA-256 hash for 'securePassword'
	};
	const ctx = createMockContext({
		method: "POST",
		path: "/api/login",
		headers: [["Content-Type", "application/json"]],
		body: createBody(
			JSON.stringify({
				email: "user@example.com",
				password: "securePassword11",
			}),
		),
	});

	const router = new Router();
	userLogin(router);

	// Mock `next` function
	const next = async () => {};

	// Call the login handler
	await router.routes()(ctx, next);

	// Assertions
	assertEquals(ctx.response.status, 401);
	assertEquals(
		ctx.response.body,
		JSON.stringify({
			isError: true,
			message: "Invalid email or password",
		}),
	);

	// Cleanup: Remove the user from the users object after the test
	delete users["user@example.com"];
});
