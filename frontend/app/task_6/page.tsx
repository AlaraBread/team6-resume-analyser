import { SignUp } from "./sign_up";
import { SignIn } from "./sign_in";
import styles from "../page.module.css";

export const metadata = {
	title: "sign up/in",
};

export default function Page() {
	return (
		<div className={styles.center}>
			<h1>sign up/in!</h1>
			<SignUp />
			<SignIn />
		</div>
	);
}
