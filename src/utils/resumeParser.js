import * as pdfjsLib from "pdfjs-dist";

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      if (fullText.trim().length > 0) {
        return fullText;
      }
    } catch (err) {
      console.warn("pdfjs extraction failed, falling back to direct array reading:", err);
    }
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
