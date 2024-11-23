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
				<List sx={{ listStyleType: "none", padding: 0 }}>
					{skills.map((skill, index) => (
						<ListItem key={index}>
							<ListItemText primary={skill} />
						</ListItem>
					))}
				</List>
			</CardContent>
		</Card>
	);
}
