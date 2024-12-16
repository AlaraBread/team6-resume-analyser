"use client";

import { useLocalStorageState } from "ahooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR, { SWRResponse } from "swr";

export const jsonFetcher: (
	...args: Parameters<typeof fetch>
) => Promise<object> = (url) =>
	fetch(url, {
		headers: { token: getToken() },
	}).then((res) => res.json());

function getEndpointPath(endpoint: string) {
	let server = process.env.NEXT_PUBLIC_BACKEND ?? "";
	// ensure trailing slash in server
	if (!server.endsWith("/")) {
		server = server + "/";
	}
	// remove trailing slash from endpoint
	if (endpoint.endsWith("/")) {
		endpoint = endpoint.slice(0, endpoint.length - 1);
	}
	// remove leading slash from endpoint
	if (endpoint.startsWith("/")) {
		endpoint = endpoint.slice(1, endpoint.length);
	}
	return server + endpoint;
}

export type getRequests = {
	"api/hello": {
		response: {
			message: string;
		};
	};
	"api/fit-score": {
		response: {
			isError: boolean;
			message: string;
			fitScore: number;
			matchedSkills: string[];
			improvementSuggestions: {
				category: string;
				text: string;
			}[];
		};
	};
};

export function useBackendGet<T extends keyof getRequests>(
	endpoint: T,
): SWRResponse<getRequests[T]["response"], Error> {
	return useSWR(getEndpointPath(endpoint), jsonFetcher) as SWRResponse<
		getRequests[T]["response"],
		Error
	>;
}

export type postRequests = {
	"api/greeting": {
		request: {
			name: string;
		};
		response: {
			message: string;
		};
	};
	"api/job-description": {
		request: {
			jobDescription: string;
		};
		response: {
			message: string;
			isError: boolean;
		};
	};
	"api/resume-upload": {
		request: FormData;
		response: {
			message: string;
			isError: boolean;
		};
	};
	"api/register": {
		request: {
			email: string;
			username: string;
			password: string;
		};
		response: {
			isError: boolean;
			message: string;
		};
	};
	"api/login": {
		request: {
			email: string;
			password: string;
		};
		response: {
			isError: boolean;
			message: string;
			token?: string;
		};
	};
	"api/analyze": {
		request: {};
		response: {
			isError: false;
			message: "Analysis successful.";
			data: {
				resumeAnalysis: string[];
				jobDescriptionAnalysis: {
					mustHave: string[];
					niceToHave: string[];
				};
				feedback: {
					feedback: string;
					category: string;
				}[];
			};
		};
	};
	"api/fit-score": {
		request: {
			resumeKeywords: string[];
			jobDescriptionKeywords: {
				niceToHave: string[];
				mustHave: string[];
			};
		};
		response: {
			isError: boolean;
			message: string;
			fitScore: number;
			feedback: {
				feedback: string;
				category: string;
			}[];
			matchedSkills: string[];
		};
	};
};

type formPostRequests = {
	[K in keyof postRequests]-?: postRequests[K]["request"] extends FormData
		? K
		: never;
}[keyof postRequests];

type jsonPostRequests = {
	[K in keyof postRequests]-?: postRequests[K]["request"] extends FormData
		? never
		: K;
}[keyof postRequests];

export async function backendPost<T extends jsonPostRequests>(
	endpoint: T,
	data: postRequests[T]["request"],
): Promise<postRequests[T]["response"]> {
	return fetch(getEndpointPath(endpoint), {
		method: "POST",
		headers: {
			token: getToken(),
		},
		body: JSON.stringify(data),
	})
		.then((response) => {
			if (response.status == 401) {
				setToken(undefined);
				return Promise.reject("not authenticated");
			}
			return response;
		})
		.then((response) => response.json())
		.then((response) => {
			if (endpoint == "api/login") {
				setToken(response.token);
			}
			return response;
		}) as Promise<postRequests[T]["response"]>;
}

export async function backendFormPost<T extends formPostRequests>(
	endpoint: T,
	data: postRequests[T]["request"],
): Promise<postRequests[T]["response"]> {
	return fetch(getEndpointPath(endpoint), {
		method: "POST",
		headers: {
			token: getToken(),
		},
		body: data,
	}).then((response) => response.json()) as Promise<
		postRequests[T]["response"]
	>;
}

export function getToken(): string {
	if (!Object.hasOwn(globalThis, "localStorage")) return "";
	return JSON.parse(localStorage?.getItem("token") ?? '""');
}

function setToken(token: string | undefined) {
	if (!Object.hasOwn(globalThis, "localStorage")) return;
	localStorage?.setItem("token", JSON.stringify(token ?? ""));
}

export function useProtectRoute() {
	const router = useRouter();
	const [t] = useLocalStorageState<string>('"token"');
	const token = t ?? getToken();

	useEffect(() => {
		if (!token) {
			router.push("/");
		}
	}, [token]);
}
