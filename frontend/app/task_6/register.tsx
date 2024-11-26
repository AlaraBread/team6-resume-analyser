"use client";

import { Button, Card, CardContent, CardHeader, Input } from "@mui/material";
import { useState } from "react";
import { backendPost } from "util/fetching";

export function Register() {
	const [postData, setPostData] = useState<string | undefined>();
	return (
		<>
			<Card>
				<CardHeader component="h2" title="Register" />
				<CardContent>
					<p data-testid="backend-register-post">{postData}</p>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							const data = new FormData(
								event.target as HTMLFormElement,
							);

							backendPost("api/register", {
								email: data.get("email")?.toString() ?? "",
								username:
									data.get("username")?.toString() ?? "",
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
							register
						</Button>
					</form>
				</CardContent>
			</Card>
		</>
	);
}
