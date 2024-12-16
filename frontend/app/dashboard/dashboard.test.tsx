import { render, screen, fireEvent, act } from "@testing-library/react";
import Dashboard from "./page";
import FitScoreChart from "./fit_score_chart";
import { useBackendGet, backendPost, postRequests } from "util/fetching";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const flushPromises = () => new Promise(setImmediate);

const backendPostMock = jest.fn();
jest.mock("../../util/fetching", () => ({
	useBackendGet: jest.fn(),
	isLoggedIn: jest.fn(),
	useProtectRoute: jest.fn(),
	backendPost: (...args: any[]) => backendPostMock(...args),
}));

/*
jest.mock("../../util/fetching", () => {
	const originalModule: object = jest.requireActual("../../util/fetching");
	return {
		__esModule: true,
		...originalModule,
		backendPost: ((...args) =>
			backendPostMock(...args)) as typeof backendPost,
	};
});*/

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

const mockFitData /*: postRequests["api/fit-score"]["response"]*/ = {
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
	feedback: [
		{ category: "skills", feedback: "Add personal characteristics." },
		{
			category: "experience",
			feedback: "Include measurable achievements.",
		},
		{ category: "skills", feedback: "Add personal project(s)." },
	],
	data: {
		resumeAnalysis: ["a", "b", "c", "d"],
		jobDescriptionAnalysis: {
			mustHave: ["b"],
			niceToHave: ["c"],
		},
		feedback: [
			{
				category: "skills",
				feedback: "Add personal characteristics.",
			},
			{
				category: "experience",
				feedback: "Include measurable achievements.",
			},
			{ category: "skills", feedback: "Add personal project(s)." },
		],
	},
};
const mockAnalyzeData: postRequests["api/analyze"]["response"] = {
	isError: false,
	message: "Analysis successful.",
	data: {
		resumeAnalysis: ["a", "b", "c", "d"],
		jobDescriptionAnalysis: {
			mustHave: ["b"],
			niceToHave: ["c"],
		},
		feedback: [
			{
				category: "skills",
				feedback: "Add personal characteristics.",
			},
			{
				category: "experience",
				feedback: "Include measurable achievements.",
			},
			{ category: "skills", feedback: "Add personal project(s)." },
		],
	},
};
const mockError = {
	isError: true,
	message: "failed to get fit score",
	//TODO: do we want to assign these garbage values, make them optional, or get rid of isError?
	fitScore: 0,
	matchedSkills: [],
	feedback: [],
};

describe("Dashboard Component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		/*
		backendPostMock.mockImplementation((endpoint, payload) => {
			if (endpoint === "api/fit-score") {
				return Promise.resolve({ response: mockFitData });
			} else if (endpoint === "api/analyze") {
				return Promise.resolve({ response: mockAnalyzeData });
			} else {
				return Promise.reject({
					error: "Invalid request",
				});
			}
		});
		*/
		/*
		(backendPost as jest.Mock).mockResolvedValue({
			data: mockFitData,
			error: null,
			isLoading: false,
		}); 
		(backendPost as jest.Mock).mockResolvedValueOnce({
			data: mockAnalyzeData,
			error: null,
			isLoading: false,
		});*/
	});

	it("should render the dashboard title", async () => {
		backendPostMock.mockResolvedValueOnce(mockAnalyzeData);
		backendPostMock.mockResolvedValueOnce(mockFitData);
		backendPostMock.mockResolvedValueOnce(mockAnalyzeData);
		backendPostMock.mockResolvedValueOnce(mockFitData);
		await act(async () => {
			// Does "Resume Analysis Dashboard" appear?
			render(<Dashboard />);
		});

		const titleElement = screen.getByText(/Resume Analysis Dashboard/i);
		expect(titleElement).toBeInTheDocument();
	});
	/*
	it("should render the FitScoreChart with the correct score", async () => {
		await act(async () => {
			// Does the fit score appear appopriately?
			render(<Dashboard />);
		});
		const scoreElement = screen.getByText(/Resume Fit Score/i);
		expect(scoreElement).toBeInTheDocument();

		const roundedScoreText = "4.25 / 5";
		const ratingElement = screen.getByText(roundedScoreText);
		expect(ratingElement).toBeInTheDocument();
	});

	it("should render the SkillsMatched component with all skills", async () => {
		await act(async () => {
			// Does the skills appear correctly?
			render(<Dashboard />);
		});
		mockFitData.matchedSkills?.forEach((skill) => {
			expect(screen.getByText(skill)).toBeInTheDocument();
		});
	});

	it("should render the feedback component with all suggestions", async () => {
		await act(async () => {
			// Does the suggestions appear correctly?
			render(<Dashboard />);
		});
		mockFitData.feedback.forEach((suggestion) => {
			expect(screen.getByText(suggestion.feedback)).toBeInTheDocument();
		});
	});

	it("should adapt correctly to changes in fit score", async () => {
		// Render a new dashboard (with a different fit score)
		const newScore = 50;
		const NewDashboard = () => (
			<div className="dashboard-container">
				<h1 className="dashboard-title">Resume Analysis Dashboard</h1>
				<FitScoreChart score={newScore} />
			</div>
		);
		await act(async () => {
			render(<NewDashboard />);
		});
		const roundedScoreText = "2.50 / 5";
		const newRatingElement = screen.getByText(roundedScoreText);
		expect(newRatingElement).toBeInTheDocument();
	});

	it("should update and render new skills and suggestions (remove old)", async () => {
		// Updated data: skills and sugggestions
		const updatedSkills = [
			"Python",
			"Machine Learning",
			"Data Science",
			"PL/SQL",
		];
		const updatedSuggestions = [
			{
				category: "experience",
				text: "Learn deep learning techniques.",
			},
			{
				category: "skills",
				text: "Contribute to open-source projects.",
			},
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
					{}//Render updated skills
					{updatedSkills.map((skill) => (
						<p key={skill}>{skill}</p>
					))}
				</div>
				<div>
					{}//Render updated skills
					{updatedSuggestions.map((suggestion) => (
						<p key={suggestion.text}>{suggestion.text}</p>
					))}
				</div>
			</div>
		);
		await act(async () => {
			// Render with updated data
			render(<NewDashboard />);
		});
		// Check if updated skills are rendered
		updatedSkills.forEach((skill) => {
			expect(screen.getByText(skill)).toBeInTheDocument();
		});

		// Check if old skills are not rendered
		mockFitData.matchedSkills?.forEach((skill) => {
			expect(screen.queryByText(skill)).toBeNull();
		});

		// Check if updated suggestions are rendered
		updatedSuggestions.forEach((suggestion) => {
			expect(screen.getByText(suggestion.text)).toBeInTheDocument();
		});

		// Check if old suggestions are not rendered
		mockFitData.feedback.forEach((suggestion) => {
			expect(screen.queryByText(suggestion.feedback)).toBeNull();
		});
	});

	it("should only display 'skills' feedback when checkbox is selected", async () => {
		await act(async () => {
			render(<Dashboard />);
		});
		const skillsCheckbox = screen.getByLabelText(/skills/i);
		const experienceCheckbox = screen.getByLabelText(/experience/i);

		expect(skillsCheckbox).toBeInTheDocument();
		expect(experienceCheckbox).toBeInTheDocument();

		// Uncheck "experience" checkbox
		fireEvent.click(experienceCheckbox);

		// Checks if "skills" feedback are only displayed
		const skillsFeedback = mockFitData.feedback.filter(
			(suggestion) => suggestion.category === "skills",
		);

		skillsFeedback.forEach((suggestion) => {
			expect(screen.getByText(suggestion.feedback)).toBeInTheDocument();
		});

		// Checks if "experience" feedback are not displayed
		const experienceFeedback = mockFitData.feedback.filter(
			(suggestion) => suggestion.category === "experience",
		);

		experienceFeedback.forEach((suggestion) => {
			expect(screen.queryByText(suggestion.feedback)).toBeNull();
		});
	});

	it("should only display 'experience' feedback when checkbox is selected", async () => {
		await act(async () => {
			render(<Dashboard />);
		});
		const skillsCheckbox = screen.getByLabelText(/skills/i);
		const experienceCheckbox = screen.getByLabelText(/experience/i);
		expect(skillsCheckbox).toBeInTheDocument();
		expect(experienceCheckbox).toBeInTheDocument();

		// Uncheck "skills" checkbox
		fireEvent.click(skillsCheckbox);

		// Checks if "experience" feedback are only displayed
		const experienceFeedback = mockFitData.feedback.filter(
			(suggestion) => suggestion.category === "experience",
		);

		experienceFeedback.forEach((suggestion) => {
			expect(screen.getByText(suggestion.feedback)).toBeInTheDocument();
		});

		// Checks if "skills" feedback are not displayed
		const skillsFeedback = mockFitData.feedback.filter(
			(suggestion) => suggestion.category === "skills",
		);

		skillsFeedback.forEach((suggestion) => {
			expect(screen.queryByText(suggestion.feedback)).toBeNull();
		});
	});
	it("should display an error with the corrosponding message if the isError is true", async () => {
		(useBackendGet as jest.Mock).mockReturnValue({
			data: mockError,
			error: null,
			isLoading: false,
		});
		await act(async () => {
			render(<Dashboard />);
		});
		const errorElement = screen.getByText(/Error retrieving results/i);
		expect(errorElement).toBeInTheDocument();
		const messageElement = screen.getByText(RegExp(mockError.message));
		expect(messageElement).toBeInTheDocument();
	});
	it("should display an error if the response is null", async () => {
		(useBackendGet as jest.Mock).mockReturnValue({
			data: null,
			error: null,
			isLoading: false,
		});
		await act(async () => {
			render(<Dashboard />);
		});
		const titleElement = screen.getByText(/Error retrieving results/i);
		expect(titleElement).toBeInTheDocument();
	});

	it("rating element should render with the correct fit score", async () => {
		const { rerender } = render(<Dashboard />);
		(useBackendGet as jest.Mock).mockReturnValue({
			data: {
				isError: false,
				message: "get fit score successful",
				fitScore: 0,
				matchedSkills: [],
				feedback: [],
			},
			error: null,
			isLoading: false,
		});
		await act(async () => {
			rerender(<Dashboard />);
		});
		let ratingElement = screen.getByRole("img");
		expect(ratingElement).toHaveAttribute("aria-label", "0 Stars");
		(useBackendGet as jest.Mock).mockReturnValue({
			data: {
				isError: false,
				message: "get fit score successful",
				fitScore: 50,
				matchedSkills: [],
				feedback: [],
			},
			error: null,
			isLoading: false,
		});
		await act(async () => {
			rerender(<Dashboard />);
		});
		ratingElement = screen.getByRole("img");
		expect(ratingElement).toHaveAttribute("aria-label", "2.5 Stars");
		(useBackendGet as jest.Mock).mockReturnValue({
			data: {
				isError: false,
				message: "get fit score successful",
				fitScore: 100,
				matchedSkills: [],
				feedback: [],
			},
			error: null,
			isLoading: false,
		});
		await act(async () => {
			rerender(<Dashboard />);
		});
		ratingElement = screen.getByRole("img");
		expect(ratingElement).toHaveAttribute("aria-label", "5 Stars");
	});
	it("empty imporovementSuggestions list should display a message", async () => {
		(useBackendGet as jest.Mock).mockReturnValue({
			data: {
				isError: false,
				message: "get fit score successful",
				fitScore: 100,
				matchedSkills: [],
				feedback: [],
			},
			error: null,
			isLoading: false,
		});
		await act(async () => {
			render(<Dashboard />);
		});
		const emptyStateMessage = screen.queryByText(
			/No suggestions available/i,
		);
		expect(emptyStateMessage).toBeInTheDocument();
	});
	it("null fit score should display a message", async () => {
		(useBackendGet as jest.Mock).mockReturnValue({
			data: {
				isError: false,
				message: "get fit score successful",
				fitScore: null,
				matchedSkills: [],
				feedback: [],
			},
			error: null,
			isLoading: false,
		});
		await act(async () => {
			render(<Dashboard />);
		});
		const nullStateMessage = screen.queryByText(/No fit score available/i);
		expect(nullStateMessage).toBeInTheDocument();
	});
	*/
});
