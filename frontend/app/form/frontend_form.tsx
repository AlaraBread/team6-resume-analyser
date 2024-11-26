"use client";

import ResumeForm from "./resume_form";
import JobDescriptionForm from "./job_description_form";
import styles from "./frontend_form.module.css";
import { Card, CardContent } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

export default function FrontendForm() {
	const [jobDescriptionSubmitted, setJobDescriptionSubmitted] =
		useState(false);
	const [resumeSubmitted, setResumeSubmitted] = useState(false);
	return (
		<div className={styles.container}>
			<Card className={styles.card}>
				<CardContent>
					<h1 className={styles.heading}>
						Resume and Job Description
					</h1>

					<ResumeForm
						onSubmit={() => {
							setResumeSubmitted(true);
						}}
					/>
					<JobDescriptionForm
						onSubmit={() => {
							setJobDescriptionSubmitted(true);
						}}
					/>
					{jobDescriptionSubmitted && resumeSubmitted ? (
						<Link href={"/dashboard"}>View Analysis</Link>
					) : undefined}
				</CardContent>
			</Card>
		</div>
	);
}
