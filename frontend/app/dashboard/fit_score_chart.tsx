type FitScoreChartProps = {
	score: number;
};

export default function FitScoreChart({ score }: FitScoreChartProps) {
	// Determine background color (dependent on fit score)
	const getBackgroundColor = (score: number): string => {
		if (score > 75) {
			// Returns green color
			return "#4caf50";
		} else if (score > 25) {
			// Returns yellow color
			return "#ffff00";
		} else {
			// Otherwise red
			return "#f44336";
		}
	};

	return (
		<div style={{ marginBottom: "2rem", textAlign: "center" }}>
			<h2>Resume Fit Score</h2>
			<div
				style={{
					position: "relative",
					width: "100%",
					maxWidth: "300px",
					margin: "0 auto",
				}}
			>
				<div
					style={{
						width: "100%",
						height: "30px",
						backgroundColor: "#f0f0f0",
						borderRadius: "5px",
						overflow: "hidden",
					}}
				>
					<div
						style={{
							width: `${score}%`,
							height: "100%",
							backgroundColor: getBackgroundColor(score),
						}}
					></div>
				</div>
				<span
					style={{
						position: "absolute",
						top: "5px",
						left: "50%",
						transform: "translateX(-50%)",
					}}
				>
					{score}%
				</span>
			</div>
		</div>
	);
}
