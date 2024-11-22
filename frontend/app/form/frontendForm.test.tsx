import { render, screen } from "@testing-library/react";
import FrontendForm from "./frontendForm";
import ResumeForm from "./resumeForm";
import JobDescriptionForm from "./jobdescriptionForm";

jest.mock("./resumeForm");
jest.mock("./jobdescriptionForm");

beforeEach(() => {
	jest.clearAllMocks();
});

it("Displays the resume form", () => {
	(ResumeForm as jest.Mock).mockReturnValue(<div>Mock Resume</div>);
	render(<FrontendForm />);
	expect(screen.getByText(/mock resume/i)).toBeInTheDocument();
});

it("Displays the job description form", () => {
	(JobDescriptionForm as jest.Mock).mockReturnValue(
		<div>Mock Job Description</div>,
	);
	render(<FrontendForm />);
	expect(screen.getByText(/mock job description/i)).toBeInTheDocument();
});

it("Displays the header", () => {
	render(<FrontendForm />);
	expect(
		screen.getByRole("heading", {
			name: /resume and job description/i,
		}),
	).toBeInTheDocument();
});
