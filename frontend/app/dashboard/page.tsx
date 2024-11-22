import FitScoreChart from "./fit_score_chart";
import SkillsMatched from "./skills_matched";
import ImprovementSuggestions from "./improvement_suggestions";
import "./dashboard.css";

interface MockData {
	fitScore: number;
	matchedSkills: string[];
	improvementSuggestions: string[];
}

const mockData: MockData = {
	fitScore: 55,
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
		<div className="dashboard-container">
			<h1 className="dashboard-title">Resume Analysis Dashboard</h1>
			<br></br>
			<FitScoreChart score={mockData.fitScore} />
			<SkillsMatched skills={mockData.matchedSkills} />
			<ImprovementSuggestions
				suggestions={mockData.improvementSuggestions}
			/>
		</div>
	);
}
