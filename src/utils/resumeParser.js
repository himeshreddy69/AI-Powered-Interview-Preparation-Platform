import * as pdfjsLib from "pdfjs-dist";

/*
 * The worker used to be pulled from cdnjs at a path built from the installed
 * version. cdnjs does not publish pdf.js 6.x, and 6.x ships the worker as
 * `.mjs` rather than `.min.js`, so that URL 404'd on every upload — PDF text
 * extraction always failed and fell through to reading the raw bytes as text.
 *
 * Vite bundles the worker that ships with the installed package instead, so it
 * always matches `pdfjs-dist` and works offline.
 */
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

/**
 * Extract raw text content from PDF or TXT file
 */
export async function parseResumeFile(file) {
  if (!file) throw new Error("No file selected.");

  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === "text/plain" || fileName.endsWith(".txt")) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  }

  if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    let fullText = "";

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }
    } catch (err) {
      console.warn("pdfjs extraction failed:", err);
    }

    if (fullText.trim().length > 0) {
      return fullText;
    }

    /*
     * Reading a PDF with readAsText yields binary noise, not a resume. Sending
     * that to the AI produces confident nonsense, so fail loudly instead — a
     * scanned/image-only PDF has no text layer to extract.
     */
    throw new Error(
      "Could not read any text from this PDF. If it is a scanned image, " +
        "please upload a text-based PDF or a .txt file instead."
    );
  }

  // Fallback text extraction for unsupported binary formats
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      resolve(typeof text === "string" ? text : `Uploaded Resume: ${file.name}`);
    };
    reader.readAsText(file);
  });
}
