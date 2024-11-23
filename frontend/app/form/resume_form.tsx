"use client";

import { useState } from "react";
import { backendPost } from "util/fetching";
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
	const [file, setFile] = useState<File | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const handleSubmit = (event: React.FormEvent) => {
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
		backendPost("api/resume-upload", { file })
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
				<form
					onSubmit={(event) => {
						void handleSubmit(event);
					}}
				>
					<Button
						component="label"
						role="button"
						variant="contained"
						tabIndex={-1}
					>
						UPLOAD RESUME
						<VisuallyHiddenInput
							type="file"
							accept="application/pdf"
							onChange={(event) => {
								const selectedFile =
									event.target.files?.[0] || null;
								setFile(selectedFile);
							}}
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
