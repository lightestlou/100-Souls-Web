// Event Listeners Module
import { characters, currentCharacterIndex, saveCharacters, renderCharacterList } from './character-manager.js';
import { createDefaultCharacter } from './character-data.js';
import { updateCharacterView, showTab } from './ui-updates.js';
import { rollDice } from './dice-roller.js';
import { updateCombatResource, updateCombatResourceMax, updateVitalityDamage } from './combat-tracker.js';

export function setupEventListeners() {
  // Add tab button event listeners
  document.querySelectorAll('#tabs button').forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      showTab(tabName);
    });
  });

  // Add combat resource button event listeners
  document.querySelectorAll('.tracker-button[data-resource]').forEach(button => {
    button.addEventListener('click', () => {
      const resource = button.dataset.resource;
      const direction = button.dataset.direction;
      updateCombatResource(resource, direction);
    });
  });

  // Add vitality damage button event listeners
  document.querySelectorAll('.tracker-button[data-damage]').forEach(button => {
    button.addEventListener('click', () => {
      const type = button.dataset.damage;
      const direction = button.dataset.direction;
      updateVitalityDamage(type, direction);
    });
  });

  // Add max value input event listeners
  document.querySelectorAll('.tracker-input').forEach(input => {
    input.addEventListener('change', () => {
      const resource = input.closest('.tracker').querySelector('.tracker-label').textContent.toLowerCase();
      updateCombatResourceMax(resource, input.value);
    });
  });

  // Add character button
  document.getElementById('add-character-btn').onclick = function() {
    const name = prompt('Enter character name:');
    if (name) {
      characters.push(createDefaultCharacter(name));
      saveCharacters();
      renderCharacterList();
    }
  };

  // Back to manager button
  document.getElementById('back-to-manager').onclick = function() {
    document.getElementById('character-view').classList.add('hidden');
    document.getElementById('character-manager').classList.remove('hidden');
    currentCharacterIndex = null;
  };

  // Add skill chip event listeners
  document.querySelectorAll('.skill-chip').forEach(chip => {
    const idx = parseInt(chip.dataset.skillIdx);
    const valueSpan = chip.querySelector('.skill-chip-value');
    const plusBtn = chip.querySelector('.skill-chip-plus');
    const minusBtn = chip.querySelector('.skill-chip-minus');

    plusBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const char = characters[currentCharacterIndex];
      char.skills[idx] = (char.skills[idx] || 0) + 1;
      valueSpan.textContent = char.skills[idx];
      valueSpan.classList.remove('animated');
      void valueSpan.offsetWidth; // force reflow
      valueSpan.classList.add('animated');
      saveCharacters();
    });

    minusBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const char = characters[currentCharacterIndex];
      char.skills[idx] = (char.skills[idx] || 0) - 1;
      valueSpan.textContent = char.skills[idx];
      valueSpan.classList.remove('animated');
      void valueSpan.offsetWidth; // force reflow
      valueSpan.classList.add('animated');
      saveCharacters();
    });
  });

  // Add info tab event listeners
  document.getElementById('char-name-input').addEventListener('input', function() {
    const char = characters[currentCharacterIndex];
    char.name = this.value;
    saveCharacters();
    renderCharacterList();
  });
  document.getElementById('char-epithet-input').addEventListener('input', function() {
    const char = characters[currentCharacterIndex];
    char.epithet = this.value;
    saveCharacters();
    renderCharacterList();
  });
  document.getElementById('char-background-input').addEventListener('input', function() {
    const char = characters[currentCharacterIndex];
    char.background = this.value;
    saveCharacters();
  });
  document.getElementById('char-traits-input').addEventListener('input', function() {
    const char = characters[currentCharacterIndex];
    char.traits = this.value;
    saveCharacters();
  });
  document.getElementById('inventory-input').addEventListener('input', function() {
    const char = characters[currentCharacterIndex];
    char.inventory = this.value;
    saveCharacters();
  });
  document.getElementById('notes-input').addEventListener('input', function() {
    const char = characters[currentCharacterIndex];
    char.notes = this.value;
    saveCharacters();
  });
  document.getElementById('soft-health-input').addEventListener('input', function() {
    const char = characters[currentCharacterIndex];
    char.softHealth = Math.max(1, parseInt(this.value) || 1);
    if (char.softDamage > char.softHealth) char.softDamage = char.softHealth;
    saveCharacters();
    if (window.softDamageBar) {
      window.softDamageBar.animate(char.softHealth === 0 ? 0 : char.softDamage / char.softHealth);
      window.softDamageBar.setText(`${char.softDamage}/${char.softHealth}`);
    }
  });
  document.getElementById('hard-health-input').addEventListener('input', function() {
    const char = characters[currentCharacterIndex];
    char.hardHealth = Math.max(1, parseInt(this.value) || 1);
    if (char.hardDamage > char.hardHealth) char.hardDamage = char.hardHealth;
    saveCharacters();
    if (window.hardDamageBar) {
      window.hardDamageBar.animate(char.hardHealth === 0 ? 0 : char.hardDamage / char.hardHealth);
      window.hardDamageBar.setText(`${char.hardDamage}/${char.hardHealth}`);
    }
  });
  document.getElementById('conditions-input').addEventListener('input', function() {
    const char = characters[currentCharacterIndex];
    char.conditions = this.value;
    saveCharacters();
  });

  // Add Damage Calculation event listeners
  function recalcAndSaveDamage() {
    const char = characters[currentCharacterIndex];
    char.attackDamage = parseFloat(document.getElementById('attack-damage-input').value) || 0;
    char.weaponModifier = parseFloat(document.getElementById('weapon-modifier-input').value) || 0;
    char.attackPower = parseFloat(document.getElementById('attack-power-input').value) || 0;
    char.abilityDamage = parseFloat(document.getElementById('ability-damage-input').value) || 0;
    char.conduitModifier = parseFloat(document.getElementById('conduit-modifier-input').value) || 0;
    char.abilityPower = parseFloat(document.getElementById('ability-power-input').value) || 0;
    document.getElementById('final-attack-damage').value = ((char.attackDamage + char.weaponModifier) * (char.attackPower / 100)).toFixed(2);
    document.getElementById('final-ability-damage').value = ((char.abilityDamage + char.conduitModifier) * (char.abilityPower / 100)).toFixed(2);
    saveCharacters();
  }
  [
    'attack-damage-input',
    'weapon-modifier-input',
    'attack-power-input',
    'ability-damage-input',
    'conduit-modifier-input',
    'ability-power-input'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', recalcAndSaveDamage);
  });

  // Add event listener for the roll button
  document.getElementById('roll-dice').addEventListener('click', rollDice);
} 