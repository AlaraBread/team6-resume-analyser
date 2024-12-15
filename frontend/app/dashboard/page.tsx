"use client";

import FitScoreChart from "./fit_score_chart";
import SkillsMatched from "./skills_matched";
import ImprovementSuggestions from "./improvement_suggestions";
import styles from "./dashboard.module.css";

import { useBackendGet } from "util/fetching";

import { useProtectRoute } from "util/fetching";
export interface MockData {
	isError: boolean;
	message: string;
	fitScore: number;
	matchedSkills: string[];
	improvementSuggestions: {
		category: string;
		text: string;
	}[];
}
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
	const response = useBackendGet("api/fit-score").data;
	if (response == null) {
		return (
			<div className={styles.dashboardContainer}>
				<h1>Error retrieving results</h1>
				<p>null response</p>
			</div>
		);
	} else if (response.isError) {
		return (
			<div className={styles.dashboardContainer}>
				<h1>Error retrieving results</h1>
				<p>{response.message}</p>
			</div>
		);
	} else {
		return (
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
		);
	}
}
