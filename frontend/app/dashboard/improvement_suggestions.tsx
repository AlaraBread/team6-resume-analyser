import {
	Card,
	CardContent,
	CardHeader,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import "./dashboard.css";

interface ImprovementSuggestionsProps {
	suggestions: string[];
}

export default function ImprovementSuggestions({
	suggestions,
}: ImprovementSuggestionsProps) {
	return (
		<Card className="card-container-improvement">
			<CardHeader
				component="h2"
				title="Improvement Suggestions"
				titleTypographyProps={{ style: { fontWeight: "bold" } }}
			/>
			<CardContent>
				<List className="improvements-list">
					{suggestions.map((suggestion, index) => (
						<ListItem
							key={index}
							disablePadding
							style={{ display: "list-item" }}
						>
							<ListItemText primary={suggestion} />
						</ListItem>
					))}
				</List>
			</CardContent>
		</Card>
	);
}
