export function formatAiResponse(text: string): string {
  if (!text) return "";

  return text
    // Remove markdown heading markers like #, ##, ###
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")

    // Remove markdown bold and italic markers anywhere in the sentence
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")

    // Remove any leftover standalone asterisks that Gemini sometimes leaves behind
    .replace(/\*/g, "")

    // Remove backticks around menu items or food names
    .replace(/`([^`]+)`/g, "$1")

    // Remove markdown horizontal divider lines
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")

    // Convert markdown bullet formats into clean bullets
    .replace(/^\s*[-•]\s+/gm, "• ")

    // Clean awkward spacing after numbered list items
    .replace(/^(\d+)\.\s{2,}/gm, "$1. ")

    // Remove excess spaces before punctuation
    .replace(/\s+([,.!?;:])/g, "$1")

    // Clean up spacing and excessive blank lines
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
