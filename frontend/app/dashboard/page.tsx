"use client";

import FitScoreChart from "./fit_score_chart";
import SkillsMatched from "./skills_matched";
import ImprovementSuggestions from "./improvement_suggestions";
import styles from "./dashboard.module.css";
import { getRequests, useBackendGet } from "util/fetching";
import { useState } from "react";
import React from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { generatePDF, generateWord } from "./report_generator";
import { useProtectRoute } from "util/fetching";

export type DashboardData = getRequests["api/fit-score"];

// mock data for testing
/*
const mockData: MockData = {
	isError: false,
	message: "get fit score successful",
	fitScore: 85,
	matchedSkills: [
		"JavaScript",
		"React",
		"Node.js",
		"Next.js",
		"Team Collaboration",
		"C",
		"C#",
	],
	improvementSuggestions: [
		{ category: "skills", text: "Add personal characteristics." },
		{ category: "experience", text: "Include measurable achievements." },
		{ category: "skills", text: "Add personal project(s)." },
	],
};
const mockError: MockData = {
	isError: true,
	message: "failed to get fit score",
	fitScore: 85,
	matchedSkills: [],
	improvementSuggestions: [],
};
const mockEmpty: MockData = {
	isError: false,
	message: "get fit score successful",
	fitScore: 0,
	matchedSkills: [],
	improvementSuggestions: [],
};
*/

export default function Dashboard() {
	useProtectRoute();
	//if you wanna use the mock data just swap out useBackendGet().data for the mock data
	const response = useBackendGet("api/fit-score").data;

	const [fileFormat, setFileFormat] = useState("PDF"); // Default format is PDF

	if (response == null) {
		// response is null, display error page
		return (
			<div className={styles.dashboardContainer}>
				<h1>Error retrieving results</h1>
				<p>null response</p>
			</div>
		);
	} else if (response.isError) {
		// isError is true, display error page
		return (
			<div className={styles.dashboardContainer}>
				<h1>Error retrieving results</h1>
				<p>{response.message}</p>
			</div>
		);
	} else {
		// no errors, display dashboard
		const handleDownload = () => {
			if (fileFormat === "PDF") {
				generatePDF(
					response.fitScore,
					response.matchedSkills,
					response.improvementSuggestions,
				);
			} else if (fileFormat === "Word") {
				generateWord(
					response.fitScore,
					response.matchedSkills,
					response.improvementSuggestions,
				);
			}
		};
		return (
			<>
				<div className={styles.dashboardContainer}>
					<h1 className={styles.dashboardTitle}>
						Resume Analysis Dashboard
					</h1>
					<br></br>
					<FitScoreChart score={response.fitScore} />
					<SkillsMatched skills={response.matchedSkills} />
					<ImprovementSuggestions
						suggestions={response.improvementSuggestions}
					/>
				</div>

				{/* Button Container for Download Report */}
				<div className={styles.buttonContainer}>
					{/* Select Button for File Format */}
					<Button
						variant="contained"
						color="primary"
						onClick={handleDownload}
					>
						Download Report
					</Button>
					<FormControl>
						<InputLabel id="file-format-select-label">
							Format
						</InputLabel>
						<Select
							labelId="file-format-select-label"
							value={fileFormat}
							label="Format"
							onChange={(event) =>
								setFileFormat(event.target.value)
							}
						>
							<MenuItem value="PDF">PDF</MenuItem>
							<MenuItem value="Word">Word</MenuItem>
						</Select>
					</FormControl>
				</div>
			</>
		);
	}
}
