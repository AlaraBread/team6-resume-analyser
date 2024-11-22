import "./dashboard.css";
interface ImprovementSuggestionsProps {
	suggestions: string[];
}

export default function ImprovementSuggestions({
	suggestions,
}: ImprovementSuggestionsProps) {
	return (
		<div>
			<h2 className="suggestions-title">Improvement Suggestions</h2>
			<ul className="suggestions-list">
				{suggestions.map((suggestion, index) => (
					<li key={index} className="suggestions-item">
						{suggestion}
					</li>
				))}
			</ul>
		</div>
	);
}
