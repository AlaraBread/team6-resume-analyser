"use client";

import { useState } from "react";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	TextField,
} from "@mui/material";

export default function ResumeForm() {
	const [file, setFile] = useState<File | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	/**
	 * Requires task 8 to submit form data
	 * For now, I created a mock upload to
	 * return a response
	 */
	const uploadResume = async (_file: File): Promise<string> => {
		return Promise.resolve("Resume uploaded successfully");
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// Checks if a file was selected
		if (!file) {
			setMessage("Please select a file");
			return;
		}

		// Checks if file is PDF
		if (file.type !== "application/pdf") {
			setMessage("PDF files are only allowed");
			return;
		}

		// Checks if file is over 2MB
		if (file.size > 2 * 1024 * 1024) {
			setMessage("File size must be under 2MB");
			return;
		}

		// This will upload the resume
		try {
			const response = await uploadResume(file);
			setMessage(response);
		} catch {
			setMessage("There was an error uploading your resume");
		}
	};
	return (
		<Card>
			<CardHeader title="Resume Upload" />
			<CardContent>
				<form
					onSubmit={(event) => {
						void handleSubmit(event);
					}}
				>
					<TextField
						type="file"
						slotProps={{
							htmlInput: {
								accept: "application/pdf",
								"aria-label": "Upload your resume",
							},
						}}
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>,
						) => {
							const selectedFile =
								event.target.files?.[0] || null;
							setFile(selectedFile);
						}}
						fullWidth
						margin="normal"
					/>
					<Button type="submit" variant="contained" fullWidth>
						Upload Resume
					</Button>
					{message && message}
				</form>
			</CardContent>
		</Card>
	);
}
