"use client";

import FitScoreChart from "./fit_score_chart";
import SkillsMatched from "./skills_matched";
import ImprovementSuggestions from "./improvement_suggestions";
import styles from "./dashboard.module.css";
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
	return (
		<div className={styles.dashboardContainer}>
			<h1 className={styles.dashboardTitle}>Resume Analysis Dashboard</h1>
			<br></br>
			<FitScoreChart score={mockData.fitScore} />
			<SkillsMatched skills={mockData.matchedSkills} />
			<ImprovementSuggestions
				suggestions={mockData.improvementSuggestions}
			/>
		</div>
	);
}
