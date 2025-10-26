/**
 * Utility function to get translation key for a category
 * @param category - The category name (e.g., "Farming", "Animal Care")
 * @returns The translation key (e.g., "category_farming", "category_animal")
 */
export function getCategoryTranslationKey(category: string): string {
  // Convert category name to lowercase and replace spaces/special chars with underscores
  const key = category.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  // Handle special cases that don't follow the standard pattern
  const specialMapping: Record<string, string> = {
    'animal_care': 'category_animal',
    'hair_salon': 'category_hair',
    'event_planning': 'category_event',
    'tax_services': 'category_tax',
  };
  
  return specialMapping[key] || `category_${key}`;
}

