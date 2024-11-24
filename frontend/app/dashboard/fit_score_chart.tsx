import { Card, CardContent, Rating, Typography } from "@mui/material";
import styles from "./dashboard.module.css";
type FitScoreChartProps = {
	score: number;
};

export default function FitScoreChart({ score }: FitScoreChartProps) {
	// Calculates to get star rating / 5 stars
	const ratingVal = (score / 100) * 5;
	// Rounds score to 2 decimal places
	const roundedScore = ratingVal.toFixed(2);

	return (
		<Card className={styles.cardContainerFit}>
			<CardContent>
				<div className={styles.fitScoreContent}>
					<Typography variant="h5" className={styles.fitScoreTitle}>
						Resume Fit Score
					</Typography>
					<div className={styles.ratingContainer}>
						<Rating
							value={ratingVal}
							readOnly
							precision={0.5}
							size="large"
						/>
						<Typography variant="h6" className={styles.ratingScore}>
							{roundedScore} / 5
						</Typography>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
