import { act, fireEvent, render, screen } from "@testing-library/react";
import Page from "./page";
import { backendPost } from "util/fetching";

const backendPostMock = jest.fn(); // dont provide a default implementation

// https://jestjs.io/docs/mock-functions
jest.mock("../../util/fetching", () => {
	const originalModule: object = jest.requireActual("../../util/fetching");
	return {
		__esModule: true,
		...originalModule,
		backendPost: ((...args) =>
			backendPostMock(...args)) as typeof backendPost,
	};
});

it("has an h2 that says sign up", () => {
	render(<Page />);
	expect(
		screen.getByRole("heading", {
			level: 2,
			name: "Sign Up",
		}),
	).toBeTruthy();
});
it("has an h2 that says sign in", () => {
	render(<Page />);
	expect(
		screen.getByRole("heading", {
			level: 2,
			name: "Sign In",
		}),
	).toBeTruthy();
});

it("displays the correct information from the backend post", async () => {
	backendPostMock.mockResolvedValueOnce({ message: "this is a message" });
	render(<Page />);
	await act(async () => {
		fireEvent.click(screen.getByRole("button", { name: "sign up" }));
	});
	expect(screen.getByTestId("backend-sign-up-post").textContent).toEqual(
		"this is a message",
	);
	backendPostMock.mockResolvedValueOnce({ message: "this is a message" });
	await act(async () => {
		fireEvent.click(screen.getByRole("button", { name: "sign in" }));
	});
	expect(screen.getByTestId("backend-sign-up-post").textContent).toEqual(
		"this is a message",
	);
});
