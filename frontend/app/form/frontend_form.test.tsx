import { render, screen } from "@testing-library/react";
import FrontendForm from "./frontend_form";
import ResumeForm from "./resume_form";
import JobDescriptionForm from "./job_description_form";

const useRouterMock = jest.fn(() => {
	return {
		push: (_route: string) => {},
	};
});

jest.mock("next/navigation", () => {
	const originalModule: object = jest.requireActual("next/navigation");
	return {
		__esModule: true,
		...originalModule,
		useRouter: () => useRouterMock(),
	};
});

jest.mock("./resume_form");
jest.mock("./job_description_form");

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
