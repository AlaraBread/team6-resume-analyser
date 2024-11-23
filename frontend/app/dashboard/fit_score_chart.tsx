import { Card, CardContent, Rating, Typography } from "@mui/material";
import "./dashboard.css";

type FitScoreChartProps = {
	score: number;
};

export default function FitScoreChart({ score }: FitScoreChartProps) {
	// Calculates to get star rating / 5 stars
	const ratingVal = (score / 100) * 5;
	// Rounds score to 2 decimal places
	const roundedScore = ratingVal.toFixed(2);

	return (
		<Card className="card-container-fit">
			<CardContent>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Typography
						variant="h5"
						style={{
							fontWeight: "bold",
							marginRight: "1rem",
						}}
					>
						Resume Fit Score
					</Typography>
					<div
						style={{
							alignItems: "center",
						}}
					>
						<Rating
							value={ratingVal}
							readOnly
							precision={0.5}
							size="large"
						/>
						<Typography
							variant="h6"
							style={{ marginLeft: "0.5rem", fontWeight: "bold" }}
						>
							{roundedScore} / 5
						</Typography>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
