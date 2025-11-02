// Validation helpers that mirror the backend Zod schemas (signup/login)

// Email check (simple but effective)
export function validateEmail(email) {
  if (!email) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

const NAME_RE = /^[A-Za-z0-9_-]+$/
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/

export function validateSignup({ name, email, password }) {
  const errors = {}

  // Name: required, trimmed, 3-50 chars, only letters/numbers/hyphen/underscore
  if (!name || !String(name).trim()) {
    errors.name = 'Name is required'
  } else {
    const v = String(name).trim()
    if (v.length < 3) errors.name = 'Name must be at least 3 characters'
    else if (v.length > 50) errors.name = 'Name cannot exceed 50 characters'
    else if (!NAME_RE.test(v))
      errors.name = 'Name must contain only letters, numbers, hyphens, and underscores'
  }

  // Email
  if (!validateEmail(email)) errors.email = 'Valid email is required'

  // Password: required, min 8, must include upper, lower, digit, special
  if (!password) {
    errors.password = 'Password is required'
  } else if (String(password).length < 8) {
    errors.password = 'Password must be at least 8 characters'
  } else if (!PASSWORD_RE.test(String(password))) {
    errors.password =
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%?&)'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}

export function validateLogin({ email, password }) {
  const errors = {}
  if (!validateEmail(email)) errors.email = 'Valid email is required'
  if (!password) errors.password = 'Password is required'
  else if (String(password).length < 8) errors.password = 'Password must be at least 8 characters'
  else if (!PASSWORD_RE.test(String(password))) {
    errors.password =
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%?&)'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}

export default { validateEmail, validateSignup, validateLogin }
