"use client";

import FitScoreChart from "./fit_score_chart";
import SkillsMatched from "./skills_matched";
import ImprovementSuggestions from "./improvement_suggestions";
import styles from "./dashboard.module.css";
import { useRouter } from "next/navigation";
import { isLoggedIn, useBackendGet } from "util/fetching";
import { useEffect } from "react";
export interface MockData {
	isError: boolean;
	message: string;
	fitScore?: number;
	matchedSkills?: string[];
	improvementSuggestions?: string[];
}

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
		"Add personal characteristics.",
		"Include measurable achievements.",
		"Add personal project(s)",
	],
};

const mockError: MockData = {
	isError: true,
	message: "failed to get fit score",
};

export default function Dashboard() {
	const router = useRouter();
	useEffect(() => {
		if (!isLoggedIn()) {
			router.push("/");
		}
	});
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
		// handle null values
		const score = response.fitScore ?? 0;
		const skills = response.matchedSkills ?? [];
		const suggestions = response.improvementSuggestions ?? [];
		return (
			<div className={styles.dashboardContainer}>
				<h1 className={styles.dashboardTitle}>
					Resume Analysis Dashboard
				</h1>
				<br></br>
				<FitScoreChart score={score} />
				<SkillsMatched skills={skills} />
				<ImprovementSuggestions suggestions={suggestions} />
			</div>
		);
	}
}
