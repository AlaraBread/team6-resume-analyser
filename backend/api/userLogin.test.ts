import { assertEquals } from "@std/assert";
import { createBody } from "../utils/util.test.ts"; // Assuming the path to your function
import userLogin from "./userLogin.ts";
import { users } from "./register.ts"; // Import the actual users object
import { createMockContext } from "@oak/oak/testing";
import { Router } from "@oak/oak";

Deno.test("POST /api/userLogin - Successful Login", async () => {
	// Pre-populate the imported users object with a registered user
	users["user@example.com"] = {
		email: "user@example.com",
		username: "user123",
		password:
			"debe062ddaaf9f8b06720167c7b65c778c934a89ca89329dcb82ca79d19e17d2", // SHA-256 hash for 'securePassword'
	};
	const ctx = createMockContext({
		method: "POST",
		path: "/api/userLogin",
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

Deno.test("POST /api/userLogin - Missing User Email", async () => {
	// Pre-populate the imported users object with a registered user
	users["user@example.com"] = {
		email: "user@example.com",
		username: "user123",
		password:
			"debe062ddaaf9f8b06720167c7b65c778c934a89ca89329dcb82ca79d19e17d2", // SHA-256 hash for 'securePassword'
	};
	const ctx = createMockContext({
		method: "POST",
		path: "/api/userLogin",
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
	assertEquals(ctx.response.body, "Email and password are required");

	// Cleanup: Remove the user from the users object after the test
	delete users["user@example.com"];
});

Deno.test("POST /api/userLogin - Missing User Password", async () => {
	// Pre-populate the imported users object with a registered user
	users["user@example.com"] = {
		email: "user@example.com",
		username: "user123",
		password:
			"debe062ddaaf9f8b06720167c7b65c778c934a89ca89329dcb82ca79d19e17d2", // SHA-256 hash for 'securePassword'
	};
	const ctx = createMockContext({
		method: "POST",
		path: "/api/userLogin",
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
	assertEquals(ctx.response.body, "Email and password are required");

	// Cleanup: Remove the user from the users object after the test
	delete users["user@example.com"];
});

Deno.test("POST /api/userLogin - Invalid password", async () => {
	// Pre-populate the imported users object with a registered user
	users["user@example.com"] = {
		email: "user@example.com",
		username: "user123",
		password:
			"debe062ddaaf9f8b06720167c7b65c778c934a89ca89329dcb82ca79d19e17d2", // SHA-256 hash for 'securePassword'
	};
	const ctx = createMockContext({
		method: "POST",
		path: "/api/userLogin",
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
	assertEquals(ctx.response.body, "Invalid email or password");

	// Cleanup: Remove the user from the users object after the test
	delete users["user@example.com"];
});
