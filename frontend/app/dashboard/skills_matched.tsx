import {
	Card,
	CardContent,
	CardHeader,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import "./dashboard.css";
interface SkillsMatchedProps {
	skills: string[];
}

export default function SkillsMatched({ skills }: SkillsMatchedProps) {
	return (
		<Card className="card-container-skills-match">
			<CardHeader
				component="h2"
				title="Skills and Keywords Matched"
				titleTypographyProps={{ style: { fontWeight: "bold" } }}
			/>
			<CardContent>
				<List className="skills-matched-list">
					{skills.map((skill, index) => (
						<ListItem
							key={index}
							disablePadding
							style={{ display: "list-item" }}
						>
							<ListItemText primary={skill} />
						</ListItem>
					))}
				</List>
			</CardContent>
		</Card>
	);
}
