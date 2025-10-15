// src/utils/passwordValidation.js

/**
 * Validates password strength based on security requirements
 * @param {string} password - The password to validate
 * @returns {Object} - Validation result with isValid flag and errors array
 */
export const validatePasswordStrength = (password) => {
    const errors = [];
    const warnings = [];
    
    // Basic validation
    if (!password || typeof password !== 'string') {
      errors.push("Password is required");
      return { isValid: false, errors, warnings, strength: calculatePasswordStrength('') };
    }
    
    // Minimum length check (reduced from 12 to 8 for better user experience)
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    // Maximum length check (prevent DoS)
    if (password.length > 128) {
      errors.push("Password must be less than 128 characters long");
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    // Check for number
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    // Check for common weak patterns
    const commonPatterns = [
      { pattern: /123456/, message: "Contains common number sequence (123456)" },
      { pattern: /password/i, message: "Contains the word 'password'" },
      { pattern: /qwerty/i, message: "Contains keyboard pattern 'qwerty'" },
      { pattern: /abc123/i, message: "Contains common pattern 'abc123'" },
      { pattern: /(.)\1{3,}/, message: "Contains too many repeated characters" },
    ];
    
    for (const { pattern, message } of commonPatterns) {
      if (pattern.test(password)) {
        errors.push(message);
      }
    }
    
    // Additional security warnings (helpful suggestions)
    if (password.length < 12) {
      warnings.push("Consider using a longer password (12+ characters) for better security");
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors,
      warnings: warnings,
      strength: calculatePasswordStrength(password)
    };
  };
  
  /**
   * Calculates password strength score
   * @param {string} password - The password to analyze
   * @returns {Object} - Strength score and level
   */
  export const calculatePasswordStrength = (password) => {
    let score = 0;
    
    // Length scoring
    if (password.length >= 12) score += 2;
    if (password.length >= 16) score += 1;
    if (password.length >= 20) score += 1;
    
    // Character variety scoring
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 2;
    
    // Bonus points for multiple character types
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (varietyCount >= 3) score += 1;
    if (varietyCount === 4) score += 1;
    
    // Penalty for common patterns
    if (/123456|password|qwerty|abc123/i.test(password)) score -= 2;
    if (/(.)\1{2,}/.test(password)) score -= 1;
    
    // Determine strength level
    let level = 'very-weak';
    let color = '#ef4444'; // red-500
    let percentage = Math.min((score / 10) * 100, 100);
    
    if (score >= 8) {
      level = 'very-strong';
      color = '#22c55e'; // green-500
    } else if (score >= 6) {
      level = 'strong';
      color = '#84cc16'; // lime-500
    } else if (score >= 4) {
      level = 'medium';
      color = '#eab308'; // yellow-500
    } else if (score >= 2) {
      level = 'weak';
      color = '#f97316'; // orange-500
    }
    
    return {
      score,
      level,
      color,
      percentage: Math.max(percentage, 10) // Minimum 10% for visibility
    };
  };
  
  /**
   * Get password strength requirements for display
   * @returns {Array} - Array of requirement objects
   */
  export const getPasswordRequirements = () => {
    return [
      {
        id: 'length',
        text: 'At least 8 characters long',
        regex: /.{8,}/,
        priority: 'high'
      },
      {
        id: 'uppercase',
        text: 'At least one uppercase letter (A-Z)',
        regex: /[A-Z]/,
        priority: 'high'
      },
      {
        id: 'lowercase',
        text: 'At least one lowercase letter (a-z)',
        regex: /[a-z]/,
        priority: 'high'
      },
      {
        id: 'number',
        text: 'At least one number (0-9)',
        regex: /\d/,
        priority: 'high'
      },
      {
        id: 'special',
        text: 'At least one special character (!@#$%^&*)',
        regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        priority: 'high'
      },
      {
        id: 'no-common',
        text: 'No common patterns (123456, password, etc.)',
        regex: /^(?!.*(123456|password|qwerty|abc123)).*$/i,
        priority: 'medium'
      }
    ];
  };
  
  /**
   * Check if passwords match
   * @param {string} password - Original password
   * @param {string} confirmPassword - Confirmation password
   * @returns {Object} - Match result
   */
  export const validatePasswordMatch = (password, confirmPassword) => {
    const matches = password === confirmPassword;
    return {
      matches,
      error: matches ? null : "Passwords do not match"
    };
  };
  
  /**
   * Real-time password validation for form inputs
   * @param {string} password - Password to validate
   * @param {string} confirmPassword - Confirmation password (optional)
   * @returns {Object} - Complete validation result
   */
  export const validatePasswordForm = (password, confirmPassword = null) => {
    const strengthValidation = validatePasswordStrength(password);
    const requirements = getPasswordRequirements();
    
    // Check each requirement
    const requirementChecks = requirements.map(req => ({
      ...req,
      met: req.regex.test(password),
      visible: password.length > 0
    }));
    
    let matchValidation = null;
    if (confirmPassword !== null) {
      matchValidation = validatePasswordMatch(password, confirmPassword);
    }
    
    return {
      strength: strengthValidation.strength,
      isValid: strengthValidation.isValid,
      errors: strengthValidation.errors,
      warnings: strengthValidation.warnings,
      requirements: requirementChecks,
      passwordMatch: matchValidation,
      canSubmit: strengthValidation.isValid && (matchValidation ? matchValidation.matches : true)
    };
  };