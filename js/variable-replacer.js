// Variable Replacer Module

// Safely evaluate expressions with character data
function evaluateExpression(expr, character) {
  try {
    // Create a safe evaluation context with character data
    const context = {
      character,
      // Add any global functions or constants here
      Math,
      Number,
      String,
      Boolean,
      Array,
      Object
    };
    
    // Create a function that will evaluate the expression in our context
    const evaluator = new Function(
      'character',
      'Math',
      'Number',
      'String',
      'Boolean',
      'Array',
      'Object',
      `return ${expr}`
    );
    
    // Execute the function with our context
    return evaluator(
      character,
      context.Math,
      context.Number,
      context.String,
      context.Boolean,
      context.Array,
      context.Object
    );
  } catch (error) {
    console.warn(`Error evaluating expression: ${expr}`, error);
    return `[Error: ${expr}]`;
  }
}

// Replace variables in text with character data
export function replaceVariables(text, character) {
  if (!text || !character) return text;
  
  return text.replace(/{{(.*?)}}/g, (match, expr) => {
    // Trim the expression
    expr = expr.trim();
    
    // If it's a direct property access (no operators), try to get it directly
    if (!/[\+\-\*\/\(\)]/.test(expr)) {
      // Handle array access notation (e.g., skills[0])
      const arrayMatch = expr.match(/^([^[]+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [_, arrayName, index] = arrayMatch;
        const array = character[arrayName];
        if (array && Array.isArray(array)) {
          return array[index] !== undefined ? array[index] : `[Missing: ${expr}]`;
        }
        return `[Missing: ${expr}]`;
      }
      
      // Handle dot notation for regular properties
      const parts = expr.split('.');
      let value = character;
      
      // Traverse the object
      for (const part of parts) {
        if (value === undefined || value === null) return `[Missing: ${expr}]`;
        value = value[part];
      }
      
      return value !== undefined ? value : `[Missing: ${expr}]`;
    }
    
    // If it's an expression, evaluate it
    return evaluateExpression(expr, character);
  });
}

// Replace variables in an ability's content
export function replaceAbilityVariables(ability, character) {
  if (!ability || !character) return ability;
  
  // Create a copy of the ability to avoid modifying the original
  const processedAbility = { ...ability };
  
  // Process each content field
  ['content1', 'content2', 'content3'].forEach(field => {
    if (processedAbility[field]) {
      processedAbility[field] = replaceVariables(processedAbility[field], character);
    }
  });
  
  return processedAbility;
} 