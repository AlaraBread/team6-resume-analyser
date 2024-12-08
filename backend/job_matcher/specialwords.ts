const seperator = /[ \n\t.;,\(\)\[\]]/;
// these are special patterns that would otherwise be garbled by the tokenizer and/or stopword list
export const specialPatterns = [
	// short programming language names that are in the stopword list
	/c/,
	/d/,
	/c\+\+/,
	/c\/c\+\+/,
	/c#/,
	/r/,
	// periods would be split by tokenizer
	/.*\.js/,
	/.*\.py/,
	/b\.s\./,
	/b\.a\./,
	// multi word phrases would get split up by tokenizer
	/single page app/,
	/spring boot/,
	/google spanner/,
	/github actions/,
	/google suite/,
	/microsoft office/,
	/database administration/,
	/systems? administration/,
	/content management/,
].map((pattern) => {
	return new RegExp(
		seperator.source + "(?<match>" + pattern.source + ")" + seperator.source,
		"g",
	);
});

// these words should be kept rather than being lemmatized
// any jargon terms that have more common, but irrelevant meanings should go in here
export const keepWords = [
	"git",
	"spanner",
	"postman",
	"vim",
	"bash",
	"rust",
	"python",
	"java",
	"transition",
	"migrating",
	"spa",
];
