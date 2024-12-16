"use client";

import FitScoreChart from "./fit_score_chart";
import SkillsMatched from "./skills_matched";
import ImprovementSuggestions from "./improvement_suggestions";
import styles from "./dashboard.module.css";
import { getRequests, postRequests, backendPost } from "util/fetching";
import { useState, useEffect } from "react";
import React from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { generatePDF, generateWord } from "./report_generator";
import { useProtectRoute } from "util/fetching";
import JobDescriptionForm from "app/form/job_description_form";

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

	const [analyzeData, setAnalyzeData] = useState<
		postRequests["api/analyze"]["response"] | null
	>(null);
	const [fitData, setFitData] = useState<
		postRequests["api/fit-score"]["response"] | null
	>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		backendPost("api/analyze", {}).then((analyzeResponse) => {
			setAnalyzeData(analyzeResponse);

			backendPost("api/fit-score", {
				resumeKeywords: analyzeResponse.data.resumeAnalysis,
				jobDescriptionKeywords:
					analyzeResponse.data.jobDescriptionAnalysis,
			}).then((fitResponse) => {
				setFitData(fitResponse);
			});
		});
	});

	const [fileFormat, setFileFormat] = useState("PDF"); // Default format is PDF

	// if data is null then its loading
	if (loading)
		return (
			<div className={styles.dashboardContainer}>
				<h1>loading...</h1>
			</div>
		);

	if (analyzeData == null || fitData == null || error) {
		// response is null, display error page
		return (
			<div className={styles.dashboardContainer}>
				<h1>Error retrieving results</h1>
				<p>null response</p>
			</div>
		);
	} else if (fitData.isError) {
		// isError is true, display error page
		return (
			<div className={styles.dashboardContainer}>
				<h1>Error retrieving results</h1>
				<p>{fitData.message}</p>
			</div>
		);
	} else {
		// no errors, display dashboard
		const handleDownload = () => {
			if (fileFormat === "PDF") {
				generatePDF(
					fitData.fitScore,
					fitData.matchedSkills,
					analyzeData.data.feedback,
				);
			} else if (fileFormat === "Word") {
				generateWord(
					fitData.fitScore,
					fitData.matchedSkills,
					analyzeData.data.feedback,
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
					<FitScoreChart score={fitData.fitScore} />
					<SkillsMatched skills={fitData.matchedSkills} />
					<ImprovementSuggestions
						suggestions={analyzeData.data.feedback}
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
