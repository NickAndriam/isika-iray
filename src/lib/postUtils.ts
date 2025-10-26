/**
 * Get the translation key for a post type
 */
export function getPostTypeTranslationKey(type: string): string {
  if (type === "help_request") return "helpRequest";
  if (type === "help_offer") return "helpOffer";
  if (type === "sell") return "sell";
  return "helpRequest";
}

/**
 * Get the color classes for a post type badge
 */
export function getPostTypeColors(type: string): string {
  if (type === "help_request") {
    return "bg-primary-gold/30 text-primary-gold border border-primary-gold";
  }
  if (type === "sell") {
    return "bg-orange-400/30 text-orange-500 border border-orange-500";
  }
  return "bg-blue-400/30 text-blue-500 border border-blue-500";
}
