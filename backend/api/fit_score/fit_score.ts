import { Context, Middleware, Router } from "@oak/oak";

export default function (router: Router, sessionMiddleware: Middleware) {
	router.post("/api/fit-score", sessionMiddleware, fitScore);
}

export async function fitScore(ctx: Context) {
	const req: {
		resumeKeywords: string[];
		jobDescriptionKeywords: { niceToHave: string[]; mustHave: string[] };
	} = await ctx.request.body.json();
	if (
		!req.resumeKeywords || !req.jobDescriptionKeywords ||
		!Array.isArray(req.resumeKeywords) ||
		typeof req.jobDescriptionKeywords !== "object" ||
		!req.jobDescriptionKeywords.mustHave ||
		!req.jobDescriptionKeywords.niceToHave
	) {
		ctx.response.status = 400;
		ctx.response.body = JSON.stringify({
			isError: true,
			message: "malformed request",
		});
		return;
	}
	ctx.response.status = 200;
	ctx.response.body = JSON.stringify({
		isError: false,
		message: "success",
		fitScore: generateFitScore(req.resumeKeywords, req.jobDescriptionKeywords),
		matchedSkills: getMatchedSkills(
			req.resumeKeywords,
			req.jobDescriptionKeywords,
		),
		feedback: generateFeedback(req.resumeKeywords, req.jobDescriptionKeywords),
	});
}

const mustHaveWeight = 0.7;
const niceToHaveWeight = 0.3;
export function generateFitScore(
	resumeKeywords: string[],
	jobDescriptionKeywords: { niceToHave: string[]; mustHave: string[] },
): number {
	const mustHaveCount = jobDescriptionKeywords.mustHave.length;
	const niceToHaveCount = jobDescriptionKeywords.niceToHave.length;
	const mustHaveMatched =
		resumeKeywords.filter((word) =>
			jobDescriptionKeywords.mustHave.includes(word)
		).length;
	const niceToHaveMatched =
		resumeKeywords.filter((word) =>
			jobDescriptionKeywords.niceToHave.includes(word)
		).length;
	const niceToHaveScore = niceToHaveCount > 0
		? niceToHaveMatched / niceToHaveCount
		: 1;
	const mustHaveScore = mustHaveCount > 0 ? mustHaveMatched / mustHaveCount : 1;
	const score = niceToHaveScore * niceToHaveWeight +
		mustHaveScore * mustHaveWeight;
	return score * 100;
}

export function getMatchedSkills(
	resumeKeywords: string[],
	jobDescriptionKeywords: { niceToHave: string[]; mustHave: string[] },
) {
	return Array.from(
		new Set(jobDescriptionKeywords.mustHave).intersection(
			new Set(resumeKeywords),
		).union(
			new Set(jobDescriptionKeywords.niceToHave).intersection(
				new Set(resumeKeywords),
			),
		),
	);
}

export function generateFeedback(
	resumeKeywords: string[],
	jobDescriptionKeywords: { niceToHave: string[]; mustHave: string[] },
) {
	const resume = new Set(resumeKeywords);
	const mustHave = new Set(jobDescriptionKeywords.mustHave);
	const niceToHave = new Set(jobDescriptionKeywords.niceToHave);
	const missingMustHave = mustHave.difference(resume);
	const missingNiceToHave = niceToHave.difference(resume);
	// this is really silly, im unsure why i have to do this
	// we have better feedback already thats coming from the openai model
	return Array.from(missingMustHave).map((keyword) => {
		const r = Math.random();
		if (r < 0.25) {
			return `Demonstrate experience with ${keyword}`;
		} else if (r < 0.5) {
			return `Include a project where you use ${keyword}`;
		} else if (r < 0.75) {
			return `Include experience with ${keyword}`;
		} else {
			return `Include ${keyword} in your resume`;
		}
	}).concat(
		Array.from(missingNiceToHave).map((keyword) => {
			const r = Math.random();
			if (r < 0.25) {
				return `Would be nice to show experience with ${keyword}`;
			} else if (r < 0.5) {
				return `If possible, demonstrate an understanding of ${keyword}`;
			} else if (r < 0.75) {
				return `Knowing ${keyword} would make you stand out`;
			} else {
				return `Include ${keyword} in your resume`;
			}
		}),
	);
}
