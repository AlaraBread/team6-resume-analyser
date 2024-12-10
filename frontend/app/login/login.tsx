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
	const [isLoading, setLoading] = useState(false);
	const router = useRouter();
	function onSubmit(event: FormEvent) {
		event.preventDefault();
		const data = new FormData(event.target as HTMLFormElement);
		// read fields
		const email = data.get("email")?.toString() ?? "";
		const password = data.get("password")?.toString() ?? "";

		if (!email || !password) {
			setBlankMessage(
				"Please make sure you didn't leave any of the fields blank.",
			);
			return;
		}
		setBlankMessage("");
		// verify email format
		const emailRegex = /^[a-zA-Z0-9_]+@[a-zA-Z]+\.[a-z]{2,}$/;
		if (!emailRegex.test(email)) {
			setBlankMessage(
				"Please enter a valid email address for logging in.",
			);
			return;
		}
		setBlankMessage("");

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
					setTimeout(() => {
						router.push("/form");
					}, 2000);
				}
				/*
				setLoading(false);
				setPostData(data.message);
				router.push("/form");
				*/
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
				<p data-testid="backend-login-post">{postData}</p>
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
					<Button variant="contained" type="submit">
						login
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
