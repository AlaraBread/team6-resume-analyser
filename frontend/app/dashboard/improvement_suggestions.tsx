import {
	Card,
	CardContent,
	Typography,
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
			<CardContent>
				<Typography variant="h6" style={{ fontWeight: "bold" }}>
					Improvement Suggestions
				</Typography>
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
