"use client";

import { Button, Card, CardContent, CardHeader } from "@mui/material";
import { useState } from "react";
import styles from "./counter.module.css";

export default function Counter() {
	const [count, setCount] = useState(0);
	return (
		<Card>
			<CardHeader
				component="h2"
				title={"count: " + count}
				data-testid="counter-header"
			/>
			<CardContent className={styles.buttons}>
				<Button
					type="button"
					variant="contained"
					onClick={() => setCount(count + 1)}
				>
					more
				</Button>
				<Button
					type="button"
					variant="outlined"
					onClick={() => setCount(count - 1)}
				>
					less
				</Button>
			</CardContent>
		</Card>
	);
}
