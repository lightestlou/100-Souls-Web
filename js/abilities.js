// Abilities Module
export let allAbilities = [];
let characterAbilities = [];

// Load all abilities from souls.json
export async function loadAbilities() {
  try {
    const response = await fetch('json/souls.json');
    allAbilities = await response.json();
    return allAbilities;
  } catch (error) {
    console.error('Error loading abilities:', error);
    return [];
  }
}

// Get abilities for a specific character
export function getCharacterAbilities(character) {
  return character.abilities || [];
}

// Add an ability to a character
export function addAbilityToCharacter(character, abilityId) {
  if (!character.abilities) {
    character.abilities = [];
  }
  if (!character.abilities.includes(abilityId)) {
    character.abilities.push(abilityId);
  }
}

// Remove an ability from a character
export function removeAbilityFromCharacter(character, abilityId) {
  if (character.abilities) {
    character.abilities = character.abilities.filter(id => id !== abilityId);
  }
}

// Get ability by ID
export function getAbilityById(abilityId) {
  return allAbilities.find(ability => ability.id === abilityId);
}

// Get abilities by category
export function getAbilitiesByCategory(abilities) {
  if (!abilities || !Array.isArray(abilities)) {
    return {};
  }
  const categories = {};
  abilities.forEach(ability => {
    if (!categories[ability.category]) {
      categories[ability.category] = [];
    }
    categories[ability.category].push(ability);
  });
  return categories;
}

// Search abilities
export function searchAbilities(query, abilities = allAbilities) {
  if (!abilities || !Array.isArray(abilities)) {
    return [];
  }
  const searchTerm = query.toLowerCase();
  return abilities.filter(ability => 
    ability.name.toLowerCase().includes(searchTerm) ||
    ability.category.toLowerCase().includes(searchTerm) ||
    ability.content1.toLowerCase().includes(searchTerm) ||
    ability.content2.toLowerCase().includes(searchTerm) ||
    ability.content3.toLowerCase().includes(searchTerm)
  );
} 