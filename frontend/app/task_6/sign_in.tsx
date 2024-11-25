"use client";

import { Button, Card, CardContent, CardHeader, Input } from "@mui/material";
import { useState } from "react";
import { backendPost } from "util/fetching";

export function SignIn() {
	const [postData, setPostData] = useState<string | undefined>();
	return (
		<>
			<Card>
				<CardHeader component="h2" title="Sign In" />
				<CardContent>
					<p data-testid="backend-sign-in-post">{postData}</p>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							const data = new FormData(
								event.target as HTMLFormElement,
							);

							backendPost("api/sign_in", {
								email: data.get("email")?.toString() ?? "",
								password:
									data.get("password")?.toString() ?? "",
							})
								.then((data) => {
									setPostData(data.message);
								})
								.catch((reason) => {
									setPostData("" + reason);
								});
						}}
					>
						<Input name="username" placeholder="username" />
						<br />
						<Input
							name="password"
							type="password"
							placeholder="password"
						/>
						<br />
						<br />
						<Button variant="contained" type="submit">
							sign in
						</Button>
					</form>
				</CardContent>
			</Card>
		</>
	);
}
