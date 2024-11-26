import { assertEquals, assertRejects } from "@std/assert";
import { assertSpyCalls, restore, spy, stub } from "@std/testing/mock";
import { sessionMiddleware } from "../middleware/session_middleware.ts";
import { inMemory } from "./deps.ts";
import { jwt } from "./deps.ts";
import { createMockContext } from "@oak/oak/testing";

Deno.test("Session Middleware - Valid Token", async () => {
	restore();
	// Mock dependencies
	const mockRetrieveData = spy(() => ({ resumeText: "", jobDescription: "" }));
	const mockStoreData = spy(() => {});
	const mockVerifyJWT = spy(
		() => (Promise.resolve({ email: "test@example.com" })),
	);

	stub(inMemory, "retrieveData", mockRetrieveData);
	stub(inMemory, "storeData", mockStoreData);
	stub(jwt, "verifyJWT", mockVerifyJWT);

	// Mock context
	const mockNext = spy(async () => {});
	const ctx = createMockContext({
		headers: [["token", "valid_token"]],
		state: {},
	});

	// Run middleware
	await sessionMiddleware(ctx, mockNext);

	// Assertions
	assertEquals(ctx.state.email, "test@example.com");
	assertEquals(ctx.state.sessionData.resumeText, "");
	assertEquals(ctx.state.sessionData.jobDescription, "");
	assertSpyCalls(mockNext, 1); // Ensure next was called
	assertSpyCalls(mockRetrieveData, 1); // Ensure retrieveData was called
	assertSpyCalls(mockStoreData, 1); // Ensure storeData was called
});

Deno.test("Session Middleware - Missing Token", async () => {
	restore();
	// Mock context
	const mockNext = spy(() => {
		return Promise.resolve();
	});
	const ctx = createMockContext({
		headers: [], // no token
		state: {},
	});

	// Assertions
	await assertRejects(
		async () => await sessionMiddleware(ctx, mockNext),
		"no token",
	);

	// Ensure `next` was not called
	assertSpyCalls(mockNext, 0);
});

Deno.test("Session Middleware - Invalid Token", async () => {
	restore();
	// Mock dependencies
	const mockVerifyJWT = spy(() => {
		return Promise.reject("Invalid token");
	});
	stub(jwt, "verifyJWT", mockVerifyJWT);

	// Mock context
	const mockNext = spy(() => {
		return Promise.resolve();
	});
	const ctx = createMockContext({
		headers: [["token", "invalid_token"]],
		state: {},
	});

	// Run middleware and assert rejection
	await assertRejects(
		async () => await sessionMiddleware(ctx, mockNext),
		"Invalid token",
	);

	// Assertions
	assertSpyCalls(mockNext, 0); // Ensure next was not called
	assertSpyCalls(mockVerifyJWT, 1); // Ensure verifyJWT was called
});

Deno.test("Session Middleware - Session Update", async () => {
	restore();
	// Mock dependencies
	const mockRetrieveData = spy(() => ({ resumeText: "", jobDescription: "" }));
	const mockStoreData = spy(() => {});
	const mockVerifyJWT = spy(
		() => (Promise.resolve({ email: "test@example.com" })),
	);

	stub(inMemory, "retrieveData", mockRetrieveData);
	stub(inMemory, "storeData", mockStoreData);
	stub(jwt, "verifyJWT", mockVerifyJWT);

	// Mock context
	const mockNext = spy(() => {
		// Simulate updating session data
		ctx.state.sessionData.resumeText = "Updated Resume";
		return Promise.resolve();
	});
	const ctx = createMockContext({
		headers: [["token", "valid_token"]],
		state: {},
	});

	// Run middleware
	await sessionMiddleware(ctx, mockNext);

	// Assertions
	assertEquals(ctx.state.sessionData.resumeText, "Updated Resume");
	assertSpyCalls(mockStoreData, 1);
	console.log(mockStoreData.calls[0].args);
	assertEquals(
		mockStoreData.calls[0].args,
		["test@example.com", "Updated Resume", ""],
	); // Ensure updated data is stored
});
