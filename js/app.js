// Main App Module
import { loadCharacters, renderCharacterList } from './character-manager.js';
import { setupEventListeners } from './event-listeners.js';
import { updateCharacterView } from './ui-updates.js';
import { initializeAbilities } from './abilities-ui.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Load saved characters
  loadCharacters();
  
  // Render the character list
  renderCharacterList();
  
  // Set up all event listeners
  setupEventListeners();
  
  // Initialize the character view if there are characters
  if (window.characters && window.characters.length > 0) {
    updateCharacterView();
  }
});

// Export function to initialize abilities when a character is selected
export function onCharacterSelect(character) {
  initializeAbilities(character);
} 