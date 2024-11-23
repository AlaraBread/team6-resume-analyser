import useSWR, { SWRResponse } from "swr";

export const jsonFetcher: (
	...args: Parameters<typeof fetch>
) => Promise<object> = (...args) => fetch(...args).then((res) => res.json());

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
			description: string;
		};
		response: {
			message: string;
		};
	};
	"api/resume-upload": {
		request: {
			file: File;
		};
		response: {
			message: string;
		};
	};
};

export async function backendPost<T extends keyof postRequests>(
	endpoint: T,
	data: postRequests[T]["request"],
): Promise<postRequests[T]["response"]> {
	return fetch(getEndpointPath(endpoint), {
		method: "POST",
		body: JSON.stringify(data),
	}).then((response) => response.json()) as Promise<
		postRequests[T]["response"]
	>;
}
