"use client";

import { useProtectRoute } from "util/fetching";
import FrontendForm from "./frontend_form";
import { isLoggedIn } from "util/fetching";
import { useEffect } from "react";

export default function FormPage() {
	useProtectRoute();
	return (
		<>
			<FrontendForm />
		</>
	);
}
/**
 * Used to see the visual of the /form
 * Will be merged in dashboard page, but
 * this page will be deleted in Sprint 2
 */
