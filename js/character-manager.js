// Character Manager Module
import { updateCharacterView, showTab } from './ui-updates.js';
import { onCharacterSelect } from './app.js';

export let characters = [];
export let currentCharacterIndex = null;

export function saveCharacters() {
  localStorage.setItem('characters', JSON.stringify(characters));
}

export function loadCharacters() {
  const savedCharacters = localStorage.getItem('characters');
  characters = savedCharacters ? JSON.parse(savedCharacters) : [];
}

export function renderCharacterList() {
  const list = document.getElementById('character-list');
  const template = document.getElementById('character-card-template');
  
  // Clear existing list
  list.innerHTML = '';
  
  // Create a card for each character
  characters.forEach((char, idx) => {
    // Clone the template
    const card = template.content.cloneNode(true);
    
    // Get references to the elements we need to update
    const nameDiv = card.querySelector('.character-card-name');
    const epithetDiv = card.querySelector('.character-card-epithet');
    const selectBtn = card.querySelector('.character-card-select');
    const deleteBtn = card.querySelector('.character-card-delete');
    
    // Update content
    nameDiv.textContent = char.name || `Character ${idx+1}`;
    
    // Only show epithet if it exists
    if (char.epithet && char.epithet.trim() !== '') {
      epithetDiv.textContent = char.epithet;
    } else {
      epithetDiv.remove();
    }
    
    // Add event listeners
    selectBtn.onclick = () => selectCharacter(char);
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm('Delete this character?')) {
        characters.splice(idx, 1);
        saveCharacters();
        renderCharacterList();
      }
    };
    
    // Add the card to the list
    list.appendChild(card);
  });
}

export function deleteCharacter(index) {
  if (index < 0 || index >= characters.length) return;
  
  if (confirm('Are you sure you want to delete this character?')) {
    characters.splice(index, 1);
    saveCharacters();
    
    // Reset current character if we deleted the current one
    if (currentCharacterIndex === index) {
      currentCharacterIndex = null;
      document.getElementById('character-view').classList.add('hidden');
      document.getElementById('character-manager').classList.remove('hidden');
    } else if (currentCharacterIndex > index) {
      // Adjust current index if we deleted a character before it
      currentCharacterIndex--;
    }
    
    renderCharacterList();
  }
}

export function selectCharacter(character) {
  if (character === null) return;
  
  currentCharacterIndex = characters.indexOf(character);
  document.getElementById('character-manager').classList.add('hidden');
  document.getElementById('character-view').classList.remove('hidden');
  
  // Initialize abilities section
  onCharacterSelect(character);
  
  // Update character view
  updateCharacterView();
  showTab('info'); // Show info tab by default
}

export function addCharacter(name) {
  const character = createDefaultCharacter(name);
  characters.push(character);
  saveCharacters();
  renderCharacterList();
  selectCharacter(character);
} 