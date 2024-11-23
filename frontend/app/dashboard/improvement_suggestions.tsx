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
				<List sx={{ listStyleType: "none", padding: 0 }}>
					{suggestions.map((suggestion, index) => (
						<ListItem key={index}>
							<ListItemText primary={suggestion} />
						</ListItem>
					))}
				</List>
			</CardContent>
		</Card>
	);
}
