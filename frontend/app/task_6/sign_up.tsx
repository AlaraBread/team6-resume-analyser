"use client";

import { Button, Card, CardContent, CardHeader, Input } from "@mui/material";
import { useState } from "react";
import { backendPost } from "util/fetching";

export function SignUp() {
	const [postData, setPostData] = useState<string | undefined>();
	return (
		<>
			<Card>
				<CardHeader component="h2" title="Sign Up" />
				<CardContent>
					<p data-testid="backend-sign-up-post">{postData}</p>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							const data = new FormData(
								event.target as HTMLFormElement,
							);

							backendPost("api/sign_up", {
								email: data.get("email")?.toString() ?? "",
								username:
									data.get("username")?.toString() ?? "",
								password:
									data.get("password")?.toString() ?? "",
								confirm_password:
									data.get("confirm_password")?.toString() ??
									"",
							})
								.then((data) => {
									setPostData(data.message);
								})
								.catch((reason) => {
									setPostData("" + reason);
								});
						}}
					>
						<Input name="email" placeholder="email" />
						<br />
						<Input name="username" placeholder="username" />
						<br />
						<Input
							name="password"
							type="password"
							placeholder="password"
						/>
						<br />
						<Input
							name="confirm_password"
							type="password"
							placeholder="confirm password"
						/>
						<br />
						<br />
						<Button variant="contained" type="submit">
							sign up
						</Button>
					</form>
				</CardContent>
			</Card>
		</>
	);
}
