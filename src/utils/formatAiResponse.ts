export function formatAiResponse(text: string): string {
  if (!text) return "";

  return text
    // Turn markdown bold/italic into plain text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")

    // Remove markdown horizontal divider lines
    .replace(/^\s*---\s*$/gm, "")

    // Convert markdown bullet stars into clean bullet points
    .replace(/^\s*\*\s+/gm, "• ")

    // Clean up spacing
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
