import "./dashboard.css";
interface SkillsMatchedProps {
	skills: string[];
}

export default function SkillsMatched({ skills }: SkillsMatchedProps) {
	return (
		<div>
			<h2 className="skills-matched-title">
				Skills and Keywords Matched
			</h2>
			<ul className="skills-matched-list">
				{skills.map((skill, index) => (
					<li key={index} className="skills-matched-item">
						{skill}
					</li>
				))}
			</ul>
		</div>
	);
}
