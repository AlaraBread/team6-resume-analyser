"use client";

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CircularProgress,
	Input,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { backendPost } from "util/fetching";

export function Login() {
	const [postData, setPostData] = useState<string | undefined>();
	const [blankMessage, setBlankMessage] = useState("");
	const [emailMessage, setEmailMessage] = useState("");
	const [isLoading, setLoading] = useState(false);
	const router = useRouter();
	function onSubmit(event: FormEvent) {
		event.preventDefault();
		const data = new FormData(event.target as HTMLFormElement);
		// read fields
		const email = data.get("email")?.toString() ?? "";
		const password = data.get("password")?.toString() ?? "";

		setBlankMessage("");
		setEmailMessage("");

		if (!email || !password) {
			setBlankMessage(
				"Please make sure you didn't leave any of the fields blank.",
			);
			return;
		}

		// verify email format
		const emailRegex = /^.+@.+$/;
		if (!emailRegex.test(email)) {
			setEmailMessage(
				"Please enter a valid email address for logging in.",
			);
			return;
		}

		setLoading(true);

		//input is valid
		backendPost("api/login", {
			email: data.get("email")?.toString() ?? "",
			password: data.get("password")?.toString() ?? "",
		})
			.then((data) => {
				setLoading(false);
				if (data.isError) {
					setLoading(false);
					// Show error and stay on login
					setPostData(data.message);
				} else {
					setPostData(data.message);
					router.push("/form");
				}
			})
			.catch((reason) => {
				setLoading(false);
				setPostData("" + reason);
			});
	}
	return (
		<Card>
			<CardHeader component="h2" title="Login" />
			{isLoading ? <CircularProgress /> : undefined}
			<CardContent>
				<p data-testid="backend-login-post">
					{!blankMessage && !emailMessage ? postData : ""}
				</p>
				<form encType="text/plain" onSubmit={onSubmit}>
					<Input name="email" placeholder="email" />
					<br />
					<Input
						name="password"
						type="password"
						placeholder="password"
					/>
					<br />
					{/* will let the user know when that fields cannot be left blank*/}
					<span data-testid="blank-message">{blankMessage}</span>
					<br />
					<span data-testid="email-message">{emailMessage}</span>
					<br />
					<Button variant="contained" type="submit">
						login
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
