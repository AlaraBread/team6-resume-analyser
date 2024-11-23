import { Card, CardContent, Typography, Rating } from "@mui/material";
import "./dashboard.css";
type FitScoreChartProps = {
	score: number;
};

export default function FitScoreChart({ score }: FitScoreChartProps) {
	const ratingVal = (score / 100) * 5;
	return (
		<Card className="card-container-fit">
			<CardContent>
				<Typography variant="h5" className="fit-score-chart-title">
					Resume Fit Score
				</Typography>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						margin: "1rem 0",
					}}
				>
					<Rating
						value={ratingVal}
						readOnly
						precision={0.5}
						size="large"
					/>
					<Typography
						style={{ marginLeft: "0.5rem", fontWeight: "bold" }}
					>
						{ratingVal.toFixed(2)} / 5
					</Typography>
				</div>
			</CardContent>
		</Card>
	);
}
