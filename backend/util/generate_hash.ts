import { encodeHex } from "@std/encoding";
import { crypto } from "./deps.ts";

// this will need to get saved to a file at some point
const salts: Record<string, string> = {};

export async function generateHash(
	username: string,
	password: string,
): Promise<string> {
	const salt = username in salts
		? salts[username]
		: salts[username] = crypto.randomUUID();
	// Hash the password
	const messageBuffer = new TextEncoder().encode(salt + password);
	const hashBuffer = await crypto.subtle.digest(
		"SHA-256",
		messageBuffer,
	);
	const hashedPassword = encodeHex(new Uint8Array(hashBuffer));

	return hashedPassword;
}
