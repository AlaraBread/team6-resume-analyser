import {
	Card,
	CardContent,
	Typography,
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
			<CardContent>
				<Typography variant="h6" style={{ fontWeight: "bold" }}>
					Skills and Keywords Matched
				</Typography>
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
