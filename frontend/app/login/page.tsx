import { Login } from "../login/login";
import styles from "../page.module.css";

export const metadata = {
	title: "register/login",
};

export default function Page() {
	return (
		<div className={styles.center}>
			<h1>Login</h1>
			<Login />
		</div>
	);
}
