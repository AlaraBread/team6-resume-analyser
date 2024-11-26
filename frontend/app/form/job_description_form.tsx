"use client";

import { useState } from "react";
import { backendPost } from "util/fetching";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CircularProgress,
	TextField,
} from "@mui/material";

export default function JobDescriptionForm(props: { onSubmit?: () => void }) {
	const [description, setDescription] = useState<string>("");
	const [message, setMessage] = useState<string | null>(null);
	const [isLoading, setLoading] = useState(false);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		// Check if the job description is empty
		if (!description) {
			setMessage("Job description cannot be empty.");
			return;
		}

		// Check if it char count exceeds 5000
		if (description.length > 5000) {
			setMessage("Job description must be under 5000 characters.");
			return;
		}

		setLoading(true);
		// Submits job description
		backendPost("api/job-description", { jobDescription: description })
			.then((data) => {
				setLoading(false);
				setMessage(data.message);
				if (props.onSubmit) {
					props.onSubmit();
				}
			})
			.catch((reason) => {
				setMessage("Error: " + (reason?.message ?? reason));
				setLoading(false);
			});
	};
	return (
		<Card>
			<CardHeader title="Job Description" />
			<CardContent>
				<form
					onSubmit={(event) => {
						void handleSubmit(event);
					}}
				>
					{isLoading ? <CircularProgress /> : undefined}
					<TextField
						label="Job Description"
						multiline
						rows={4}
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						placeholder="Enter job description"
						variant="outlined"
						fullWidth
						margin="normal"
					/>
					Character count: {description.length}/5000
					<Button type="submit" variant="contained" fullWidth>
						Submit Job Description
					</Button>
					{message ?? ""}
				</form>
			</CardContent>
		</Card>
	);
}
