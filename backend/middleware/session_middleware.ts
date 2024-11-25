import { Middleware } from "@oak/oak";
import { generateSessionId, retrieveData, storeData } from "../in_memory/in_memory.ts";

export const sessionMiddleware: Middleware = async (ctx, next) => {
  // Retrieve or generate a session ID
  const sessionId = (await ctx.cookies.get("sessionId")) || generateSessionId();


  ctx.cookies.set("sessionId", sessionId, { httpOnly: true });

  // Attach session data to the context state
  ctx.state.sessionId = sessionId;
  ctx.state.sessionData = retrieveData(sessionId) || {};

  await next();

  // Update tempStorage after route handler executes
  const updatedSessionData = ctx.state.sessionData;
  if (updatedSessionData) {
    storeData(sessionId, updatedSessionData.resume_text || "", updatedSessionData.job_description || "");
  }
};
