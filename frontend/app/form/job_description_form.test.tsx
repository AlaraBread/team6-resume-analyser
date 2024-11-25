import { render, screen, fireEvent } from "@testing-library/react";
import JobDescriptionForm from "./job_description_form";
import { backendPost } from "util/fetching";

jest.mock("../../util/fetching", () => ({
	backendPost: jest.fn(),
}));

it("Displays the job description form with input and button", () => {
	render(<JobDescriptionForm />);
	expect(screen.getByLabelText(/job description/i)).toBeInTheDocument();
	expect(screen.getByText(/character count: 0\/5000/i)).toBeInTheDocument();
	expect(
		screen.getByRole("button", { name: /submit job description/i }),
	).toBeInTheDocument();
});

it("Updates real-time character count as the user types", () => {
	render(<JobDescriptionForm />);
	const input = screen.getByLabelText(/job description/i);

	fireEvent.change(input, { target: { value: "Typing" } });
	expect(screen.getByText(/character count: 6\/5000/i)).toBeInTheDocument();
});

it("Displays an error if the job description is empty", () => {
	render(<JobDescriptionForm />);
	fireEvent.click(
		screen.getByRole("button", { name: /submit job description/i }),
	);
	expect(
		screen.getByText(/job description cannot be empty/i),
	).toBeInTheDocument();
});

it("Displays an error if the job description exceeds 5000 characters", () => {
	render(<JobDescriptionForm />);
	const input = screen.getByLabelText(/job description/i);
	const submitButton = screen.getByRole("button", {
		name: /submit job description/i,
	});

	const longDescription = "a".repeat(5001);
	fireEvent.change(input, { target: { value: longDescription } });
	fireEvent.click(submitButton);

	expect(
		screen.getByText(/job description must be under 5000 characters/i),
	).toBeInTheDocument();
});

it("Displays a success message if the job description is valid", async () => {
	(backendPost as jest.Mock).mockResolvedValueOnce({
		message: "Job description submitted successfully",
	});

	render(<JobDescriptionForm />);
	const textarea = screen.getByPlaceholderText(/enter job description/i);
	const submitButton = screen.getByRole("button", {
		name: /submit job description/i,
	});

	fireEvent.change(textarea, {
		target: { value: "Valid job description" },
	});
	fireEvent.click(submitButton);

	const successMessage = await screen.findByText(
		/job description submitted successfully/i,
	);
	expect(successMessage).toBeInTheDocument();
});
