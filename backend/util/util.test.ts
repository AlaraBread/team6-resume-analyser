import { assert } from "@std/assert";

export function createBody(body: string) {
	const req = new Request("http://0.0.0.0", {
		method: "POST",
		body: (body + "\n").replaceAll("\n", "\r\n"),
	});
	assert(req.body);
	return req.body;
}
