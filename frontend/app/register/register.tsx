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

export function Register() {
	const [postData, setPostData] = useState<string | undefined>();
	const [blankMessage, setBlankMessage] = useState("");
	const [emailMessage, setEmailMessage] = useState("");
	const [passMessage, setPassMessage] = useState("");
	const [isLoading, setLoading] = useState(false);
	const router = useRouter();
	function onSubmit(event: FormEvent) {
		event.preventDefault();
		const data = new FormData(event.target as HTMLFormElement);

		const email = data.get("email")?.toString() ?? "";
		const username = data.get("username")?.toString() ?? "";
		const password = data.get("password")?.toString() ?? "";
		const confirmPassword = data.get("confirm_password")?.toString() ?? "";

		setBlankMessage("");
		setEmailMessage("");
		setPassMessage("");
		// verify fields are not empty
		if (!email || !username || !password || !confirmPassword) {
			setBlankMessage(
				"Please make sure you didn't leave any of the fields blank.",
			);
			return;
		}

		//setBlankMessage("");
		// verify email format
		const emailRegex = /^[a-zA-Z0-9_]+@[a-zA-Z]+\.[a-z]{2,}$/;
		if (!emailRegex.test(email)) {
			setEmailMessage("Please enter a valid email address.");
			return;
		}

		//setEmailMessage("");
		// verify passwords match
		if (password != confirmPassword) {
			setPassMessage("Please make sure passwords match.");
			return;
		}

		//setPassMessage("");
		// input is valid
		setLoading(true);
		backendPost("api/register", {
			email,
			username,
			password,
		})
			.then((data) => {
				setLoading(false);
				if (data.isError) {
					setLoading(false);
					setPostData(data.message);
				} else {
					setPostData(data.message);
					router.push("/login");
				}
			})
			.catch((reason) => {
				console.error(reason);
				setPostData("Error: " + (reason?.message ?? reason));
				setLoading(false);
			});
	}

	return (
		<Card>
			<CardHeader component="h2" title="Register" />
			{isLoading ? <CircularProgress /> : undefined}
			<CardContent>
				<p data-testid="backend-register-post">
					{!blankMessage && !emailMessage && !passMessage
						? postData
						: ""}
				</p>
				<form encType="text/plain" onSubmit={onSubmit}>
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
					{/* will let the user know when the passwords dont match*/}
					<span data-testid="pass-message">{passMessage}</span>
					<br />
					{/* will let the user know when that fields cannot be left blank*/}
					<span data-testid="blank-message">{blankMessage}</span>
					<br />
					{/* will let the user know when that fields cannot be left blank*/}
					<span data-testid="email-message">{emailMessage}</span>
					<br />
					<Button variant="contained" type="submit">
						register
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
