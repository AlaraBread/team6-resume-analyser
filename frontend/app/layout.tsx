import "./global.css";
import { Theme } from "./theme";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<Theme>
				<body>{children}</body>
			</Theme>
		</html>
	);
}
