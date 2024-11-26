import { assertEquals, assertRejects } from "@std/assert";
import { spy, assertSpyCalls } from "@std/testing/mock";
import { sessionMiddleware } from "../middleware/session_middleware.ts";
import * as inMemory from "../in_memory/in_memory.ts";
import * as jwtService from "../services/jwt.ts";

Deno.test("Session Middleware - Valid Token", async () => {
  // Mock dependencies
  const mockRetrieveData = spy(() => ({ resumeText: "", jobDescription: "" }));
  const mockStoreData = spy(() => {});
  const mockVerifyJWT = spy(async () => ({ email: "test@example.com" }));

  inMemory.retrieveData = mockRetrieveData;
  inMemory.storeData = mockStoreData;
  jwtService.verifyJWT = mockVerifyJWT;

  // Mock context
  const mockNext = spy( async() => {});
  const ctx = {
    request: {
      headers: new Headers({ token: "valid_token" }),
    },
    response: { status: 0, body: {} },
    state: {},
  } as any;

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
  // Mock context
  const mockNext = spy(() => {});
  const ctx = {
    request: {
      headers: new Headers(), // No token
    },
    response: { status: 0, body: {} },
    state: {},
  } as any;

  // Assertions
  await assertRejects(() => sessionMiddleware(ctx, mockNext), "no token");

  // Ensure `next` was not called
  assertSpyCalls(mockNext, 0);
});

Deno.test("Session Middleware - Invalid Token", async () => {
  // Mock dependencies
  const mockVerifyJWT = spy(async () => {
    throw new Error("Invalid token");
  });
  jwtService.verifyJWT = mockVerifyJWT;

  // Mock context
  const mockNext = spy(() => {});
  const ctx = {
    request: {
      headers: new Headers({ token: "invalid_token" }),
    },
    response: { status: 0, body: {} },
    state: {},
  } as any;

  // Run middleware and assert rejection
  await assertRejects(() => sessionMiddleware(ctx, mockNext), "Invalid token");

  // Assertions
  assertSpyCalls(mockNext, 0); // Ensure next was not called
  assertSpyCalls(mockVerifyJWT, 1); // Ensure verifyJWT was called
});

Deno.test("Session Middleware - Session Update", async () => {
  // Mock dependencies
  const mockRetrieveData = spy(() => ({ resumeText: "", jobDescription: "" }));
  const mockStoreData = spy(() => {});
  const mockVerifyJWT = spy(async () => ({ email: "test@example.com" }));

  inMemory.retrieveData = mockRetrieveData;
  inMemory.storeData = mockStoreData;
  jwtService.verifyJWT = mockVerifyJWT;

  // Mock context
  const mockNext = spy(() => {
    // Simulate updating session data
    ctx.state.sessionData.resumeText = "Updated Resume";
  });
  const ctx = {
    request: {
      headers: new Headers({ token: "valid_token" }),
    },
    response: { status: 0, body: {} },
    state: {},
  } as any;

  // Run middleware
  await sessionMiddleware(ctx, mockNext);

  // Assertions
  assertEquals(ctx.state.sessionData.resumeText, "Updated Resume");
  assertSpyCalls(mockStoreData, 1);
  assertEquals(
    mockStoreData.calls[0].args,
    ["test@example.com", "Updated Resume", ""]
  ); // Ensure updated data is stored
});
