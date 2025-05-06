// Character Data Module
export function createDefaultCharacter(name) {
  return {
    id: 'char_' + Date.now(),
    // Basic Info
    name: name,
    epithet: '',
    background: '',
    traits: '',
    inventory: '',
    notes: '',
    // Damage Tracker
    softDamage: 0,
    hardDamage: 0,
    softHealth: 12,
    hardHealth: 3,
    conditions: '',
    // Skills
    skills: Array(23).fill(0),
    // Abilities
    abilities: [],
    // Combat Resources
    maxActions: 3,
    currentActions: 3,
    maxReactions: 3,
    currentReactions: 3,
    maxMana: 1,
    currentMana: 1,
    maxSpeed: 3,
    currentSpeed: 3,
    // Damage Calculation fields
    attackDamage: 1,
    weaponModifier: 1,
    attackPower: 100,
    abilityDamage: 1,
    conduitModifier: 1,
    abilityPower: 100
  };
} 