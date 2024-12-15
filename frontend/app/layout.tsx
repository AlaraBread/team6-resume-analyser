import "./global.css";
import { Theme } from "./theme";
import { Fetching } from "util/fetching";
import { RecoilContextProvider } from "./recoil";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<RecoilContextProvider>
				<Fetching />
				<Theme>
					<body>{children}</body>
				</Theme>
			</RecoilContextProvider>
		</html>
	);
}
