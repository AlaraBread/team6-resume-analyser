import React, { useState } from "react";

import {
	Card,
	CardContent,
	CardHeader,
	List,
	ListItem,
	ListItemText,
	Checkbox,
	FormControlLabel,
	Box,
} from "@mui/material";
import styles from "./dashboard.module.css";
interface ImprovementSuggestionsProps {
	suggestions: { category: "skills" | "experience"; text: string }[];
}

export default function ImprovementSuggestions({
	suggestions,
}: ImprovementSuggestionsProps) {
	const [CategorySelected, CategorySet] = useState<string[]>([
		"skills",
		"experience",
	]);

	const handleCategoryChange = (category: string, checked: boolean) => {
		CategorySet((prev) =>
			checked
				? [...prev, category]
				: prev.filter((cat) => cat !== category),
		);
	};

	const suggestionsfiltered = suggestions.filter((item) =>
		CategorySelected.includes(item.category),
	);

	return (
		<Card className={styles.cardContainerImprovement}>
			<CardHeader
				component="h2"
				title="Improvement Suggestions"
				titleTypographyProps={{
					className: styles.cardHeaderTitleImprovement,
				}}
			/>

			<CardContent>
				<Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
					<FormControlLabel
						control={
							<Checkbox
								checked={
									CategorySelected.includes("skills") &&
									CategorySelected.includes("experience")
								}
								indeterminate={
									CategorySelected.includes("skills") !==
									CategorySelected.includes("experience")
								}
								onChange={(event) => {
									const checked = event.target.checked;
									if (checked) {
										CategorySet(["skills", "experience"]);
									} else {
										CategorySet([]);
									}
								}}
							/>
						}
						label="All"
					/>
					<Box
						sx={{ display: "flex", flexDirection: "column", ml: 3 }}
					>
						<FormControlLabel
							control={
								<Checkbox
									checked={CategorySelected.includes(
										"skills",
									)}
									onChange={(event) =>
										handleCategoryChange(
											"skills",
											event.target.checked,
										)
									}
								/>
							}
							label="Skills"
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={CategorySelected.includes(
										"experience",
									)}
									onChange={(event) =>
										handleCategoryChange(
											"experience",
											event.target.checked,
										)
									}
								/>
							}
							label="Experience"
						/>
					</Box>
				</Box>

				<List className={styles.listContainerImprovement}>
					{suggestionsfiltered.map((suggestion, index) => (
						<ListItem key={index} className={styles.listItem}>
							<ListItemText primary={suggestion.text} />
						</ListItem>
					))}
				</List>
			</CardContent>
		</Card>
	);
}
