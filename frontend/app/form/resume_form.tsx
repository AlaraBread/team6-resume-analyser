"use client";

import { useState } from "react";
import { backendFormPost } from "util/fetching";
import { Button, Card, CardContent, CardHeader, styled } from "@mui/material";

/*https://mui.com/material-ui/react-button/#file-upload*/
const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

export default function ResumeForm() {
	const [message, setMessage] = useState<string | null>(null);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const file = formData.get("file");

		// Checks if a file was selected
		if (!file || typeof file == "string" || file.name == "") {
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
		backendFormPost("api/resume-upload", formData)
			.then((data) => {
				setMessage(data.message);
			})
			.catch((error) => {
				setMessage("" + error);
			});
	};
	return (
		<Card>
			<CardHeader title="Resume Upload" />
			<CardContent>
				<form onSubmit={handleSubmit} name="resume upload">
					<Button
						component="label"
						role="button"
						variant="contained"
						tabIndex={-1}
					>
						UPLOAD RESUME
						<VisuallyHiddenInput
							name="file"
							type="file"
							accept="application/pdf"
						/>
					</Button>
					<Button
						type="submit"
						variant="contained"
						fullWidth
						style={{ marginTop: "1rem" }}
					>
						Submit Resume
					</Button>
					{message ?? ""}
				</form>
			</CardContent>
		</Card>
	);
}
