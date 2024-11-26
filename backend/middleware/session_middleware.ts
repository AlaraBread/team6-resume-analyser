import { Middleware } from "@oak/oak";
import { jwt } from "./deps.ts";
import { inMemory } from "./deps.ts";

export const sessionMiddleware: Middleware = async (ctx, next) => {
	// Retrieve or generate a session ID
	const token = ctx.request.headers.get("token");
	if (!token) {
		return Promise.reject("no token");
	}
	const payload = await jwt.verifyJWT(token);

	// Attach session data to the context state
	ctx.state.email = payload.email;
	ctx.state.sessionData = inMemory.retrieveData(payload.email) || {};

	await next();

	// Update tempStorage after route handler executes
	const updatedSessionData = ctx.state.sessionData;
	if (updatedSessionData) {
		inMemory.storeData(
			payload.email,
			updatedSessionData.resumeText || "",
			updatedSessionData.jobDescription || "",
		);
	}
};
