import { Application } from "@oak/oak";
import { router } from "./routes.ts";
import { oakCors } from "@tajpouria/cors";
import "jsr:@std/dotenv/load";

if (import.meta.main) {
	const app = new Application();
	app.use(oakCors({ origin: "*" }));
	app.use(router.routes());
	app.use(router.allowedMethods());

	const port = 3001;
	console.log(`listening on port ${port}`);
	app.listen({
		port,
	});
}
