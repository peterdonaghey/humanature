// @ts-expect-error - pdf-extraction doesn't have TypeScript definitions
import extract from "pdf-extraction";

export async function convertPdfToHtml(pdfUrl: string): Promise<string> {
  try {
    console.log("🔍 Starting PDF conversion for URL:", pdfUrl);

    // Fetch the PDF from the URL
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    console.log(
      "✅ PDF fetched successfully, size:",
      response.headers.get("content-length")
    );

    const pdfBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(pdfBuffer);
    console.log("✅ PDF buffer created, size:", buffer.length);

    // Extract text from PDF
    console.log("🔄 Extracting text from PDF...");
    const data = await extract(buffer);
    console.log("✅ Text extraction result:", {
      textLength: data?.text?.length || 0,
      hasText: !!data?.text,
      preview: data?.text?.substring(0, 100) + "...",
    });

    // Convert text to HTML with basic formatting
    const text = data?.text || "";

    if (!text || text.trim().length === 0) {
      console.warn("⚠️ No text extracted from PDF");
      return '<div class="prose prose-lg max-w-none"><p class="text-gray-500 italic">Unable to extract text from this PDF. The PDF might be image-based or encrypted.</p></div>';
    }

    // Better text processing for PDF content
    let processedText = text
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    // Split into sentences and rebuild with better structure
    const sentences = processedText.split(/\.\s+/);
    let rebuiltText = "";
    let currentParagraph = "";

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (!sentence) continue;

      // Add the sentence to current paragraph
      currentParagraph += sentence;
      if (i < sentences.length - 1) currentParagraph += ". ";

      // Check if this should end a paragraph (various indicators)
      const nextSentence = sentences[i + 1]?.trim() || "";
      const shouldBreak =
        sentence.length > 200 || // Long sentences often end paragraphs
        /\b(recipe|ingredients|instructions|steps|method|why|how|what|when|where|conclusion|finally|summary)\b/i.test(
          nextSentence
        ) ||
        nextSentence.length < 50; // Short sentences are often headings

      if (shouldBreak || i === sentences.length - 1) {
        rebuiltText += currentParagraph + "\n\n";
        currentParagraph = "";
      }
    }

    // Split into paragraphs
    const paragraphs = rebuiltText
      .split(/\n\s*\n/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);

    // Convert to HTML with better formatting
    const html = paragraphs
      .map((paragraph: string) => {
        // Detect headings
        const isHeading =
          paragraph.length < 80 ||
          /^(the\s+)?(recipe|ingredients|instructions|steps|method|summary|conclusion|why|how|what)/i.test(
            paragraph
          ) ||
          paragraph.split(" ").length <= 6 ||
          paragraph === paragraph.toUpperCase();

        if (isHeading) {
          return `<h2 class="text-2xl font-bold mb-4 mt-8 text-emerald-800">${paragraph}</h2>`;
        }

        // Detect lists (look for bullet points, numbers, or multiple items)
        const hasListMarkers = /[●•▪▫◦‣⁃]\s|^\d+\.\s|\s[●•▪▫◦‣⁃]\s/;
        if (hasListMarkers.test(paragraph)) {
          // Split into list items
          const items = paragraph
            .split(/[●•▪▫◦‣⁃]|\d+\./)
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0);

          if (items.length > 1) {
            const listItems = items
              .map((item: string) => `<li class="mb-2">${item}</li>`)
              .join("\n");
            return `<ul class="list-disc list-inside mb-6 space-y-2">\n${listItems}\n</ul>`;
          }
        }

        return `<p class="mb-4 leading-relaxed text-gray-800">${paragraph}</p>`;
      })
      .join("\n");

    const finalHtml = `<div class="prose prose-lg max-w-none">${html}</div>`;
    console.log(
      "✅ PDF conversion completed successfully, HTML length:",
      finalHtml.length
    );
    return finalHtml;
  } catch (error) {
    console.error("💥 Error converting PDF to HTML:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return a helpful error message instead of throwing
    return `<div class="prose prose-lg max-w-none">
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-800 font-medium">Failed to convert PDF to HTML</p>
        <p class="text-red-600 text-sm mt-2">Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }</p>
        <p class="text-red-600 text-sm">Please try re-uploading the PDF or contact support if the issue persists.</p>
      </div>
    </div>`;
  }
}
