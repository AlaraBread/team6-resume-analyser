"use client";

import FitScoreChart from "./fit_score_chart";
import SkillsMatched from "./skills_matched";
import ImprovementSuggestions from "./improvement_suggestions";
import styles from "./dashboard.module.css";
import { useState } from "react";
import React from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { generatePDF, generateWord } from "./report_generator";
import { useProtectRoute } from "util/fetching";
export interface MockData {
	fitScore: number;
	matchedSkills: string[];
	improvementSuggestions: {
		category: string;
		text: string;
	}[];
}

const mockData: MockData = {
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

export default function Dashboard() {
	useProtectRoute();

	const [fileFormat, setFileFormat] = useState("PDF"); // Default format is PDF

	const handleDownload = () => {
		if (fileFormat === "PDF") {
			generatePDF(
				mockData.fitScore,
				mockData.matchedSkills,
				mockData.improvementSuggestions,
			);
		} else if (fileFormat === "Word") {
			generateWord(
				mockData.fitScore,
				mockData.matchedSkills,
				mockData.improvementSuggestions,
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
				<FitScoreChart score={mockData.fitScore} />
				<SkillsMatched skills={mockData.matchedSkills} />
				<ImprovementSuggestions
					suggestions={mockData.improvementSuggestions}
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
						onChange={(event) => setFileFormat(event.target.value)}
					>
						<MenuItem value="PDF">PDF</MenuItem>
						<MenuItem value="Word">Word</MenuItem>
					</Select>
				</FormControl>
			</div>
		</>
	);
}
