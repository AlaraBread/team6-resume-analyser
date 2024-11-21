interface SkillsMatchedProps {
	skills: string[];
}

export default function SkillsMatched({ skills }: SkillsMatchedProps) {
	return (
		<div style={{ marginBottom: "2rem" }}>
			<h2>Skills and Keywords Matched</h2>
			<ul>
				{skills.map((skill, index) => (
					<li key={index} style={{ marginBottom: "0.5rem" }}>
						{skill}
					</li>
				))}
			</ul>
		</div>
	);
}
