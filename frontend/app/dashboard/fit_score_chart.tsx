import "./dashboard.css";
type FitScoreChartProps = {
	score: number;
};

export default function FitScoreChart({ score }: FitScoreChartProps) {
	const getBackgroundColor = (score: number): string => {
		if (score > 75) {
			return "#4caf50";
		} else if (score > 25) {
			return "#ffff00";
		} else {
			return "#f44336";
		}
	};

	return (
		<div className="fit-score-chart">
			<h2 className="fit-score-chart-title">Resume Fit Score</h2>
			<div className="fit-score-bar-container">
				<div className="fit-score-bar-background">
					<div
						className="fit-score-bar"
						style={{
							width: `${score}%`,
							backgroundColor: getBackgroundColor(score),
						}}
					></div>
				</div>
				<span className="fit-score-label">{score}%</span>
			</div>
		</div>
	);
}
