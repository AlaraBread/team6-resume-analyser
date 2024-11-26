import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
	title: "resume analyser",
};

export default function Page() {
	return (
		<div className={styles.center}>
			<h1>resume analyser!</h1>
			<Link href={"login"}>Login</Link>
			<Link href={"register"}>Register</Link>
		</div>
	);
}
