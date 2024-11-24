import { Buffer, createHmac, getNumericDate } from "../api/deps.ts";

const base64UrlEncode = (data: string): string => {
	return Buffer.from(data, "utf-8").toString("base64");
};

const headerObject = {
	typ: "JWT",
	alg: "HS256",
};
// Secret key for JWT
const jwtKey = "59c4b48eac7e9ac37c046ba88964870d";

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
