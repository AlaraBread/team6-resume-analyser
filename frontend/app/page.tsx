import { BackendExample } from "./backend_example";
import Counter from "./counter";
import styles from "./page.module.css";

export const metadata = {
	title: "resume analyser",
};

export default function Page() {
	return (
		<div className={styles.center}>
			<h1>resume analyser!</h1>
			<Counter />
			<BackendExample />
		</div>
	);
}
