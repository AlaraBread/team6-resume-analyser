const seperator = /[ \n\t.;,\(\)\[\]]/;
// these are special patterns that would otherwise be garbled by the tokenizer and/or stopword list
export const specialPatterns = [
	// short programming language names that are in the stopword list
	/c/,
	/d/,
	/c\+\+/,
	/c\/c\+\+/,
	/\.net\/c#/,
	/c#/,
	/r/,
	// periods would be split by tokenizer
	/.*?\.js/,
	/.*?\.py/,
	/.*?\.net/,
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
	/user experience/,
	/version control/,
	/back[- ]?end/,
	/front[- ]?end/,
	/full[- ]?stack/,
	/cross[- ]browser[- ]compatibility/,
	/react testing library/,
	/millions of requests/,
	/prompt engineering/,
	/credit cards?/,
	/point of sale/,
	/hardware engineering/,
	/software configuration management/,
	/high speed networking/,
	/tcp\/ip/,
	/pci[- ]express/,
	/communication protocols?/,
	/real[- ]time/,
	/operating systems?/,
	/computer science/,
	/artificial intelligence/,
].map((pattern) => {
	return new RegExp(
		seperator.source + "(?<match>" + pattern.source + ")" + seperator.source,
		"g",
	);
});

// these words should be kept rather than being lemmatized
// any jargon terms that have more common, but irrelevant meanings should go in here
export const keepWords = new Set([
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
	"restful",
	"rest",
	"api",
	"android",
	"jest",
	"usb",
	"thunderbolt",
	"ai",
	"content",
]);
