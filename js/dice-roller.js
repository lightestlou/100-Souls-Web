// Dice Roller Module
export function rollDice() {
  // Roll two d6s
  const roll1 = Math.floor(Math.random() * 6) + 1;
  const roll2 = Math.floor(Math.random() * 6) + 1;
  
  // Calculate result
  const result = roll1 - roll2;
  
  // Get result elements
  const diceRolls = document.querySelectorAll('.dice-roll');
  const diceResult = document.querySelector('.dice-result');
  
  // Update the display
  diceRolls[0].textContent = roll1;
  diceRolls[1].textContent = roll2;
  
  // Clear previous classes
  diceResult.className = 'dice-result';
  
  // Check for special cases
  if (roll1 === 6 && roll2 === 6) {
    // Critical Success
    diceResult.classList.add('success');
    diceResult.textContent = '+6';
  } else if (roll1 === 1 && roll2 === 1) {
    // Critical Failure
    diceResult.classList.add('failure');
    diceResult.textContent = '-6';
  } else if (roll1 === roll2) {
    // Doubles
    diceResult.classList.add('neutral');
    diceResult.textContent = '0';
  } else {
    // Normal result
    if (result > 0) {
      diceResult.classList.add('success');
      diceResult.textContent = `+${result}`;
    } else if (result < 0) {
      diceResult.classList.add('failure');
      diceResult.textContent = result;
    } else {
      diceResult.classList.add('neutral');
      diceResult.textContent = '0';
    }
  }
} 