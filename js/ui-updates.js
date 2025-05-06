// UI Updates Module
import { characters, currentCharacterIndex, saveCharacters } from './character-manager.js';

export function updateCharacterView() {
  const char = characters[currentCharacterIndex];
  // Update Info Tab fields
  document.getElementById('char-name-input').value = char.name || '';
  document.getElementById('char-epithet-input').value = char.epithet || '';
  document.getElementById('char-background-input').value = char.background || '';
  document.getElementById('char-traits-input').value = char.traits || '';

  // Update Skills Tab values
  document.querySelectorAll('.skill-chip').forEach(chip => {
    const idx = parseInt(chip.dataset.skillIdx);
    const valueSpan = chip.querySelector('.skill-chip-value');
    valueSpan.textContent = char.skills[idx] || 0;
  });

  // Update Damage Calculation fields
  document.getElementById('attack-damage-input').value = char.attackDamage || 1;
  document.getElementById('weapon-modifier-input').value = char.weaponModifier || 1;
  document.getElementById('attack-power-input').value = char.attackPower || 100;
  document.getElementById('ability-damage-input').value = char.abilityDamage || 1;
  document.getElementById('conduit-modifier-input').value = char.conduitModifier || 1;
  document.getElementById('ability-power-input').value = char.abilityPower || 100;
  // Calculate and set derived values
  document.getElementById('final-attack-damage').value = ((char.attackDamage + char.weaponModifier) * (char.attackPower / 100)).toFixed(2);
  document.getElementById('final-ability-damage').value = ((char.abilityDamage + char.conduitModifier) * (char.abilityPower / 100)).toFixed(2);

  // Update Combat Tab values
  document.getElementById('actions-progressbar').nextElementSibling.nextElementSibling.querySelector('input').value = char.maxActions || 3;
  document.getElementById('reactions-progressbar').nextElementSibling.nextElementSibling.querySelector('input').value = char.maxReactions || 3;
  document.getElementById('mana-progressbar').nextElementSibling.nextElementSibling.querySelector('input').value = char.maxMana || 1;
  document.getElementById('speed-progressbar').nextElementSibling.nextElementSibling.querySelector('input').value = char.maxSpeed || 3;

  // Vitality
  document.getElementById('soft-health-input').value = char.softHealth || 12;
  document.getElementById('hard-health-input').value = char.hardHealth || 3;

  // Conditions
  document.getElementById('conditions-input').value = char.conditions || '';

  // Inventory & Notes
  document.getElementById('inventory-input').value = char.inventory || '';
  document.getElementById('notes-input').value = char.notes || '';

  // Initialize progress bars
  setTimeout(() => {
    // Combat Stats
    const combatStats = [
      { key: 'actions', color: 'var(--gold-color)', current: char.currentActions || 3, max: char.maxActions || 3 },
      { key: 'reactions', color: 'var(--orange-color)', current: char.currentReactions || 3, max: char.maxReactions || 3 },
      { key: 'mana', color: 'var(--blue-color)', current: char.currentMana || 1, max: char.maxMana || 1 },
      { key: 'speed', color: 'var(--green-color)', current: char.currentSpeed || 3, max: char.maxSpeed || 3 }
    ];

    combatStats.forEach(stat => {
      if (window[stat.key + 'Bar']) {
        window[stat.key + 'Bar'].destroy();
      }

      window[stat.key + 'Bar'] = new ProgressBar.Circle(`#${stat.key}-progressbar`, {
        color: stat.color,
        trailColor: 'var(--bg-white)',
        strokeWidth: 8,
        trailWidth: 8,
        duration: 500,
        easing: 'easeOut',
        text: {
          value: `${stat.current}/${stat.max}`,
          style: {
            color: 'var(--text-main)',
            position: 'absolute',
            left: '50%',
            top: '50%',
            padding: 0,
            margin: 0,
            transform: 'translate(-50%, -50%)',
            fontSize: '1.5em',
            fontWeight: '700',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
          }
        },
        step: function(state, circle) {
          circle.setText(`${Math.round(circle.value() * stat.max)}/${stat.max}`);
        }
      });
      window[stat.key + 'Bar'].animate(stat.max === 0 ? 0 : stat.current / stat.max);
    });

    // Vitality
    if (window.softDamageBar) window.softDamageBar.destroy();
    if (window.hardDamageBar) window.hardDamageBar.destroy();

    window.softDamageBar = new ProgressBar.Circle('#soft-damage-progressbar', {
      color: '#ef4444',
      trailColor: 'var(--bg-white)',
      strokeWidth: 8,
      trailWidth: 8,
      duration: 500,
      easing: 'easeOut',
      text: {
        value: `${char.softDamage || 0}/${char.softHealth || 12}`,
        style: {
          color: 'var(--text-main)',
          position: 'absolute',
          left: '50%',
          top: '50%',
          padding: 0,
          margin: 0,
          transform: 'translate(-50%, -50%)',
          fontSize: '1.5em',
          fontWeight: '700',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
        }
      },
      step: function(state, circle) {
        circle.setText(`${Math.round(circle.value() * (char.softHealth || 12))}/${char.softHealth || 12}`);
      }
    });
    window.softDamageBar.animate((char.softHealth || 12) === 0 ? 0 : (char.softDamage || 0) / (char.softHealth || 12));

    window.hardDamageBar = new ProgressBar.Circle('#hard-damage-progressbar', {
      color: '#dc2626',
      trailColor: 'var(--bg-white)',
      strokeWidth: 8,
      trailWidth: 8,
      duration: 500,
      easing: 'easeOut',
      text: {
        value: `${char.hardDamage || 0}/${char.hardHealth || 3}`,
        style: {
          color: 'var(--text-main)',
          position: 'absolute',
          left: '50%',
          top: '50%',
          padding: 0,
          margin: 0,
          transform: 'translate(-50%, -50%)',
          fontSize: '1.5em',
          fontWeight: '700',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
        }
      },
      step: function(state, circle) {
        circle.setText(`${Math.round(circle.value() * (char.hardHealth || 3))}/${char.hardHealth || 3}`);
      }
    });
    window.hardDamageBar.animate((char.hardHealth || 3) === 0 ? 0 : (char.hardDamage || 0) / (char.hardHealth || 3));
  }, 0);
}

export function showTab(tabName) {
  // Hide all tab sections
  document.querySelectorAll('.tab-section').forEach(sec => {
    sec.classList.remove('active');
  });
  
  // Show the selected tab section
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  // Update tab button states
  document.querySelectorAll('#tabs button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const tabOrder = ['info', 'skills', 'combat', 'abilities', 'feats', 'inventory', 'notes'];
  const tabIndex = tabOrder.indexOf(tabName);
  if (tabIndex >= 0) {
    document.querySelectorAll('#tabs button')[tabIndex].classList.add('active');
  }
} 