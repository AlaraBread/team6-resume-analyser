import { act, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
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
it("has an h2 that says login", () => {
	render(<Page />);
	expect(
		screen.getByRole("heading", {
			level: 2,
			name: "Login",
		}),
	).toBeTruthy();
});

it("displays the correct message when a field is blank", async () => {
	const user = userEvent.setup();
	render(<Page />);
	const emailField = screen.getByPlaceholderText("email");
	await user.type(emailField, "foo@gmail.com");

	await await act(async () => {
		fireEvent.click(screen.getByRole("button", { name: "login" }));
	});
	expect(screen.getByTestId("blank-message").textContent).toEqual(
		"Please make sure you didn't leave any of the fields blank.",
	);
});
it("displays the correct information from the backend post", async () => {
	backendPostMock.mockResolvedValueOnce({ message: "this is a message" });
	const user = userEvent.setup();
	render(<Page />);
	const emailField = screen.getByPlaceholderText("email");
	const passField = screen.getByPlaceholderText("password");

	await user.type(emailField, "foo@gmail.com");
	await user.type(passField, "a");

	await act(async () => {
		fireEvent.click(screen.getByRole("button", { name: "login" }));
	});
	expect(screen.getByTestId("backend-login-post").textContent).toEqual(
		"this is a message",
	);
});
