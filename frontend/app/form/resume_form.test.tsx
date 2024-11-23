import { render, fireEvent, screen } from "@testing-library/react";
import ResumeForm from "./resume_form";
import { backendFormPost } from "util/fetching";
import fs from "fs";
import path from "path";

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

// TEST FAILED, OUTPUT IS "please select a file"
// CURRENTLY FIXING WITH REAL FILE
it("Displays error if file type is invalid", async () => {
	render(<ResumeForm />);
	const upload = screen.getByRole("button", { name: /upload resume/i });
	const input = upload.querySelector(
		"input[type='file']",
	) as HTMLInputElement;

	const file_path = path.join(__dirname, "test.txt");
	const file_content = fs.readFileSync(file_path); // Read file content
	const file = new File([file_content], "test.txt", { type: "text/plain" });
	Object.defineProperty(input, "files", {
		value: [file],
	});
	fireEvent.change(input);

	const submit = screen.getByRole("button", { name: /submit resume/i });
	fireEvent.click(submit);
	expect(
		await screen.findByText(/pdf files are only allowed/i),
	).toBeInTheDocument();
});

// TEST FAILED, OUTPUT IS "please select a file"
it("Displays error if file is over 2MB", async () => {
	render(<ResumeForm />);
	const upload = screen.getByRole("button", { name: /upload resume/i });
	const input = upload.querySelector("input[type='file']");
	const file = new File(["A".repeat(3 * 1024 * 1024)], "large.pdf", {
		type: "application/pdf",
	});

	fireEvent.change(input as HTMLInputElement, { target: { files: [file] } });
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
	const upload = screen.getByRole("button", { name: /upload resume/i });
	const input = upload.querySelector("input[type='file']");

	const file = new File(["content"], "resume.pdf", {
		type: "application/pdf",
	});
	fireEvent.change(input as Element, { target: { files: [file] } });

	const submitButton = screen.getByRole("button", { name: /submit resume/i });
	fireEvent.click(submitButton);

	const successMessage = await screen.findByText(
		/resume uploaded successfully/i,
	);
	expect(successMessage).toBeInTheDocument();
});
