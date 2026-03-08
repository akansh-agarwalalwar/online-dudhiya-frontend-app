/**
 * Validation utilities for form fields
 */

// Regular expressions for validation
const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/, // Indian mobile number format
  name: /^[a-zA-Z\s]{2,50}$/, // Only letters and spaces, 2-50 characters
  username: /^[a-zA-Z0-9_]{3,20}$/, // Alphanumeric and underscore, 3-20 characters
  pincode: /^[0-9]{6}$/,
  // Add more patterns as needed
};

// Error messages
const ERROR_MESSAGES = {
  required: (field) => `${field} is required`,
  minLength: (field, min) => `${field} must be at least ${min} characters`,
  maxLength: (field, max) => `${field} must not exceed ${max} characters`,
  invalidFormat: (field) => `Please enter a valid ${field}`,
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid 10-digit mobile number',
  name: 'Name should contain only letters and spaces (2-50 characters)',
  username: 'Username should contain only letters, numbers, and underscores (3-20 characters)',
  pincode: 'Please enter a valid 6-digit pincode',
};

/**
 * Validate a single field
 * @param {string} field - Field name
 * @param {string} value - Field value
 * @param {Object} options - Validation options
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateField = (field, value, options = {}) => {
  const {
    required = false,
    minLength = null,
    maxLength = null,
    pattern = null,
    customValidator = null,
  } = options;

  // Trim whitespace
  const trimmedValue = value?.toString().trim() || '';

  // Check if field is required
  if (required && !trimmedValue) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.required(field),
    };
  }

  // If field is empty and not required, it's valid
  if (!trimmedValue && !required) {
    return {
      isValid: true,
      error: null,
    };
  }

  // Check minimum length
  if (minLength && trimmedValue.length < minLength) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.minLength(field, minLength),
    };
  }

  // Check maximum length
  if (maxLength && trimmedValue.length > maxLength) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.maxLength(field, maxLength),
    };
  }

  // Check pattern
  if (pattern && !pattern.test(trimmedValue)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.invalidFormat(field),
    };
  }

  // Custom validator
  if (customValidator) {
    const customResult = customValidator(trimmedValue);
    if (!customResult.isValid) {
      return customResult;
    }
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate name field
 */
export const validateName = (value) => {
  const validation = validateField('Name', value, {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: REGEX_PATTERNS.name,
  });

  if (!validation.isValid && validation.error === ERROR_MESSAGES.invalidFormat('Name')) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.name,
    };
  }

  return validation;
};

/**
 * Validate username field
 */
export const validateUsername = (value) => {
  const validation = validateField('Username', value, {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: REGEX_PATTERNS.username,
  });

  if (!validation.isValid && validation.error === ERROR_MESSAGES.invalidFormat('Username')) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.username,
    };
  }

  return validation;
};

/**
 * Validate phone number field
 */
export const validatePhoneNumber = (value) => {
  const validation = validateField('Phone Number', value, {
    required: true,
    pattern: REGEX_PATTERNS.phone,
  });

  if (!validation.isValid && validation.error === ERROR_MESSAGES.invalidFormat('Phone Number')) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.phone,
    };
  }

  return validation;
};

/**
 * Validate email field
 */
export const validateEmail = (value) => {
  const validation = validateField('Email', value, {
    required: true,
    pattern: REGEX_PATTERNS.email,
  });

  if (!validation.isValid && validation.error === ERROR_MESSAGES.invalidFormat('Email')) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.email,
    };
  }

  return validation;
};

/**
 * Validate multiple fields at once
 * @param {Object} fields - Object with field names as keys and values as values
 * @param {Object} validationRules - Object with field names as keys and validation options as values
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateMultipleFields = (fields, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(fields).forEach((fieldName) => {
    const fieldValue = fields[fieldName];
    const rules = validationRules[fieldName];

    if (rules) {
      const validation = validateField(fieldName, fieldValue, rules);
      if (!validation.isValid) {
        errors[fieldName] = validation.error;
        isValid = false;
      }
    }
  });

  return {
    isValid,
    errors,
  };
};

/**
 * Sanitize input to prevent common issues
 */
export const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  
  return value
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .substring(0, 1000); // Prevent extremely long inputs
};

/**
 * Get validation rules for profile fields
 */
export const getProfileValidationRules = () => ({
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: REGEX_PATTERNS.name,
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: REGEX_PATTERNS.username,
  },
  phone_number: {
    required: true,
    pattern: REGEX_PATTERNS.phone,
  },
  email: {
    required: true,
    pattern: REGEX_PATTERNS.email,
  },
});

export default {
  validateField,
  validateName,
  validateUsername,
  validatePhoneNumber,
  validateEmail,
  validateMultipleFields,
  sanitizeInput,
  getProfileValidationRules,
  REGEX_PATTERNS,
  ERROR_MESSAGES,
};