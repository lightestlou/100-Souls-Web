// Abilities UI Module
import { loadAbilities, getAbilitiesByCategory, searchAbilities, addAbilityToCharacter, removeAbilityFromCharacter, allAbilities } from './abilities.js';
import { saveCharacters } from './character-manager.js';
import { replaceAbilityVariables } from './variable-replacer.js';

let currentView = 'character'; // Changed from 'all' to 'character'
let currentSearch = '';
let currentCharacter = null;

// Initialize the abilities section
export async function initializeAbilities(character) {
  currentCharacter = character;
  await loadAbilities();
  setupEventListeners();
  renderAbilities();
}

// Set up event listeners for abilities section
function setupEventListeners() {
  const searchInput = document.getElementById('ability-search');
  const toggleAllBtn = document.getElementById('toggle-all-abilities');
  const toggleCharacterBtn = document.getElementById('toggle-character-abilities');

  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderAbilities();
  });

  toggleAllBtn.addEventListener('click', () => {
    currentView = 'all';
    toggleAllBtn.classList.add('active');
    toggleCharacterBtn.classList.remove('active');
    renderAbilities();
  });

  toggleCharacterBtn.addEventListener('click', () => {
    currentView = 'character';
    toggleCharacterBtn.classList.add('active');
    toggleAllBtn.classList.remove('active');
    renderAbilities();
  });

  // Set initial button states
  toggleCharacterBtn.classList.add('active');
  toggleAllBtn.classList.remove('active');
}

// Render all abilities
function renderAbilities() {
  const container = document.getElementById('abilities-container');
  container.innerHTML = '';

  let abilities;
  if (currentView === 'all') {
    abilities = allAbilities;
  } else {
    // For character view, we need to get the full ability objects from the IDs
    abilities = (currentCharacter.abilities || [])
      .map(id => allAbilities.find(ability => ability.id === id))
      .filter(ability => ability !== undefined);
  }
  
  if (currentSearch) {
    abilities = searchAbilities(currentSearch, abilities);
  }

  const categories = getAbilitiesByCategory(abilities);
  
  Object.entries(categories).forEach(([category, categoryAbilities]) => {
    const categoryElement = createCategoryElement(category, categoryAbilities);
    container.appendChild(categoryElement);
  });
}

// Create a category element
function createCategoryElement(category, abilities) {
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'ability-category';
  
  const header = document.createElement('div');
  header.className = 'ability-category-header';
  header.innerHTML = `
    <span class="ability-category-title">${category}</span>
    <span class="ability-category-toggle collapsed">▼</span>
  `;
  
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'ability-cards';
  cardsContainer.style.display = 'none'; // Start collapsed
  
  abilities.forEach(ability => {
    const card = createAbilityCard(ability);
    cardsContainer.appendChild(card);
  });
  
  header.addEventListener('click', () => {
    const isCollapsed = cardsContainer.style.display === 'none';
    cardsContainer.style.display = isCollapsed ? 'grid' : 'none';
    header.querySelector('.ability-category-toggle').classList.toggle('collapsed');
  });
  
  categoryDiv.appendChild(header);
  categoryDiv.appendChild(cardsContainer);
  
  return categoryDiv;
}

// Create an ability card
function createAbilityCard(ability) {
  const card = document.createElement('div');
  card.className = 'ability-card';
  
  const isCharacterAbility = currentCharacter.abilities && currentCharacter.abilities.includes(ability.id);
  
  // Process the ability content with character variables
  const processedAbility = replaceAbilityVariables(ability, currentCharacter);
  
  card.innerHTML = `
    <div class="ability-card-header">
      <div class="ability-card-name">${processedAbility.name}</div>
      <div class="ability-card-costs">
        <span class="ability-card-cost">⚡ ${processedAbility.cost.action}</span>
        <span class="ability-card-cost">🔄 ${processedAbility.cost.reaction}</span>
        <span class="ability-card-cost">✨ ${processedAbility.cost.mana}</span>
      </div>
    </div>
    <div class="ability-card-content">
      <div class="ability-card-content-block active" data-block="1">${processedAbility.content1}</div>
      <div class="ability-card-content-block" data-block="2">${processedAbility.content2}</div>
      <div class="ability-card-content-block" data-block="3">${processedAbility.content3}</div>
    </div>
    <div class="ability-card-footer">
      <button class="content-toggle active" data-block="1">Description</button>
      <button class="content-toggle" data-block="2">Details</button>
      <button class="content-toggle" data-block="3">Notes</button>
    </div>
  `;
  
  // Set up content toggle buttons
  const contentToggles = card.querySelectorAll('.content-toggle');
  const contentBlocks = card.querySelectorAll('.ability-card-content-block');
  
  contentToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const blockNum = toggle.dataset.block;
      
      contentToggles.forEach(t => t.classList.remove('active'));
      contentBlocks.forEach(b => b.classList.remove('active'));
      
      toggle.classList.add('active');
      card.querySelector(`.ability-card-content-block[data-block="${blockNum}"]`).classList.add('active');
    });
  });

  // Add context menu event listener
  card.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showAbilityContextMenu(e, card, ability, isCharacterAbility);
  });
  
  return card;
}

// Show context menu for ability card
function showAbilityContextMenu(event, card, ability, isCharacterAbility) {
  // Remove any existing context menu
  const existingMenu = document.querySelector('.ability-context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }

  // Create context menu
  const menu = document.createElement('div');
  menu.className = 'ability-context-menu';
  menu.innerHTML = `
    <div class="context-menu-item ${isCharacterAbility ? 'remove-ability' : 'add-ability'}">
      ${isCharacterAbility ? 'Remove Ability' : 'Add Ability'}
    </div>
  `;

  // Position the menu
  menu.style.position = 'fixed';
  menu.style.left = `${event.clientX}px`;
  menu.style.top = `${event.clientY}px`;

  // Add click handler
  const menuItem = menu.querySelector('.context-menu-item');
  menuItem.addEventListener('click', () => {
    if (isCharacterAbility) {
      removeAbilityFromCharacter(currentCharacter, ability.id);
    } else {
      addAbilityToCharacter(currentCharacter, ability.id);
    }
    // Save changes to localStorage
    saveCharacters();
    renderAbilities();
    menu.remove();
  });

  // Add click outside handler to close menu
  document.addEventListener('click', function closeMenu(e) {
    if (!menu.contains(e.target)) {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    }
  });

  // Add the menu to the document
  document.body.appendChild(menu);
} 