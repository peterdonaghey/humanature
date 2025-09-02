import mammoth from "mammoth";

export async function convertDocxToHtml(docxUrl: string): Promise<string> {
  try {
    console.log("🔍 Starting Word document conversion for URL:", docxUrl);

    // Fetch the .docx file
    const response = await fetch(docxUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch document: ${response.status} ${response.statusText}`
      );
    }

    console.log(
      "✅ Document fetched successfully, size:",
      response.headers.get("content-length")
    );

    // Get the document as an ArrayBuffer
    const docxBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(docxBuffer);

    console.log("✅ Document buffer created, size:", buffer.length);

    // Convert to HTML using mammoth
    console.log("🔄 Converting Word document to HTML...");
    const result = await mammoth.convertToHtml({buffer});

    if (result.messages && result.messages.length > 0) {
      console.warn("⚠️ Conversion warnings:", result.messages);
    }

    const htmlContent = result.value;

    if (!htmlContent || htmlContent.trim().length === 0) {
      throw new Error("No content extracted from document");
    }

    console.log(
      "✅ Document conversion completed, HTML length:",
      htmlContent.length
    );

    // Apply our custom styling
    const styledHtml = `
      <div class="prose prose-lg max-w-none mx-auto">
        <div class="bg-white rounded-lg shadow-sm p-8">
          ${htmlContent}
        </div>
      </div>
    `;

    return styledHtml;
  } catch (error) {
    console.error("💥 Error converting document to HTML:", error);

    // Return user-friendly error message
    return `
      <div class="prose prose-lg max-w-none">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 class="text-red-800 font-semibold mb-2">Document Conversion Failed</h3>
          <p class="text-red-700 mb-4">
            We couldn't convert this Word document to HTML. This might happen if:
          </p>
          <ul class="list-disc list-inside text-red-700 space-y-1">
            <li>The document is password-protected or corrupted</li>
            <li>The file is not a valid .docx document</li>
            <li>The document contains unsupported features</li>
          </ul>
          <p class="text-red-700 mt-4">
            <a href="${docxUrl}" target="_blank" class="underline hover:no-underline">
              Click here to download the original document
            </a>
          </p>
        </div>
      </div>
    `;
  }
}

// Keep the old function name for backwards compatibility, but now it handles .docx
export const convertPdfToHtml = convertDocxToHtml;
