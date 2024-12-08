import natural, { DataRecord } from "@natural";
import { stopwords } from "./stopwords.ts";
import { keepWords, specialPatterns } from "./specialwords.ts";
import { dedup } from "../util/util.ts";

const wordnet = new natural.WordNet();
const tokenizer = new natural.WordTokenizer();

// lookup a word in the wordnet database
// https://wordnet.princeton.edu/
async function wnLookup(word: string): Promise<DataRecord[]> {
	// wordnet doesnt use promises :(
	return await new Promise((resolve, _reject) => {
		wordnet.lookup(word, resolve);
	});
}

export async function keywords(text: string): Promise<string[]> {
	// add seperators for the special patterns
	text = " " + text.toLowerCase() + " ";
	const special: string[] = [];
	specialPatterns.forEach((pattern) => {
		pattern.lastIndex = 0;
		let match = pattern.exec(text);
		while (match && match.groups) {
			special.push(match.groups.match);
			text = text.substring(0, match.index) + " " +
				text.substring(pattern.lastIndex, text.length);
			pattern.lastIndex -= match.length;
			match = pattern.exec(text);
		}
	});
	const tokens = tokenizer.tokenize(text).filter((word) =>
		!stopwords.includes(word)
	);
	return dedup(
		(await Promise.all(
			tokens.map(async (
				word,
			) => ({
				word,
				lookup: await wnLookup(word),
			})),
		)).map(({ word, lookup }) =>
			lookup.length == 0
				? { word, lookup: [{ lemma: word, synsetOffset: 0 }] }
				: {
					word,
					lookup,
				}
		).map(({ word, lookup }) => ({
			word,
			lookup: lookup.sort((a, b) => a.synsetOffset - b.synsetOffset), // sort meanings by most frequently used
		})).map(({ word, lookup }) =>
			keepWords.includes(word) ? word : lookup[0].lemma.toLowerCase()
		)
			.concat(special),
	);
}

export async function match(resumeText: string, jobDescriptionText: string) {
	const resume = await keywords(resumeText);
	const jobDescription = await keywords(jobDescriptionText);
	// number of words in both resume and jobDescription
	const matched = resume.filter((word) => jobDescription.includes(word)).length;
	return jobDescription.length > 0
		? 100 * (matched / jobDescription.length)
		: 0;
}
