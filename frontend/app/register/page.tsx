import { Register } from "./register";
import styles from "../page.module.css";

export const metadata = {
	title: "register/login",
};

export default function Page() {
	return (
		<div className={styles.center}>
			<h1>Registration</h1>
			<Register />
		</div>
	);
}
