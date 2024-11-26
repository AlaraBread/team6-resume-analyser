import { restore, stub } from "@std/testing/mock";
import { assertEquals } from "@std/assert";
import { generateHash } from "./generate_hash.ts";
import { encodeHex } from "@std/encoding";
import { crypto } from "./deps.ts";

Deno.test("generate a hash", async () => {
	restore();
	stub(crypto, "randomUUID", () => {
		return "1-2-3-4-5" as const;
	});
	assertEquals(
		await generateHash("user", "pass"),
		encodeHex(
			new Uint8Array(
				await crypto.subtle.digest(
					"SHA-256",
					new TextEncoder().encode("1-2-3-4-5" + "pass"),
				),
			),
		),
	);
});
