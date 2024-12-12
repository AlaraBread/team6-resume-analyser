import { assertEquals } from "@std/assert";
import { createMockContext } from "@oak/oak/testing";
import { Router } from "@oak/oak";
import analyze from "./analyze.ts";
import { createBody } from "../../util/util.test.ts";
import { stub, restore } from "@std/testing/mock";
import * as huggingface from "../huggingface/huggingface.ts"; // Import huggingface directly


Deno.test("POST /api/analyze - Valid Input", async () => {
  restore();

  // Mock analyzeTextHelper
  const mockAnalyzeTextHelper = stub(
    huggingface,
    "analyzeTextHelper",
    () => Promise.resolve({ similarity_score: 85 }),
  );

  const ctx = createMockContext({
    method: "POST",
    path: "/api/analyze",
    headers: [["Content-Type", "application/json"]],
    body: createBody(
      JSON.stringify({
        resumeText: "Resume content",
        jobDescription: "Job content",
      }),
    ),
  });

  const router = new Router();
  analyze(router);

  const next = async () => {};

  await router.routes()(ctx, next);

  // Assertions
  assertEquals(ctx.response.status, 200);
  assertEquals(ctx.response.body, {
    isError: false,
    message: "Analysis successful.",
    data: { similarity_score: 85 },
  });

  mockAnalyzeTextHelper.restore();
});

Deno.test("POST /api/analyze - Missing Input", async () => {
  restore();

  const ctx = createMockContext({
    method: "POST",
    path: "/api/analyze",
    headers: [["Content-Type", "application/json"]],
    body: createBody(
      JSON.stringify({
        jobDescription: "Job content", // Missing resumeText
      }),
    ),
  });

  const router = new Router();
  analyze(router);

  const next = async () => {};

  await router.routes()(ctx, next);

  // Assertions
  assertEquals(ctx.response.status, 400);
  assertEquals(ctx.response.body, {
    isError: true,
    message: "Both resumeText and jobDescription are required.",
  });
});

Deno.test("POST /api/analyze - Input Too Long", async () => {
  restore();

  const longText = "a".repeat(10001);

  const ctx = createMockContext({
    method: "POST",
    path: "/api/analyze",
    headers: [["Content-Type", "application/json"]],
    body: createBody(
      JSON.stringify({
        resumeText: longText,
        jobDescription: "Job content",
      }),
    ),
  });

  const router = new Router();
  analyze(router);

  const next = async () => {};

  await router.routes()(ctx, next);

  // Assertions
  assertEquals(ctx.response.status, 400);
  assertEquals(ctx.response.body, {
    isError: true,
    message: "Inputs must be strings and under 10000 characters.",
  });
});
