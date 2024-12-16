/*
Copyright (c) 2011, Chris Umbel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// i modified the list a little for our application
// -julia
export const stopwords = new Set([
	"about",
	"after",
	"all",
	"also",
	"am",
	"an",
	"and",
	"another",
	"any",
	"are",
	"as",
	"at",
	"be",
	"because",
	"been",
	"before",
	"being",
	"between",
	"both",
	"but",
	"by",
	"came",
	"can",
	"come",
	"could",
	"did",
	"do",
	"each",
	"for",
	"from",
	"get",
	"got",
	"has",
	"had",
	"he",
	"have",
	"her",
	"here",
	"him",
	"himself",
	"his",
	"how",
	"if",
	"in",
	"into",
	"is",
	"it",
	"like",
	"make",
	"many",
	"me",
	"might",
	"more",
	"most",
	"much",
	"must",
	"my",
	"never",
	"now",
	"of",
	"on",
	"only",
	"or",
	"other",
	"our",
	"out",
	"over",
	"said",
	"same",
	"see",
	"should",
	"since",
	"some",
	"still",
	"such",
	"take",
	"than",
	"that",
	"the",
	"their",
	"them",
	"then",
	"there",
	"these",
	"they",
	"this",
	"those",
	"through",
	"to",
	"too",
	"under",
	"up",
	"very",
	"was",
	"way",
	"we",
	"well",
	"were",
	"what",
	"where",
	"which",
	"while",
	"who",
	"with",
	"would",
	"you",
	"your",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
	"$",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"0",
	"_",
	"im",
	"its",
	"seek",
	"seeking",
	"job",
	"description",
	"includes",
	"via",
	"drive",
	"updates",
	"ongoing",
	"fluid",
	"fully",
	"have",
	"end",
	"knowledge",
	"able",
	"experience",
	"within",
	"ability",
	"willingness",
	"help",
	"join",
	"looking",
	"highly",
	"opportunity",
	"amazing",
	"needs",
	"deep",
	"entire",
	"strong",
	"similar",
	"proven",
	"track",
	"record",
	"working",
	"flexible",
	"contribute",
	"across",
	"primary",
	"focus",
	"assist",
	"dynamic",
	"startup",
	"environment",
	"challenging",
	"interesting",
	"role",
	"fast",
	"paced",
	"motivated",
	"position",
	"office",
	"product",
	"grow",
	"growing",
	"customer",
	"base",
	"ground",
	"floor",
	"will",
	"moving",
	"already",
	"making",
	"great",
	"learn",
	"fun",
	"minded",
	"people",
	"full",
	"time",
	"person",
	"hybrid",
	"remote",
	"helping",
	"minimal",
	"staff",
	"done",
	"indeed",
	"partially",
	"heavily",
	"use",
	"accept",
	"show",
	"updates",
	"kept",
	"minimum",
	"written",
	"partner",
	"closely",
	"transformative",
	"harness",
	"mission",
	"build",
	"products",
	"improve",
	"experiences",
	"requires",
	"flexibility",
	"hours",
	"availability",
	"offices",
	"everyone",
	"backed",
	"top",
	"ask",
	"quality",
	"improvement",
	"improvements",
	"away",
	"adept",
	"areas",
	"steering",
	"big",
	"large",
	"sized",
	"resolve",
	"realistic",
	"solutions",
	"goals",
	"approaches",
	"aligning",
]);
