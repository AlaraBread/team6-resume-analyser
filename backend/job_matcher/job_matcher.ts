function tokenize(text: string): string[] {
	return text.split(" |\\/!@#$%^&*()[]{}<>,./?\"'");
}

export function match(resumeText: string, jobDescriptionText: string) {
	const resume = tokenize(resumeText);
	const jobDescription = tokenize(jobDescriptionText);
	// number of words in both resume and jobDescription
	const matched = resume.filter((word) => jobDescription.includes(word)).length;
	return jobDescription.length > 0
		? 100 * (matched / jobDescription.length)
		: 0;
}
