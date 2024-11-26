import { Register } from "./register";
import { Login } from "./login";
import styles from "../page.module.css";

export const metadata = {
	title: "register/login",
};

export default function Page() {
	return (
		<div className={styles.center}>
			<h1>sign up/in!</h1>
			<Register />
			<Login />
		</div>
	);
}
