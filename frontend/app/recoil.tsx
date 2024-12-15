"use client";

import RecoilNexus from "recoil-nexus";
import { ReactElement } from "react";
import { RecoilRoot } from "recoil";

export function RecoilContextProvider({
	children,
}: {
	children: ReactElement[];
}) {
	return <RecoilRoot>{children}</RecoilRoot>;
}
