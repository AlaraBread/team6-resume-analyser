"use client";

import ResumeForm from "./resumeForm";
import JobDescriptionForm from "./jobdescriptionForm";
import styles from "./frontendForm.module.css";
import { Card, CardContent } from "@mui/material";

export default function FrontendForm() {
	return (
		<div className={styles.container}>
			<Card className={styles.card}>
				<CardContent>
					<h1 className={styles.heading}>
						Resume and Job Description
					</h1>

					<ResumeForm />
					<JobDescriptionForm />
				</CardContent>
			</Card>
		</div>
	);
}
