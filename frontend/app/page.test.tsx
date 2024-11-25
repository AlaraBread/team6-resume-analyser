import { act, fireEvent, render, screen } from "@testing-library/react";
import Page from "./page";
import { backendPost, useBackendGet } from "util/fetching";

const useBackendGetMock = jest.fn(((_endpoint) => {
	// this is the default mock implementation
	return {
		data: { message: "Hello from the backend!" },
		error: undefined,
	};
}) as typeof useBackendGet);

const backendPostMock = jest.fn(); // dont provide a default implementation

// https://jestjs.io/docs/mock-functions
jest.mock("../util/fetching", () => {
	const originalModule: object = jest.requireActual("../util/fetching");
	return {
		__esModule: true,
		...originalModule,
		useBackendGet: ((...args) =>
			useBackendGetMock(...args)) as typeof useBackendGet,
		backendPost: ((...args) =>
			backendPostMock(...args)) as typeof backendPost,
	};
});

it("has an h1 that says resume analyser", () => {
	render(<Page />);
	expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
		"resume analyser!",
	);
});

it("should match snapshot", () => {
	const { container } = render(<Page />);
	expect(container).toMatchSnapshot();
});

it("displays the correct information from the backend get", () => {
	render(<Page />);
	expect(screen.getByTestId("backend-example-get").textContent).toEqual(
		'{"message":"Hello from the backend!"}',
	);
});

it("displays the correct information from the backend post", async () => {
	backendPostMock.mockResolvedValueOnce({ message: "this is a message" });
	render(<Page />);
	await act(async () => {
		fireEvent.click(
			screen.getByRole("button", { name: "send post request" }),
		);
	});
	expect(screen.getByTestId("backend-example-post").textContent).toEqual(
		"this is a message",
	);

	backendPostMock.mockResolvedValueOnce({
		message: "this is another message",
	});
	await act(async () => {
		fireEvent.click(
			screen.getByRole("button", { name: "send post request" }),
		);
	});
	expect(screen.getByTestId("backend-example-post").textContent).toEqual(
		"this is another message",
	);
});
