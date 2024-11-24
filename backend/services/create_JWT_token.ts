import { getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { createHmac } from "node:crypto";
import { Buffer } from "node:buffer";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

const base64UrlEncode = (data: string): string => {
	return Buffer.from(data, "utf-8").toString("base64");
};

const headerObject = {
	typ: "JWT",
	alg: "HS256",
};

// Load environment variable from .env
const env = config({ path: "../../.env" });
const jwtKey = env.JWT_SECRET_KEY;

const createJWT = (email: string, password: string) => {
	const payloadObject = {
		sub: email,
		password: password,
		exp: getNumericDate(60 * 60), // 1 hour expiration
	};
	const base64Header = base64UrlEncode(JSON.stringify(headerObject));
	const base64Payload = base64UrlEncode(JSON.stringify(payloadObject));
	const signature: string = createHmac("sha256", jwtKey)
		.update(`${base64Header}.${base64Payload}`)
		.digest("hex");
	return [base64Header, base64Payload, signature].join(".");
};

export { createJWT };
