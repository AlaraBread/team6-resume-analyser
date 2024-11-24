import FitScoreChart from "./fit_score_chart";
import SkillsMatched from "./skills_matched";
import ImprovementSuggestions from "./improvement_suggestions";
import styles from "./pages.module.css";
export interface MockData {
	fitScore: number;
	matchedSkills: string[];
	improvementSuggestions: string[];
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
		"Add personal characteristics.",
		"Include measurable achievements.",
		"Add personal project(s)",
	],
};

export default function Dashboard() {
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
