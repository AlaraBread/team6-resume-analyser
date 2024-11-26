import { assertEquals, assertRejects } from "@std/assert";
import { createJWT, jwtKey } from "./jwt.ts";
import { verifyJWT } from "./jwt.ts";
import { create } from "@djwt";

Deno.test("jwt should contain email", async () => {
	const token = await createJWT("user@example.com");
	const email = (await verifyJWT(token)).email;
	assertEquals(
		email,
		"user@example.com",
	);
});

Deno.test("verify invalid jwt", async () => {
	await assertRejects(async () => {
		await verifyJWT("this isnt a jwt");
	});
});

Deno.test("invalid payload", async () => {
	const token = await create({ alg: "HS512", typ: "JWT" }, {}, jwtKey);
	await assertRejects(async () => {
		await verifyJWT(token);
	});
});
