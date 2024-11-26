"use client";

import { Button, Card, CardContent, CardHeader, Input } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { backendPost } from "util/fetching";

export function Register() {
	const [postData, setPostData] = useState<string | undefined>();
	const [blankMessage, setBlankMessage] = useState("");
	const [passMessage, setPassMessage] = useState("");
	const router = useRouter();
	return (
		<>
			<Card>
				<CardHeader component="h2" title="Register" />
				<CardContent>
					<p data-testid="backend-register-post">{postData}</p>
					<form
						encType="text/plain"
						onSubmit={(event) => {
							event.preventDefault();
							const data = new FormData(
								event.target as HTMLFormElement,
							);
							// read fields
							const fields = {
								email: data.get("email")?.toString() ?? "",
								username:
									data.get("username")?.toString() ?? "",
								password:
									data.get("password")?.toString() ?? "",
								confirmPassword:
									data.get("confirm_password")?.toString() ??
									"",
							};

							// verify fields are not empty
							let isBlank = false;
							for (const [_key, value] of Object.entries(
								fields,
							)) {
								if (!value) isBlank = true;
							}
							if (isBlank)
								setBlankMessage(
									"Please make sure you didn't leave any of the fields blank.",
								);
							else setBlankMessage("");

							// verify passwords match
							const isMatching =
								fields["password"] == fields["confirmPassword"];
							if (isMatching) setPassMessage("");
							else
								setPassMessage(
									"Please make sure passwords match.",
								);

							if (isMatching && !isBlank) {
								// input is valid
								backendPost("api/register", fields)
									.then((data) => {
										setPostData(data.message);
										router.push("/login");
									})
									.catch((reason) => {
										setPostData("" + reason);
									});
							}
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
						{/* will let the user know when the passwords dont match*/}
						<label data-testid="pass-message">{passMessage}</label>
						<br />
						{/* will let the user know when that fields cannot be left blank*/}
						<label data-testid="blank-message">
							{blankMessage}
						</label>
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
