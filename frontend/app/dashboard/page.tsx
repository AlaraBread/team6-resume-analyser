import FitScoreChart from "./FitScoreChart";
import SkillsMatched from "./SkillsMatched";
import ImprovementSuggestions from "./ImprovementSuggestions";

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
		<div style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
			<h1 style={{ textAlign: "center" }}>Resume Analysis Dashboard</h1>
			<br></br>
			<FitScoreChart score={mockData.fitScore} />
			<SkillsMatched skills={mockData.matchedSkills} />
			<ImprovementSuggestions
				suggestions={mockData.improvementSuggestions}
			/>
		</div>
	);
}
