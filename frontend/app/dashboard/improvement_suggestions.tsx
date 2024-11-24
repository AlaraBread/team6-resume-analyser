import {
	Card,
	CardContent,
	CardHeader,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import styles from "./pages.module.css";
interface ImprovementSuggestionsProps {
	suggestions: string[];
}

export default function ImprovementSuggestions({
	suggestions,
}: ImprovementSuggestionsProps) {
	return (
		<Card className={styles.cardContainerImprovement}>
			<CardHeader
				component="h2"
				title="Improvement Suggestions"
				titleTypographyProps={{
					className: styles.cardHeaderTitleImprovement,
				}}
			/>

			<CardContent>
				<List className={styles.listContainerImprovement}>
					{suggestions.map((suggestion, index) => (
						<ListItem key={index} className={styles.listItem}>
							<ListItemText primary={suggestion} />
						</ListItem>
					))}
				</List>
			</CardContent>
		</Card>
	);
}
