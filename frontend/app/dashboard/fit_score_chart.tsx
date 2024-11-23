import {
	Card,
	CardContent,
	CardHeader,
	Rating,
	Typography,
} from "@mui/material";
import "./dashboard.css";

type FitScoreChartProps = {
	score: number;
};

export default function FitScoreChart({ score }: FitScoreChartProps) {
	// Calulates to get star rating / 5 stars
	const ratingVal = (score / 100) * 5;
	// Rounds score to 2 decimal places
	const roundedScore = ratingVal.toFixed(2);

	return (
		<Card className="card-container-fit">
			<CardHeader
				component="h1"
				title="Resume Fit Score"
				className="fit-score-chart-title"
				titleTypographyProps={{ style: { fontWeight: "bolder" } }}
			/>
			<CardContent>
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
						variant="h6"
						style={{ marginLeft: "0.5rem", fontWeight: "bold" }}
					>
						{roundedScore} / 5
					</Typography>
				</div>
			</CardContent>
		</Card>
	);
}
