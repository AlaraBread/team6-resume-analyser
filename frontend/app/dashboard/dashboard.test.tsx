import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "./page";
import { MockData } from "./page";
import FitScoreChart from "./fit_score_chart";
import { useBackendGet, useProtectRoute } from "util/fetching";
import * as SWR from "swr";

jest.mock("../../util/fetching", () => ({
	useBackendGet: jest.fn(),
	isLoggedIn: jest.fn(),
	useProtectRoute: jest.fn(),
}));

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

describe("Dashboard Component", () => {
	// Mock data for testing
	const mockData: MockData = {
		isError: false,
		message: "get fit score successful",
		fitScore: 85,
		matchedSkills: [
			"JavaScript",
			"React",
			"Node.js",
			"Next.js",
			"Team Collaboration",
			"C",
			"C#",
		],
		improvementSuggestions: [
			{ category: "skills", text: "Add personal characteristics." },
			{
				category: "experience",
				text: "Include measurable achievements.",
			},
			{ category: "skills", text: "Add personal project(s)." },
		],
	};
	const mockError: MockData = {
		isError: true,
		message: "failed to get fit score",
		//TODO: do we want to assign these garbage values, make them optional, or get rid of isError?
		fitScore: 0,
		matchedSkills: [],
		improvementSuggestions: [],
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useBackendGet as jest.Mock).mockReturnValue({
			data: mockData,
			error: null,
			isLoading: false,
		});
	});

	it("should render the dashboard title", () => {
		// Does "Resume Analysis Dashboard" appear?
		render(<Dashboard />);
		const titleElement = screen.getByText(/Resume Analysis Dashboard/i);
		expect(titleElement).toBeInTheDocument();
	});

	it("should render the FitScoreChart with the correct score", () => {
		// Does the fit score appear appopriately?
		render(<Dashboard />);

		const scoreElement = screen.getByText(/Resume Fit Score/i);
		expect(scoreElement).toBeInTheDocument();

		const roundedScoreText = "4.25 / 5";
		const ratingElement = screen.getByText(roundedScoreText);
		expect(ratingElement).toBeInTheDocument();
	});

	it("should render the SkillsMatched component with all skills", () => {
		// Does the skills appear correctly?
		//useBackendGetMock.mockResolvedValueOnce({ mockData });
		render(<Dashboard />);
		mockData.matchedSkills?.forEach((skill) => {
			expect(screen.getByText(skill)).toBeInTheDocument();
		});
	});

	it("should render the ImprovementSuggestions component with all suggestions", () => {
		// Does the suggestions appear correctly?
		//useBackendGetMock.mockResolvedValueOnce({ mockData });
		render(<Dashboard />);
		mockData.improvementSuggestions.forEach((suggestion) => {
			expect(screen.getByText(suggestion.text)).toBeInTheDocument();
		});
	});

	it("should adapt correctly to changes in fit score", () => {
		// Render a new dashboard (with a different fit score)
		const newScore = 50;
		const NewDashboard = () => (
			<div className="dashboard-container">
				<h1 className="dashboard-title">Resume Analysis Dashboard</h1>
				<FitScoreChart score={newScore} />
			</div>
		);
		render(<NewDashboard />);
		const roundedScoreText = "2.50 / 5";
		const newRatingElement = screen.getByText(roundedScoreText);
		expect(newRatingElement).toBeInTheDocument();
	});

	it("should update and render new skills and suggestions (remove old)", () => {
		// Updated data: skills and sugggestions
		const updatedSkills = [
			"Python",
			"Machine Learning",
			"Data Science",
			"PL/SQL",
		];
		const updatedSuggestions = [
			{ category: "experience", text: "Learn deep learning techniques." },
			{ category: "skills", text: "Contribute to open-source projects." },
			{
				category: "experience",
				text: "Improve algorithm design skills.",
			},
		];

		// New mock Dashboard component for testing
		const NewDashboard = () => (
			<div className="dashboard-container">
				<h1 className="dashboard-title">Resume Analysis Dashboard</h1>
				<br></br>
				<div>
					{/* Render updated skills */}
					{updatedSkills.map((skill) => (
						<p key={skill}>{skill}</p>
					))}
				</div>
				<div>
					{/* Render updated suggestions */}
					{updatedSuggestions.map((suggestion) => (
						<p key={suggestion.text}>{suggestion.text}</p>
					))}
				</div>
			</div>
		);

		// Render with updated data
		render(<NewDashboard />);

		// Check if updated skills are rendered
		updatedSkills.forEach((skill) => {
			expect(screen.getByText(skill)).toBeInTheDocument();
		});

		// Check if old skills are not rendered
		mockData.matchedSkills?.forEach((skill) => {
			expect(screen.queryByText(skill)).toBeNull();
		});

		// Check if updated suggestions are rendered
		updatedSuggestions.forEach((suggestion) => {
			expect(screen.getByText(suggestion.text)).toBeInTheDocument();
		});

		// Check if old suggestions are not rendered
		mockData.improvementSuggestions.forEach((suggestion) => {
			expect(screen.queryByText(suggestion.text)).toBeNull();
		});
	});

	it("should only display 'skills' feedback when checkbox is selected", () => {
		render(<Dashboard />);

		const skillsCheckbox = screen.getByLabelText(/skills/i);
		const experienceCheckbox = screen.getByLabelText(/experience/i);

		expect(skillsCheckbox).toBeInTheDocument();
		expect(experienceCheckbox).toBeInTheDocument();

		// Uncheck "experience" checkbox
		fireEvent.click(experienceCheckbox);

		// Checks if "skills" feedback are only displayed
		const skillsFeedback = mockData.improvementSuggestions.filter(
			(suggestion) => suggestion.category === "skills",
		);

		skillsFeedback.forEach((suggestion) => {
			expect(screen.getByText(suggestion.text)).toBeInTheDocument();
		});

		// Checks if "experience" feedback are not displayed
		const experienceFeedback = mockData.improvementSuggestions.filter(
			(suggestion) => suggestion.category === "experience",
		);

		experienceFeedback.forEach((suggestion) => {
			expect(screen.queryByText(suggestion.text)).toBeNull();
		});
	});

	it("should only display 'experience' feedback when checkbox is selected", () => {
		render(<Dashboard />);

		const skillsCheckbox = screen.getByLabelText(/skills/i);
		const experienceCheckbox = screen.getByLabelText(/experience/i);
		expect(skillsCheckbox).toBeInTheDocument();
		expect(experienceCheckbox).toBeInTheDocument();

		// Uncheck "skills" checkbox
		fireEvent.click(skillsCheckbox);

		// Checks if "experience" feedback are only displayed
		const experienceFeedback = mockData.improvementSuggestions.filter(
			(suggestion) => suggestion.category === "experience",
		);

		experienceFeedback.forEach((suggestion) => {
			expect(screen.getByText(suggestion.text)).toBeInTheDocument();
		});

		// Checks if "skills" feedback are not displayed
		const skillsFeedback = mockData.improvementSuggestions.filter(
			(suggestion) => suggestion.category === "skills",
		);

		skillsFeedback.forEach((suggestion) => {
			expect(screen.queryByText(suggestion.text)).toBeNull();
		});
	});
	it("should display an error with the corrosponding message if the isError is true", () => {
		(useBackendGet as jest.Mock).mockReturnValue({
			data: mockError,
			error: null,
			isLoading: false,
		});
		render(<Dashboard />);
		const errorElement = screen.getByText(/Error retrieving results/i);
		expect(errorElement).toBeInTheDocument();
		const messageElement = screen.getByText(RegExp(mockError.message));
		expect(messageElement).toBeInTheDocument();
	});
	it("should display an error if the response is null", () => {
		(useBackendGet as jest.Mock).mockReturnValue({
			data: null,
			error: null,
			isLoading: false,
		});
		render(<Dashboard />);
		const titleElement = screen.getByText(/Error retrieving results/i);
		expect(titleElement).toBeInTheDocument();
	});

	it("rating element should render with the correct fit score", () => {
		const { rerender } = render(<Dashboard />);
		(useBackendGet as jest.Mock).mockReturnValue({
			data: {
				isError: false,
				message: "get fit score successful",
				fitScore: 0,
				matchedSkills: [],
				improvementSuggestions: [],
			},
			error: null,
			isLoading: false,
		});
		rerender(<Dashboard />);
		var ratingElement = screen.getByRole("img");
		expect(ratingElement).toHaveAttribute("aria-label", "0 Stars");
		(useBackendGet as jest.Mock).mockReturnValue({
			data: {
				isError: false,
				message: "get fit score successful",
				fitScore: 50,
				matchedSkills: [],
				improvementSuggestions: [],
			},
			error: null,
			isLoading: false,
		});
		rerender(<Dashboard />);
		ratingElement = screen.getByRole("img");
		expect(ratingElement).toHaveAttribute("aria-label", "2.5 Stars");
		(useBackendGet as jest.Mock).mockReturnValue({
			data: {
				isError: false,
				message: "get fit score successful",
				fitScore: 100,
				matchedSkills: [],
				improvementSuggestions: [],
			},
			error: null,
			isLoading: false,
		});
		rerender(<Dashboard />);
		ratingElement = screen.getByRole("img");
		expect(ratingElement).toHaveAttribute("aria-label", "5 Stars");
	});
	it("empty imporovementSuggestions list should render an empty feedback box", () => {
		(useBackendGet as jest.Mock).mockReturnValue({
			data: {
				isError: false,
				message: "get fit score successful",
				fitScore: 100,
				matchedSkills: [],
				improvementSuggestions: [],
			},
			error: null,
			isLoading: false,
		});
		render(<Dashboard />);
		const emptyStateMessage = screen.queryByText(
			/No suggestions available/i,
		);
		expect(emptyStateMessage).toBeInTheDocument();
	});
});
