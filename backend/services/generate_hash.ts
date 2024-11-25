import { crypto } from "@std/crypto";
import { encodeHex } from "@std/encoding";

export async function generateHash(password: string): Promise<string> {
	// Hash the password
	const messageBuffer = new TextEncoder().encode(password);
	const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
	const hashedPassword = encodeHex(new Uint8Array(hashBuffer));

	return hashedPassword;
}
