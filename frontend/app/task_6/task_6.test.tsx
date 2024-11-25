/*import { act, fireEvent, render, screen } from "@testing-library/react";
import { SignUp } from "./sign_up";

it("should ", () => {
	act(() => {
		render(<SignUp />);
		fireEvent.click(screen.getByRole("button", { name: "sign up" }));
	});
	let response;
	act(() => {
		response = screen.getByTestId("backend-sign-up-post");
	});
	expect(response).toHaveTextContent(
		"SyntaxError: Unexpected end of JSON input",
	);
});
*/
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

it("has an h1 that says sign up", () => {
	render(<Page />);
	expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
		"sign up",
	);
});
it("has an h1 that says sign in", () => {
	render(<Page />);
	expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
		"sign in",
	);
});
/*
it("should match snapshot", () => {
	const { container } = render(<Page />);
	expect(container).toMatchSnapshot();
});
*/
it("displays the correct information from the backend post", async () => {
	backendPostMock.mockResolvedValueOnce({ message: "this is a message" });
	render(<Page />);
	await act(async () => {
		fireEvent.click(screen.getByRole("button", { name: "sign up" }));
	});
	expect(screen.getByTestId("backend-sign-up-post").textContent).toEqual(
		"this is a message",
	);
	await act(async () => {
		fireEvent.click(screen.getByRole("button", { name: "sign in" }));
	});
	expect(screen.getByTestId("backend-sign-up-post").textContent).toEqual(
		"this is a message",
	);
	/*
	await act(async () => {
		fireEvent.click(screen.getByRole("button", { name: "sign up" }));
	});
	expect(screen.getByTestId("backend-sign-up-post").textContent).toEqual(
		"this is a message",
	);
	*/
});
