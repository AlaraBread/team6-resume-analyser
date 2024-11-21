interface ImprovementSuggestionsProps {
	suggestions: string[];
}

export default function ImprovementSuggestions({
	suggestions,
}: ImprovementSuggestionsProps) {
	return (
		<div>
			<h2>Improvement Suggestions</h2>
			<ul>
				{suggestions.map((suggestion, index) => (
					<li key={index} style={{ marginBottom: "0.5rem" }}>
						{suggestion}
					</li>
				))}
			</ul>
		</div>
	);
}
