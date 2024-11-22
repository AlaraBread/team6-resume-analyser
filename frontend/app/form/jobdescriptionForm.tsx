"use client";

import { useState } from "react";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	TextField,
} from "@mui/material";

export default function JobDescriptionForm() {
	const [description, setDescription] = useState<string>("");
	const [message, setMessage] = useState<string | null>(null);

	/**
	 * Requires task 8 to submit form data
	 * For now, I created a mock to submit and
	 * return a response
	 */
	const uploadJobDescription = async (
		_description: string,
	): Promise<string> => {
		return Promise.resolve("Job description submitted successfully.");
	};

	const handleSubmit = async (event: React.FormEvent) => {
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

		// Submits job description
		try {
			const response = await uploadJobDescription(description);
			setMessage(response);
		} catch {
			setMessage("There was an error submitting the job description.");
		}
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
					{message && message}
				</form>
			</CardContent>
		</Card>
	);
}
