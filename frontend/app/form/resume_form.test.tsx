import { render, fireEvent, screen } from "@testing-library/react";
import ResumeForm from "./resume_form";
import { backendFormPost } from "util/fetching";

jest.mock("../../util/fetching", () => ({
	backendFormPost: jest.fn(),
}));

it("Displays the form with input field and button", () => {
	render(<ResumeForm />);

	const upload = screen.getByRole("button", { name: /upload resume/i });
	expect(upload).toBeInTheDocument();

	const input = upload.querySelector("input[type='file']");
	expect(input).toBeInTheDocument();

	const submit = screen.getByRole("button", { name: /submit resume/i });
	expect(submit).toBeInTheDocument();
});

it("Displays error when no file is selected", async () => {
	render(<ResumeForm />);
	const submit = screen.getByRole("button", { name: /submit resume/i });
	fireEvent.click(submit);
	expect(
		await screen.findByText(/please select a file/i),
	).toBeInTheDocument();
});

it("Displays error if file type is invalid", async () => {
	render(<ResumeForm />);
	globalThis.FormData.prototype.get = jest.fn((name: string) => {
		switch (name) {
			case "file":
				return new File([new Blob()], "test.txt", {
					type: "application/txt",
				});
		}
		return null;
	});

	const submit = screen.getByRole("button", { name: /submit resume/i });
	fireEvent.click(submit);
	expect(
		await screen.findByText(/pdf files are only allowed/i),
	).toBeInTheDocument();
});

// TEST FAILED, OUTPUT IS "please select a file"
it("Displays error if file is over 2MB", async () => {
	render(<ResumeForm />);
	globalThis.FormData.prototype.get = jest.fn((name: string) => {
		switch (name) {
			case "file":
				return new File(["A".repeat(3 * 1024 * 1024)], "large.pdf", {
					type: "application/pdf",
				});
		}
		return null;
	});

	const submit = screen.getByRole("button", { name: /submit resume/i });
	fireEvent.click(submit);
	expect(
		await screen.findByText(/file size must be under 2mb/i),
	).toBeInTheDocument();
});

// TEST FAILED, OUTPUT IS "please select a file"
it("Displays a successful response when PDF file is uploaded", async () => {
	(backendFormPost as jest.Mock).mockResolvedValueOnce({
		message: "Resume uploaded successfully",
	});
	render(<ResumeForm />);
	globalThis.FormData.prototype.get = jest.fn((name: string) => {
		switch (name) {
			case "file":
				return new File(["content"], "resume.pdf", {
					type: "application/pdf",
				});
		}
		return null;
	});

	const submitButton = screen.getByRole("button", { name: /submit resume/i });
	fireEvent.click(submitButton);

	const successMessage = await screen.findByText(
		/resume uploaded successfully/i,
	);
	expect(successMessage).toBeInTheDocument();
});
