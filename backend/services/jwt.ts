import { create, getNumericDate, verify } from "@djwt";

export const jwtKey = await crypto.subtle.generateKey(
	{ name: "HMAC", hash: "SHA-512" },
	true,
	["sign", "verify"],
);

interface JWTPayload {
	// the user's email
	email: string;
}

export async function createJWT(email: string) {
	const payload = {
		sub: email,
		exp: getNumericDate(60 * 60), // 1 hour expiration
	};
	return await create({ alg: "HS512", typ: "JWT" }, payload, jwtKey);
}

export async function verifyJWT(jwt: string): Promise<JWTPayload> {
	const payload = await verify(jwt, jwtKey);
	if (!payload.sub) {
		return Promise.reject("invalid payload");
	}
	return Promise.resolve({
		email: payload.sub,
	});
}
