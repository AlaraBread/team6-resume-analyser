import jsPDF from "jspdf";
import { AlignmentType, Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export function generatePDF(
	fitScore: number,
	matchedKeywords: string[],
	feedback: {
		category: string;
		feedback: string;
	}[],
) {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.width;

	// Add centered title
	const title = "Resume Analysis Report";
	const titleWidth = doc.getTextWidth(title);
	const titleX = (pageWidth - titleWidth) / 2; // Center the title horizontally
	doc.setFont("helvetica", "bold");
	doc.text(title, titleX, 20);

	let currentY = 40; // Start y-position for content

	// Add "Fit Score" section
	doc.setFont("helvetica", "bold");
	doc.text("Fit Score:", 10, currentY);
	doc.setFont("helvetica", "normal");
	doc.text(`${fitScore}%`, 40, currentY);

	currentY += 20; // Add extra space after "Fit Score" section

	// Add "Matched Keywords" section
	doc.setFont("helvetica", "bold");
	doc.text("Matched Keywords:", 10, currentY);
	currentY += 10;

	doc.setFont("helvetica", "normal");
	matchedKeywords.forEach((keyword, index) => {
		doc.text(`- ${keyword}`, 10, currentY + index * 10);
	});

	currentY += matchedKeywords.length * 10 + 10; // Move down based on the number of keywords

	// Add "Feedback" section
	doc.setFont("helvetica", "bold");
	doc.text("Feedback:", 10, currentY);
	currentY += 10;

	doc.setFont("helvetica", "normal");
	feedback.forEach((item, index) => {
		doc.text(
			`- ${item.category} - ${item.feedback}`,
			10,
			currentY + index * 10,
		);
	});

	doc.save("Resume_Analysis_Report.pdf");
}

export function generateWord(
	fitScore: number,
	matchedKeywords: string[],
	feedback: {
		category: string;
		feedback: string;
	}[],
) {
	const doc = new Document({
		sections: [
			{
				children: [
					// Centered title
					new Paragraph({
						text: "Resume Analysis Report",
						heading: "Title",
						alignment: AlignmentType.CENTER,
					}),
					new Paragraph({ text: "" }), // Blank line after the title

					// "Fit Score" section
					new Paragraph({
						children: [
							new TextRun({
								text: "Fit Score: ",
								bold: true,
								size: 24,
							}), // Bold title
							new TextRun({ text: `${fitScore}%`, size: 24 }),
						],
					}),
					new Paragraph({ text: "" }), // Blank line after Fit Score

					// "Matched Keywords" section
					new Paragraph({
						children: [
							new TextRun({
								text: "Matched Keywords:",
								bold: true,
								size: 24,
							}),
						], // Bold title
					}),
					...matchedKeywords.map(
						(keyword) =>
							new Paragraph({
								children: [
									new TextRun({
										text: `- ${keyword}`,
										size: 24,
									}),
								],
							}),
					),
					new Paragraph({ text: "" }), // Blank line after Matched Keywords

					// "Feedback" section
					new Paragraph({
						children: [
							new TextRun({
								text: "Feedback:",
								bold: true,
								size: 24,
							}),
						], // Bold title
					}),
					...feedback.map(
						(item) =>
							new Paragraph({
								children: [
									new TextRun({
										text: `- ${item.category} - ${item.feedback}`,
										size: 24,
									}),
								],
							}),
					),
				],
			},
		],
	});

	// Save the document as a Word file
	Packer.toBlob(doc).then((blob) => {
		saveAs(blob, "Resume_Analysis_Report.docx");
	});
}
