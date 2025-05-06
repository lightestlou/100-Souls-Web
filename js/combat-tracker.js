// Combat Tracker Module
import { characters, currentCharacterIndex, saveCharacters } from './character-manager.js';

export function updateCombatResource(resourceKey, direction) {
  const char = characters[currentCharacterIndex];
  if (!char) return;
  const currentKey = `current${resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1)}`;
  const maxKey = `max${resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1)}`;
  if (direction === 'increase' && char[currentKey] < char[maxKey]) {
    char[currentKey]++;
  } else if (direction === 'decrease' && char[currentKey] > 0) {
    char[currentKey]--;
  }
  saveCharacters();
  // Update progressbar.js for the resource
  if (window[resourceKey + 'Bar']) {
    window[resourceKey + 'Bar'].animate(char[maxKey] === 0 ? 0 : char[currentKey] / char[maxKey]);
    window[resourceKey + 'Bar'].setText(`${char[currentKey]}/${char[maxKey]}`);
  }
}

export function updateCombatResourceMax(resourceKey, newMax) {
  const char = characters[currentCharacterIndex];
  if (!char) return;
  
  // Validate newMax is a positive number
  newMax = Math.max(0, parseInt(newMax) || 0);
  
  // Update max value
  const maxKey = `max${resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1)}`;
  const currentKey = `current${resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1)}`;
  
  char[maxKey] = newMax;
  
  // Ensure current value doesn't exceed new max
  if (char[currentKey] > newMax) {
    char[currentKey] = newMax;
  }
  
  saveCharacters();
  
  // Update progress bar
  if (window[resourceKey + 'Bar']) {
    window[resourceKey + 'Bar'].destroy();
    let color = 'var(--gold-color)';
    if (resourceKey === 'reactions') { color = 'var(--orange-color)'; }
    if (resourceKey === 'mana') { color = 'var(--blue-color)'; }
    if (resourceKey === 'speed') { color = 'var(--green-color)'; }
    
    window[resourceKey + 'Bar'] = new ProgressBar.Circle(`#${resourceKey}-progressbar`, {
      color: color,
      trailColor: 'var(--bg-white)',
      strokeWidth: 8,
      trailWidth: 8,
      duration: 500,
      easing: 'easeOut',
      text: {
        value: `${char[currentKey]}/${newMax}`,
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
        circle.setText(`${Math.round(circle.value() * newMax)}/${newMax}`);
      }
    });
    window[resourceKey + 'Bar'].animate(newMax === 0 ? 0 : char[currentKey] / newMax);
  }
}

export function updateVitalityDamage(type, direction) {
  const char = characters[currentCharacterIndex];
  if (!char) return;
  
  const isSoft = type === 'soft';
  const max = isSoft ? char.softHealth : char.hardHealth;
  const key = isSoft ? 'softDamage' : 'hardDamage';
  
  if (direction === 'increase' && char[key] < max) {
    char[key]++;
  } else if (direction === 'decrease' && char[key] > 0) {
    char[key]--;
  }
  
  saveCharacters();
  
  // Update progress bar
  if (type === 'soft') {
    if (window.softDamageBar) {
      window.softDamageBar.animate(char.softHealth === 0 ? 0 : char.softDamage / char.softHealth);
      window.softDamageBar.setText(`${char.softDamage}/${char.softHealth}`);
    }
  } else {
    if (window.hardDamageBar) {
      window.hardDamageBar.animate(char.hardHealth === 0 ? 0 : char.hardDamage / char.hardHealth);
      window.hardDamageBar.setText(`${char.hardDamage}/${char.hardHealth}`);
    }
  }
} 