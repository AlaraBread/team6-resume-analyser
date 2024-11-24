import { assertEquals } from "@std/assert";
import { createBody } from "../utils/util.test.ts"; // Assuming the path to your function
import { register } from "./register.ts";
import { createMockContext } from "@oak/oak/testing";
import { Router } from "@oak/oak";

Deno.test("POST /api/register - Successful Registration", async () => {
	const ctx = createMockContext({
		method: "POST",
		path: "/api/register",
		headers: [["Content-Type", "application/json"]],
		body: createBody(
			JSON.stringify({
				email: "user@example.com",
				password: "securePassword",
				username: "user123",
			}),
		),
	});

	const router = new Router();
	register(router);

	// Mock `next` function
	const next = async () => {};

	// Call the registration handler
	await router.routes()(ctx, next);

	assertEquals(ctx.response.status, 201);
	assertEquals(ctx.response.body, "User registered");
});

Deno.test("POST /api/register - Missing Fields", async () => {
	const ctx = createMockContext({
		method: "POST",
		path: "/api/register",
		headers: [["Content-Type", "application/json"]],
		body: createBody(
			JSON.stringify({
				email: "user@example.com",
				username: "user123", // Missing password
			}),
		),
	});

	const router = new Router();
	register(router);

	const next = async () => {};

	await router.routes()(ctx, next);

	assertEquals(ctx.response.status, 400);
	assertEquals(ctx.response.body, "All fields are required");
});

Deno.test("POST /api/register - Duplicate Email", async () => {
	const mockBody = {
		email: "duplicate@example.com",
		password: "securePassword",
		username: "user123",
	};

	const router = new Router();
	register(router);

	// First registration
	const ctx1 = createMockContext({
		method: "POST",
		path: "/api/register",
		headers: [["Content-Type", "application/json"]],
		body: createBody(JSON.stringify(mockBody)),
	});

	const next = async () => {};

	await router.routes()(ctx1, next);

	// Duplicate registration
	const ctx2 = createMockContext({
		method: "POST",
		path: "/api/register",
		headers: [["Content-Type", "application/json"]],
		body: createBody(JSON.stringify(mockBody)),
	});

	await router.routes()(ctx2, next);

	assertEquals(ctx2.response.status, 400);
	assertEquals(ctx2.response.body, "Email already registered");
});
