import { render, fireEvent, screen } from "@testing-library/react";
import ResumeForm from "./resumeForm";

it("Displays the form with input field and button", () => {
	render(<ResumeForm />);
	expect(screen.getByLabelText("Upload your resume")).toBeInTheDocument();
	expect(
		screen.getByRole("button", { name: /upload resume/i }),
	).toBeInTheDocument();
});

it("Displays error when no file is selected", async () => {
	render(<ResumeForm />);
	fireEvent.click(screen.getByRole("button", { name: /upload resume/i }));
	expect(
		await screen.findByText(/please select a file/i),
	).toBeInTheDocument();
});

it("Displays error if file type is invalid", async () => {
	render(<ResumeForm />);
	const input = screen.getByLabelText("Upload your resume");
	const file = new File(["content"], "document.txt", {
		type: "text/plain",
	});
	fireEvent.change(input, { target: { files: [file] } });
	fireEvent.click(screen.getByRole("button", { name: /upload resume/i }));
	expect(
		await screen.findByText(/pdf files are only allowed/i),
	).toBeInTheDocument();
});

it("Displays error if file is over 2MB", async () => {
	render(<ResumeForm />);
	const input = screen.getByLabelText("Upload your resume");
	const file = new File(["A".repeat(3 * 1024 * 1024)], "large.pdf", {
		type: "application/pdf",
	});
	fireEvent.change(input, { target: { files: [file] } });
	fireEvent.click(screen.getByRole("button", { name: /upload resume/i }));
	expect(
		await screen.findByText(/file size must be under 2mb/i),
	).toBeInTheDocument();
});

it("Displays a successful response when PDF file is uploaded", async () => {
	render(<ResumeForm />);
	const input = screen.getByLabelText("Upload your resume");
	const file = new File(["content"], "resume.pdf", {
		type: "application/pdf",
	});
	fireEvent.change(input, { target: { files: [file] } });
	fireEvent.click(screen.getByRole("button", { name: /upload resume/i }));
	expect(
		await screen.findByText(/resume uploaded successfully/i),
	).toBeInTheDocument();
});
