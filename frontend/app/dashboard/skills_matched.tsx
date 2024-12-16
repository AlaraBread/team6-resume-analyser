import {
	Card,
	CardContent,
	CardHeader,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import styles from "./dashboard.module.css";
interface SkillsMatchedProps {
	skills: string[];
}

export default function SkillsMatched({ skills = [] }: SkillsMatchedProps) {
	return (
		<Card className={styles.cardContainerSkillsMatch}>
			<CardHeader
				component="h2"
				title="Skills and Keywords Matched"
				titleTypographyProps={{
					className: styles.cardHeaderTitleSkills,
				}}
			/>
			<CardContent>
				<List className={styles.listContainerSkills}>
					{skills.map((skill, index) => (
						<ListItem key={index} className={styles.listItem}>
							<ListItemText primary={skill} />
						</ListItem>
					))}
				</List>
			</CardContent>
		</Card>
	);
}
