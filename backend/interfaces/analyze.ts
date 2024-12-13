export interface AnalyzeRequest {
	//The text of the resume to analyze.
	resumeText: string;

	//The text of the job description to analyze.
	jobDescription: string;
}

export interface AnalyzeResponse {
	isError: boolean;
	message: string;
	data?: AnalyzeResult; // Reference to the AnalyzeResult interface
}

export interface AnalyzeResult {
	//The similarity score between the resume and job description.
	fitScore: number;
	feedback: string[];
}

export interface ErrorResponse {
	isError: boolean;
	message: string;

	//Optional field to include additional error details (e.g., stack trace, error code).
	errorDetails?: string;
}
