const COFACTOR_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bPROTEIN\b/g, "Protein"],
  [/\bVITAMIN C\b/g, "Vitamin C"],
  [/\bVITAMIN A\b/g, "Vitamin A"],
  [/\bVITAMIN E\b/g, "Vitamin E"],
  [/\bZINC\b/g, "Zinc"],
  [/\bCOPPER\b/g, "Copper"],
  [/\bOMEGA-3\b/g, "Omega-3"],
  [/\bANTIOXIDANTS\b/g, "Antioxidants"],
  [/\bLYCOPENE\b/g, "Lycopene"],
  [/\bSILICA\b/g, "Silica"],
  [/\bMANGANESE\b/g, "Manganese"],
  [/\bBLOOD SUGAR STABILITY\b/g, "Blood sugar stability"],
];

export function formatAiResponse(text: string): string {
  if (!text) return "";

  let cleaned = text
    // Hide the raw score line because index.tsx displays it as a score circle
    .replace(/^\s*collagen score\s*:\s*\d{1,3}\s*\/\s*100\s*$/gim, "")

    // Remove markdown heading markers like #, ##, ###
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")

    // Remove markdown bold and italic markers
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")

    // Remove leftover standalone asterisks
    .replace(/\*/g, "")

    // Remove backticks around menu items or food names
    .replace(/`([^`]+)`/g, "$1")

    // Remove markdown horizontal divider lines
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")

    // Remove markdown bullet characters from the start of lines
    .replace(/^\s*[-•]\s+/gm, "")

    // Clean awkward spacing after numbered list items
    .replace(/^(\d+)\.\s{2,}/gm, "$1. ")

    // Remove excess spaces before punctuation
    .replace(/\s+([,.!?;:])/g, "$1")

    // Clean up spacing and excessive blank lines
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  for (const [pattern, replacement] of COFACTOR_REPLACEMENTS) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  return cleaned;
}
